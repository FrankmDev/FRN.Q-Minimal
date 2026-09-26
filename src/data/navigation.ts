/**
 * Single source of truth for navigation and the contact CTA.
 *
 * Internal links use real anchors on the single-page commercial surface.
 * The external portfolio is labelled PORTFOLIO / EN and opens frnq.studio.
 */

export interface NavItem {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#sobre-mi", label: "Estudio" },
  { href: "#contacto", label: "Contacto" },
];

/** Header action. Primary conversion path into the contact section. */
export const headerCta = {
  label: "Hablemos",
  href: "#contacto",
} as const;
