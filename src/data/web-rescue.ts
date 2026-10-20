import type { ContactType } from "./contact-contract";
import { formatPrice, rescueOffers } from "./pricing";

/**
 * Copy for the Web Rescue block ("Revisión y reparación web") integrated into
 * the Home page.
 *
 * PRICING RULES
 * - The public amounts come from `src/data/pricing.ts`; this module only
 *   composes the block copy around them.
 * - Only the productized offers are public: the scoped 360 review and the
 *   "from" price of a landing repair. Larger repairs are quoted after the
 *   review; no full internal price list is published.
 * - The review is initial and scoped, never an unlimited audit.
 * - No guaranteed results, rankings or income.
 */

const rescueDiagnosis = rescueOffers[0];
const rescueLanding = rescueOffers[1];
const rescueLarger = rescueOffers[2];

/** Amount-only label for the landing offer, reused by `price` and `amountLabel`. */
const landingAmountLabel = formatPrice(rescueLanding.amount);

export interface RescueStep {
  num: string;
  title: string;
  description: string;
}

export interface RescuePrice {
  title: string;
  /** Visible price: a fixed amount or a scoped label ("Presupuesto"). */
  price: string;
  detail: string;
  /** Schema-ready amount when the offer has a fixed public number. */
  amount?: number;
  /** True when `amount` is a minimum ("desde"). */
  from?: boolean;
  /**
   * Optional qualifier split out of `price` ("desde") for contexts that show
   * the amount with its own hierarchy (Home price plates).
   */
  qualifier?: string;
  /** Amount-only label shown next to `qualifier`; falls back to `price`. */
  amountLabel?: string;
}

export interface WebRescueCopy {
  label: string;
  titleLine: string;
  titleHighlight: string;
  lead: string;
  steps: RescueStep[];
  prices: RescuePrice[];
  note: string;
  market: {
    titleLine: string;
    titleHighlight: string;
    audience: string[];
    cases: string[];
    disclaimer: string;
    cta: { label: string; type: ContactType };
  };
  cta: { label: string; type: ContactType };
}

/** Public, productized entry offer. Reused by the corporate-web FAQ. */
export const webRescueDiagnosis = {
  title: rescueDiagnosis.name,
  price: formatPrice(rescueDiagnosis.amount),
  amount: rescueDiagnosis.amount,
  detail: rescueDiagnosis.scope,
} as const;

export const webRescueCopy: WebRescueCopy = {
  label: "Revisión y reparación web",
  titleLine: "Tu web ya existe.",
  titleHighlight: "Que trabaje mejor.",
  lead:
    "Reviso webs en marcha —WordPress, Elementor o WooCommerce— para recuperar lo que se rompió, arreglar lo que no convierte y ampliar lo que falta. Sin rehacerlo todo.",
  steps: [
    {
      num: "01",
      title: "Diagnóstico",
      description:
        "Revisión acotada: qué falla, qué conviene mejorar y por dónde empezar.",
    },
    {
      num: "02",
      title: "Presupuesto",
      description: "Alcance y coste por escrito antes de tocar nada.",
    },
    {
      num: "03",
      title: "Reparación",
      description: "Corrijo y mejoro lo acordado sobre la web existente.",
    },
    {
      num: "04",
      title: "Verificación",
      description:
        "Compruebo que todo funciona y dejo los cambios documentados.",
    },
  ],
  prices: [
    { ...webRescueDiagnosis },
    {
      title: rescueLanding.name,
      price: `desde ${landingAmountLabel}`,
      amount: rescueLanding.amount,
      from: true,
      qualifier: "desde",
      amountLabel: landingAmountLabel,
      detail: rescueLanding.scope,
    },
    {
      title: rescueLarger.name,
      price: "Presupuesto",
      detail: rescueLarger.scope,
    },
  ],
  note:
    "El diagnóstico es un punto de partida acotado, no una auditoría ilimitada. El presupuesto se cierra por escrito antes de reparar.",
  market: {
    titleLine: "Para todo tipo de",
    titleHighlight: "negocios",
    audience: [
      "Comercios",
      "Hostelería",
      "Industria",
      "Servicios",
      "Profesionales",
      "B2B",
    ],
    cases: [
      "Mejorar la web del negocio",
      "Vender directo y online",
      "Integrar reservas y pagos",
      "Promociones y entradas con proveedores especializados",
      "Medir consultas, reservas y ventas",
    ],
    disclaimer:
      "Cada solución se plantea tras estudiar el negocio: no hay paquetes cerrados ni funciones garantizadas.",
    cta: { label: "Cuéntame tu negocio", type: "reparacion" },
  },
  cta: { label: "Revisar mi web", type: "reparacion" },
};

