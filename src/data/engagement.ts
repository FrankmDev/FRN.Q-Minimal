/**
 * Single source of truth for engagement, pricing philosophy and FAQ.
 *
 * PRICING RULES
 * - No fixed public price list. Prices are scope-specific and agreed after
 *   discovery.
 * - No guaranteed ROI, no invented metrics, no outcome promises.
  * - Form budget options live in contact-contract.ts, not a quote.
 */

import { formatPrice, getPublicAmount } from "./pricing";

export interface FaqItem {
  q: string;
  a: string;
}

// The CARE figure is read from pricing.ts so the FAQ can never drift from
// /precios/ and /soporte/ (same pattern as support.ts).
const careAmount = getPublicAmount("care");

export const faqItems: FaqItem[] = [
  {
    q: "¿Cuánto cuesta un proyecto?",
    a: "El importe se cierra en una propuesta por escrito, con entregables, calendario y coste. Webs, tiendas y mantenimiento tienen precio de partida publicado en la página de Precios; los portales B2B, los sistemas y el ecommerce a medida se presupuestan tras el discovery.",
  },
  {
    q: "¿Cuánto tarda un proyecto?",
    a: "El calendario depende del alcance, los contenidos y las integraciones. Lo concretamos en la propuesta, con hitos y dependencias.",
  },
  {
    q: "¿Qué pasa después del lanzamiento?",
    a: "Entrego documentación y accesos. Si lo necesitas, puedo seguir con mejoras y mantenimiento. En los proyectos que lo incluyen, tienes acceso a FRN.Q Portal, un espacio privado para consultar la información y los materiales del proyecto.",
  },
  {
    q: "¿Puedo contratar solo el mantenimiento?",
    a: careAmount && careAmount.billing === "monthly"
      ? `Sí. El plan CARE parte de ${formatPrice(careAmount.minimum)}/mes para contenido, ajustes y pequeñas mejoras, sin permanencia obligatoria. También puedo hacerme cargo de webs hechas por terceros si son mantenibles; antes reviso su estado y sus accesos.`
      : "Sí. El alcance del mantenimiento se acuerda por escrito según lo que tu proyecto necesite.",
  },
  {
    q: "¿Puedes arreglar mi web actual?",
    a: "Sí. Empiezo por el Diagnóstico Web 360: reviso la web en marcha y te entrego un informe con hallazgos y prioridades. Su importe se descuenta de una reparación elegible contratada en los 30 días siguientes; las reparaciones mayores se presupuestan tras el diagnóstico. Trabajo con WordPress, Elementor, WooCommerce y otras plataformas.",
  },
];
