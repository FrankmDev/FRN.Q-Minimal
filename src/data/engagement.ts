/**
 * Single source of truth for engagement, pricing philosophy and FAQ.
 *
 * PRICING RULES
 * - No fixed public price list. Prices are scope-specific and agreed after
 *   discovery.
 * - No guaranteed ROI, no invented metrics, no outcome promises.
  * - Form budget options live in contact-contract.ts, not a quote.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const faqItems: FaqItem[] = [
  {
    q: "¿Cómo se presupuesta un proyecto?",
    a: "Aclaro contigo el objetivo, el alcance y las integraciones. Después recibes una propuesta por escrito con entregables, calendario y coste.",
  },
  {
    q: "¿Shopify o desarrollo a medida?",
    a: "Depende del catálogo, el flujo de venta y las integraciones. Valoro esas necesidades para elegir la base adecuada para el proyecto.",
  },
  {
    q: "¿Hay que rehacer lo que ya tengo?",
    a: "No necesariamente. Reviso contigo la web y los sistemas actuales para decidir qué conservar, ajustar o sustituir.",
  },
  {
    q: "¿Cuánto tarda un proyecto?",
    a: "El calendario depende del alcance, los contenidos y las integraciones. Lo concretamos en la propuesta, con hitos y dependencias.",
  },
  {
    q: "¿Qué pasa después del lanzamiento?",
    a: "Entrego documentación y accesos. Si lo necesitas, puedo seguir con mejoras y mantenimiento.",
  },
  {
    q: "¿Trabajas fuera de Granada?",
    a: "Sí. Trabajo en remoto con empresas de España y de otros países.",
  },
];
