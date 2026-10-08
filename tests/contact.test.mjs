import { afterEach, expect, test, mock } from "bun:test";
import handler from "../api/contact.ts";
import {
  CONTACT_BUDGETS,
  CONTACT_MESSAGE_MIN,
  CONTACT_TYPES,
} from "../src/data/contact-contract.ts";

const valid = {
  name: "Francisco",
  email: "example@example.test",
  type: CONTACT_TYPES[0].value,
  budget: CONTACT_BUDGETS[1].value,
  message: "Necesito revisar un comercio y sus pedidos.",
};

let nextClient = 0;
const originalFetch = globalThis.fetch;

function request(
  body,
  {
    contentType = "application/json",
    accept = "application/json",
    ip = `test-client-${++nextClient}`,
    method = "POST",
  } = {},
) {
  return {
    method,
    headers: {
      "content-type": contentType,
      accept,
      "x-forwarded-for": ip,
    },
    body,
  };
}

async function send(req) {
  const headers = {};
  let status = 0;
  let payload;
  const response = {
    setHeader(name, value) {
      headers[name] = value;
    },
    status(code) {
      status = code;
      return this;
    },
    json(body) {
      payload = body;
    },
  };
  await handler(req, response);
  return { status, headers, payload };
}

function setDeliveryConfig() {
  process.env.RESEND_API_KEY = "test";
  process.env.CONTACT_FROM_EMAIL = "FRN.Q <from@example.test>";
}

function okDelivery() {
  return mock(() => Promise.resolve({ ok: true }));
}

/** Minimal in-memory stand-in for the Upstash/Vercel KV REST pipeline. */
function redisMock(store = new Map()) {
  const deliver = okDelivery();
  const fetchMock = mock((input, options) => {
    const url = String(input);
    if (url.includes("/pipeline")) {
      const commands = JSON.parse(options.body);
      const key = commands[0][1];
      const count = (store.get(key) ?? 0) + 1;
      store.set(key, count);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ result: count }, { result: 1 }, { result: 600 }]),
      });
    }
    return deliver(input, options);
  });
  return { fetchMock, deliver, store };
}

afterEach(() => {
  mock.restore();
  globalThis.fetch = originalFetch;
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  delete process.env.RATE_LIMIT_SALT;
});

test("form options are accepted as JSON and URL-encoded without JavaScript", async () => {
  setDeliveryConfig();
  const deliver = okDelivery();
  globalThis.fetch = deliver;

  for (const type of CONTACT_TYPES) {
    for (const budget of CONTACT_BUDGETS) {
      const data = { ...valid, type: type.value, budget: budget.value };
      const json = await send(request(data));
      expect(json.status).toBe(200);
      expect(json.payload).toEqual({ success: true });
      const nojs = await send(
        request(new URLSearchParams(data).toString(), {
          contentType: "application/x-www-form-urlencoded",
          accept: "text/html",
        }),
      );
      expect(nojs.status).toBe(303);
      expect(nojs.headers.Location).toBe("/?contacto=enviado#contacto");
    }
  }
  expect(deliver).toHaveBeenCalledTimes(CONTACT_TYPES.length * CONTACT_BUDGETS.length * 2);
});

test("form submissions are delivered to the configured internal contact mailbox", async () => {
  setDeliveryConfig();
  const deliver = mock((_url, options) => {
    expect(JSON.parse(options.body).to).toEqual(["info@frnq.studio"]);
    return Promise.resolve({ ok: true });
  });
  globalThis.fetch = deliver;

  const response = await send(request(valid));

  expect(response.status).toBe(200);
  expect(deliver).toHaveBeenCalledTimes(1);
});

test("invalid project types and budgets are rejected before delivery", async () => {
  const type = await send(request({ ...valid, type: "unknown" }));
  expect(type.status).toBe(400);
  expect(type.payload?.errors?.type).toBeDefined();
  const budget = await send(request({ ...valid, budget: "unknown" }));
  expect(budget.status).toBe(400);
  expect(budget.payload?.errors?.budget).toBeDefined();
});

test("the message floor is low enough for a short brief but still rejects noise", async () => {
  setDeliveryConfig();
  globalThis.fetch = okDelivery();

  const short = "Necesito web";
  expect(short.length).toBeGreaterThanOrEqual(CONTACT_MESSAGE_MIN);
  const accepted = await send(request({ ...valid, message: short }));
  expect(accepted.status).toBe(200);

  const rejected = await send(request({ ...valid, message: "web" }));
  expect(rejected.status).toBe(400);
  expect(rejected.payload?.errors?.message).toBeDefined();
});

test("an oversized message is rejected", async () => {
  const rejected = await send(request({ ...valid, message: "x".repeat(2001) }));
  expect(rejected.status).toBe(400);
  expect(rejected.payload?.errors?.message).toBeDefined();
});

test("the honeypot is silently accepted and never delivered", async () => {
  setDeliveryConfig();
  const deliver = okDelivery();
  globalThis.fetch = deliver;

  const response = await send(request({ ...valid, website: "http://spam.example" }));

  expect(response.status).toBe(200);
  expect(response.payload).toEqual({ success: true });
  expect(deliver).not.toHaveBeenCalled();
});

