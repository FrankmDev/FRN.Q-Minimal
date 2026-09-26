/**
 * Single source of truth for site identity, contact and external links.
 *
 * frnq.es is the Spanish commercial surface of FRN.Q. The English,
 * professional/technical portfolio lives at frnq.studio and is linked
 * externally as PORTFOLIO / EN. This site is not a translation of it.
 */

export const siteConfig = {
  name: "FRN.Q",
  fullName: "Francisco Muñoz",
  tagline: "Ecommerce, portales y sistemas",
  url: "https://frnq.es",
  email: "hola@frnq.es",
  lang: "es",
  locale: "es_ES",
  location: {
    city: "Granada",
    region: "Andalucía",
    country: "ES",
  },
  geo: {
    latitude: "37.1773",
    longitude: "-3.5986",
  },
  description:
    "Estudio digital de Francisco Muñoz en Granada. Ecommerce, portales B2B, sistemas y automatización para negocios que necesitan vender mejor, ordenar sus procesos y medir lo que importa.",
} as const;

/**
 * External portfolio. frnq.studio is the English professional/technical
 * surface; it is linked, never merged, into the commercial site.
 */
export const portfolioLink = {
  label: "PORTFOLIO / EN",
  title: "Portfolio profesional y técnico",
  href: "https://frnq.studio",
  display: "frnq.studio",
} as const;

export interface SocialLink {
  label: string;
  title: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { label: "LI", title: "LinkedIn", href: "https://linkedin.com/in/frnq" },
  { label: "GH", title: "GitHub", href: "https://github.com/frnq" },
  { label: "DR", title: "Dribbble", href: "https://dribbble.com/frnq" },
];
