export const CONTACT_NAME_MIN = 2;
export const CONTACT_NAME_MAX = 100;
export const CONTACT_EMAIL_MAX = 254;
export const CONTACT_COMPANY_MAX = 120;
/**
 * The message is required. A low floor keeps a real description without
 * rejecting a short but useful brief ("Necesito una tienda online"), while
 * still discarding one-word noise. Anti-spam relies on the honeypot plus the
 * rate limiter, not on a long minimum.
 */
export const CONTACT_MESSAGE_MIN = 10;
export const CONTACT_MESSAGE_MAX = 2000;
export const CONTACT_OPTIONAL_MAX = 60;
export const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Client-generated, opaque per-submission id echoed back for analytics de-dup. */
export const CONTACT_SUBMISSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

export const CONTACT_TYPES = [
  { value: "ecommerce", label: "Ecommerce / Shopify" },
  { value: "portal", label: "Portal / B2B" },
  { value: "sistema", label: "Sistema / integración" },
  { value: "web", label: "Web" },
  { value: "reparacion", label: "Reparación / mejora web" },
  { value: "seo", label: "SEO / posicionamiento" },
  { value: "otro", label: "Otro" },
] as const;

export type ContactType = (typeof CONTACT_TYPES)[number]["value"];

export const CONTACT_TYPE_VALUES: readonly string[] = CONTACT_TYPES.map(
  (type) => type.value,
);

export const CONTACT_BUDGETS = [
  { value: "", label: "Prefiero comentarlo antes" },
  { value: "hasta-500", label: "Hasta 500 €" },
  { value: "hasta-2k", label: "Hasta 2.000 €" },
  { value: "2k-5k", label: "2.000 € – 5.000 €" },
  { value: "5k-10k", label: "5.000 € – 10.000 €" },
  { value: "mas-10k", label: "Más de 10.000 €" },
] as const;

export const CONTACT_BUDGET_VALUES: readonly string[] = CONTACT_BUDGETS.map(
  (budget) => budget.value,
);
