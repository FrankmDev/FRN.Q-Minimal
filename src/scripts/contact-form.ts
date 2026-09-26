import {
  CONTACT_COMPANY_MAX,
  CONTACT_EMAIL_MAX,
  CONTACT_EMAIL_PATTERN,
  CONTACT_MESSAGE_MAX,
  CONTACT_MESSAGE_MIN,
  CONTACT_NAME_MAX,
  CONTACT_NAME_MIN,
  CONTACT_OPTIONAL_MAX,
} from "../data/contact-contract";

export {};

type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type ContactResponse = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string>;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const COUNTER_WARN_THRESHOLD = 1800;

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
): void {
  if (!banner || !textEl) return;
  textEl.textContent = message;
  banner.classList.remove("hidden");
  banner.focus();
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
      validateField(field);
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
        return;
      }
    }

    const data = Object.fromEntries(new FormData(form).entries());

    const send = async () => {
      submitBtn.disabled = true;
      form.setAttribute("aria-busy", "true");
      if (submitText) submitText.textContent = "Enviando…";
      formLoading?.classList.remove("hidden");
      formLoading?.classList.add("flex");

      try {
        const res = await fetch("/api/contact", {
          signal: controller.signal,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const raw = await res.text();
        let result: ContactResponse = {};

        if (raw) {
          try {
            result = JSON.parse(raw) as ContactResponse;
          } catch {
            showFormError("Respuesta inesperada del servidor. Inténtalo de nuevo.", formErrorBanner, formErrorText);
            return;
          }
        } else if (!res.ok) {
          showFormError("No se ha podido enviar. Inténtalo de nuevo.", formErrorBanner, formErrorText);
          return;
        }

        if (res.ok && result.success) {
          form.classList.add("hidden");
          successBlock.classList.remove("hidden");
          successBlock.classList.add("flex");
          successBlock.focus();

          if (window.gtag) window.gtag("event", "contact_form_submitted");
          else window.dispatchEvent(new CustomEvent("contact_form_submitted"));
          return;
        }

        const errorMessage =
          result.error ||
          (res.status >= 500
            ? "No se ha podido enviar. Inténtalo de nuevo más tarde."
            : "Revisa los campos marcados.");

        showFormError(errorMessage, formErrorBanner, formErrorText);

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
        if (!controller.signal.aborted) {
          showFormError("Error de conexión. Inténtalo de nuevo.", formErrorBanner, formErrorText);
        }
      } finally {
        submitBtn.disabled = false;
        form.removeAttribute("aria-busy");
        if (submitText) submitText.textContent = "Enviar proyecto";
        formLoading?.classList.add("hidden");
        formLoading?.classList.remove("flex");
      }
    };

    void send();
  });

  if (resetBtn) {
    add(resetBtn, "click", () => {
      form.reset();
      form.classList.remove("hidden");
      successBlock.classList.add("hidden");
      successBlock.classList.remove("flex");
      hideFormError(formErrorBanner);

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

function handleReturnState(): void {
  const params = new URLSearchParams(window.location.search);
  const state = params.get("contacto");
  if (!state) return;

  const form = document.getElementById("contact-form");
  const successBlock = document.getElementById("contact-success");
  const banner = document.getElementById("form-error-banner");
  const bannerText = document.getElementById("form-error-text");

  if (state === "enviado" && form && successBlock) {
    form.classList.add("hidden");
    successBlock.classList.remove("hidden");
    successBlock.classList.add("flex");
    successBlock.focus();
  } else if (state === "error" && banner && bannerText) {
    bannerText.textContent = "No se ha podido enviar. Revisa los campos e inténtalo de nuevo.";
    banner.classList.remove("hidden");
    banner.focus();
  }

  window.history.replaceState(null, "", window.location.pathname + window.location.hash);
}

function boot(): void {
  initContactForm();
  handleReturnState();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
