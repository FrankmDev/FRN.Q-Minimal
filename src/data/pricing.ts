/**
 * Single source of truth for the public price reference (/precios/) and for
 * every amount shown elsewhere on the site (Web Rescue on the Home, the
 * corporate-web FAQ).
 *
 * PRICING RULES
 * - Only scope-specific starting points and the productized Web Rescue entry
 *   offers are public. They orient a defined scope; they are never a universal
 *   quote or a fixed project total.
 * - B2B portals, product systems, integrations and custom ecommerce are
 *   discovery-led: no public figure is published.
 * - Every amount lives here once. Pages read it from this module, so a visible
 *   price can never drift from its structured data.
 * - No invented metrics, guarantees or outcome promises.
 */

export type PricingId =
  | "start"
  | "studio"
  | "presence"
  | "business"
  | "shopify"
  | "care";

export type PricingBilling = "project" | "monthly";

/** How a public offer is expressed. */
export type PricingMode =
  /** Published starting point for a defined scope ("desde"). */
  | "from"
  /** Fixed, scoped entry offer with a single published price. */
  | "fixed"
  /** Discovery-led work: quoted after discovery, no public figure. */
  | "scoped";

export interface PublicAmount {
  id: PricingId;
  /** Published starting amount in EUR. */
  minimum: number;
  billing: PricingBilling;
}

/**
 * Published starting points (EUR). Scope-specific entry prices, not fixed
 * project totals. Contrasted against the FRN.Q commercial base (V3.1).
 */
export const publicAmounts: readonly PublicAmount[] = [
  { id: "start", minimum: 690, billing: "project" },
  { id: "studio", minimum: 990, billing: "project" },
  { id: "presence", minimum: 1390, billing: "project" },
  { id: "business", minimum: 1990, billing: "project" },
  { id: "shopify", minimum: 3190, billing: "project" },
  { id: "care", minimum: 49, billing: "monthly" },
];

export const getPublicAmount = (id: PricingId): PublicAmount | undefined =>
  publicAmounts.find((amount) => amount.id === id);

/** Spanish price label used everywhere a public amount is shown. */
export const formatPrice = (amount: number): string =>
  `${new Intl.NumberFormat("es-ES", { useGrouping: true, maximumFractionDigits: 0 }).format(amount)} €`;

export interface PricingModeInfo {
  mode: PricingMode;
  num: string;
  label: string;
  description: string;
}

/** The three ways a price is expressed. Also the visual key on /precios/. */
export const pricingModes: readonly PricingModeInfo[] = [
  {
    mode: "from",
    num: "01",
    label: "Precio de partida",
    description:
      "El punto de entrada publicado para un alcance definido. Marca dónde empieza un proyecto de ese tipo; el alcance final se cierra en la propuesta.",
  },
  {
    mode: "fixed",
    num: "02",
    label: "Alcance definido",
    description:
      "Un entregable concreto con un precio cerrado, como el Diagnóstico Web 360. No cambia mientras el alcance no cambie; la reparación de landing se publica desde un importe, no a precio fijo.",
  },
  {
    mode: "scoped",
    num: "03",
    label: "Presupuesto personalizado",
    description:
      "Portales B2B, sistemas, integraciones y ecommerce a medida. Se presupuestan tras el discovery, según procesos, datos y sistemas implicados.",
  },
];

export const pricingModeLabel = (mode: PricingMode): string =>
  pricingModes.find((entry) => entry.mode === mode)?.label ?? mode;

export interface PublicOffer {
  /** Links to a published amount in `publicAmounts`, when one exists. */
  id?: PricingId;
  name: string;
  mode: PricingMode;
  /** Situation the offer fits. */
  fit: string;
  /** What the published price, or the shape of the quote, covers. */
  scope: string;
  /** Published amount for offers outside `publicAmounts` (Web Rescue). */
  amount?: number;
}

/**
 * Productized Web Rescue entry offers. Amounts and copy live here so the Home
 * block and the price reference cannot disagree.
 */
export const rescueOffers = [
  {
    name: "Diagnóstico Web 360",
    mode: "fixed",
    amount: 99,
    fit: "Revisar una web en marcha antes de decidir qué reparar, ampliar o dejar como está.",
    scope:
      "Informe inicial y acotado. Se descuenta de una reparación elegible contratada en los 30 días siguientes.",
  },
  {
    name: "Reparación de landing",
    mode: "from",
    amount: 299,
    fit: "Corregir y mejorar una página concreta sin rehacer el sitio completo.",
    scope: "Correcciones y mejoras sobre una página concreta.",
  },
  {
    name: "Webs mayores",
    mode: "scoped",
    fit: "Incidencias o cambios que afectan a varias partes de la web.",
    scope: "Según incidencias y complejidad, tras el diagnóstico.",
  },
] as const satisfies readonly PublicOffer[];

