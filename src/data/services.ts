/**
 * Single source of truth for the commercial service hierarchy.
 *
 * Order is intentional and reflects priority:
 *   1. ECOMMERCE & SHOPIFY
 *   2. PORTALES & SISTEMAS B2B
 *   3. SISTEMAS & AUTOMATIZACIÓN
 *   4. WEB, SEO & GROWTH
 *
 * Each area is sold as a solution to a business problem, not as a list of
 * technologies. Cross-cutting capabilities (UI/UX, frontend, integrations,
 * SEO, analytics, CRO, accessibility, performance) support these areas and
 * are never presented as separate top-level services.
 */

export interface ServiceArea {
  num: string;
  id: string;
  /** Card title used by the Services section. */
  title: string;
  /** Card description used by the Services section. */
  short: string;
  /** Real business problems this area addresses. */
  problems: string[];
  /** What the engagement can cover. Not a promise on every project. */
  includes: string[];
}

export const serviceAreas: ServiceArea[] = [
  {
    num: "01",
    id: "ecommerce",
    title: "Ecommerce & Shopify",
    short:
      "Tiendas que venden: catálogo, producto, checkout y operación conectados.",
    problems: [
      "Vender online sin que el catálogo, el stock y los pedidos se descuadren",
      "Depender de una tienda lenta o difícil de gestionar",
      "No saber qué producto, canal o campaña funciona de verdad",
    ],
    includes: [
      "Diseño y desarrollo de tienda sobre Shopify o a medida",
      "Catálogo, variantes, precios y gestión de producto",
      "Checkout, pagos, envíos y fiscalidad",
      "Analítica y medición de conversión",
    ],
  },
  {
    num: "02",
    id: "b2b",
    title: "Portales & Sistemas B2B",
    short:
      "Clientes profesionales, precios privados, pedidos y procesos bajo control.",
    problems: [
      "Atender pedidos de clientes profesionales por email, teléfono o WhatsApp",
      "Gestionar precios privados y condiciones por cliente en hojas de cálculo",
      "Dar acceso a catálogos y documentos sin exponer información interna",
    ],
    includes: [
      "Áreas privadas con acceso por cliente, roles y permisos",
      "Catálogos y tarifas por cliente profesional",
      "Flujos de pedido, aprobación y reposición",
      "Portal de cliente, documentación y seguimiento",
    ],
  },
  {
    num: "03",
    id: "sistemas",
    title: "Sistemas & Automatización",
    short:
      "Workflows, integraciones y datos que dejan de trabajarse a mano.",
    problems: [
      "Datos de venta, stock, facturación o CRM repartidos en sistemas que no se hablan",
      "Tareas repetitivas que consumen horas y generan errores",
      "Procesos internos que solo funcionan si los hace una persona concreta",
    ],
    includes: [
      "Integraciones entre herramientas y servicios que ya usas",
      "Automatización de tareas y flujos internos",
      "Paneles e interfaces de operación a medida",
      "Consolidación y medición de datos",
    ],
  },
  {
    num: "04",
    id: "growth",
    title: "Web, SEO & Growth",
    short:
      "Web, visibilidad técnica y local, analítica y conversión para crecer con criterio.",
    problems: [
      "Web que no comunica lo que haces ni genera consultas",
      "No aparecer en búsquedas locales o sectoriales",
      "Tomar decisiones sin datos fiables de tráfico y conversión",
    ],
    includes: [
      "Diseño y desarrollo web, frontend y accesibilidad",
      "SEO técnico y local, arquitectura y contenidos",
      "Analítica, eventos y medición de conversión",
      "CRO, rendimiento y mejora continua",
    ],
  },
];

/** Section header copy for the Services block. */
export const servicesCopy = {
  label: "Qué hago",
  titleLine: "Cuatro áreas.",
  titleHighlight: "Un mismo negocio.",
} as const;
