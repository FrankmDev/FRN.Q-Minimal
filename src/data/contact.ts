import { siteConfig } from "./site";

export const contactMethods = [
  {
    icon: "✉",
    label: "Email directo",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: "→",
    label: "Brief de proyecto",
    value: "Rellena el formulario",
    href: "#form",
  },
] as const;
