import { afterEach, beforeEach, expect, test } from "bun:test";
import { isGa4MeasurementId, pageType } from "../src/scripts/analytics.ts";

let initTracking, getConsent, setConsent, track, trackOnce;
let moduleId = 0;

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const pages = ["/", "/404/", "/casos/", "/soluciones/b2b/", "/soluciones/ecommerce/", "/casos/emilio-faraoni/", "/casos/kingbelt/"];
let events, session, local, forwarded, listeners;

function storage(values) {
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

beforeEach(async () => {
  // Each fixture represents a fresh document, including its module state.
  ({ initTracking, getConsent, setConsent, track, trackOnce } = await import(`../src/scripts/analytics.ts?test=${++moduleId}`));
  events = []; session = new Map(); local = new Map(); forwarded = []; listeners = [];
  globalThis.document = {
    documentElement: { dataset: { trackPages: pages.join("|") } },
    addEventListener: (...args) => listeners.push(args),
  };
  globalThis.window = {
    location: { pathname: "/" },
    localStorage: storage(local),
    sessionStorage: storage(session),
    dispatchEvent: (event) => { if (event.type === "frnq:track") events.push(event.detail); },
    plausible: (name, options) => forwarded.push({ name, ...options }),
  };
});

afterEach(() => {
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
});

test("unknown URLs and caller-supplied page/context never enter analytics", () => {
  window.location.pathname = "/cliente/alice@example.test/";
  track("cta_click", { page: "/secret/", last_solution: "/secret/", location: "header" });
  expect(events[0].props).toEqual({ page: "/404/", location: "header" });
  expect(session.size).toBe(0);
});

test("only categorical props are eligible; personal fields are omitted", () => {
  track("contact_form_submit", { name: "Alice", email: "alice@example.test", message: "Private", ref: "private", label: "alice@example.test", type: "portal", hasCompany: true });
  expect(events[0].props).toEqual({ page: "/", type: "portal", hasCompany: true });
  expect(forwarded).toHaveLength(0);
});

test("solution to case to contact keeps only the approved last-viewed paths", () => {
  window.location.pathname = "/soluciones/b2b/";
  track("cta_click", { location: "solution_hero" });
  window.location.pathname = "/casos/emilio-faraoni/";
  track("cta_click", { location: "header" });
  window.location.pathname = "/";
  track("contact_form_submit", { type: "portal" });
  expect(events.at(-1).props).toEqual({ page: "/", type: "portal", last_solution: "/soluciones/b2b/", last_case: "/casos/emilio-faraoni/" });
  expect(JSON.parse(session.get("frnq:track:context"))).toEqual({ last_solution: "/soluciones/b2b/", last_case: "/casos/emilio-faraoni/" });
});

test("changing solution clears the previous case association", () => {
  session.set("frnq:track:context", JSON.stringify({ last_solution: "/soluciones/b2b/", last_case: "/casos/emilio-faraoni/" }));
  window.location.pathname = "/soluciones/ecommerce/";
  track("cta_click");
  expect(events[0].props).toEqual({ page: "/soluciones/ecommerce/", last_solution: "/soluciones/ecommerce/" });
});

test("unrecognized, malformed and wrongly categorized stored paths are discarded", () => {
  for (const value of ["{broken", JSON.stringify({ last_solution: "/cliente/alice@example.test/", last_case: "/soluciones/b2b/", email: "private" })]) {
    session.set("frnq:track:context", value);
    track("contact_view");
    expect(events.at(-1).props).toEqual({ page: "/" });
    expect(session.has("frnq:track:context")).toBe(false);
  }
});

test("a consent-required provider neither forwards nor remembers pre-consent context", () => {
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "plausible" };
  session.set("frnq:track:context", JSON.stringify({ last_solution: "/soluciones/b2b/" }));
  window.location.pathname = "/casos/emilio-faraoni/";
  track("cta_click");
  expect(forwarded).toHaveLength(0);
  expect(session.size).toBe(0);
  expect(events[0].props).toEqual({ page: "/casos/emilio-faraoni/" });
  setConsent(true);
  track("cta_click");
  expect(forwarded[0].props.last_case).toBe("/casos/emilio-faraoni/");
});

test("denial clears context and dedup storage and blocks even an exempt provider", () => {
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "plausible", requireConsent: false };
  session.set("frnq:track:seen", "[]");
  window.location.pathname = "/soluciones/b2b/";
  track("cta_click");
  expect(forwarded).toHaveLength(1);
  setConsent(false);
  track("cta_click");
  expect(session.size).toBe(0);
  expect(forwarded).toHaveLength(1);
  expect(events.at(-1).props).toEqual({ page: "/soluciones/b2b/" });
});

