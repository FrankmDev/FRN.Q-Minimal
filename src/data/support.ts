import type { ContactType } from "./contact-contract";
import { formatPrice, getPublicAmount } from "./pricing";

/**
 * Single source of truth for the FRN.Q Support page (`/soporte/`).
 *
 * PRICING RULES
 * - The public starting point is the CARE price, read from `src/data/pricing.ts`
 *   so the figure never drifts from `/precios/`. It is a scope-specific starting
 *   point ("desde"), never a fixed total: every agreement fixes its scope,
 *   availability and terms in writing.
 * - No unlimited support, no generic response times, no 24/7 availability,
 *   no guaranteed results or invented metrics.
 */

const careAmount = getPublicAmount("care");

/** Public monthly reference for maintenance, only when the source publishes it. */
export const supportPrice =
  careAmount && careAmount.billing === "monthly"
    ? {
        plan: "CARE",
        amount: careAmount.minimum,
        /** Visible label, e.g. "desde 49 €/mes". */
        label: `desde ${formatPrice(careAmount.minimum)}/mes`,
      }
    : undefined;

export interface SupportItem {
  num: string;
  title: string;
  description: string;
}

export interface SupportCapability extends SupportItem {
  /** Small mono label that states where the capability sits. */
  scope: string;
  /** True for the work that leaves the maintenance agreement (inverted plate). */
  detached?: boolean;
}

export interface SupportOrigin {
  title: string;
  description: string;
  includes: string[];
}

export interface SupportFaq {
  q: string;
  a: string;
}

export interface SupportCopy {
  label: string;
  eyebrow: string;
  titleLine: string;
  titleHighlight: string;
  intro: string;
  audience: string;
  meta: { title: string; description: string };
  differences: {
    tag: string;
    title: string;
    lead: string;
    items: SupportItem[];
  };
  service: {
    tag: string;
    title: string;
    statement: string;
    compatibilityTitle: string;
    compatibility: string[];
    compatibilityNote: string;
  };
  price: {
    tag: string;
    detail: string;
  };
  capabilities: {
    tag: string;
    title: string;
    lead: string;
    items: SupportCapability[];
  };
  scope: {
    tag: string;
    title: string;
    lead: string;
    items: string[];
    note: string;
  };
  onboarding: {
    tag: string;
    title: string;
    lead: string;
    origins: SupportOrigin[];
    stepsTitle: string;
    steps: (SupportItem & { num: string })[];
  };
  faqs: SupportFaq[];
  cta: { label: string; lead: string; type: ContactType };
}

