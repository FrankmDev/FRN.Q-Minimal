import { afterEach, expect, test } from "bun:test";
import { handleReturnState, isConfirmedSubmission, leadProps, responseErrorReason } from "../src/scripts/contact-form.ts";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalFetch = globalThis.fetch;
const originalFormData = globalThis.FormData;
let moduleId = 0;

afterEach(() => {
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
  globalThis.fetch = originalFetch;
  globalThis.FormData = originalFormData;
});

test("rate limiting, field validation and other rejections stay distinct", () => {
  expect(responseErrorReason(429, true)).toBe("rate_limited");
  expect(responseErrorReason(400, true)).toBe("validation");
  expect(responseErrorReason(400, false)).toBe("request_failed");
  expect(responseErrorReason(415, false)).toBe("request_failed");
  expect(responseErrorReason(502, true)).toBe("server");
});

test("lead props reject unrecognized options and never include personal contents", () => {
  expect(leadProps({ name: "Alice", email: "alice@example.test", message: "Private", company: "Company", type: "portal", budget: "2k-5k" })).toEqual({ type: "portal", budget: "2k-5k", hasCompany: true });
  expect(leadProps({ type: "alice@example.test", budget: "Alice", company: "" })).toEqual({ type: undefined, budget: undefined, hasCompany: false });
});

test("confirmed conversion needs the current request ID echoed by a successful response", () => {
  const id = "submission-id-12345";
  expect(isConfirmedSubmission({ success: true, ref: id }, id)).toBe(true);
  expect(isConfirmedSubmission({ success: false, ref: id }, id)).toBe(false);
  expect(isConfirmedSubmission({ success: "true", ref: id }, id)).toBe(false);
  expect(isConfirmedSubmission({ success: true }, id)).toBe(false); // honeypot
  expect(isConfirmedSubmission({ success: true, ref: "another-id" }, id)).toBe(false);
  expect(isConfirmedSubmission({ success: true, ref: "alice@example.test" }, "alice@example.test")).toBe(false);
});

test("success return parameters cannot hide the form, emit conversion or persist a ref", () => {
  const changed = [];
  const writes = [];
  globalThis.document = { getElementById: () => { throw Error("success query must not change form UI"); } };
  globalThis.window = {
    location: { pathname: "/", search: "?contacto=enviado&ref=alice%40example.test&utm_source=campaign", hash: "#contacto" },
    history: { replaceState: (_state, _title, url) => changed.push(url) },
    sessionStorage: { setItem: (...args) => writes.push(args) },
    dispatchEvent: () => { throw Error("query must not report conversion"); },
  };
  handleReturnState();
  expect(changed).toEqual(["/?utm_source=campaign#contacto"]);
  expect(writes).toHaveLength(0);
});

test("legacy error returns retain accessible feedback without tracking query values", () => {
  let focused = false;
  const banner = { classList: { remove: () => {} }, focus: () => { focused = true; } };
  const text = {};
  globalThis.document = { getElementById: (id) => id === "form-error-banner" ? banner : text };
  globalThis.window = {
    location: { pathname: "/", search: "?contacto=error&ref=private", hash: "#contacto" },
    history: { replaceState: () => {} },
    dispatchEvent: () => { throw Error("legacy return must not emit events"); },
  };
  handleReturnState();
  expect(focused).toBe(true);
  expect(text.textContent).toContain("No se ha podido enviar");
});

async function submitFixture(status, responseBody) {
  const events = [];
  const posted = [];
  const listeners = new Map();
  const node = () => {
    const classes = new Set();
    return {
      classList: { add: (...names) => names.forEach((name) => classes.add(name)), remove: (...names) => names.forEach((name) => classes.delete(name)), contains: (name) => classes.has(name) },
      attributes: new Map(),
      setAttribute(name, value) { this.attributes.set(name, value); },
      removeAttribute(name) { this.attributes.delete(name); },
      focus() {}, closest: () => null,
      addEventListener: (name, handler) => listeners.set(name, handler),
    };
  };
  const fields = Object.entries({ name: "Alice", email: "alice@example.test", company: "Private company", type: "portal", budget: "2k-5k", message: "Necesito un portal para gestionar los pedidos profesionales." })
    .map(([name, value]) => ({ ...node(), name, value, required: true }));
  const submission = { value: "", name: "submissionId" };
  const form = { ...node(), dataset: {}, elements: { namedItem: () => submission }, querySelector: () => fields.at(-1), querySelectorAll: () => fields };
  const ids = Object.fromEntries(["contact-success", "submit-btn", "submit-text", "reset-btn", "form-loading", "form-error-banner", "form-error-text", "form-error-dismiss"].map((id) => [id, node()]));
  ids["contact-form"] = form;
  ids["contact-success"].classList.add("hidden");
  let boot;
  let complete;
  const completed = new Promise((resolve) => { complete = resolve; });
  const session = new Map();
  globalThis.document = {
    readyState: "loading",
    documentElement: { dataset: { trackPages: "/|/404/" } },
    getElementById: (id) => ids[id] ?? null,
    addEventListener: (name, callback) => {
      if (name === "DOMContentLoaded") boot = callback;
      else listeners.set(`doc:${name}`, callback);
    },
  };
  globalThis.window = {
    location: { pathname: "/", search: "", hash: "" },
    localStorage: { getItem: () => null },
    sessionStorage: { getItem: (key) => session.get(key) ?? null, setItem: (key, value) => session.set(key, value), removeItem: (key) => session.delete(key) },
    dispatchEvent: (event) => { if (event.type === "frnq:track") events.push(event.detail); },
    setTimeout: () => 1,
    clearTimeout: () => complete(),
  };
  globalThis.FormData = class {
    entries() { return [...fields.map((field) => [field.name, field.value]), ["submissionId", submission.value]][Symbol.iterator](); }
  };
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    posted.push({ url, body });
    return { ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(responseBody(body.submissionId)) };
  };
  await import(`../src/scripts/contact-form.ts?flow=${++moduleId}`);
  boot();
  listeners.get("submit")({ preventDefault() {} });
  await completed;
  return { events, posted, form, ids };
}

