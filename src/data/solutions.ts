import { serviceAreas } from "./services";
import { webRescueDiagnosis } from "./web-rescue";

export type SolutionId = "ecommerce" | "b2b" | "sistemas" | "growth";

export interface SolutionFaq {
  q: string;
  a: string;
}

export interface SolutionHeading {
  tag: string;
  title: string;
}

export interface SolutionCard {
  title: string;
  description: string;
}

/** A way of arriving at the engagement: new build, migration or improvement. */
export interface SolutionScenario {
  /** Mono index shown beside the title, e.g. "01". */
  label: string;
  title: string;
  description: string;
  /** Concrete pieces included in this scenario. */
  includes: string[];
}

/** Grouped heading plus scenarios, used to differentiate a route's offer. */
export interface SolutionScenarioGroup {
  tag: string;
  title: string;
  lead?: string;
  items: SolutionScenario[];
}

/** Grouped commercial block: heading plus item cards. */
export interface SolutionBlock {
  tag: string;
  title: string;
  lead: string;
  items: SolutionCard[];
}

/** Composition specific to the corporate-web page. */
export interface WebDetails {
  /** Creación, rediseño y desarrollo a medida: how the engagement starts. */
  modes: SolutionScenarioGroup;
  /** Shapes the built site can take. */
  projectTypes: SolutionCard[];
  /** Craft and technical capabilities integrated into the build. */
  capabilities: SolutionCard[];
  /** What the client receives at the end of the engagement. */
  deliverables: string[];
  /** How the site is handed over and maintained after launch. */
  maintenance: string;
  /** Routes an existing-site problem to the Web Rescue offer. */
  repair: {
    tag: string;
    title: string;
    description: string;
    label: string;
  };
}

export interface B2BPortalLevel {
  title: string;
  description: string;
  includes: string[];
}

export interface B2BBuyerStep {
  title: string;
  description: string;
}

export interface B2BDetails {
  levels: B2BPortalLevel[];
  /** Building blocks of the portal, from registration to order. */
  pieces: SolutionCard[];
  buyerJourney: B2BBuyerStep[];
  phases: B2BBuyerStep[];
  systemsCta: string;
}

export interface SystemsDetails {
  tag: string;
  title: string;
  lead: string;
  /** How an integration or automation gets decided. */
  decisions: SolutionCard[];
  /** Honest boundary of an integration engagement. */
  note: string;
}

export interface SolutionPage {
  id: SolutionId;
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  audience: string;
  systemDescription: string;
  integrationDescription: string;
  integrationExamples: string[];
  platformOptions?: SolutionCard[];
  clientInputs?: string[];
  deliverables?: string[];
  projectLimits?: string[];
  process: { title: string; description: string }[];
  relatedSolutions: SolutionId[];
  b2bDetails?: B2BDetails;
  webDetails?: WebDetails;
  /** Ways of arriving at the work; differentiates the offer per route. */
  scenarios?: SolutionScenarioGroup;
  /** How the delivered store runs day to day. */
  operations?: SolutionBlock;
  /** Systems page: symptoms and the decisions behind an integration. */
  systemsDetails?: SystemsDetails;
  /** Contextual sentence rendered above the related evidence. */
  evidenceNote?: string;
  /** Contextual CTA labels, kept specific to each route. */
  ctas?: { hero: string; mid?: string; closing: string };
  /** In-page navigation, listing the anchors each route actually renders. */
  jump?: { href: string; label: string }[];
  /**
   * Published case categories rendered as evidence when the solution has no
   * `serviceArea` match. The projects collection stays the single source.
   */
  evidenceCategories?: string[];
  /** Optional heading overrides; defaults live in the page component. */
  headings?: Partial<Record<"integrations" | "process" | "evidence", SolutionHeading>>;
  faqs: SolutionFaq[];
}

