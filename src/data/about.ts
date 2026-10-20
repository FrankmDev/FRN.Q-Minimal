/**
 * Structured content for the Home "Estudio" section (About.astro).
 *
 * The intro prose stays in the component (same convention as Hero); the two
 * numbered lists live here so the commercial copy has a single source of
 * truth, like services.ts or web-rescue.ts.
 */

export interface NumberedItem {
  num: string;
  title: string;
  desc: string;
}

/**
 * Advantages of hiring FRN.Q directly, without an agency layer. They repeat the
 * three durable promises of the practice: direct contact, understanding the
 * business first and maintainable systems.
 */
export const directAdvantages: NumberedItem[] = [
  {
    num: "01",
    title: "Trato directo",
    desc: "Sin intermediarios ni cambios de interlocutor: hablas siempre conmigo.",
  },
  {
    num: "02",
    title: "El negocio primero",
    desc: "Empiezo por cómo funciona tu negocio, no por una tecnología ni una plantilla.",
  },
  {
    num: "03",
    title: "Sistemas que puedes mantener",
    desc: "Código, accesos y documentación para que evoluciones sin depender del estudio.",
  },
];

/** Four-phase delivery process shown in the inverted panel. */
export const aboutProcess: NumberedItem[] = [
  {
    num: "01",
    title: "Descubrir y acotar",
    desc: "Analizo el negocio, sus procesos y objetivos para fijar un alcance claro.",
  },
  {
    num: "02",
    title: "Diseñar",
    desc: "Defino estructura y experiencia desde las necesidades del negocio.",
  },
  {
    num: "03",
    title: "Desarrollar",
    desc: "Construyo el producto e integro los sistemas necesarios.",
  },
  {
    num: "04",
    title: "Probar y lanzar",
    desc: "Pruebas, publicación y entrega documentada.",
  },
];
