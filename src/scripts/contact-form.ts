import {
  CONTACT_COMPANY_MAX,
  CONTACT_BUDGET_VALUES,
  CONTACT_EMAIL_MAX,
  CONTACT_EMAIL_PATTERN,
  CONTACT_MESSAGE_MAX,
  CONTACT_MESSAGE_MIN,
  CONTACT_NAME_MAX,
  CONTACT_NAME_MIN,
  CONTACT_OPTIONAL_MAX,
  CONTACT_SUBMISSION_ID_PATTERN,
  CONTACT_TYPE_VALUES,
} from "../data/contact-contract";
import { track, trackOnce, type TrackProps } from "./analytics";

export {};

type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type ContactResponse = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string>;
  ref?: string;
};

const COUNTER_WARN_THRESHOLD = 1800;
const REQUEST_TIMEOUT_MS = 15000;

function newSubmissionId(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  return `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function ensureSubmissionId(form: HTMLFormElement, force = false): string {
  let input = form.elements.namedItem("submissionId") as HTMLInputElement | null;
  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = "submissionId";
    form.appendChild(input);
  }
  if (input.value && !force) return input.value;
  const id = newSubmissionId();
  input.value = id;
  return id;
}

export function leadProps(data: Record<string, unknown>): TrackProps {
  // Non-personal, categorical data only: never name, email or message.
  return {
    type: typeof data.type === "string" && CONTACT_TYPE_VALUES.includes(data.type) ? data.type : undefined,
    budget: typeof data.budget === "string" && CONTACT_BUDGET_VALUES.includes(data.budget) ? data.budget : undefined,
    hasCompany:
      typeof data.company === "string" && data.company.trim().length > 0,
  };
}

export function responseErrorReason(status: number, hasFieldErrors: boolean): string {
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return hasFieldErrors ? "validation" : "request_failed";
}

/** Accepts only a known contact type, so a crafted `?tipo=` value cannot
 * preselect an option the server would reject. */
export function resolvePreselectType(value: string | null | undefined): string | undefined {
  return typeof value === "string" && CONTACT_TYPE_VALUES.includes(value) ? value : undefined;
}

export function isConfirmedSubmission(result: ContactResponse, submissionId: string): boolean {
  return result.success === true && result.ref === submissionId && CONTACT_SUBMISSION_ID_PATTERN.test(submissionId);
}

function getFormFields(form: HTMLFormElement): FormField[] {
  return Array.from(
    form.querySelectorAll<FormField>(
      'input:not([type="hidden"]):not(#website), select, textarea',
    ),
  );
}

function setFieldState(
  field: FormField,
  state: "valid" | "invalid" | "neutral",
  errorMessage = "",
): void {
  const fieldUnit = field.closest("[data-field-id]");
  const errorEl = document.getElementById(`${field.name}-error`);

  fieldUnit?.classList.remove("is-focus", "is-valid", "is-invalid");
  if (state === "invalid") fieldUnit?.classList.add("is-invalid");
  else if (state === "valid") fieldUnit?.classList.add("is-valid");

  if (errorEl) {
    if (state === "invalid") {
      errorEl.textContent = errorMessage;
      errorEl.classList.remove("hidden");
      field.setAttribute("aria-invalid", "true");
    } else {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
      field.removeAttribute("aria-invalid");
    }
  }
}

function validateField(field: FormField): boolean {
  const value = field.value.trim();

  if (field.required && !value) {
    setFieldState(field, "invalid", "Este campo es obligatorio.");
    return false;
  }

  if (field.name === "name" && value.length < CONTACT_NAME_MIN) {
    setFieldState(field, "invalid", `Indica al menos ${CONTACT_NAME_MIN} caracteres.`);
    return false;
  }

  if (field.name === "name" && value.length > CONTACT_NAME_MAX) {
    setFieldState(field, "invalid", "El nombre es demasiado largo.");
    return false;
  }

  if (field.name === "email" && (!CONTACT_EMAIL_PATTERN.test(value) || value.length > CONTACT_EMAIL_MAX)) {
    setFieldState(field, "invalid", "Introduce un email válido.");
    return false;
  }

  if (field.name === "company" && value.length > CONTACT_COMPANY_MAX) {
    setFieldState(field, "invalid", "El nombre de empresa es demasiado largo.");
    return false;
  }

  if (
    field.name === "message" &&
    value.length > 0 &&
    (value.length < CONTACT_MESSAGE_MIN || value.length > CONTACT_MESSAGE_MAX)
  ) {
    setFieldState(field, "invalid", `El contexto debe tener entre ${CONTACT_MESSAGE_MIN} y ${CONTACT_MESSAGE_MAX} caracteres.`);
    return false;
  }

  if (field.name === "budget" && value.length > CONTACT_OPTIONAL_MAX) {
    setFieldState(field, "invalid", "Valor no válido.");
    return false;
  }

  setFieldState(field, value ? "valid" : "neutral");
  return true;
}

function updateMessageCounter(field: HTMLTextAreaElement): void {
  const counterWrap = field.closest("[data-field-id]")?.querySelector("[data-field-counter]");
  const currentEl = counterWrap?.querySelector("[data-counter-current]");
  const len = field.value.length;

  if (currentEl) currentEl.textContent = String(len);
  if (!counterWrap) return;

  counterWrap.classList.remove("is-warn", "is-max");
  if (len > CONTACT_MESSAGE_MAX) counterWrap.classList.add("is-max");
  else if (len > COUNTER_WARN_THRESHOLD) counterWrap.classList.add("is-warn");
}

function showFormError(
  message: string,
  banner: HTMLElement | null,
  textEl: HTMLElement | null,
  reason = "unknown",
): void {
  if (!banner || !textEl) return;
  textEl.textContent = message;
  banner.classList.remove("hidden");
  banner.focus();
  track("contact_form_error", { reason });
}

function hideFormError(banner: HTMLElement | null): void {
  banner?.classList.add("hidden");
}

function initContactForm(): void {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const successBlock = document.getElementById("contact-success") as HTMLElement | null;
  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement | null;
  const submitText = document.getElementById("submit-text") as HTMLElement | null;
  const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement | null;
  const formLoading = document.getElementById("form-loading") as HTMLElement | null;
  const formErrorBanner = document.getElementById("form-error-banner") as HTMLElement | null;
  const formErrorText = document.getElementById("form-error-text") as HTMLElement | null;
  const formErrorDismiss = document.getElementById("form-error-dismiss") as HTMLButtonElement | null;

  if (!form || !successBlock || !form.querySelector("textarea")) return;
  if (form.dataset.enhanced === "true") return;
  form.dataset.enhanced = "true";

  // The enhanced flow owns validation so every error renders in our own
  // accessible UI. Without JS the native constraint validation still runs.
  form.noValidate = true;
  ensureSubmissionId(form);

  const fields = getFormFields(form);
  const controller = new AbortController();

  const add = (el: Element, type: string, fn: EventListener) => {
    el.addEventListener(type, fn, { signal: controller.signal });
  };

  fields.forEach((field) => {
    const fieldUnit = field.closest("[data-field-id]");

    add(field, "focus", () => fieldUnit?.classList.add("is-focus"));
    add(field, "blur", () => {
      fieldUnit?.classList.remove("is-focus");
      validateField(field);
    });
    add(field, "input", () => {
      // Do not flag a field while the visitor is still typing. If it was
      // already invalid, re-validate so the error clears as soon as it is fixed.
      const fieldUnitEl = field.closest("[data-field-id]");
      if (fieldUnitEl?.classList.contains("is-invalid")) validateField(field);
      if (field.name === "message") updateMessageCounter(field as HTMLTextAreaElement);
    });
    add(field, "change", () => validateField(field));
  });

  add(form, "submit", (event) => {
    event.preventDefault();
    if (!submitBtn || submitBtn.disabled) return;
    hideFormError(formErrorBanner);

    for (const field of fields) {
      if (!validateField(field)) {
        field.focus();
        track("contact_form_error", { reason: "validation" });
        return;
      }
    }

    const submissionId = ensureSubmissionId(form);
    const data = Object.fromEntries(new FormData(form).entries());
    data.submissionId = submissionId;

    const send = async () => {
      submitBtn.disabled = true;
      form.setAttribute("aria-busy", "true");
      if (submitText) submitText.textContent = "Enviando…";
      formLoading?.classList.remove("hidden");
      formLoading?.classList.add("flex");

      track("contact_form_submit", leadProps(data));

      const requestController = new AbortController();
      const timeoutId = window.setTimeout(() => requestController.abort(), REQUEST_TIMEOUT_MS);

      try {
        const res = await fetch("/api/contact", {
          signal: requestController.signal,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const raw = await res.text();
        let result: ContactResponse = {};

        if (raw) {
          try {
            const parsed: unknown = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid response");
            result = parsed as ContactResponse;
          } catch {
            showFormError("Respuesta inesperada del servidor. Inténtalo de nuevo.", formErrorBanner, formErrorText, "invalid_response");
            return;
          }
        } else if (!res.ok) {
          showFormError("No se ha podido enviar. Inténtalo de nuevo.", formErrorBanner, formErrorText, responseErrorReason(res.status, false));
          return;
        }

        if (res.ok && result.success === true) {
          form.classList.add("hidden");
          successBlock.classList.remove("hidden");
          successBlock.classList.add("flex");
          successBlock.focus();

          // The honeypot also returns success, but only delivered submissions
          // echo our opaque ID. Never use an arbitrary response or URL ref.
          if (isConfirmedSubmission(result, submissionId)) {
            trackOnce(`submit:${submissionId}`, "contact_form_success", leadProps(data));
          }
          return;
        }

        const errorMessage =
          result.error ||
          (res.status >= 500
            ? "No se ha podido enviar. Inténtalo de nuevo más tarde."
            : "Revisa los campos marcados.");

        showFormError(errorMessage, formErrorBanner, formErrorText, responseErrorReason(res.status, Boolean(result.errors && Object.keys(result.errors).length)));

        if (result.errors) {
          Object.entries(result.errors).forEach(([key, message]) => {
            const field = document.getElementById(key) as FormField | null;
            if (field) setFieldState(field, "invalid", message);
          });

          const firstServerError = Object.keys(result.errors)[0];
          const errorField = firstServerError
            ? (document.getElementById(firstServerError) as FormField | null)
            : null;
          errorField?.focus();
        }
      } catch {
        if (requestController.signal.aborted) {
          showFormError("El envío ha tardado demasiado. Inténtalo de nuevo.", formErrorBanner, formErrorText, "timeout");
        } else if (typeof navigator !== "undefined" && navigator.onLine === false) {
          showFormError("Parece que no hay conexión. Revisa tu red e inténtalo de nuevo.", formErrorBanner, formErrorText, "offline");
        } else {
          showFormError("Error de conexión. Inténtalo de nuevo.", formErrorBanner, formErrorText, "network");
        }
      } finally {
        window.clearTimeout(timeoutId);
        submitBtn.disabled = false;
        form.removeAttribute("aria-busy");
        if (submitText) submitText.textContent = "Enviar solicitud";
        formLoading?.classList.add("hidden");
        formLoading?.classList.remove("flex");
      }
    };

    void send();
  });

  if (resetBtn) {
    add(resetBtn, "click", () => {
      form.reset();
      ensureSubmissionId(form, true);
      form.classList.remove("hidden");
      successBlock.classList.add("hidden");
      successBlock.classList.remove("flex");
      hideFormError(formErrorBanner);
      track("contact_form_reset");

      fields.forEach((field) => {
        field.closest("[data-field-id]")?.classList.remove("is-focus", "is-valid", "is-invalid");
        setFieldState(field, "neutral");
      });

      const messageField = form.querySelector<HTMLTextAreaElement>("#message");
      if (messageField) updateMessageCounter(messageField);
      fields[0]?.focus();
    });
  }

  if (formErrorDismiss && formErrorBanner) {
    add(formErrorDismiss, "click", () => hideFormError(formErrorBanner));
  }
}

export function handleReturnState(): void {
  const params = new URLSearchParams(window.location.search);
  const state = params.get("contacto");
  if (!state && !params.has("ref")) return;
  // Legacy 303 parameters are not authenticated receipts. They must never
  // hide the form, report confirmed success or enter analytics storage.
  if (state === "error") {
    const banner = document.getElementById("form-error-banner");
    const bannerText = document.getElementById("form-error-text");
    if (banner && bannerText) {
      bannerText.textContent = "No se ha podido enviar. Revisa los campos e inténtalo de nuevo.";
      banner.classList.remove("hidden");
      banner.focus();
    }
  }

  params.delete("contacto");
  params.delete("ref");
  const query = params.toString();
  window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : "") + window.location.hash);
}

function applyContactType(type: string): void {
  const select = document.getElementById("type") as HTMLSelectElement | null;
  if (!select) return;
  select.value = type;

  select.closest("[data-field-id]")?.classList.remove("is-invalid");
  const errorEl = document.getElementById("type-error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }
  select.removeAttribute("aria-invalid");
}

let preselectBound = false;

/**
 * Preselects the query type carried by a `?tipo=` link and by any CTA with
 * `data-contact-type` (the Home "Revisar mi web" action). It only accepts
 * known contract values, never blocks navigation and never weakens the form
 * validations: the API still validates the submitted type.
 */
export function handleContactTypePreselect(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const fromQuery = resolvePreselectType(params.get("tipo"));
  if (fromQuery) {
    applyContactType(fromQuery);
    params.delete("tipo");
    const query = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : "") + window.location.hash);
  }

  if (preselectBound) return;
  preselectBound = true;

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest("[data-contact-type]");
    if (!trigger) return;
    const type = resolvePreselectType(trigger.getAttribute("data-contact-type"));
    if (type) applyContactType(type);
  });
}

function boot(): void {
  initContactForm();
  handleReturnState();
  handleContactTypePreselect();
}

if (typeof document !== "undefined" && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else if (typeof document !== "undefined") {
  boot();
}
