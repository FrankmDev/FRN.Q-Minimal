/**
 * Single source of truth for site identity, contact and external links.
 *
 * frnq.es is the Spanish commercial surface of FRN.Q. The English,
 * professional/technical portfolio lives at frnq.studio and is linked
 * externally as STUDIO ↗ everywhere. This site is not a translation of it.
 */

export const siteConfig = {
  name: "FRN.Q",
  fullName: "Francisco Muñoz",
  tagline: "Ecommerce, portales y sistemas",
  url: "https://frnq.es",
  /** Public contact address shown across the site. */
  email: "info@frnq.es",
  /**
   * Internal delivery mailbox. Form submissions are sent here; the public
   * info@frnq.es address redirects internally to this same mailbox.
   */
  internalEmail: "info@frnq.studio",
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
    "Ecommerce, Shopify, portales B2B e integraciones para empresas. Estudio independiente de Francisco Muñoz, en Granada.",
} as const;

/**
 * External portfolio. frnq.studio is the English professional/technical
 * surface; it is linked, never merged, into the commercial site.
 */
export const portfolioLink = {
  label: "STUDIO",
  title: "Portfolio profesional y técnico",
  href: "https://frnq.studio/",
} as const;

export interface SocialLink {
  label: string;
  title: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { label: "GH", title: "GitHub", href: "https://github.com/FrankmDev" },
];