export interface RescueProblem {
  num: string;
  title: string;
  description: string;
}

export interface RescueFaq {
  q: string;
  a: string;
}

/**
 * Dedicated repair-intent landing page (`/soluciones/revision-web/`).
 *
 * Intent boundary: this page covers repairing, updating and improving a web
 * that already exists (WordPress, Elementor, WooCommerce or custom). Creating
 * or redesigning a site is the corporate-web route (`/soluciones/desarrollo-web/`).
 *
 * Shared blocks are reused by reference — `steps`, `prices` and `note` come
 * from `webRescueCopy` and the diagnosis offer from `webRescueDiagnosis` — so
 * no rate, process step or discount text is duplicated.
 */
export const webRescuePage = {
  slug: "revision-web",
  path: "/soluciones/revision-web/",
  label: "Reparación web",
  title: "Reparación y mejora de webs existentes | FRN.Q",
  description: `Reparo y mejoro webs en marcha (WordPress, Elementor, WooCommerce): formularios, errores, responsive, rendimiento y SEO técnico. ${webRescueDiagnosis.title} ${webRescueDiagnosis.price}.`,
  h1Line: "Tu web puede",
  h1Highlight: "funcionar mejor.",
  eyebrow: "Reparación, actualización y mejora",
  intro:
    "Recupero y mejoro webs que ya están en marcha: lo que ha dejado de funcionar, lo que se ve mal, lo que carga lento y lo que no convierte. Trabajo sobre la web existente en lugar de rehacerla desde cero.",
  audience:
    "Empresas y profesionales con una web en marcha que ha envejecido, se ha roto o se ha quedado corta, y que necesitan recuperarla y mejorarla sin empezar de nuevo.",
  platforms: ["WordPress", "Elementor", "WooCommerce", "Web a medida"],
  problems: [
    {
      num: "01",
      title: "Formularios que no envían",
      description:
        "Contacto o presupuesto que falla, llega incompleto o se queda sin respuesta ni aviso.",
    },
    {
      num: "02",
      title: "Errores visuales",
      description:
        "Elementos descolocados, tipografía rota, imágenes que no cargan o secciones que se ven mal.",
    },
    {
      num: "03",
      title: "Responsive roto",
      description:
        "En móvil o tablet la web se desborda, no se puede leer o los botones no responden.",
    },
    {
      num: "04",
      title: "Rendimiento",
      description:
        "La web tarda en cargar y pierde visitas antes de mostrar el contenido.",
    },
    {
      num: "05",
      title: "SEO técnico",
      description:
        "Metadatos, enlazado, redirecciones o rastreo que impiden que Google entienda el sitio.",
    },
    {
      num: "06",
      title: "Funciones deterioradas",
      description:
        "Plugins, tienda o funciones que dejaron de trabajar tras una actualización.",
    },
  ],
  diagnosis: {
    lead:
      "Una revisión inicial y acotada para decidir con criterio qué reparar, qué mejorar y qué dejar como está.",
    conditions: [
      "Antes de contratar, acordamos qué páginas y recorridos se revisan y qué accesos hacen falta. No envíes contraseñas por el formulario.",
      "Recibes un informe de hallazgos y prioridades, con una recomendación y el siguiente alcance propuesto. El diagnóstico no autoriza cambios en la web.",
      "El descuento se aplica a una reparación elegible contratada en los 30 días siguientes. La propuesta identifica la reparación elegible y cómo se aplica el importe del diagnóstico; no es un descuento automático para cualquier trabajo.",
    ],
    includes: [
      "Revisión de las páginas principales y de su estado técnico.",
      "Comprobación de formularios, enlaces y errores visibles.",
      "Revisión en móvil y escritorio de estructura y lectura.",
      "Lectura del rendimiento y de las señales técnicas de SEO.",
      "Localización de lo que conviene mejorar y de lo que conviene dejar.",
      "Informe con prioridades y una propuesta de siguiente paso.",
    ],
    excludes: [
      "No es una auditoría ilimitada ni un plan de SEO continuado.",
      "No incluye la corrección ni el desarrollo de las mejoras.",
      "No rehace el diseño ni migra la web de plataforma.",
      "No garantiza posiciones, tráfico ni ventas.",
      "Contenidos, campañas y acciones de marketing quedan fuera.",
      "Sistemas externos o accesos que no se faciliten quedan fuera.",
    ],
  },
  faqs: [
    {
      q: "¿Reparo mi web o hago una nueva?",
      a: "Depende del estado real. Si la base funciona, reparar y mejorar suele ser más rápido y económico que rehacer. Si la estructura o la plataforma ya no aguantan, lo valoro y te lo digo antes de tocar nada.",
    },
    {
      q: "¿Con qué plataformas trabajas?",
      a: "Habitualmente WordPress, Elementor y WooCommerce, además de webs hechas a medida. Reviso el estado real del sitio antes de proponer una reparación.",
    },
    {
      q: `¿Qué es el ${webRescueDiagnosis.title}?`,
      a: `Es la revisión con la que empieza la reparación. ${webRescueDiagnosis.detail} Sirve para decidir qué reparar, qué mejorar y por dónde empezar.`,
    },
    {
      q: "¿Cuánto cuesta reparar mi web?",
      a: `Una landing con incidencias concretas parte de ${formatPrice(rescueLanding.amount)}. En webs mayores el coste depende de lo que se repare; cierro el presupuesto por escrito después del diagnóstico y antes de tocar nada.`,
    },
    {
      q: "¿Arreglar la web puede perjudicar mi posicionamiento?",
      a: "El objetivo es no perderlo: trabajo con la estructura, las URLs y las redirecciones existentes, y te comento qué cambios pueden afectar al rastreo antes de aplicarlos.",
    },
    {
      q: "¿Trabajas solo en Granada?",
      a: "Trabajo desde Granada con empresas de toda España. La revisión y las correcciones se hacen en remoto.",
    },
  ],
  cta: { label: "Solicitar revisión", type: webRescueCopy.cta.type },
  /** Shared blocks, reused by reference to avoid duplicating rates or texts. */
  steps: webRescueCopy.steps,
  prices: webRescueCopy.prices,
  note: webRescueCopy.note,
} as const;

/**
 * Schema-ready `Offer`s for the public, productized Web Rescue prices. Shared
 * by the Home `Service` and the repair landing page so the same numbers are
 * published once. Only offers with a fixed public amount become `Offer`s;
 * larger repairs are quoted after the review and are not published as a price.
 */
export function webRescueOffers() {
  return webRescueCopy.prices
    .filter((price) => typeof price.amount === "number")
    .map((price) =>
      price.from
        ? {
            "@type": "Offer",
            name: price.title,
            priceCurrency: "EUR",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: price.amount,
              priceCurrency: "EUR",
            },
          }
        : {
            "@type": "Offer",
            name: price.title,
            priceCurrency: "EUR",
            price: price.amount,
          },
    );
}
