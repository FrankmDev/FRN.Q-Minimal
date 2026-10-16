/**
 * Single source of truth for the commercial service areas.
 *
 * Order is intentional: it drives the Home Services composition, where the
 * first entry becomes the priority feature plate.
 *   1. WEB, SEO & GROWTH — shown publicly as "Web corporativa & SEO"
 *   2. ECOMMERCE & SHOPIFY
 *   3. PORTALES & SISTEMAS B2B
 *   4. SISTEMAS & INTEGRACIONES
 *
 * Each area is sold as a solution to a business problem, not as a list of
 * technologies. `problem` states the recognisable situation; `short` states
 * the outcome. `problems` and `includes` feed the matching solution page.
 * Cross-cutting capabilities (UI/UX, frontend, integrations, SEO, analytics,
 * CRO, accessibility, performance) support these areas and are never presented
 * as separate top-level services.
 */

export interface ServiceArea {
  num: string;
  id: string;
  /** Card title used by the Services section. */
  title: string;
  /** Recognisable business problem, stated in one line. */
  problem: string;
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
    id: "growth",
    title: "Web corporativa & SEO",
    problem:
      "Tu web no explica lo que haces, no genera consultas o se ha quedado atrás.",
    short:
      "Web nueva, reparada o mejorada: presencia, posicionamiento y medición.",
    audience: "Empresas que necesitan web",
    linkLabel: "Cuéntame tu web",
    problems: [
      "Web que no comunica lo que haces ni genera consultas",
      "Una web antigua, lenta o rota que conviene recuperar antes de rehacerla",
      "No aparecer en búsquedas locales o sectoriales",
      "Tomar decisiones sin datos fiables de tráfico y conversión",
    ],
    includes: [
      "Diseño y desarrollo web, frontend y accesibilidad",
      "Reparación, recuperación y ampliación de webs existentes",
      "WordPress, Elementor y WooCommerce: diagnóstico, ajustes y mejoras",
      "SEO técnico y local, Search Console y Perfil de Empresa en Google",
      "Analítica, eventos y medición de conversión",
      "CRO, rendimiento y mejora continua",
      "Apoyo de IA en contenido y mantenimiento, con revisión manual",
    ],
  },
  {
    num: "02",
    id: "ecommerce",
    title: "Ecommerce & Shopify",
    problem:
      "Vendes online, pero catálogo, stock y pedidos no cuadran.",
    short:
      "Construyo la tienda y conecto catálogo, pago y pedidos.",
    audience: "Marcas que venden online",
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
    num: "03",
    id: "b2b",
    title: "Portales & Sistemas B2B",
    problem:
      "Los pedidos B2B llegan por teléfono, email y hojas de cálculo.",
    short:
      "Monto el portal: cada cuenta ve sus precios y hace pedidos.",
    audience: "Fabricantes y distribuidores",
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
    num: "04",
    id: "sistemas",
    title: "Sistemas & Integraciones",
    problem:
      "Tus datos viven en herramientas que no se hablan.",
    short:
      "Conecto esas herramientas y automatizo tareas repetitivas.",
    audience: "Equipos con datos dispersos",
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
];

/**
 * Section header copy for the Services block.
 *
 * Both title lines are kept to a similar length so the `title-mark` slab sits
 * on a line comparable to the first one; an oversized second line squeezes the
 * lead paragraph beside it.
 */
export const servicesCopy = {
  label: "Servicios",
  titleLine: "La web, primero.",
  titleHighlight: "Y lo conectado.",
  lead:
    "Web y mejora de la que ya existe, tienda online, portal B2B y sistemas conectados. Cuatro áreas para captar clientes y ordenar la operación.",
} as const;
