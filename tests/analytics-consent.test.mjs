import { afterEach, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
let fixtureId = 0;

afterEach(() => {
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
});

async function controls(storedConsent = null) {
  const choices = ["false", "true"].map((value) => ({ dataset: { consentChoice: value }, focused: false, addEventListener(_name, listener) { this.choose = listener; }, focus() { this.focused = true; } }));
  const settings = { hidden: true, focused: false, addEventListener(_name, listener) { this.open = listener; }, focus() { this.focused = true; } };
  const panel = { dataset: {}, hidden: true, querySelector: () => choices[0], querySelectorAll: () => choices };
  const local = new Map();
  if (storedConsent) {
    local.set("frnq:analytics:consent", storedConsent);
    local.set("frnq:analytics:consent-at", String(Date.now()));
  }
  globalThis.document = {
    getElementById: () => panel,
    querySelectorAll: () => [settings],
    documentElement: { dataset: { trackPages: "/|/404/" } },
    addEventListener() {},
  };
  globalThis.window = {
    location: { pathname: "/" },
    localStorage: { getItem: (key) => local.get(key) ?? null, setItem: (key, value) => local.set(key, value) },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    dispatchEvent() {},
  };
  // A temporary bundle isolates the consent module and analytics singleton.
  // Bun does not reliably import long data: URLs; use a real temporary module.
  const result = await Bun.build({ entrypoints: [new URL("../src/scripts/analytics-consent.ts", import.meta.url).pathname], target: "browser", write: false });
  expect(result.success).toBe(true);
  const directory = await mkdtemp(join(tmpdir(), "frnq-consent-test-"));
  let module;
  try {
    const file = join(directory, `fixture-${++fixtureId}.mjs`);
    await Bun.write(file, result.outputs[0]);
    module = await import(file);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
  module.initAnalyticsConsent();
  return { panel, choices, settings, local, module };
}

test("the consent notice offers accept and reject, persists denial and can be reopened", async () => {
  const { panel, choices, settings, local, module } = await controls();
  expect(panel.hidden).toBe(false);
  expect(settings.hidden).toBe(false);
  choices[0].choose();
  expect(local.get("frnq:analytics:consent")).toBe("denied");
  expect(panel.hidden).toBe(true);
  settings.open();
  expect(panel.hidden).toBe(false);
  expect(choices[0].focused).toBe(true);
  choices[1].choose();
  expect(local.get("frnq:analytics:consent")).toBe("granted");
  expect(settings.focused).toBe(true);
  expect(() => module.initAnalyticsConsent()).not.toThrow();
});

test("a stored choice keeps the notice closed but preferences stay available", async () => {
  const { panel, settings } = await controls("denied");
  expect(panel.hidden).toBe(true);
  expect(settings.hidden).toBe(false);
});
