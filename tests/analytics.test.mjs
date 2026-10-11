import { afterEach, beforeEach, expect, test } from "bun:test";

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