export const supportCopy: SupportCopy = {
  label: "Soporte y mantenimiento",
  eyebrow: "FRN.Q Support",
  titleLine: "Tu proyecto no",
  titleHighlight: "termina al publicarse.",
  intro:
    "Publicar es el principio de la vida útil de una web o un sistema, no su final. Después del lanzamiento hay que mantener lo que funciona, corregir lo que aparece y decidir qué evoluciona. FRN.Q Support cubre esa continuidad con un alcance acordado por escrito.",
  audience:
    "Para empresas con una web, una tienda o un sistema ya en marcha que necesitan a alguien que responda y que lleve su mantenimiento y sus mejoras sin volver a empezar de cero.",
  meta: {
    title: "Soporte y mantenimiento web y sistemas | FRN.Q",
    description:
      "Mantenimiento, cambios menores y evolución para sitios y sistemas ya publicados. Alcance, tiempos y trabajos extraordinarios acordados por escrito.",
  },
  differences: {
    tag: "Antes de contratar",
    title: "Tres cosas que se confunden",
    lead:
      "Garantía de entrega, mantenimiento técnico y mejoras evolutivas son compromisos distintos. Mezclarlos es la causa habitual de expectativas mal calibradas.",
    items: [
      {
        num: "01",
        title: "Garantía de entrega",
        description:
          "Responde por lo acordado: si algo del proyecto entregado no funciona como se definió, se corrige. Es una obligación ligada al alcance del proyecto, con su periodo y sus condiciones, no un servicio continuado.",
      },
      {
        num: "02",
        title: "Mantenimiento técnico",
        description:
          "Mantiene en marcha lo que ya funciona: revisiones, actualizaciones y resolución de incidencias dentro del alcance. Aporta continuidad, no funciones nuevas.",
      },
      {
        num: "03",
        title: "Mejoras evolutivas",
        description:
          "Añade o cambia cosas: secciones nuevas, funciones, integraciones, trabajo de posicionamiento o datos. Se planifican y se presupuestan aparte del mantenimiento.",
      },
    ],
  },
  service: {
    tag: "Continuidad",
    title: "FRN.Q Support",
    statement:
      "FRN.Q Support mantiene en marcha y en evolución sitios y sistemas compatibles después de la entrega, con un alcance definido por escrito y sin prometer más de lo que el proyecto permite.",
    compatibilityTitle: "Con qué proyectos trabajo",
    compatibility: [
      "Proyectos desarrollados por FRN.Q, con el código y la documentación de entrega.",
      "Webs y tiendas WordPress, Elementor o WooCommerce en estado mantenible.",
      "Sitios estáticos o frontales con acceso propio y control del despliegue.",
      "Sistemas e integraciones con accesos, proveedores y documentación identificados.",
    ],
    compatibilityNote:
      "No todos los proyectos son mantenibles en las mismas condiciones. Si por accesos, dependencias heredadas o estado técnico no puedo atenderlo con garantías, lo digo antes de empezar.",
  },
  price: {
    tag: "Precio público",
    detail:
      "El plan CARE parte de esa cuota para contenido, ajustes y pequeñas mejoras, sin permanencia obligatoria. El alcance, el trabajo incluido y las condiciones se acuerdan por escrito; la evolución mayor, el SEO y las integraciones van aparte.",
  },
  capabilities: {
    tag: "Qué cubre",
    title: "Un servicio, cuatro frentes",
    lead:
      "El mantenimiento y las mejoras pequeñas conviven en el mismo acuerdo. La evolución mayor se trata aparte, con su propio alcance.",
    items: [
      {
        num: "01",
        title: "Mantenimiento técnico e incidencias",
        description:
          "Reviso el estado del sitio o sistema, aplico las actualizaciones necesarias y resuelvo las incidencias que entran en el alcance acordado.",
        scope: "Dentro del mantenimiento",
      },
      {
        num: "02",
        title: "Cambios menores y mejoras planificadas",
        description:
          "Ajustes de contenido, correcciones y mejoras pequeñas que se agrupan y se ejecutan de forma planificada, sin interrumpir la operación.",
        scope: "Dentro del mantenimiento",
      },
      {
        num: "03",
        title: "Revisión técnica y seguimiento",
        description:
          "Compruebo rendimiento, errores, copias y seguridad básica, y te cuento el estado real con la periodicidad que acordemos.",
        scope: "Dentro del mantenimiento",
      },
      {
        num: "04",
        title: "Evolución, SEO, datos e integraciones",
        description:
          "Funciones nuevas, trabajo de posicionamiento, analítica, nuevos flujos o conexiones con otros sistemas. Por su alcance, se define un acuerdo específico.",
        scope: "Acuerdo aparte",
        detached: true,
      },
    ],
  },
  scope: {
    tag: "Sin sorpresas",
    title: "Todo se acuerda por escrito",
    lead:
      "El servicio no cubre todo lo imaginable ni se resuelve en cualquier momento. Lo que entra, lo que no y cómo se responde se fija antes de empezar.",
    items: [
      "Alcance incluido y excluido del mantenimiento",
      "Tiempos de respuesta según criticidad y disponibilidad",
      "Horarios de atención y canal de contacto",
      "Quién asume hosting, dominio y licencias",
      "Cómo se presupuestan los trabajos extraordinarios",
      "Límites del servicio: no es soporte ilimitado",
    ],
    note:
      "No prometo soporte ilimitado, disponibilidad permanente ni tiempos de respuesta genéricos. Cada acuerdo fija su alcance, su disponibilidad y sus tiempos.",
  },
  onboarding: {
    tag: "Cómo se empieza",
    title: "Integrar tu proyecto",
    lead:
      "El punto de partida cambia según lo haya desarrollado FRN.Q o ya existiera antes. En ambos casos se empieza por una revisión del estado real.",
    origins: [
      {
        title: "Proyectos desarrollados por FRN.Q",
        description:
          "El punto de partida es el trabajo ya entregado y su documentación.",
        includes: [
          "Reviso el estado actual tras la publicación",
          "Parto del alcance, los accesos y la documentación de entrega",
          "Defino qué mantenimiento tiene sentido para ese sistema",
        ],
      },
      {
        title: "Proyectos que ya existen",
        description:
          "Antes de comprometerme a mantenerlo, necesito entender qué hay.",
        includes: [
          "Revisión inicial del estado técnico y de los accesos",
          "Compruebo plataforma, dependencias y puntos de riesgo",
          "Propongo un punto de partida realista o explico por qué no lo veo viable",
        ],
      },
    ],
    stepsTitle: "De la revisión al acuerdo",
    steps: [
      {
        num: "01",
        title: "Revisión inicial",
        description:
          "Analizo el estado del sitio o sistema, los accesos y las dependencias.",
      },
      {
        num: "02",
        title: "Propuesta de alcance",
        description:
          "Recibes por escrito qué entra, qué no, con qué tiempos y en qué condiciones.",
      },
      {
        num: "03",
        title: "Acuerdo y puesta en marcha",
        description:
          "Empezamos el mantenimiento con el alcance cerrado y un canal de contacto claro.",
      },
    ],
  },
  faqs: [
    {
      q: "¿Qué incluye el mantenimiento técnico?",
      a: "Revisiones del estado del sitio o sistema, las actualizaciones necesarias, copias y la resolución de las incidencias incluidas en el alcance. Lo concreto se fija por escrito antes de empezar: no es lo mismo mantener una web informativa que una tienda o un sistema conectado.",
    },
    {
      q: "¿Cuánto cuesta el mantenimiento?",
      a: supportPrice
        ? `El plan ${supportPrice.plan} parte de ${formatPrice(supportPrice.amount)}/mes para contenido, ajustes y pequeñas mejoras. Es un punto de partida según alcance: el trabajo incluido, los tiempos y las condiciones se acuerdan por escrito, y la evolución mayor o el SEO se presupuestan aparte.`
        : "El mantenimiento se acuerda por escrito según el alcance, el trabajo incluido y los tiempos. La evolución mayor o el SEO se presupuestan aparte.",
    },
    {
      q: "¿Es soporte ilimitado?",
      a: "No. El acuerdo define qué entra, cuánto trabajo incluye y qué se considera un trabajo extraordinario. Si algo queda fuera, te aviso y se presupuesta antes de hacerlo.",
    },
    {
      q: "¿Puedo contratarlo aunque la web no la hayas hecho tú?",
      a: "Sí, si el proyecto es mantenible. Reviso primero el estado técnico, los accesos y las dependencias; si no puedo atenderlo con garantías, te lo digo antes de comprometerme.",
    },
    {
      q: "¿Cómo se factura y cuánto dura?",
      a: "La periodicidad y la duración se acuerdan por escrito y se ajustan al alcance. No impongo una permanencia que el proyecto no necesite.",
    },
    {
      q: "¿Gestionas el hosting, el dominio y las licencias?",
      a: "Pueden quedar dentro o fuera del acuerdo, según lo que ya tengas. En la propuesta queda claro quién asume cada cosa y qué costes son externos al servicio.",
    },
    {
      q: "¿Hay tiempos de respuesta garantizados?",
      a: "Se acuerdan por escrito y pueden variar según la criticidad y la disponibilidad del acuerdo. No ofrezco de forma genérica un soporte 24/7 ni tiempos que no pueda cumplir.",
    },
    {
      q: "¿Qué pasa si necesito una función nueva o trabajo de SEO?",
      a: "Es evolución, no mantenimiento, y se aborda con un acuerdo específico: alcance, calendario y coste propios. Así el mantenimiento no se diluye en un proyecto nuevo.",
    },
  ],
  cta: {
    label: "Consultar soporte",
    lead:
      "Cuéntame qué tienes en marcha y qué necesitas mantener o mejorar. Te respondo con un alcance concreto.",
    type: "soporte",
  },
};

/** Public support path, reused by the links from services, cases and footer. */
export const supportPath = "/soporte/";
