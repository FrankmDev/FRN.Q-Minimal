---
title: "Emilio Faraoni"
client: "Emilio Faraoni"
category: "b2b"
sector: "Fabricación y distribución mayorista"
year: "2026"
status: "in-development"
publicPreview: true
order: 1
serviceArea: "b2b"
tagline: "Catálogo mayorista y acceso profesional con precios privados, verificación de empresas y solicitudes de pedido."
context: "Emilio Faraoni es una empresa familiar de marroquinería fundada en 1976 en Elche. Fabrica cinturones, bolsos y complementos y trabaja con compradores profesionales."
problem: "El proceso comercial mayorista requiere referencias y variantes ordenadas, validación de compradores, condiciones privadas y solicitudes que pueda gestionar la empresa sin convertir el catálogo en una tienda minorista."
objective: "Construir una base digital comercial para consulta de catálogo y relación con profesionales, con acceso verificado y solicitudes de pedido sin cobro online."
scope:
  - "Catálogo público con categorías, colores y tallas"
  - "Normalización y presentación de referencias e imágenes"
  - "Registro y aprobación de clientes profesionales"
  - "Tarifas privadas con permisos en servidor"
  - "Cesta persistente y solicitudes de pedido"
  - "Gestión administrativa de solicitudes y pedidos"
solution: "Sistema catalog-first con Astro y Supabase que distingue catálogo público, acceso profesional y datos comerciales protegidos. Los usuarios aprobados pueden consultar precios y preparar solicitudes de pedido que se tramitan directamente con la empresa, sin pasarela de pago."
features:
  - title: "Registro y validación profesional"
    description: "Alta de cuentas, documentación de actividad y revisión administrativa antes de permitir el acceso a tarifas."
  - title: "Catálogo estructurado"
    description: "Organización jerárquica de productos y variantes con referencias, colores, tallas e imágenes."
  - title: "Precios protegidos"
    description: "La validación en servidor y las políticas RLS de Supabase restringen el acceso a información comercial."
  - title: "Solicitud de pedido"
    description: "Cesta persistente, registro de solicitudes y avisos internos para revisión y tramitación directa, sin checkout ni pagos online."
decisions:
  - title: "No convertir el mayorista en una tienda D2C"
    description: "El flujo se diseña alrededor de empresas y solicitudes comerciales, no de compras y pagos automáticos."
  - title: "Separar información pública y privada"
    description: "El catálogo sigue siendo visible y los precios solo aparecen tras la autorización profesional."
  - title: "Estructurar los datos desde el inicio"
    description: "Referencias, variantes, categorías e imágenes se gestionan con un modelo central en Supabase para facilitar futuras evoluciones."
result: "El sistema reúne catálogo público, verificación de empresas, tarifas restringidas y preparación de solicitudes de pedido. La implantación y revisión del catálogo siguen en desarrollo, sin atribuir todavía resultados comerciales cuantificados."
technologies:
  - "Astro"
  - "TypeScript"
  - "Supabase"
  - "PostgreSQL"
  - "Vercel"
cover:
  src: "../../assets/projects/emilio-faraoni/cover.avif"
  alt: "Fotografía editorial de Emilio Faraoni y su proyecto de marroquinería"
images:
  - src: "../../assets/projects/emilio-faraoni/detail.avif"
    alt: "Material fotográfico editorial del proyecto Emilio Faraoni"
    caption: "Fotografía editorial de la marca Emilio Faraoni."
seo:
  title: "Emilio Faraoni: catálogo y portal B2B | FRN.Q"
  description: "Caso B2B para Emilio Faraoni: catálogo mayorista, precios privados, aprobación profesional y solicitudes de pedido con Astro y Supabase."
  keywords:
    - "portal B2B mayoristas"
    - "catálogo mayorista privado"
    - "sistema B2B Supabase"
    - "desarrollo portal comercial"
---