export interface PricingGroup {
  id: string;
  /** Commercial area or scope the group belongs to. */
  label: string;
  /** One line framing the group. */
  summary: string;
  /** Solution route that deepens the group, when one exists. */
  href?: string;
  hrefLabel?: string;
  offers: readonly PublicOffer[];
}

/**
 * Public offers grouped by solution and scope, in commercial priority order
 * (Ecommerce → B2B → Systems → Web), followed by the cross-cutting support
 * and repair scopes.
 */
export const pricingGroups: readonly PricingGroup[] = [
  {
    id: "ecommerce",
    label: "Ecommerce & Shopify",
    summary: "Vender producto online con catálogo, checkout y pedidos conectados.",
    href: "/soluciones/ecommerce/",
    hrefLabel: "Ver la solución",
    offers: [
      {
        id: "shopify",
        name: "Shopify",
        mode: "from",
        fit: "Lanzar o renovar una tienda con catálogo, ficha de producto, checkout y pedidos conectados con tu operación.",
        scope:
          "Incluye la tienda definida en el alcance. Apps, pasarelas y suscripciones de plataforma son externas.",
      },
      {
        name: "Ecommerce a medida",
        mode: "scoped",
        fit: "Reglas de negocio, catálogo o flujos que no encajan razonablemente en una plataforma estándar.",
        scope:
          "Se presupuesta tras el discovery, valorando también el coste de construir y mantenerlo.",
      },
    ],
  },
  {
    id: "b2b",
    label: "Portales & Sistemas B2B",
    summary: "Vender a clientes profesionales con catálogo y condiciones propias.",
    href: "/soluciones/b2b/",
    hrefLabel: "Ver la solución",
    offers: [
      {
        name: "Portal B2B o catálogo privado",
        mode: "scoped",
        fit: "Dar de alta empresas y ofrecer referencias, precios por cuenta y pedidos o solicitudes a clientes profesionales.",
        scope:
          "Puede empezar por el catálogo y crecer por fases. Se presupuesta según cuentas, reglas y permisos.",
      },
    ],
  },
  {
    id: "sistemas",
    label: "Sistemas & Integraciones",
    summary: "Conectar herramientas y ordenar procesos internos.",
    href: "/soluciones/sistemas/",
    hrefLabel: "Ver la solución",
    offers: [
      {
        name: "Integraciones y sistemas",
        mode: "scoped",
        fit: "Datos repartidos entre herramientas y tareas que hoy se copian a mano.",
        scope:
          "Depende de las APIs, la calidad de los datos y los sistemas implicados. Se cierra tras revisarlos.",
      },
    ],
  },
  {
    id: "web",
    label: "Web corporativa & SEO",
    summary: "Web nueva o renovada, con base técnica, medición y contacto.",
    href: "/soluciones/desarrollo-web/",
    hrefLabel: "Ver la solución",
    offers: [
      {
        id: "start",
        name: "START",
        mode: "from",
        fit: "Una primera presencia: landing de campaña o web breve con una sola acción clara.",
        scope: "Alcance corto, pocas secciones y contenidos acotados.",
      },
      {
        id: "studio",
        name: "STUDIO",
        mode: "from",
        fit: "Web profesional para ordenar la oferta y facilitar el contacto.",
        scope: "Estructura y diseño de las páginas incluidas en el alcance.",
      },
      {
        id: "presence",
        name: "PRESENCE",
        mode: "from",
        fit: "Web corporativa completa: servicios, recorrido y contacto con más secciones y contenido.",
        scope: "Más páginas y contenidos que un proyecto de entrada.",
      },
      {
        id: "business",
        name: "BUSINESS",
        mode: "from",
        fit: "Web corporativa con más estructura o funciones específicas: áreas, catálogos o herramientas propias.",
        scope: "Alcance ampliado; el proyecto mayor se cierra en la propuesta.",
      },
    ],
  },
  {
    id: "soporte",
    label: "Mantenimiento y soporte",
    summary: "Continuidad después del lanzamiento.",
    href: "/soporte/",
    hrefLabel: "Ver soporte y límites",
    offers: [
      {
        id: "care",
        name: "CARE",
        mode: "from",
        fit: "Mantener la web o la tienda al día: contenido, ajustes y pequeñas mejoras.",
        scope: "Cuota mensual sin permanencia obligatoria; el alcance se acuerda.",
      },
    ],
  },
  {
    id: "revision",
    label: "Revisión y reparación web",
    summary: "Webs en marcha que conviene recuperar o mejorar antes de rehacerlas.",
    href: "/soluciones/revision-web/",
    hrefLabel: "Ver revisión y reparación",
    offers: rescueOffers,
  },
];

/** Resolved public amount for an offer, or undefined when it is discovery-led. */
export const lineAmount = (offer: PublicOffer): number | undefined =>
  offer.id ? getPublicAmount(offer.id)?.minimum : offer.amount;

