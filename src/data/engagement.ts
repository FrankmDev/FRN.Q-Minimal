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
    q: "¿Cómo se define el precio de un proyecto?",
    a: "Cada proyecto se presupuesta según alcance, complejidad e integraciones. Tras una primera conversación recibes una horquilla orientativa y, una vez definido el alcance, un presupuesto cerrado por escrito. No publico tarifas fijas porque dos tiendas o dos portales nunca cuestan lo mismo.",
  },
  {
    q: "¿Shopify o desarrollo a medida?",
    a: "Depende del problema. Para venta directa y puesta en marcha rápida, Shopify suele ser la base adecuada. Para portales B2B, precios privados o flujos complejos, desarrollo a medida o una combinación de ambos. Elijo la herramienta por el negocio, no por moda.",
  },
  {
    q: "¿Y si ya tengo una web o un sistema?",
    a: "Se puede partir de lo que tienes. Audito, mido y decidimos qué conservar, qué migrar y qué reconstruir. No siempre hace falta empezar de cero.",
  },
  {
    q: "¿Cuánto tarda un proyecto?",
    a: "Depende del alcance. Una web o una tienda sencilla puede estar lista en semanas; un portal B2B o un sistema con integraciones requiere más. Recibes un calendario realista por fases, con hitos claros.",
  },
  {
    q: "¿Qué pasa después del lanzamiento?",
    a: "Entrego documentación y accesos. Puedes mantenerlo con tu equipo o seguir contando conmigo para mejoras, sin permanencia obligatoria.",
  },
  {
    q: "¿Cómo se mide el resultado?",
    a: "Definimos de antemano qué vamos a medir: visibilidad, conversión, tiempos de proceso, tareas manuales eliminadas. La analítica se instala desde el inicio para decidir con datos y no con impresiones.",
  },
  {
    q: "¿Trabajas fuera de España?",
    a: "Sí. Trabajo en remoto con clientes en España y en el extranjero, con reuniones y seguimiento por videollamada.",
  },
];