test("enhanced submission counts only live echoed success and restores loading state", async () => {
  const { events, posted, form, ids } = await submitFixture(200, (ref) => ({ success: true, ref }));
  expect(posted).toHaveLength(1);
  expect(posted[0].url).toBe("/api/contact");
  expect(posted[0].body.email).toBe("alice@example.test"); // Existing API payload remains intact.
  const conversions = events.filter((event) => event.name === "contact_form_success");
  expect(conversions).toHaveLength(1);
  expect(conversions[0].props).toEqual({ page: "/", type: "portal", budget: "2k-5k", hasCompany: true });
  expect(form.classList.contains("hidden")).toBe(true);
  expect(form.attributes.has("aria-busy")).toBe(false);
  expect(ids["submit-btn"].disabled).toBe(false);
  expect(ids["form-loading"].classList.contains("hidden")).toBe(true);
});

for (const [label, body] of [["honeypot acknowledgement", { success: true }], ["mismatched receipt", { success: true, ref: "unrelated-id-12345" }]]) {
  test(`${label} cannot produce an enhanced conversion`, async () => {
    const { events } = await submitFixture(200, () => body);
    expect(events.filter((event) => event.name === "contact_form_success")).toHaveLength(0);
  });
}

for (const [status, reason, response] of [
  [429, "rate_limited", () => ({ success: false, error: "Inténtalo más tarde." })],
  [400, "validation", () => ({ success: false, errors: { email: "Email no válido." } })],
  [500, "server", (ref) => ({ success: true, ref })],
  [200, "invalid_response", () => null],
]) {
  test(`enhanced response ${status}/${reason} leaves the form usable without conversion`, async () => {
    const { events, form, ids } = await submitFixture(status, response);
    expect(events.filter((event) => event.name === "contact_form_success")).toHaveLength(0);
    expect(events.find((event) => event.name === "contact_form_error")?.props.reason).toBe(reason);
    expect(form.classList.contains("hidden")).toBe(false);
    expect(ids["submit-btn"].disabled).toBe(false);
    expect(form.attributes.has("aria-busy")).toBe(false);
  });
}

function preselectFixture(search) {
  const select = {
    value: "",
    closest: () => ({ classList: { remove: () => {} } }),
    removeAttribute: () => {},
  };
  const error = { textContent: "keep", classList: { add: () => {} } };
  const changed = [];
  const listeners = [];
  globalThis.document = {
    getElementById: (id) => (id === "type" ? select : id === "type-error" ? error : null),
    addEventListener: (name, callback) => listeners.push([name, callback]),
  };
  globalThis.window = {
    location: { pathname: "/", search, hash: "#contacto" },
    history: { replaceState: (_state, _title, url) => changed.push(url) },
  };
  return { select, error, changed, listeners };
}

test("a ?tipo= deep link preselects a known contact type and strips the parameter", async () => {
  const { select, error, changed, listeners } = preselectFixture("?tipo=reparacion&utm_source=x");
  await import(`../src/scripts/contact-form.ts?preselect=${++moduleId}`);

  expect(select.value).toBe("reparacion");
  expect(error.textContent).toBe("");
  expect(changed).toEqual(["/?utm_source=x#contacto"]);
  expect(listeners.map(([name]) => name)).toContain("click");
});

test("an unknown ?tipo= value is ignored and leaves the URL untouched", async () => {
  const { select, changed } = preselectFixture("?tipo=not-a-real-type");
  await import(`../src/scripts/contact-form.ts?preselect=${++moduleId}`);

  expect(select.value).toBe("");
  expect(changed).toEqual([]);
});
