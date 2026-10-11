/**
 * Single source of truth for the commercial service hierarchy.
 *
 * Order is intentional and reflects priority:
 *   1. ECOMMERCE & SHOPIFY
 *   2. PORTALES & SISTEMAS B2B
 *   3. SISTEMAS & INTEGRACIONES
 *   4. WEB, SEO & GROWTH — presented to visitors as "Web corporativa & SEO"
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
  /** One-line outcome used by the Services card. */
  short: string;
  /** Type of business this area is for, shown as the card kicker. */
  audience: string;
  /** Link label used by the card to reach the matching page. */
  linkLabel: string;
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
      "Tienda online con catálogo, pago y pedidos conectados a tu operación.",
    audience: "Marcas y empresas que venden producto online",
    linkLabel: "Ver tienda online",
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
      "Tus clientes profesionales consultan sus precios y hacen pedidos online.",
    audience: "Fabricantes, distribuidores y mayoristas",
    linkLabel: "Ver portal B2B",
    problems: [
      "Dar de alta y validar empresas antes de mostrarles catálogo y precios",
      "Gestionar referencias, tarifas restringidas, roles y condiciones por cuenta",
      "Recibir pedidos y solicitudes de presupuesto entre email, teléfono y hojas de cálculo",
      "Coordinar al comprador y al equipo comercial sin un recorrido claro de seguimiento",
    ],
    includes: [
      "Registro y validación de empresas; usuarios, roles y permisos según el alcance",
      "Catálogo privado, referencias y precios o tarifas restringidas por cuenta",
      "Solicitudes de presupuesto, pedidos, reposición y seguimiento comercial",
      "CRM, ERP u otras conexiones solo cuando sean necesarias y viables",
    ],
  },
  {
    num: "03",
    id: "sistemas",
    title: "Sistemas & Integraciones",
    short:
      "Conecto tus herramientas y automatizo tareas que hoy se hacen a mano.",
    audience: "Equipos con datos repartidos y tareas manuales",
    linkLabel: "Ver integraciones",
    problems: [
      "Datos de venta, stock, facturación o CRM repartidos en sistemas que no se hablan",
      "Tareas repetitivas que consumen horas y generan errores",
      "Pedidos y solicitudes que se copian a mano entre email, teléfono y hojas de cálculo",
      "Sin una vista clara de qué se ha hecho, qué falta y en qué estado está cada pedido",
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
    title: "Web corporativa & SEO",
    short:
      "Web profesional o corporativa, con posicionamiento y medición.",
    audience: "Empresas y profesionales que necesitan presencia web",
    linkLabel: "Cuéntame tu web",
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
  titleLine: "Tiendas, portales",
  titleHighlight: "y sistemas.",
  lead:
    "Tiendas online, portales de pedidos, sistemas a medida y webs profesionales para empresas. Trabajo la venta y la operación, y también la web que presenta tu negocio y genera consultas.",
} as const;
