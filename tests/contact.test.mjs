import { afterEach, expect, test, mock } from "bun:test";
import handler from "../api/contact.ts";
import { CONTACT_BUDGETS, CONTACT_TYPES } from "../src/data/contact-contract.ts";

const valid = {
  name: "Francisco",
  email: "example@example.test",
  type: CONTACT_TYPES[0].value,
  budget: CONTACT_BUDGETS[1].value,
  message: "Necesito revisar un comercio y sus pedidos.",
};

let nextClient = 0;
const originalFetch = globalThis.fetch;
function request(body, contentType = "application/json", accept = "application/json") {
  return {
    method: "POST",
    headers: {
      "content-type": contentType,
      accept,
      "x-forwarded-for": `test-client-${++nextClient}`,
    },
    body,
  };
}

async function send(req) {
  const headers = {};
  let status = 0;
  let payload;
  const response = {
    setHeader(name, value) { headers[name] = value; },
    status(code) { status = code; return this; },
    json(body) { payload = body; },
  };
  await handler(req, response);
  return { status, headers, payload };
}

afterEach(() => {
  mock.restore();
  globalThis.fetch = originalFetch;
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  delete process.env.CONTACT_FROM_EMAIL;
});

test("form options are accepted as JSON and URL-encoded without JavaScript", async () => {
  process.env.RESEND_API_KEY = "test";
  process.env.CONTACT_TO_EMAIL = "to@example.test";
  process.env.CONTACT_FROM_EMAIL = "from@example.test";
  const deliver = mock(() => Promise.resolve({ ok: true }));
  globalThis.fetch = deliver;

  for (const type of CONTACT_TYPES) {
    for (const budget of CONTACT_BUDGETS) {
      const data = { ...valid, type: type.value, budget: budget.value };
      const json = await send(request(data));
      expect(json.status).toBe(200);
      expect(json.payload).toEqual({ success: true });
      const nojs = await send(request(new URLSearchParams(data).toString(), "application/x-www-form-urlencoded", "text/html"));
      expect(nojs.status).toBe(303);
      expect(nojs.headers.Location).toBe("/?contacto=enviado#contacto");
    }
  }
  expect(deliver).toHaveBeenCalledTimes(CONTACT_TYPES.length * CONTACT_BUDGETS.length * 2);
});

test("invalid project types and budgets are rejected before delivery", async () => {
  const type = await send(request({ ...valid, type: "unknown" }));
  expect(type.status).toBe(400);
  expect(type.payload?.errors?.type).toBeDefined();
  const budget = await send(request({ ...valid, budget: "unknown" }));
  expect(budget.status).toBe(400);
  expect(budget.payload?.errors?.budget).toBeDefined();
});
