import { siteConfig } from "./site";

export const contactMethods = [
  {
    /** Stable identifier for analytics (`data-track-method`). */
    id: "email",
    icon: "✉",
    label: "Email directo",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
] as const;
