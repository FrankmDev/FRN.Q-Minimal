import { siteConfig } from "./site";

export const contactMethods = [
  {
    icon: "✉",
    label: "Email directo",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
] as const;