test("blocked storage and a failing sink cannot break tracking callers", () => {
  window.sessionStorage = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); }, removeItem() { throw Error("blocked"); } };
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "plausible", requireConsent: false };
  window.plausible = () => { throw Error("provider failed"); };
  expect(() => track("cta_click")).not.toThrow();
  expect(events[0].props.page).toBe("/");
});

test("explicit denial still blocks forwarding and context when consent storage fails", () => {
  window.localStorage = {
    getItem: () => "granted", // A stale persisted value must not override denial.
    setItem() { throw Error("blocked"); },
  };
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "plausible", requireConsent: false };
  window.location.pathname = "/soluciones/b2b/";
  setConsent(false);
  expect(getConsent()).toBe(false);
  track("cta_click");
  expect(session.size).toBe(0);
  expect(forwarded).toHaveLength(0);
  window.localStorage.getItem = () => { throw Error("blocked"); };
  window.__FRNQ_ANALYTICS__.enabled = false;
  trackOnce("submit:denied-id-12345", "contact_form_success");
  expect(getConsent()).toBe(false);
  expect(session.size).toBe(0);
  expect(events.at(-1).props).toEqual({ page: "/soluciones/b2b/" });
});

test("dedup accepts opaque submission IDs and discards arbitrary saved values", () => {
  session.set("frnq:track:seen", JSON.stringify(["submit:alice@example.test", "arbitrary"]));
  trackOnce("submit:test-id-12345", "contact_form_success");
  trackOnce("submit:test-id-12345", "contact_form_success");
  expect(events).toHaveLength(1);
  expect(JSON.parse(session.get("frnq:track:seen"))).toEqual(["submit:test-id-12345"]);
  trackOnce("submit:alice@example.test", "contact_form_success");
  expect(events).toHaveLength(1);
});

test("initialization records a solution visit without needing a tracked click", () => {
  window.location.pathname = "/soluciones/b2b/";
  initTracking();
  initTracking();
  expect(listeners).toHaveLength(1);
  window.location.pathname = "/";
  track("contact_view");
  expect(events[0].props.last_solution).toBe("/soluciones/b2b/");
});

test("navigation records exactly one page_view plus the matching entry event", () => {
  window.location.pathname = "/soluciones/ecommerce/";
  initTracking();
  initTracking();
  expect(events.map((event) => event.name)).toEqual(["page_view", "solution_view"]);
  expect(events[0].props).toEqual({ page: "/soluciones/ecommerce/", last_solution: "/soluciones/ecommerce/", page_type: "solution" });
  expect(events[1].props).toEqual({ page: "/soluciones/ecommerce/", page_type: "solution", slug: "ecommerce" });
});

test("entering a case page is categorized without a click", () => {
  window.location.pathname = "/casos/kingbelt/";
  initTracking();
  expect(events.map((event) => event.name)).toEqual(["page_view", "case_view"]);
  expect(events[0].props.page_type).toBe("case");
  expect(events[1].props).toEqual({ page: "/casos/kingbelt/", page_type: "case", slug: "kingbelt" });
});

test("page categories are derived from the allowlist, never from user input", () => {
  expect(pageType("/")).toBe("home");
  expect(pageType("/soluciones/revision-web/")).toBe("solution");
  expect(pageType("/casos/")).toBe("case_index");
  expect(pageType("/casos/kingbelt/")).toBe("case");
  expect(pageType("/guias/como-medir-una-tienda/")).toBe("guide");
  expect(pageType("/soporte/")).toBe("support");
  expect(pageType("/precios/")).toBe("pricing");
  expect(pageType("/colaboraciones/agencias/")).toBe("agency");
  expect(pageType("/legal/privacidad/")).toBe("legal");
  expect(pageType("/404/")).toBe("not_found");
});

test("only a syntactically valid GA4 measurement id is ever accepted", () => {
  expect(isGa4MeasurementId("G-ABC1234567")).toBe(true);
  expect(isGa4MeasurementId("G-1")).toBe(false);
  expect(isGa4MeasurementId("UA-12345")).toBe(false);
  expect(isGa4MeasurementId("G- <script>")).toBe(false);
  expect(isGa4MeasurementId(undefined)).toBe(false);
});

test("a consent-required page_view is emitted locally but never forwarded", () => {
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "plausible" };
  initTracking();
  expect(events[0].name).toBe("page_view");
  expect(forwarded).toHaveLength(0);
  expect(session.size).toBe(0);
});

function ga4Document(appended, { failCreate = false } = {}) {
  globalThis.document = {
    documentElement: { dataset: { trackPages: pages.join("|") } },
    addEventListener: (...args) => listeners.push(args),
    createElement: () => {
      if (failCreate) throw Error("script blocked");
      return { async: false, src: "" };
    },
    head: { appendChild: (el) => appended.push(el) },
  };
}

