import { serviceAreas } from "./services";

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

/** Composition specific to the corporate-web page. */
export interface WebDetails {
  /** Project shapes the offer can cover, from a full corporate site to a redesign. */
  projectTypes: SolutionCard[];
  /** Craft and technical capabilities integrated into the build. */
  capabilities: SolutionCard[];
  /** What the client receives at the end of the engagement. */
  deliverables: string[];
  /** How the site is handed over and maintained after launch. */
  maintenance: string;
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
  buyerJourney: B2BBuyerStep[];
  phases: B2BBuyerStep[];
  systemsCta: string;
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
  platformOptions?: { title: string; description: string }[];
  clientInputs?: string[];
  deliverables?: string[];
  projectLimits?: string[];
  process: { title: string; description: string }[];
  relatedSolutions: SolutionId[];
  b2bDetails?: B2BDetails;
  webDetails?: WebDetails;
  /**
   * Published case categories rendered as evidence when the solution has no
   * `serviceArea` match. The projects collection stays the single source.
   */
  evidenceCategories?: string[];
  /** Optional heading overrides; defaults match the platform-led pages. */
  headings?: Partial<Record<"integrations" | "process" | "evidence", SolutionHeading>>;
  faqs: SolutionFaq[];
}

export const solutionPages: SolutionPage[] = [
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "Tiendas online Shopify y desarrollo ecommerce | FRN.Q",
    description:
      "Construyo, migro o mejoro tiendas online con Shopify o desarrollo a medida: catálogo, checkout, pagos, envíos, SEO e integraciones.",
    h1: "Desarrollo de tiendas online y Shopify",
    intro:
      "Construyo tiendas nuevas, rediseño las existentes y migro proyectos que ya no encajan en su plataforma, para empresas que necesitan ordenar el catálogo, facilitar la compra y conectar la tienda con su operativa. Shopify es una buena base para muchos proyectos; cuando el flujo o las integraciones lo requieren, definimos una solución más personalizada.",
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
      "Portal B2B y catálogo mayorista para fabricantes y distribuidores. Ecommerce B2B, precios privados, referencias y pedidos online para mayoristas.",
    h1: "Portal B2B para vender a clientes profesionales",
    intro:
      "Digitalizo el proceso comercial de fabricantes, distribuidores y mayoristas: desde el alta y validación de empresas hasta la consulta de referencias, las solicitudes de presupuesto y los pedidos.",
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
      "Diseño integraciones, workflows y herramientas internas cuando la información no circula bien entre sistemas o una tarea depende de pasos manuales repetitivos.",
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
        q: "¿Hasta dónde se puede automatizar sin rehacer toda la operación?",
        a: "Se empieza por los pasos que más tiempo o errores generan. Una automatización avanzada o una integración completa se plantean solo después de revisar los sistemas y comprobar que son viables; no se promete un ERP nuevo ni conectar todo sin ese análisis.",
      },
    ],
  },
  {
    id: "growth",
    slug: "desarrollo-web",
    title: "Diseño y desarrollo web a medida en Granada | FRN.Q",
    description:
      "Diseño y desarrollo web en Granada: web corporativa y profesional, SEO técnico, rendimiento y analítica. En remoto, con empresas de toda España.",
    h1: "Diseño y desarrollo web a medida",
    intro:
      "Diseño y desarrollo webs profesionales y corporativas a medida: desde una landing de campaña hasta un sitio completo que explica con claridad qué hace una empresa, ordena sus servicios y facilita el contacto. Cada proyecto se construye para ser rápido, accesible y medible desde el primer día. Trabajo desde Granada con empresas de toda España.",
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
          title: "Proyecto web a medida",
          description:
            "Estructura o funcionalidad específica que no encaja en una web convencional: catálogos, áreas privadas, calculadoras o herramientas propias.",
        },
        {
          title: "Rediseño y mejora",
          description:
            "Revisión de una web existente para corregir estructura, diseño y rendimiento, o para ampliar el sitio por fases sin rehacerlo todo.",
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
            "Estructura, enlazado, metadatos, datos estructurados y rendimiento para que el sitio sea rastreable y comprensible.",
        },
        {
          title: "Rendimiento",
          description:
            "Generación estática, imágenes optimizadas y JavaScript mínimo para reducir los tiempos de carga.",
        },
        {
          title: "Accesibilidad",
          description:
            "Jerarquía semántica, contraste, foco visible y navegación por teclado como parte del desarrollo.",
        },
        {
          title: "Analítica y medición",
          description:
            "Eventos y objetivos definidos para entender qué páginas y qué recorridos generan contacto.",
        },
      ],
      deliverables: [
        "Web publicada y accesible en su dominio",
        "Diseño de todas las páginas incluidas en el alcance",
        "Código y repositorio del proyecto",
        "SEO técnico base y datos estructurados",
        "Analítica configurada y objetivos definidos",
        "Documentación de edición y accesos",
      ],
      maintenance:
        "Entrego la web documentada y con accesos propios, para que puedas mantenerla sin depender del estudio. Si lo necesitas, continúo con mejoras de contenido, nuevas secciones o ajustes de rendimiento y medición, sin obligar a una cuota permanente.",
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
          "Reviso el comportamiento una vez publicado y planifico mejoras con datos.",
      },
    ],
    relatedSolutions: ["ecommerce", "sistemas"],
    evidenceCategories: ["corporate", "web", "website"],
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
        q: "¿En cuánto tiempo se publica?",
        a: "El plazo depende del alcance y de la disponibilidad de los contenidos. El proyecto se organiza por fases, con hitos y dependencias claras.",
      },
      {
        q: "¿Trabajas solo en Granada?",
        a: "Trabajo desde Granada y colaboro en remoto con empresas de toda España. La ubicación no condiciona el proyecto.",
      },
      {
        q: "¿Puedo actualizar el contenido yo mismo?",
        a: "Sí. Defino una estructura editable y entrego documentación y accesos para que puedas mantener textos, imágenes y páginas.",
      },
      {
        q: "¿La web incluye SEO y analítica?",
        a: "Incluye un trabajo de base: estructura, metadatos, datos estructurados, rendimiento y una medición configurada. Un plan de posicionamiento continuado se acota aparte.",
      },
      {
        q: "¿Qué diferencia hay entre una landing, una web corporativa y una web a medida?",
        a: "Una landing concentra una sola acción, normalmente una campaña o un lanzamiento. Una web corporativa reúne la actividad completa, los servicios y el contacto. Un proyecto a medida añade estructura o funciones específicas —catálogo, área privada, calculadora— que una web convencional no cubre.",
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
