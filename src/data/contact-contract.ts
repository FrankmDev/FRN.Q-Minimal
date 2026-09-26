export const CONTACT_NAME_MIN = 2;
export const CONTACT_NAME_MAX = 100;
export const CONTACT_EMAIL_MAX = 254;
export const CONTACT_COMPANY_MAX = 120;
export const CONTACT_MESSAGE_MIN = 20;
export const CONTACT_MESSAGE_MAX = 2000;
export const CONTACT_OPTIONAL_MAX = 60;
export const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_TYPES = [
  { value: "ecommerce", label: "Ecommerce / Shopify" },
  { value: "portal", label: "Portal / B2B" },
  { value: "sistema", label: "Sistema / automatización" },
  { value: "web", label: "Web" },
  { value: "seo", label: "SEO / Growth" },
  { value: "otro", label: "Otro" },
] as const;

export type ContactType = (typeof CONTACT_TYPES)[number]["value"];

export const CONTACT_TYPE_VALUES: readonly string[] = CONTACT_TYPES.map(
  (type) => type.value,
);

export const CONTACT_BUDGETS = [
  { value: "", label: "Prefiero comentarlo antes" },
  { value: "hasta-2k", label: "Hasta 2.000 €" },
  { value: "2k-5k", label: "2.000 € – 5.000 €" },
  { value: "5k-10k", label: "5.000 € – 10.000 €" },
  { value: "mas-10k", label: "Más de 10.000 €" },
] as const;

export const CONTACT_BUDGET_VALUES: readonly string[] = CONTACT_BUDGETS.map(
  (budget) => budget.value,
);
