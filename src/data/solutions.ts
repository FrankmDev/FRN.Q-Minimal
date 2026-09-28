import { serviceAreas } from "./services";

export type SolutionId = "ecommerce" | "b2b" | "sistemas";

export interface SolutionFaq {
  q: string;
  a: string;
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
  process: { title: string; description: string }[];
  relatedSolutions: SolutionId[];
  faqs: SolutionFaq[];
}

export const solutionPages: SolutionPage[] = [
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "Desarrollo ecommerce y Shopify para empresas | FRN.Q",
    description:
      "Desarrollo de tiendas online en Shopify o a medida, con catálogo, checkout e integraciones definidos según cada negocio.",
    h1: "Ecommerce y Shopify para vender con más control",
    intro:
      "Desarrollo tiendas online para marcas que necesitan presentar sus productos, facilitar la compra y conectar la venta con su operativa. La base puede ser Shopify o una solución a medida.",
    audience:
      "Marcas y empresas que venden producto directamente a sus clientes y necesitan una tienda conectada con su forma de trabajar.",
    systemDescription:
      "El proyecto puede cubrir catálogo, variantes, disponibilidad, checkout y medición, según los requisitos de la tienda y sus conexiones.",
    integrationDescription:
      "Antes de elegir una plataforma, reviso qué datos deben circular entre la tienda y las herramientas existentes. La integración depende de las interfaces disponibles y se concreta dentro del alcance del proyecto.",
    integrationExamples: [
      "Catálogo, variantes y datos de producto",
      "Pedidos, stock y operación interna",
      "Pagos, envíos y fiscalidad",
      "Analítica y medición de conversión",
    ],
    process: [
      {
        title: "Revisar catálogo y venta",
        description:
          "Aclaramos productos, variantes, clientes, checkout y requisitos de la operación.",
      },
      {
        title: "Elegir la base adecuada",
        description:
          "Valoramos Shopify o desarrollo a medida según el alcance y las integraciones necesarias.",
      },
      {
        title: "Construir y conectar",
        description:
          "Implemento la tienda y las conexiones acordadas con los sistemas existentes.",
      },
      {
        title: "Probar y entregar",
        description:
          "Revisamos el flujo de compra, publico el proyecto y entrego accesos y documentación.",
      },
    ],
    relatedSolutions: ["b2b", "sistemas"],
    faqs: [
      {
        q: "¿Shopify o desarrollo a medida?",
        a: "Depende del catálogo, el flujo de venta y las integraciones. Valoro esas necesidades para elegir la base adecuada para el proyecto.",
      },
      {
        q: "¿Se puede conectar la tienda con el stock o el ERP?",
        a: "Se estudia con los sistemas concretos y sus interfaces disponibles. Primero definimos qué datos deben sincronizarse y qué herramienta es la fuente de cada dato.",
      },
      {
        q: "¿Tengo que rehacer la tienda que ya utilizo?",
        a: "No necesariamente. Reviso contigo la tienda y la operación actual para decidir qué conservar, ajustar o sustituir.",
      },
    ],
  },
  {
    id: "b2b",
    slug: "b2b",
    title: "Portal B2B de pedidos y catálogo privado | FRN.Q",
    description:
      "Portales B2B para fabricantes, distribuidores y mayoristas: precios por cliente, catálogo privado, pedidos y cuentas profesionales.",
    h1: "Catálogo, precios privados y pedidos B2B",
    intro:
      "Desarrollo portales de pedido para organizar el acceso, las condiciones comerciales y la compra recurrente en un canal digital adaptado al proceso de cada empresa.",
    audience:
      "Fabricantes, distribuidores y mayoristas que gestionan clientes profesionales, tarifas, pedidos o documentación por canales dispersos.",
    systemDescription:
      "Un portal B2B puede dar acceso por cliente, mostrar catálogos y tarifas privadas, y ordenar solicitudes, pedidos, aprobaciones o reposiciones. Las funciones se acotan al proceso real de la empresa.",
    integrationDescription:
      "El portal se diseña alrededor de los datos que ya existen: clientes, permisos, tarifas, catálogo, disponibilidad y pedidos. Las conexiones con ERP u otras herramientas se concretan tras revisar sus interfaces y el flujo de información.",
    integrationExamples: [
      "Acceso por empresa, usuarios, roles y permisos",
      "Catálogos, tarifas y precios por cliente profesional",
      "Pedidos, aprobación y reposición",
      "Documentación y seguimiento de pedidos",
    ],
    process: [
      {
        title: "Mapear clientes y condiciones",
        description:
          "Definimos cuentas, roles, catálogos, tarifas y reglas comerciales.",
      },
      {
        title: "Ordenar el pedido",
        description:
          "Acordamos cómo se solicita, valida, prepara y consulta cada pedido.",
      },
      {
        title: "Conectar los datos necesarios",
        description:
          "Revisamos las herramientas actuales y el intercambio posible de clientes, precios, stock y pedidos.",
      },
      {
        title: "Probar con los roles reales",
        description:
          "Validamos permisos y recorridos antes de publicar y entregar el portal.",
      },
    ],
    relatedSolutions: ["ecommerce", "sistemas"],
    faqs: [
      {
        q: "¿Se pueden mostrar precios distintos para cada cliente?",
        a: "Sí. El alcance puede contemplar tarifas o condiciones por cliente profesional, junto con los permisos necesarios para mantenerlas privadas.",
      },
      {
        q: "¿Un portal puede sustituir pedidos por email o WhatsApp?",
        a: "Puede ofrecer un flujo centralizado para catálogo, pedido y seguimiento. Revisamos el proceso actual para decidir qué pasos conviene trasladar al portal.",
      },
      {
        q: "¿El portal se conecta con el ERP que ya usamos?",
        a: "Depende del ERP y de sus interfaces. Analizo qué datos deben intercambiarse y cómo encaja esa conexión en el alcance antes de proponerla.",
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