function pageViews() {
  return (window.dataLayer ?? []).filter((entry) => entry[0] === "event" && entry[1] === "page_view");
}

test("GA4 stays unloaded before consent, loads once after, and flushes the view once", () => {
  const appended = [];
  ga4Document(appended);
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "gtag", measurementId: "G-ABC1234567", requireConsent: true };
  initTracking();

  // No network, no stub, no dataLayer before an explicit choice.
  expect(window.gtag).toBeUndefined();
  expect(window.dataLayer).toBeUndefined();
  expect(appended).toHaveLength(0);

  setConsent(true);
  expect(appended).toHaveLength(1);
  expect(appended[0].src).toBe("https://www.googletagmanager.com/gtag/js?id=G-ABC1234567");
  expect(pageViews()).toHaveLength(1);

  // Repeating consent or re-initializing must not duplicate script or event.
  setConsent(true);
  initTracking();
  expect(appended).toHaveLength(1);
  expect(pageViews()).toHaveLength(1);

  track("cta_click", { location: "hero" });
  expect(window.dataLayer.some((entry) => entry[1] === "cta_click")).toBe(true);
});

test("an invalid GA4 id never loads the provider nor leaks a request", () => {
  const appended = [];
  ga4Document(appended);
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "gtag", measurementId: "not-a-real-id", requireConsent: true };
  setConsent(true);
  expect(appended).toHaveLength(0);
  expect(window.gtag).toBeUndefined();
  expect(window.dataLayer).toBeUndefined();
});

test("a blocked GA4 script never breaks the page or the local event", () => {
  const appended = [];
  ga4Document(appended, { failCreate: true });
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "gtag", measurementId: "G-ABC1234567", requireConsent: true };
  expect(() => setConsent(true)).not.toThrow();
  expect(appended).toHaveLength(0);
  expect(() => track("cta_click", { location: "hero" })).not.toThrow();
  expect(events.map((event) => event.name)).toContain("cta_click");
});

test("GA4 receives Arguments commands and only a canonical allowlisted URL", () => {
  ga4Document([]);
  window.location = { pathname: "/cliente/alice@example.test/", hostname: "frnq.es", search: "?email=alice@example.test", hash: "#private" };
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "gtag", measurementId: "G-ABC1234567" };
  setConsent(true);
  initTracking();
  const config = window.dataLayer.find((entry) => entry[0] === "config");
  expect(Object.prototype.toString.call(config)).toBe("[object Arguments]");
  expect(config[2].page_location).toBe("https://frnq.es/404/");
  expect(config[2].page_referrer).toBe("");
  expect(config[2].page_title).toBe("not_found");
  expect(config[2].send_page_view).toBe(false);
  expect(config[2].allow_google_signals).toBe(false);
  expect(JSON.stringify(window.dataLayer)).not.toContain("alice");
});

test("consent on a solution page forwards the entry and page view exactly once", () => {
  ga4Document([]);
  window.location.pathname = "/soluciones/b2b/";
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "gtag", measurementId: "G-ABC1234567" };
  initTracking();
  setConsent(true);
  setConsent(true);
  expect(window.dataLayer.filter((entry) => entry[0] === "event" && entry[1] === "solution_view")).toHaveLength(1);
  expect(pageViews()).toHaveLength(1);
});

test("revoking GA4 consent opts out a loaded tag, clears only GA cookies and blocks events", () => {
  ga4Document([]);
  window.location.hostname = "frnq.es";
  document.cookie = "_ga=abc; _ga_ABC1234567=def; theme=dark";
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "gtag", measurementId: "G-ABC1234567" };
  initTracking();
  setConsent(true);
  const cookieWrites = [];
  Object.defineProperty(document, "cookie", { get: () => "_ga=abc; _ga_ABC1234567=def; theme=dark", set: (value) => cookieWrites.push(value) });
  setConsent(false);
  const count = window.dataLayer.length;
  track("cta_click");
  expect(window["ga-disable-G-ABC1234567"]).toBe(true);
  expect(window.dataLayer).toHaveLength(count);
  expect(cookieWrites).toHaveLength(6);
  expect(cookieWrites.every((value) => value.startsWith("_ga") && value.includes("Max-Age=0"))).toBe(true);
  setConsent(true);
  expect(window["ga-disable-G-ABC1234567"]).toBe(false);
  expect(pageViews()).toHaveLength(1);
});

test("consent expires after six months and legacy choices require a new decision", () => {
  local.set("frnq:analytics:consent", "granted");
  expect(getConsent()).toBeNull();
  local.set("frnq:analytics:consent-at", String(Date.now() - 181 * 86400000));
  expect(getConsent()).toBeNull();
  local.set("frnq:analytics:consent-at", String(Date.now()));
  expect(getConsent()).toBe(true);
});
