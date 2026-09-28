/**
 * Single source of truth for navigation and the contact CTA.
 *
 * Internal links use real anchors on the home commercial surface, including
 * when navigation starts from a case, legal or solution route.
 * frnq.studio is linked externally only as STUDIO ↗ (textual secondary
 * link); HABLEMOS remains the only highlighted CTA.
 */

export interface NavItem {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "#servicios", label: "Soluciones" },
  { href: "#proyectos", label: "Casos" },
  { href: "#sobre-mi", label: "Estudio" },
  { href: "#contacto", label: "Contacto" },
];

/** Header action. Primary conversion path into the contact section. */
export const headerCta = {
  label: "Hablemos",
  href: "#contacto",
} as const;