export const solutionPages: SolutionPage[] = [
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "Tiendas online Shopify y desarrollo ecommerce | FRN.Q",
    description:
      "Creo, migro y mejoro tiendas online con Shopify o desarrollo a medida: catálogo, variantes, pagos, pedidos, SEO e integraciones.",
    h1: "Desarrollo de tiendas online y Shopify",
    intro:
      "Construyo tiendas nuevas, migro proyectos que ya no encajan en su plataforma y mejoro tiendas que venden pero arrastran fricciones: catálogo desordenado, compra confusa o una operación que no cuadra. Shopify es una buena base para muchos proyectos; cuando el flujo o las integraciones lo requieren, defino una solución más personalizada.",
    audience:
      "Marcas y empresas que venden producto online y necesitan lanzar una tienda, cambiar de plataforma o resolver fricciones concretas sin perder de vista cómo se gestionará después.",
    systemDescription:
      "El alcance parte del recorrido real de compra y de quién mantiene el catálogo, el stock y los pedidos. Puede incluir estructura de categorías, fichas de producto, variantes, checkout, pagos, envíos, SEO ecommerce y analítica.",
    integrationDescription:
      "La tienda debe encajar con la operación, no crear otra fuente de datos aislada. Definimos qué sistema manda sobre catálogo, inventario y pedidos, y qué puede conectarse de forma viable.",
    integrationExamples: [
      "Catálogo, variantes, fichas y gestión de producto",
      "Checkout, medios de pago, reglas de envío e impuestos",
      "Inventario, pedidos, ERP y herramientas de operación",
      "SEO técnico ecommerce, analítica y eventos de compra",
      "Mantenimiento y evolución acordados para la tienda",
    ],
    scenarios: {
      tag: "Cómo llegas a la tienda",
      title: "Tres puntos de partida, tres alcances",
      lead: "No es lo mismo lanzar una tienda que migrarla o reparar la que ya vende. El alcance, los riesgos y el calendario cambian según el caso.",
      items: [
        {
          label: "01",
          title: "Tienda nueva",
          description:
            "Empiezas a vender online y necesitas una base ordenada: catálogo, compra y gestión bien resueltos desde el primer día.",
          includes: ["Estructura de tienda y catálogo", "Checkout, pagos y envíos", "SEO técnico y medición"],
        },
        {
          label: "02",
          title: "Migración de plataforma",
          description:
            "La tienda actual se ha quedado corta y hay que trasladar catálogo, pedidos y URLs sin perder lo construido ni el posicionamiento.",
          includes: ["Plan de datos y URLs", "Redirecciones y continuidad", "Revisión antes de publicar"],
        },
        {
          label: "03",
          title: "Optimización o mejora",
          description:
            "La tienda vende, pero hay fricciones concretas de catálogo, compra, rendimiento o gestión que conviene resolver por fases.",
          includes: ["Fricciones priorizadas", "Cambios por fases", "Conversión y operación"],
        },
      ],
    },
    operations: {
      tag: "La tienda por dentro",
      title: "Catálogo, pago, pedidos y medición",
      lead: "Una tienda funciona cuando producto, compra y gestión encajan. Estas son las piezas que se definen, implementan y prueban según el alcance.",
      items: [
        {
          title: "Catálogo y variantes",
          description:
            "Categorías, atributos, colores, tallas, precios e imágenes con criterios claros para gestionarlos después.",
        },
        {
          title: "Pagos, envíos e impuestos",
          description:
            "Medios de pago, reglas de envío, mercados e impuestos alineados con cómo vendes y a quién.",
        },
        {
          title: "Pedidos y stock",
          description:
            "Qué sistema manda sobre inventario y pedidos, qué se sincroniza y cómo se tratan los errores.",
        },
        {
          title: "SEO ecommerce y medición",
          description:
            "Estructura, datos de producto y eventos de compra para entender qué ocurre realmente en la tienda.",
        },
      ],
    },
    platformOptions: [
      {
        title: "Shopify estándar",
        description:
          "Adecuado cuando el catálogo y la compra encajan con sus funciones y aplicaciones disponibles. Menos complejidad propia y una gestión cotidiana más directa.",
      },
      {
        title: "Shopify personalizado o integración",
        description:
          "Para requisitos de interfaz, datos o conexiones que necesitan trabajo específico, tras comprobar APIs, límites de plataforma y sistemas implicados.",
      },
      {
        title: "Desarrollo a medida",
        description:
          "Se valora cuando reglas de negocio o flujos esenciales no encajan razonablemente en una plataforma estándar. Implica definir también más alcance de operación y mantenimiento.",
      },
    ],
    clientInputs: [
      "Catálogo de muestra: productos, variantes, atributos, precios e imágenes.",
      "Reglas comerciales: mercados, impuestos, promociones, pagos y envíos.",
      "Herramientas actuales y documentación de ERP, stock, logística o marketing.",
      "Accesos, marca y contenidos necesarios; una persona que valide decisiones y pruebas.",
    ],
    deliverables: [
      "Alcance acordado, estructura de tienda y configuración o desarrollo incluidos.",
      "Flujos de producto y compra probados según los escenarios definidos.",
      "Conexiones expresamente incluidas, accesos y documentación de entrega.",
    ],
    projectLimits: [
      "Migración masiva, limpieza de datos, carga de catálogo y licencias se delimitan antes; no se presuponen.",
      "Costes de Shopify, aplicaciones y proveedores de pago o logística son externos al desarrollo.",
      "SEO no garantiza posiciones ni ventas; soporte posterior y nuevas funciones se acuerdan aparte.",
    ],
    process: [
      {
        title: "Entender la tienda y sus datos",
        description:
          "Revisamos catálogo, compra, sistemas actuales, objetivos y fricciones; en migraciones, también qué datos y URLs deben conservarse.",
      },
      {
        title: "Elegir la base adecuada",
        description:
          "Comparamos Shopify estándar, personalización e integración, o desarrollo a medida según el flujo real y sus límites.",
      },
      {
        title: "Construir y conectar",
        description:
          "Implemento las plantillas y funciones acordadas, preparo los datos incluidos y conecto los sistemas viables dentro del alcance.",
      },
      {
        title: "Probar y entregar",
        description:
          "Probamos compra, pagos, envíos y eventos definidos; publico y entrego accesos y documentación acordados.",
      },
    ],
    relatedSolutions: ["b2b", "sistemas"],
    evidenceNote:
      "KingBelt reúne catálogo, fichas con variantes y contenido de marca sobre una arquitectura Shopify. Es una referencia pública: no se le atribuyen ventas ni resultados comerciales.",
    ctas: {
      hero: "Hablemos de tu tienda",
      mid: "Cuéntame cómo vendes hoy",
      closing: "Hablemos de tu tienda online",
    },
    jump: [
      { href: "#escenarios", label: "Puntos de partida" },
      { href: "#plataforma", label: "Plataforma" },
      { href: "#operacion", label: "Operación" },
      { href: "#faq-title", label: "Preguntas frecuentes" },
    ],
    headings: {
      integrations: { tag: "Compra y operación", title: "La tienda conectada con tu operación" },
      process: { tag: "Cómo trabajo", title: "De la tienda actual a la que necesitas" },
      evidence: { tag: "Evidencia publicada", title: "Casos de ecommerce" },
    },
    faqs: [
      {
        q: "¿Shopify o desarrollo a medida?",
        a: "Primero compruebo si catálogo, reglas de venta, checkout y conexiones encajan con Shopify estándar. Personalizo o planteo desarrollo a medida solo si una necesidad concreta lo justifica; el coste de construir y mantenerlo también forma parte de la decisión.",
      },
      {
        q: "¿Puedes crear, migrar o mejorar una tienda que ya existe?",
        a: "Sí. Revisamos la plataforma actual, catálogo, ventas y dependencias. Antes de migrar se define qué se traslada, cómo se tratan URLs y datos, y qué queda fuera del alcance.",
      },
      {
        q: "¿Qué se prueba antes de publicar la tienda?",
        a: "Los escenarios acordados: alta y edición de producto, variantes, carrito, medios de pago, reglas de envío, impuestos y los eventos de medición incluidos. Lo que no forma parte del alcance no se prueba ni se entrega.",
      },
      {
        q: "¿Se puede conectar la tienda con el stock o el ERP?",
        a: "Depende del sistema, sus interfaces y la calidad de los datos. Acordamos qué herramienta es la fuente de cada dato, qué sincronizar, con qué frecuencia y cómo tratar errores.",
      },
      {
        q: "¿Qué necesitas para empezar?",
        a: "Una muestra de catálogo, cómo vendes y envías hoy, las herramientas que usas y tus prioridades. No hace falta tener todo resuelto: identificamos juntos lo que falta para cerrar el alcance.",
      },
      {
        q: "¿Incluyes SEO, analítica y mantenimiento?",
        a: "Puedo incluir estructura técnica y datos de producto, redirecciones en una migración, medición de eventos y una propuesta de mantenimiento. Se concreta qué se implementa; el posicionamiento, las ventas y el soporte continuo no se dan por garantizados.",
      },
    ],
  },
  {
    id: "b2b",
    slug: "b2b",
    title: "Portal B2B y catálogo mayorista para distribuidores | FRN.Q",
    description:
      "Portal B2B y catálogo mayorista para fabricantes y distribuidores: registro de empresas, precios privados, referencias y pedidos online.",
    h1: "Portal B2B para vender a clientes profesionales",
    intro:
      "Digitalizo el proceso comercial de fabricantes, distribuidores y mayoristas: desde el alta y validación de empresas hasta la consulta de referencias, las solicitudes de presupuesto y los pedidos. Un catálogo privado sencillo y un portal comercial completo comparten piezas, no el mismo alcance.",
    audience:
      "Empresas que venden a otras empresas y necesitan ordenar catálogo, condiciones comerciales y pedidos sin obligar a todos sus clientes a comprar de la misma manera.",
    systemDescription:
      "El ecommerce B2B puede empezar con un catálogo mayorista privado y pedidos sencillos, o convertirse en un portal comercial con cuentas, reglas y recorridos distintos. Se implementa solo lo que el proceso necesita.",
    integrationDescription:
      "La prioridad de esta página es el canal de venta y el recorrido del comprador. Conectar CRM, ERP o automatizar procesos internos es opcional: se plantea si resuelve una necesidad concreta y las herramientas permiten hacerlo.",
    integrationExamples: [
      "Datos de clientes, referencias y pedidos que deban compartirse",
      "CRM para registrar solicitudes o dar contexto al equipo comercial",
      "ERP para catálogo, precios, disponibilidad o pedidos, si es necesario",
      "Sin integración cuando una gestión sencilla es suficiente",
    ],
    process: [
      {
        title: "Entender la venta profesional",
        description:
          "Reviso cómo se dan de alta las empresas, quién valida, qué referencias consulta cada cuenta y cómo se acuerdan sus condiciones.",
      },
      {
        title: "Diseñar el recorrido y el alcance",
        description:
          "Definimos si el cliente compra, pide presupuesto o contacta con un comercial, además de los datos y permisos necesarios.",
      },
      {
        title: "Implantar por fases",
        description:
          "Priorizamos una primera versión útil y dejamos las funciones avanzadas o conexiones para cuando aporten valor.",
      },
      {
        title: "Validar con el equipo",
        description:
          "Probamos acceso, catálogo y pedidos con los perfiles que intervienen antes de publicar y entregar el portal.",
      },
    ],
    relatedSolutions: ["ecommerce", "sistemas"],
    b2bDetails: {
      levels: [
        {
          title: "Catálogo mayorista sencillo",
          description:
            "Para publicar referencias a clientes profesionales con acceso controlado y recibir pedidos sin construir un sistema comercial complejo.",
          includes: [
            "Catálogo privado o visible tras registro",
            "Formulario de alta de empresa y revisión manual",
            "Consulta de referencias y solicitud de pedido o presupuesto",
          ],
        },
        {
          title: "Portal comercial avanzado",
          description:
            "Para operaciones con varias cuentas, condiciones y personas implicadas en la compra o atención comercial.",
          includes: [
            "Empresas validadas, usuarios, roles y permisos",
            "Precios restringidos, tarifas o catálogo por cuenta",
            "Pedidos, reposiciones, presupuestos y seguimiento según el proceso",
            "Acceso del equipo comercial y conexiones externas cuando hagan falta",
          ],
        },
      ],
      pieces: [
        {
          title: "Registro y validación",
          description:
            "La empresa solicita acceso, aporta sus datos y el negocio aprueba la cuenta —manual o con reglas— antes de ver condiciones.",
        },
        {
          title: "Catálogo privado",
          description:
            "Referencias, variantes y documentación visibles solo para las cuentas autorizadas, con la organización que usa la empresa.",
        },
        {
          title: "Precios restringidos",
          description:
            "Tarifas y catálogos por cuenta, usuario o rol: cada cliente ve sus condiciones y no las del resto.",
        },
        {
          title: "Pedidos y presupuestos",
          description:
            "El comprador prepara una cesta, envía un pedido o solicita presupuesto, y el equipo comercial lo tramita según sus reglas.",
        },
      ],
      buyerJourney: [
        { title: "Registro", description: "La empresa solicita acceso y aporta los datos necesarios para identificarla." },
        { title: "Validación", description: "El negocio revisa la solicitud y habilita la cuenta cuando corresponde; puede ser manual." },
        { title: "Consulta", description: "El comprador autorizado encuentra sus referencias, condiciones y documentación disponible." },
        { title: "Pedido o presupuesto", description: "Envía un pedido directo o una solicitud para revisar cantidades, precio o disponibilidad." },
        { title: "Atención y seguimiento", description: "El equipo comercial interviene en las decisiones que lo requieren y el cliente conoce el estado acordado." },
      ],
      phases: [
        { title: "1. Acceso y catálogo", description: "Publicar referencias y gestionar altas y validación de empresas." },
        { title: "2. Transacción", description: "Añadir precios restringidos, carrito, pedidos, presupuestos o reposición según prioridad." },
        { title: "3. Conexiones", description: "Valorar CRM, ERP u otras integraciones solo si evitan duplicar trabajo o son necesarias para operar." },
      ],
      systemsCta: "Si el reto principal está en conectar herramientas o coordinar procesos internos, consulta Sistemas e Integraciones.",
    },
    evidenceNote:
      "Emilio Faraoni reúne catálogo mayorista, alta y validación de empresas, precios privados protegidos y solicitudes de pedido. Es una referencia pública, sin resultados comerciales atribuidos.",
    ctas: {
      hero: "Revisemos tu proceso comercial",
      mid: "Cuéntame cómo compran tus clientes",
      closing: "Hablemos de tu catálogo o portal B2B",
    },
    jump: [
      { href: "#niveles", label: "Nivel de portal" },
      { href: "#piezas", label: "Piezas del portal" },
      { href: "#recorrido", label: "Recorrido del comprador" },
      { href: "#faq-title", label: "Preguntas frecuentes" },
    ],
    headings: {
      integrations: { tag: "Conexiones opcionales", title: "CRM y ERP solo si aportan" },
      process: { tag: "Cómo trabajo", title: "Del proceso comercial al portal" },
      evidence: { tag: "Evidencia publicada", title: "Caso de portal B2B" },
    },
    faqs: [
      {
        q: "¿Todos los clientes tienen que comprar online?",
        a: "No. El portal puede limitarse a mostrar catálogo y recoger solicitudes de pedido o presupuesto. La compra online se añade cuando encaja con el proceso comercial.",
      },
      {
        q: "¿Necesito un ERP para tener un catálogo B2B?",
        a: "No. Un catálogo privado con alta revisada y gestión sencilla de solicitudes puede funcionar sin integración ERP. Se evalúa una conexión solo si es necesaria y viable.",
      },
      {
        q: "¿Cómo se da de alta un cliente profesional?",
        a: "La empresa envía una solicitud con sus datos de actividad y el negocio la revisa antes de habilitar el acceso. Esa validación puede ser manual o seguir reglas acordadas; decide quién ve el catálogo y las tarifas.",
      },
      {
        q: "¿Se pueden restringir precios y referencias?",
        a: "El alcance puede controlar el acceso por empresa, usuario o rol y limitar qué catálogo o tarifas ve cada cuenta, según las reglas comerciales que definamos.",
      },
      {
        q: "¿Cómo se integra con el CRM o ERP?",
        a: "La integración es opcional y depende de qué datos deban circular y de las interfaces disponibles. Si la necesidad principal es conectar procesos y sistemas, esa parte se aborda desde Sistemas e Integraciones.",
      },
    ],
  },
  {
    id: "sistemas",
    slug: "sistemas",
    title: "Integraciones ERP, CRM y sistemas de empresa | FRN.Q",
    description:
      "Integro herramientas y datos para ordenar pedidos, stock y procesos internos. El alcance depende de los sistemas y sus interfaces.",
    h1: "Conecta los sistemas y datos de tu empresa",
    intro:
      "Diseño integraciones, automatizaciones y herramientas internas cuando la información no circula bien entre sistemas o una tarea depende de pasos manuales repetitivos. El trabajo empieza por entender qué se hace a mano hoy, no por decidir una herramienta.",
    audience:
      "Equipos que gestionan pedidos, stock, facturación, clientes o reporting en varias herramientas y necesitan entender cómo hacerlas trabajar juntas.",
    systemDescription:
      "El trabajo puede abarcar conexiones entre software existente, automatización de pasos concretos, paneles de operación o una herramienta interna. Se prioriza el flujo que resuelve un problema real, no automatizar por automatizar.",
    integrationDescription:
      "Una integración empieza por identificar la fuente de cada dato, cuándo debe actualizarse y qué ocurre si falla. La viabilidad depende de las APIs, permisos, formatos y límites de los sistemas implicados.",
    integrationExamples: [
      "ERP, CRM, ecommerce y herramientas internas",
      "Datos de pedidos, inventario, clientes y facturación",
      "Workflows con validación y tratamiento de errores",
      "Paneles e interfaces para tareas de operación",
    ],
    systemsDetails: {
      tag: "Cómo se decide",
      title: "Qué conectar y qué automatizar",
      lead: "Antes de proponer una conexión se aclara dónde está el trabajo manual y qué dato debería circular solo. La decisión sale del proceso, no del catálogo de herramientas.",
      decisions: [
        {
          title: "Fuente de verdad",
          description:
            "Se decide qué herramienta manda sobre cada dato —cliente, artículo, pedido— para dejar de mantener versiones distintas en paralelo.",
        },
        {
          title: "Viabilidad real",
          description:
            "Antes de prometer una conexión se revisan APIs, permisos, formatos y límites de los sistemas implicados: qué permite cada uno y qué no.",
        },
        {
          title: "Automatización medida",
          description:
            "Se automatiza lo repetitivo y propenso a error; donde el criterio humano importa, se mantiene la intervención sobre el flujo.",
        },
      ],
      note: "Cada sistema tiene sus interfaces y restricciones. No se conecta todo con todo: se define qué es posible, qué aporta una mejora y qué se deja fuera del alcance.",
    },
    process: [
      {
        title: "Localizar el cuello de botella",
        description:
          "Identificamos las tareas repetidas, errores y traspasos de datos que generan fricción.",
      },
      {
        title: "Mapear sistemas y datos",
        description:
          "Aclaramos qué herramienta es fuente de cada dato y qué interfaces ofrece.",
      },
      {
        title: "Definir el flujo y sus límites",
        description:
          "Diseñamos la integración o herramienta, incluidas validaciones y excepciones relevantes.",
      },
      {
        title: "Implementar y documentar",
        description:
          "Pruebo el flujo acordado y entrego accesos y documentación para mantenerlo.",
      },
    ],
    relatedSolutions: ["ecommerce", "b2b"],
    ctas: {
      hero: "Revisemos tus procesos",
      mid: "Revisemos qué se hace a mano",
      closing: "Cuéntame qué te frena hoy",
    },
    jump: [
      { href: "#decision", label: "Qué conectar" },
      { href: "#alcance", label: "Alcance" },
      { href: "#proceso", label: "Proceso" },
      { href: "#faq-title", label: "Preguntas frecuentes" },
    ],
    headings: {
      integrations: { tag: "Qué se conecta", title: "Conexiones posibles, no universales" },
      process: { tag: "Cómo trabajo", title: "Del cuello de botella al flujo" },
      evidence: { tag: "Evidencia publicada", title: "Proyectos relacionados" },
    },
    faqs: [
      {
        q: "¿Qué sistemas se pueden integrar?",
        a: "Depende de las herramientas y de las interfaces que ofrezcan. Antes de definir el alcance reviso APIs, formatos de datos, permisos y restricciones.",
      },
      {
        q: "¿Hay que automatizar todo el proceso?",
        a: "No. Se priorizan los pasos repetitivos o propensos a error que aportan una mejora clara, manteniendo intervención humana donde el proceso lo necesita.",
      },
      {
        q: "¿También puedes crear una herramienta o panel interno?",
        a: "Sí. El alcance puede incluir interfaces de operación, paneles o herramientas internas cuando resuelven una necesidad concreta del proceso.",
      },
      {
        q: "¿Se puede conectar cualquier herramienta con cualquier otra?",
        a: "No necesariamente. Cada sistema expone interfaces, permisos y límites distintos. Se comprueba qué permite cada uno antes de prometer una conexión y se documenta lo que queda fuera.",
      },
      {
        q: "¿Hasta dónde se puede automatizar sin rehacer toda la operación?",
        a: "Se empieza por los pasos que más tiempo o errores generan. Una automatización avanzada o una integración completa se plantean solo después de revisar los sistemas y comprobar que son viables; no se promete un ERP nuevo ni conectar todo sin ese análisis.",
      },
    ],
  },
  {
    id: "growth",
    slug: "desarrollo-web",
    title: "Diseño y desarrollo web profesional en Granada | FRN.Q",
    description:
      "Webs profesionales y corporativas en Granada: creación, rediseño y funciones a medida. Estructura clara, SEO técnico y captación según alcance.",
    h1: "Diseño y desarrollo web a medida",
    intro:
      "Creo y rediseño webs para que una empresa explique su actividad, presente sus servicios y facilite el contacto. Defino contigo la estructura, los contenidos y las funciones necesarias. Trabajo desde Granada con empresas de toda España; si solo necesitas corregir una web existente, tienes una revisión específica sin plantear de entrada una reconstrucción.",
    audience:
      "Empresas que necesitan una web propia para presentar su actividad, transmitir confianza y generar consultas, y que quieren una base sólida sobre la que construir su presencia online.",
    systemDescription:
      "El alcance puede ir de una web corporativa completa al rediseño de un sitio existente. Defino la arquitectura, el diseño y el desarrollo a partir del contenido y los objetivos del negocio, no al revés.",
    integrationDescription:
      "Una web corporativa puede funcionar por sí sola o conectar con las herramientas que ya usas. Defino qué datos deben circular, dónde vive cada uno y qué conexiones aportan valor real.",
    integrationExamples: [
      "Formularios de contacto y captación",
      "CRM o email marketing",
      "Analítica y eventos de conversión",
      "Reservas, agenda o pagos puntuales",
    ],
    webDetails: {
      modes: {
        tag: "Según de dónde partes",
        title: "Crear, rediseñar o desarrollar a medida",
        lead: "El punto de partida decide el trabajo: una web nueva, una existente que conviene reordenar o una función que no encaja en una web convencional.",
        items: [
          {
            label: "01",
            title: "Creación",
            description:
              "Partes de cero y necesitas una web completa: arquitectura, diseño y desarrollo definidos desde el contenido y los objetivos.",
            includes: ["Estructura y contenidos", "Diseño y desarrollo", "Publicación en tu dominio"],
          },
          {
            label: "02",
            title: "Rediseño",
            description:
              "La web existe, pero su estructura, diseño o rendimiento ya no acompañan. Se reordena y mejora sin empezar de nuevo.",
            includes: ["Revisión de lo actual", "Nueva jerarquía y diseño", "Rendimiento y SEO técnico"],
          },
          {
            label: "03",
            title: "Desarrollo a medida",
            description:
              "Hay una función que una web convencional no cubre: catálogo, área privada, calculadora o herramienta propia.",
            includes: ["Definición funcional", "Desarrollo específico", "Conexión con tus herramientas"],
          },
        ],
      },
      projectTypes: [
        {
          title: "Landing o página de campaña",
          description:
            "Una sola página para presentar un servicio, producto o lanzamiento con un siguiente paso claro. Útil para campañas y acciones concretas.",
        },
        {
          title: "Web corporativa o profesional",
          description:
            "Sitio completo para presentar la empresa o el servicio, ordenar la oferta y dejar claro cómo contactar. Sirve para empresas, despachos y consultas.",
        },
        {
          title: "Web con funciones propias",
          description:
            "Estructura o funcionalidad específica que no encaja en una web convencional: catálogos, áreas privadas, calculadoras o herramientas propias.",
        },
      ],
      capabilities: [
        {
          title: "Diseño web a medida",
          description:
            "Composición e identidad propias, definidas desde el contenido de la empresa y no desde una plantilla.",
        },
        {
          title: "SEO técnico",
          description:
            "Estructura, enlazado, metadatos, datos estructurados y rendimiento para que el sitio sea rastreable y comprensible. Un plan de posicionamiento continuado se acota aparte.",
        },
        {
            title: "Gestión de contenidos",
            description:
              "Si necesitas editar la web sin tocar código, definimos qué contenidos puedes gestionar y con qué herramienta, según el alcance.",
        },
        {
          title: "Rendimiento",
          description:
            "Generación estática, imágenes optimizadas y JavaScript mínimo para reducir los tiempos de carga.",
        },
        {
          title: "Accesibilidad",
          description:
            "Jerarquía semántica, contraste, foco visible y navegación por teclado como parte del desarrollo, no como añadido final.",
        },
        {
          title: "Analítica y medición",
          description:
            "Cuando se incluye, defino eventos y objetivos para medir consultas, con un proveedor acordado y el consentimiento necesario.",
        },
      ],
      deliverables: [
        "Web publicada y accesible en su dominio",
        "Diseño de todas las páginas incluidas en el alcance",
        "Código y repositorio del proyecto",
        "SEO técnico base y datos estructurados",
        "Accesibilidad y rendimiento revisados en el alcance acordado",
        "Medición y objetivos cuando forman parte del alcance",
        "Documentación de la solución y accesos acordados",
      ],
      maintenance:
        "Entrego la web documentada y con accesos propios, para que puedas mantenerla sin depender del estudio. Si lo necesitas, continúo con mejoras de contenido, nuevas secciones o ajustes de rendimiento y medición, sin obligar a una cuota permanente.",
      repair: {
        tag: "¿La web ya existe?",
        title: "Antes de rehacer, revisar",
        description: `Si el problema es una web en marcha —WordPress, Elementor o WooCommerce— con fallos, lentitud o mejoras pendientes, el punto de partida es el ${webRescueDiagnosis.title} (${webRescueDiagnosis.price}), que se descuenta de una reparación elegible contratada en los 30 días siguientes.`,
        label: "Ver revisión y reparación web",
      },
    },
    process: [
      {
        title: "Entender el negocio",
        description:
          "Aclaro la actividad, los servicios y el objetivo de la web antes de proponer una estructura.",
      },
      {
        title: "Definir estructura y diseño",
        description:
          "Organizo el contenido en páginas y recorridos, y diseño la interfaz a partir de ahí.",
      },
      {
        title: "Desarrollar y publicar",
        description:
          "Construyo el sitio, lo reviso en distintos dispositivos y lo publico con su dominio.",
      },
      {
        title: "Medir y evolucionar",
        description:
          "Si se incluye medición, reviso los datos disponibles para proponer mejoras. El mantenimiento y la evolución se acuerdan aparte.",
      },
    ],
    relatedSolutions: ["ecommerce", "sistemas"],
    evidenceCategories: ["corporate", "web", "website"],
    evidenceNote:
      "Webs corporativas y proyectos publicados en el sitio. Son referencias de trabajo real; no se les atribuyen métricas ni resultados comerciales.",
    ctas: {
      hero: "Hablemos de tu web",
      mid: "Cuéntame qué web necesitas",
      closing: "Cuéntame cómo quieres tu web",
    },
    jump: [
      { href: "#modos", label: "Punto de partida" },
      { href: "#tipologias", label: "Tipologías" },
      { href: "#reparacion", label: "¿Ya tienes web?" },
      { href: "#entregables", label: "Entregables" },
      { href: "#faq-title", label: "Preguntas frecuentes" },
    ],
    headings: {
      integrations: { tag: "Datos y herramientas", title: "La web conectada con tus herramientas" },
      process: { tag: "Cómo trabajo", title: "De la idea a la publicación" },
      evidence: { tag: "Evidencia publicada", title: "Proyectos corporativos" },
    },
    faqs: [
      {
        q: "¿Cuánto cuesta una web a medida?",
        a: "Depende del número de páginas, el contenido y las integraciones. Después de entender el alcance recibes una propuesta por escrito con entregables, calendario y coste.",
      },
      {
        q: "¿Puedes reparar o mejorar una web que ya tengo?",
        a: `Sí. Reviso la web existente, localizo qué falla o se puede mejorar y propongo qué reparar, ampliar o dejar como está. Empiezo con el ${webRescueDiagnosis.title} (${webRescueDiagnosis.price}), que se descuenta de una reparación elegible contratada en los 30 días siguientes.`,
      },
      {
        q: "¿Trabajas con WordPress, Elementor o WooCommerce?",
        a: "Sí. Son plataformas habituales en webs y tiendas que ya están en marcha. Reviso tema, plugins, contenidos, rendimiento y SEO técnico, y propongo una reparación o una mejora concreta según el estado real del sitio.",
      },
      {
        q: "¿En cuánto tiempo se publica?",
        a: "El plazo depende del alcance y de la disponibilidad de los contenidos. El proyecto se organiza por fases, con hitos y dependencias claras.",
      },
      {
        q: "¿Trabajas solo en Granada?",
        a: "Trabajo desde Granada y colaboro en remoto con empresas de toda España. La ubicación no condiciona el proyecto.",
      },
      {
        q: "¿Puedo actualizar el contenido yo mismo?",
        a: "Si necesitas editar sin tocar código, acordamos un sistema de gestión de contenido y qué podrás actualizar. No todas las webs lo necesitan ni lo incluyen. Entrego los accesos y la documentación correspondientes a la solución contratada.",
      },
      {
        q: "¿La web incluye SEO y analítica?",
        a: "La base técnica cubre estructura, metadatos y rendimiento. La medición se configura cuando está incluida, con un proveedor y los objetivos acordados, y el consentimiento necesario. Un plan de posicionamiento continuado se acota aparte; no se garantizan posiciones ni consultas.",
      },
      {
        q: "¿Qué diferencia hay entre crear, rediseñar y desarrollar a medida?",
        a: "Crear es partir de cero: arquitectura, diseño y desarrollo desde el contenido. Rediseñar es reordenar y mejorar una web que ya existe sin rehacerla. Desarrollar a medida es cubrir una función que una web convencional no resuelve, como un catálogo o un área privada. Si el problema es una web en marcha, la reparación se aborda antes de plantear un rediseño completo.",
      },
    ],
  },
];