test("a missing mail configuration returns 503 without leaking internal detail", async () => {
  const response = await send(request(valid));
  expect(response.status).toBe(503);
  expect(response.payload?.success).toBe(false);
  expect(response.payload?.error).toBe("El formulario no está disponible ahora mismo.");
});

test("a Resend failure returns a generic 502 and logs the provider detail", async () => {
  setDeliveryConfig();
  const spy = mock((message) => message);
  const originalError = console.error;
  console.error = spy;
  globalThis.fetch = mock(() =>
    Promise.resolve({
      ok: false,
      status: 422,
      text: () => Promise.resolve("domain not verified: secret"),
    }),
  );

  try {
    const response = await send(request(valid));
    expect(response.status).toBe(502);
    expect(response.payload).toEqual({
      success: false,
      error: "No se ha podido enviar el mensaje. Inténtalo de nuevo.",
    });
    expect(JSON.stringify(response.payload)).not.toContain("secret");
    expect(spy).toHaveBeenCalled();
  } finally {
    console.error = originalError;
  }
});

test("a Resend timeout returns 502 instead of hanging", async () => {
  setDeliveryConfig();
  const originalError = console.error;
  console.error = () => {};
  globalThis.fetch = mock(() => {
    const error = new Error("The operation was aborted due to timeout");
    error.name = "TimeoutError";
    return Promise.reject(error);
  });

  try {
    const response = await send(request(valid));
    expect(response.status).toBe(502);
    expect(response.payload?.error).toBe("No se ha podido enviar el mensaje. Inténtalo de nuevo.");
  } finally {
    console.error = originalError;
  }
});

test("a durable external store enforces the limit across requests", async () => {
  setDeliveryConfig();
  process.env.UPSTASH_REDIS_REST_URL = "https://kv.example.test";
  process.env.UPSTASH_REDIS_REST_TOKEN = "token";
  const { fetchMock, store } = redisMock();
  globalThis.fetch = fetchMock;

  const ip = "203.0.113.10";
  for (let i = 0; i < 5; i += 1) {
    const ok = await send(request(valid, { ip }));
    expect(ok.status).toBe(200);
  }

  const limited = await send(request(valid, { ip }));
  expect(limited.status).toBe(429);
  expect(limited.headers["Retry-After"]).toBe("600");
  expect(limited.payload?.error).toBeDefined();

  // The stored key is a hash, never the raw address.
  const storedKeys = [...store.keys()];
  expect(storedKeys).toHaveLength(1);
  expect(storedKeys[0]).not.toContain(ip);
});

test("an external store outage degrades to the in-memory limiter", async () => {
  setDeliveryConfig();
  process.env.UPSTASH_REDIS_REST_URL = "https://kv.example.test";
  process.env.UPSTASH_REDIS_REST_TOKEN = "token";
  const deliver = okDelivery();
  globalThis.fetch = mock((input, options) => {
    if (String(input).includes("/pipeline")) {
      return Promise.resolve({ ok: false, status: 500, text: () => Promise.resolve("down") });
    }
    return deliver(input, options);
  });

  const ip = "203.0.113.20";
  for (let i = 0; i < 5; i += 1) {
    const ok = await send(request(valid, { ip }));
    expect(ok.status).toBe(200);
  }
  const limited = await send(request(valid, { ip }));
  expect(limited.status).toBe(429);
});

test("the submission id is echoed for analytics de-duplication", async () => {
  setDeliveryConfig();
  globalThis.fetch = okDelivery();

  const json = await send(request({ ...valid, submissionId: "abc12345" }));
  expect(json.payload).toEqual({ success: true, ref: "abc12345" });

  const nojs = await send(
    request(new URLSearchParams({ ...valid, submissionId: "abc12345" }).toString(), {
      contentType: "application/x-www-form-urlencoded",
      accept: "text/html",
    }),
  );
  expect(nojs.headers.Location).toBe("/?contacto=enviado&ref=abc12345#contacto");
});

test("an invalid submission id is ignored", async () => {
  setDeliveryConfig();
  globalThis.fetch = okDelivery();

  const json = await send(request({ ...valid, submissionId: "x" }));
  expect(json.payload).toEqual({ success: true });

  const nojs = await send(
    request(new URLSearchParams({ ...valid, submissionId: "x" }).toString(), {
      contentType: "application/x-www-form-urlencoded",
      accept: "text/html",
    }),
  );
  expect(nojs.headers.Location).toBe("/?contacto=enviado#contacto");
});

test("non-POST methods and unsupported content types are refused", async () => {
  const method = await send(request(valid, { method: "GET" }));
  expect(method.status).toBe(405);
  expect(method.headers.Allow).toBe("POST");

  const contentType = await send(request(valid, { contentType: "text/plain" }));
  expect(contentType.status).toBe(415);
});

test("the Resend subject never contains header-breaking characters", async () => {
  setDeliveryConfig();
  const deliver = mock((_url, options) => {
    const payload = JSON.parse(options.body);
    expect(payload.subject).not.toMatch(/[\r\n]/);
    expect(payload.reply_to).toBe(valid.email);
    return Promise.resolve({ ok: true });
  });
  globalThis.fetch = deliver;

  await send(request({ ...valid, name: "Ana\nBcc: evil@example.test" }));

  expect(deliver).toHaveBeenCalledTimes(1);
});
