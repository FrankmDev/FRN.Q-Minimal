import {
  CONTACT_BUDGET_VALUES,
  CONTACT_BUDGETS,
  CONTACT_COMPANY_MAX,
  CONTACT_EMAIL_MAX,
  CONTACT_EMAIL_PATTERN,
  CONTACT_MESSAGE_MAX,
  CONTACT_MESSAGE_MIN,
  CONTACT_NAME_MAX,
  CONTACT_NAME_MIN,
  CONTACT_OPTIONAL_MAX,
  CONTACT_TYPES,
  CONTACT_TYPE_VALUES,
} from "../src/data/contact-contract";
import { siteConfig } from "../src/data/site";

declare const process: { env: Record<string, string | undefined> };

type ContactSuccess = { success: true };
type ContactFailure = {
  success: false;
  error: string;
  errors?: Record<string, string>;
};
type ContactResponse = ContactSuccess | ContactFailure;

type VercelRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => VercelResponse;
  json: (body: ContactResponse) => void;
};

const GENERIC_ERROR = "No se ha podido enviar el mensaje. Inténtalo de nuevo.";
const UNAVAILABLE_ERROR = "El formulario no está disponible ahora mismo.";
const INVALID_REQUEST_ERROR = "Solicitud no válida.";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

function readMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function parseBody(raw: unknown): Record<string, unknown> | null {
  if (isRecord(raw)) return raw;
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parseUrlEncoded(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const params = new URLSearchParams(raw);
  const result: Record<string, unknown> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function labelFor(
  list: readonly { value: string; label: string }[],
  value: string,
): string {
  return list.find((item) => item.value === value)?.label ?? value;
}

function getClientKey(request: VercelRequest): string {
  const forwarded = request.headers?.["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (rateLimitStore.size > 5000) {
    for (const [storedKey, stored] of rateLimitStore) {
      if (stored.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }
  return entry.count > RATE_LIMIT_MAX;
}

function validate(body: Record<string, unknown>):
  | {
      ok: true;
      name: string;
      email: string;
      company: string;
      type: string;
      message: string;
      budget: string;
    }
  | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const name = readString(body.name);
  const email = readString(body.email);
  const company = readString(body.company);
  const type = readString(body.type);
  const message = readMessage(body.message);
  const budget = readString(body.budget);

  if (name.length < CONTACT_NAME_MIN) errors.name = `Indica al menos ${CONTACT_NAME_MIN} caracteres.`;
  else if (name.length > CONTACT_NAME_MAX) errors.name = "El nombre es demasiado largo.";

  if (!CONTACT_EMAIL_PATTERN.test(email) || email.length > CONTACT_EMAIL_MAX) {
    errors.email = "Introduce un email válido.";
  }

  if (company.length > CONTACT_COMPANY_MAX) errors.company = "El nombre de empresa es demasiado largo.";

  if (!type) errors.type = "Selecciona el tipo de proyecto.";
  else if (!CONTACT_TYPE_VALUES.includes(type)) errors.type = "Selecciona un tipo de proyecto válido.";

  if (message.length < CONTACT_MESSAGE_MIN || message.length > CONTACT_MESSAGE_MAX) {
    errors.message = `El contexto debe tener entre ${CONTACT_MESSAGE_MIN} y ${CONTACT_MESSAGE_MAX} caracteres.`;
  }

  if (budget && !CONTACT_BUDGET_VALUES.includes(budget)) errors.budget = "Valor no válido.";
  if (budget.length > CONTACT_OPTIONAL_MAX) errors.budget = "Valor no válido.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, name, email, company, type, message, budget };
}

function wantsHtml(request: VercelRequest): boolean {
  const accept = request.headers?.["accept"];
  const value = Array.isArray(accept) ? accept[0] : accept;
  return typeof value === "string" && value.includes("text/html");
}

function reply(
  request: VercelRequest,
  response: VercelResponse,
  status: number,
  payload: ContactResponse,
  htmlState: "enviado" | "error",
) {
  if (wantsHtml(request)) {
    response.setHeader("Location", `/?contacto=${htmlState}#contacto`);
    return response
      .status(303)
      .json(status < 400 ? { success: true } : { success: false, error: "See form." });
  }
  return response.status(status).json(payload);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return reply(request, response, 405, { success: false, error: "Method not allowed." }, "error");
  }

  const contentTypeHeader = request.headers?.["content-type"];
  const contentType = (Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : contentTypeHeader) ?? "";
  const isUrlEncoded = contentType.toLowerCase().includes("application/x-www-form-urlencoded");
  const isJson = contentType.toLowerCase().includes("application/json");

  if (!isJson && !isUrlEncoded) {
    return reply(request, response, 415, { success: false, error: INVALID_REQUEST_ERROR }, "error");
  }

  const rawBody = request.body;
  const body = isRecord(rawBody)
    ? rawBody
    : isUrlEncoded
      ? parseUrlEncoded(rawBody)
      : parseBody(rawBody);
  if (!body) {
    return reply(request, response, 400, { success: false, error: INVALID_REQUEST_ERROR }, "error");
  }

  if (readString(body.website) !== "") {
    return reply(request, response, 200, { success: true }, "enviado");
  }

  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return reply(request, response, 429, { success: false, error: "Demasiados envíos. Inténtalo más tarde." }, "error");
  }

  const result = validate(body);
  if (!result.ok) {
    return reply(
      request,
      response,
      400,
      { success: false, error: "Revisa los campos marcados.", errors: result.errors },
      "error",
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return reply(request, response, 503, { success: false, error: UNAVAILABLE_ERROR }, "error");
  }

  const lines = [
    `Nombre: ${result.name}`,
    `Email: ${result.email}`,
    result.company ? `Empresa: ${result.company}` : "",
    `Tipo: ${labelFor(CONTACT_TYPES, result.type)}`,
    result.budget ? `Presupuesto: ${labelFor(CONTACT_BUDGETS, result.budget)}` : "Presupuesto: por comentar",
    "",
    result.message,
  ].filter((line, index, all) => line !== "" || all[index - 1] !== "");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [siteConfig.internalEmail],
        reply_to: result.email,
        subject: `FRN.Q — ${result.name} · ${labelFor(CONTACT_TYPES, result.type)}`,
        text: lines.join("\n"),
      }),
    });

    if (!resendResponse.ok) {
      return reply(request, response, 502, { success: false, error: GENERIC_ERROR }, "error");
    }

    return reply(request, response, 200, { success: true }, "enviado");
  } catch {
    return reply(request, response, 502, { success: false, error: GENERIC_ERROR }, "error");
  }
}