/** Billing unit for a priced offer, or undefined when it is discovery-led. */
export const lineBilling = (offer: PublicOffer): PricingBilling | undefined =>
  offer.id ? getPublicAmount(offer.id)?.billing : offer.amount ? "project" : undefined;

export interface PricingTerm {
  title: string;
  body: string;
}

/** What is closed in writing before and during a project. */
export const pricingTerms: readonly PricingTerm[] = [
  {
    title: "Cambios de alcance",
    body: "Si el alcance cambia durante el proyecto, presupuesto la diferencia por escrito antes de ejecutarla. Nada se añade sin tu aprobación.",
  },
  {
    title: "Costes externos",
    body: "Dominio, hosting, licencias de plataforma, aplicaciones, pasarelas de pago y otros proveedores son externos al desarrollo y se contratan aparte, salvo que la propuesta indique lo contrario.",
  },
  {
    title: "Impuestos",
    body: "Los importes se muestran sin impuestos. El IVA u otros tributos aplicables se añaden según la normativa vigente y la ubicación del cliente.",
  },
  {
    title: "Mantenimiento",
    body: "El mantenimiento no es obligatorio. Entrego la solución documentada y con accesos propios; si quieres continuidad, existe una cuota mensual de soporte (Care) que se acuerda según el caso.",
  },
];

export interface PricingFaq {
  q: string;
  a: string;
}

/** Visible FAQ on /precios/. Also feeds the page's FAQPage schema. */
export const pricingFaqs: readonly PricingFaq[] = [
  {
    q: "¿Por qué hay precios públicos y también presupuestos?",
    a: "Porque no todos los proyectos se parecen. Las webs, las tiendas y el mantenimiento tienen puntos de partida publicados para un alcance definido; los portales B2B, los sistemas y el ecommerce a medida dependen de procesos, datos y sistemas que hay que revisar antes de poner una cifra.",
  },
  {
    q: "¿El precio de partida es el precio final?",
    a: "No. Es el punto de entrada para un alcance definido. El alcance concreto se cierra en la propuesta; si tu proyecto necesita más páginas, funciones o integraciones, el importe sube y lo verás por escrito antes de empezar.",
  },
  {
    q: "¿Cómo se calcula un presupuesto personalizado?",
    a: "Empiezo por entender el objetivo, el alcance y las integraciones. Después recibes una propuesta por escrito con entregables, calendario y coste, desglosada por lo que se va a hacer.",
  },
  {
    q: "¿Cuánto tarda un proyecto?",
    a: "El calendario depende del alcance, los contenidos y las integraciones. Lo concretamos en la propuesta, con hitos y dependencias claras.",
  },
  {
    q: "¿Se puede pagar por hitos?",
    a: "Sí. Los proyectos se facturan por hitos acordados en la propuesta: el número y el importe de cada hito se fijan antes de empezar.",
  },
  {
    q: "¿Qué soporte hay después del lanzamiento?",
    a: "Entrego la solución documentada y con accesos propios, para que puedas mantenerla sin depender del estudio. Si necesitas continuidad, Care cubre mejoras y ajustes con una cuota mensual y sin permanencia obligatoria. En los proyectos que lo incluyen, tienes acceso a FRN.Q Portal.",
  },
  {
    q: "¿Hay costes que no estén en el precio?",
    a: "Sí. Dominio, hosting, licencias, aplicaciones y proveedores externos se contratan aparte, y los impuestos aplicables se añaden a los importes mostrados. La propuesta indica qué es tuyo y qué es externo.",
  },
  {
    q: "¿Trabajas fuera de Granada?",
    a: "Sí. Trabajo en remoto con empresas de España y de otros países.",
  },
];

/** Page-level copy for /precios/. */
export const pricingCopy = {
  label: "Precios",
  title: "Una inversión según lo que necesitas.",
  lead:
    "Estos son los precios públicos y los puntos de partida de FRN.Q. Cada solución tiene un alcance distinto, así que no aplico una tarifa única: los proyectos grandes y los sistemas B2B se presupuestan tras entender qué hay que resolver.",
  tableTag: "Precios públicos",
  tableTitle: "Qué cuesta cada solución.",
  tableLead:
    "Importes sin impuestos ni costes externos. Un punto de partida orienta; las páginas, funciones, contenidos y el importe final se cierran por escrito en la propuesta.",
  modesTag: "Cómo se lee",
  modesTitle: "Tres formas de cerrar un precio.",
  termsTag: "Condiciones",
  termsTitle: "Qué se cierra por escrito.",
  termsLead:
    "Sin sorpresas: el alcance, los costes externos, los impuestos y la continuidad quedan claros antes de empezar.",
  faqTag: "Preguntas frecuentes",
  faqTitle: "Dudas sobre precios y pagos.",
  cta: { label: "Pedir propuesta", href: "/#contacto" },
  secondaryCta: { label: "Ver soluciones", href: "/#servicios" },
} as const;
