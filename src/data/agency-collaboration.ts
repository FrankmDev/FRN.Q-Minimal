export const agencyCollaboration = {
  path: "/colaboraciones/agencias/",
  meta: {
    title: "Desarrollo técnico para agencias y estudios | FRN.Q",
    description: "Desarrollo frontend, ecommerce Shopify, portales B2B e integraciones para agencias y estudios. Colaboración técnica con alcance y responsabilidades acordados.",
  },
  title: "Desarrollo técnico para agencias.",
  description: "Amplía tu capacidad de producción sin ampliar plantilla.",
  capabilities: [
    { number: "01", title: "Frontend a medida", detail: "Astro · TypeScript · interfaces y experiencias web" },
    { number: "02", title: "Ecommerce", detail: "Shopify · storefronts · catálogo y flujos de compra" },
    { number: "03", title: "Portales B2B", detail: "Acceso profesional · precios privados · pedidos" },
    { number: "04", title: "Integraciones", detail: "Sistemas delimitados · datos · herramientas existentes" },
    { number: "05", title: "Optimización técnica", detail: "Rendimiento · accesibilidad · SEO técnico" },
  ],
  collaborationModes: [
    { number: "A", title: "White-label", detail: "Ejecución técnica bajo la marca de la agencia, si así se acuerda." },
    { number: "B", title: "Subcontratación", detail: "Un alcance técnico definido dentro del proyecto de la agencia." },
    { number: "C", title: "Ejecución conjunta", detail: "Coordinación directa con el equipo y responsabilidades acordadas." },
  ],
  delivery: [
    "Alcance y responsabilidades definidos antes de empezar.",
    "Comunicación directa durante la ejecución.",
    "Entregables comprobables, QA y documentación del trabajo.",
  ],
  relationship: [
    "Confidencialidad y uso de la información del cliente.",
    "Relación agencia-cliente: interlocución y contacto directo solo en los términos acordados.",
    "Quién decide, entrega y mantiene cada parte.",
    "Créditos, visibilidad y condiciones de colaboración.",
  ],
  process: [
    { number: "01", title: "Envía el briefing", detail: "Contexto, alcance previsto, equipo y calendario deseado." },
    { number: "02", title: "Revisamos el encaje", detail: "Valoro el reto técnico y la forma de coordinación." },
    { number: "03", title: "Acordamos alcance", detail: "Si encaja, concretamos responsabilidades y propuesta por escrito." },
    { number: "04", title: "Desarrollo y coordinación", detail: "Implemento lo acordado y comparto avances para su revisión." },
    { number: "05", title: "QA y entrega", detail: "Pruebas del alcance, revisión contigo y entrega de código, accesos y documentación acordados." },
  ],
  contactType: "agencia",
} as const;
