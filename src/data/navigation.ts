/**
 * Single source of truth for navigation and the contact CTA.
 *
 * Primary items mix home anchors (sections without a dedicated route:
 * servicios, sobre-mi, contacto) with real subpages (casos, precios,
 * soporte), so the header works from any route, including case, legal or
 * solution pages. frnq.studio is linked externally only as STUDIO ↗
 * (textual secondary link); HABLEMOS remains the only highlighted CTA.
 */

import { serviceAreas } from "./services";
import { getSolutionForService, solutionPath } from "./solutions";
import { webRescueCopy, webRescueDiagnosis } from "./web-rescue";

export interface NavItem {
  href: string;
  label: string;
}

/** Header primary navigation, in commercial order. */
export const navItems: NavItem[] = [
  { href: "/#servicios", label: "Soluciones" },
  { href: "/casos/", label: "Casos" },
  { href: "/precios/", label: "Precios" },
  { href: "/soporte/", label: "Soporte" },
  { href: "/#sobre-mi", label: "Estudio" },
  { href: "/#contacto", label: "Contacto" },
];

/**
 * Secondary destinations: real routes without a slot in the primary bar.
 * Rendered as the mobile menu "Más" index; the footer index carries the
 * full set.
 */
export const secondaryNavItems: NavItem[] = [
  { href: "/guias/", label: "Guías" },
  { href: "/colaboraciones/agencias/", label: "Colaboraciones" },
];

export interface SolutionNavItem {
  href: string;
  label: string;
  short: string;
  num: string;
}

/**
 * The four solution routes, in Home presentation order (`services.ts`).
 * Rendered as the desktop "Soluciones" dropdown and the mobile menu group.
 */
export const solutionNav: SolutionNavItem[] = serviceAreas.flatMap((area) => {
  const solution = getSolutionForService(area.id);
  if (!solution) return [];
  return [
    {
      href: solutionPath(solution.slug),
      label: area.title,
      short: area.short,
      num: area.num,
    },
  ];
});

/** The productized entry offer, closing the Soluciones group. */
export const rescueNav = {
  href: solutionPath("revision-web"),
  label: webRescueCopy.label,
  short: webRescueDiagnosis.detail,
  tag: "Punto de entrada",
} as const;

/** Header action. Primary conversion path into the contact section. */
export const headerCta = {
  label: "Hablemos",
  href: "/#contacto",
} as const;