export function getSolutionBySlug(slug: string): SolutionPage | undefined {
  return solutionPages.find((solution) => solution.slug === slug);
}

export function getSolutionForService(serviceId: string): SolutionPage | undefined {
  return solutionPages.find((solution) => solution.id === serviceId);
}

export function solutionPath(slug: string): string {
  return `/soluciones/${slug}/`;
}

export function getServiceForSolution(solution: SolutionPage) {
  return serviceAreas.find((service) => service.id === solution.id);
}

/**
 * Commercial solution a published case points back to. `serviceArea` wins when
 * the case explicitly evidences ecommerce, B2B or systems; otherwise the case
 * category selects the solution it demonstrates. Every published case resolves
 * to one solution, so no case page is a dead end.
 */
const solutionIdByCategory: Record<string, SolutionId> = {
  ecommerce: "ecommerce",
  b2b: "b2b",
  corporate: "growth",
  web: "growth",
  website: "growth",
  product: "growth",
  interactive: "growth",
};

export function getSolutionForCase(caseItem: {
  category: string;
  serviceArea?: SolutionId;
}): SolutionPage | undefined {
  const id = caseItem.serviceArea ?? solutionIdByCategory[caseItem.category];
  return id ? getSolutionForService(id) : undefined;
}

/**
 * Contact form type (`?tipo=`, see `src/data/contact-contract.ts`) that matches
 * each solution, so a case CTA opens the form with the right project type.
 */
export const solutionContactTypes: Record<SolutionId, string> = {
  ecommerce: "ecommerce",
  b2b: "portal",
  sistemas: "sistema",
  growth: "web",
};
