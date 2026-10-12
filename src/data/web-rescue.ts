import type { ContactType } from "./contact-contract";

/**
 * Single source of truth for the Web Rescue block ("Revisión y reparación
 * web") integrated into the Home page.
 *
 * PRICING RULES
 * - Only the productized offers are public: the scoped 360 review and the
 *   "from" price of a landing repair. Larger repairs are quoted after the
 *   review; no full internal price list is published.
 * - The review is initial and scoped, never an unlimited audit.
 * - No guaranteed results, rankings or income.
 */

export interface RescueStep {
  num: string;
  title: string;
  description: string;
}

export interface RescuePrice {
  title: string;
  /** Visible price: a fixed amount or a scoped label ("Presupuesto"). */
  price: string;
  detail: string;
  /** Schema-ready amount when the offer has a fixed public number. */
  amount?: number;
  /** True when `amount` is a minimum ("desde"). */
  from?: boolean;
}

export interface WebRescueCopy {
  label: string;
  titleLine: string;
  titleHighlight: string;
  lead: string;
  steps: RescueStep[];
  prices: RescuePrice[];
  note: string;
  market: {
    title: string;
    lead: string;
    cases: string[];
    disclaimer: string;
  };
  cta: { label: string; type: ContactType };
}

/** Public, productized entry offer. Reused by the corporate-web FAQ. */
export const webRescueDiagnosis = {
  title: "Diagnóstico Web 360",
  price: "99 €",
  amount: 99,
  detail:
    "Informe inicial y acotado. Se descuenta de una reparación elegible contratada en los 30 días siguientes.",
} as const;

export const webRescueCopy: WebRescueCopy = {
  label: "Revisión y reparación web",
  titleLine: "Tu web ya existe.",
  titleHighlight: "Hagamos que trabaje.",
  lead:
    "Reviso webs en marcha —WordPress, Elementor o WooCommerce— para recuperar lo que dejó de funcionar, mejorar lo que no convierte y ampliar lo que falta, sin rehacerlo todo.",
  steps: [
    {
      num: "01",
      title: "Diagnóstico",
      description:
        "Revisión inicial y acotada: qué falla, qué se puede mejorar y por dónde empezar.",
    },
    {
      num: "02",
      title: "Presupuesto",
      description: "Alcance y coste por escrito antes de tocar nada.",
    },
    {
      num: "03",
      title: "Reparación",
      description: "Corrijo y mejoro lo acordado sobre la web existente.",
    },
    {
      num: "04",
      title: "Verificación",
      description:
        "Compruebo que todo funciona y dejo los cambios documentados.",
    },
  ],
  prices: [
    { ...webRescueDiagnosis },
    {
      title: "Reparación de landing",
      price: "desde 299 €",
      amount: 299,
      from: true,
      detail: "Correcciones y mejoras sobre una página concreta.",
    },
    {
      title: "Webs mayores",
      price: "Presupuesto",
      detail: "Según incidencias y complejidad, tras el diagnóstico.",
    },
  ],
  note:
    "El diagnóstico es un punto de partida acotado, no una auditoría ilimitada. El presupuesto se cierra por escrito antes de reparar.",
  market: {
    title: "También para negocios de Granada",
    lead:
      "Trabajo desde Granada con hoteles, alojamientos, restaurantes, pubs, salas y comercios.",
    cases: [
      "Presencia digital y web del negocio",
      "Venta directa y tienda online",
      "Reservas y pagos integrados",
      "Promociones y entradas con proveedores especializados",
      "Medición de consultas, reservas y ventas",
    ],
    disclaimer:
      "Planteo estas soluciones después de estudiar cada negocio. No son productos cerrados ni funciones garantizadas.",
  },
  cta: { label: "Revisar mi web", type: "reparacion" },
};
