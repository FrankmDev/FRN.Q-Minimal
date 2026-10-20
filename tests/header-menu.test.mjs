import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Exercise the actual component script without a browser or new DOM dependency.
const source = readFileSync(new URL("../src/components/Header.astro", import.meta.url), "utf8");
const script = ts.transpileModule(source.match(/<script>([\s\S]*?)<\/script>/)[1], {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;

function fixture({ height = 800, top = 84, overflow = "", viewport } = {}) {
  let document;
  function node() {
    const attributes = new Map();
    const classes = new Set();
    const listeners = new Map();
    return {
      attributes,
      style: { setProperty(name, value) { this[name] = value; } },
      classList: {
        toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); },
        add(name) { classes.add(name); },
        remove(name) { classes.delete(name); },
        contains: (name) => classes.has(name),
      },
      setAttribute: (name, value) => attributes.set(name, value),
      getAttribute: (name) => attributes.get(name) ?? null,
      toggleAttribute(name, enabled) { enabled ? attributes.set(name, "") : attributes.delete(name); },
      addEventListener: (name, handler) => listeners.set(name, handler),
      emit: (name, event = {}) => listeners.get(name)?.(event),
      querySelector: () => null,
      querySelectorAll: () => [],
      contains: () => false,
      focus() { document.activeElement = this; },
      getClientRects: () => [{}],
    };
  }

  const button = node();
  button.setAttribute("aria-expanded", "false");
  const nav = node();
  nav.toggleAttribute("inert", true);
  const links = Array.from({ length: 6 }, node);
  nav.contains = (element) => element === nav || links.includes(element);
  nav.querySelector = () => links[0];
  nav.querySelectorAll = () => links;
  nav.getBoundingClientRect = () => ({ top });
  const theme = node();
  const logo = node();
  const studio = node();
  const hiddenDesktopLink = { ...node(), getClientRects: () => [] };
  const header = node();
  header.querySelectorAll = () => [logo, hiddenDesktopLink, studio, theme, button, ...links];
  const ids = { "menu-toggle": button, "mobile-nav": nav, "theme-toggle": theme, header };
  document = {
    ...node(),
    activeElement: null,
    documentElement: { ...node(), scrollHeight: 2400 },
    body: { style: { overflow } },
    getElementById: (id) => ids[id] ?? null,
    querySelector: () => null,
  };
  const desktop = { ...node(), matches: false };
  const window = {
    ...node(),
    innerHeight: height,
    scrollY: 0,
    matchMedia: () => desktop,
    visualViewport: viewport ? { ...node(), scale: 1, offsetTop: 0, ...viewport } : undefined,
  };
  runInNewContext(script, { document, window, requestAnimationFrame: (callback) => callback() });

  function key(key, shiftKey = false) {
    const event = { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
    document.emit("keydown", event);
    return event;
  }
  return { document, window, desktop, button, nav, header, links, theme, logo, key };
}

test("opening synchronizes accessible state, focus and the panel's real height", () => {
  const { button, nav, header, links, document } = fixture({ top: 83 });
  button.emit("click");
  expect(button.getAttribute("aria-expanded")).toBe("true");
  expect(button.getAttribute("aria-label")).toBe("Cerrar menú");
  expect(nav.attributes.has("inert")).toBe(false);
  expect(header.classList.contains("is-menu-open")).toBe(true);
  expect(nav.style["--menu-h"]).toBe("717px");
  expect(nav.scrollTop).toBe(0);
  expect(document.body.style.overflow).toBe("hidden");
  expect(document.activeElement).toBe(links[0]);
});

test("landscape height is not forced beyond the viewport", () => {
  const { button, nav } = fixture({ height: 300, top: 84 });
  button.emit("click");
  expect(nav.style["--menu-h"]).toBe("216px");
});

test("browser chrome resize updates an open panel, but not a closed one", () => {
  const { button, nav, window } = fixture({ viewport: { height: 700 } });
  button.emit("click");
  expect(nav.style["--menu-h"]).toBe("616px");
  window.visualViewport.height = 640;
  window.visualViewport.emit("resize");
  expect(nav.style["--menu-h"]).toBe("556px");
  button.emit("click");
  window.visualViewport.height = 600;
  window.visualViewport.emit("resize");
  expect(nav.style["--menu-h"]).toBe("556px");
});

test("pinch zoom does not shrink the panel to the magnified viewport", () => {
  const { button, nav } = fixture({ viewport: { height: 400, scale: 2 } });
  button.emit("click");
  expect(nav.style["--menu-h"]).toBe("716px");
});

test("rapid toggles restore the previous scroll setting and close state", () => {
  const { button, nav, header, document } = fixture({ overflow: "clip" });
  for (let i = 0; i < 6; i++) button.emit("click");
  expect(button.getAttribute("aria-expanded")).toBe("false");
  expect(button.getAttribute("aria-label")).toBe("Abrir menú");
  expect(nav.attributes.has("inert")).toBe(true);
  expect(header.classList.contains("is-menu-open")).toBe(false);
  expect(document.body.style.overflow).toBe("clip");
  expect(document.activeElement).toBe(button);
});

test("all menu links close the panel without leaving focus inside inert content", () => {
  const { button, links, nav, document } = fixture();
  for (const link of links) {
    button.emit("click");
    link.focus();
    link.emit("click");
    expect(nav.attributes.has("inert")).toBe(true);
    expect(document.activeElement).toBe(button);
  }
});

test("Escape closes and returns focus without intercepting closed-menu keys", () => {
  const { button, document, key } = fixture();
  expect(key("Escape").prevented).toBe(false);
  button.emit("click");
  expect(key("Escape").prevented).toBe(true);
  expect(button.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(button);
});

test("Tab wraps across visible header/menu controls while leaving interior order native", () => {
  const { button, logo, links, document, key } = fixture();
  button.emit("click");
  expect(key("Tab").prevented).toBe(false);
  links.at(-1).focus();
  expect(key("Tab").prevented).toBe(true);
  expect(document.activeElement).toBe(logo);
  expect(key("Tab", true).prevented).toBe(true);
  expect(document.activeElement).toBe(links.at(-1));
  button.emit("click");
  expect(key("Tab").prevented).toBe(false);
});

test("desktop breakpoint closes safely and does not focus a hidden mobile toggle", () => {
  const { button, desktop, theme, nav, document } = fixture({ overflow: "auto" });
  button.emit("click");
  desktop.matches = true;
  desktop.emit("change", { matches: true });
  expect(nav.attributes.has("inert")).toBe(true);
  expect(document.activeElement).toBe(theme);
  expect(document.body.style.overflow).toBe("auto");
  desktop.emit("change", { matches: true });
  expect(document.body.style.overflow).toBe("auto");
});

test("desktop breakpoint also moves focus away from the disappearing close button", () => {
  const { button, desktop, theme, document } = fixture();
  button.emit("click");
  button.focus();
  desktop.matches = true;
  desktop.emit("change", { matches: true });
  expect(document.activeElement).toBe(theme);
});
