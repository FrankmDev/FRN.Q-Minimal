# FRN.Q Minimal

Sitio estático de FRN.Q construido con Astro y Bun.

**Estado: CURRENT.** La composición e identidad visual de la Home permanecen congeladas. El alcance orgánico incluye páginas estáticas de solución para Ecommerce, B2B y Sistemas & Integraciones.

## Requisitos

- Bun 1.3.14 o compatible.
- Node.js 22.12 o posterior.

## Desarrollo

```sh
bun install
bun run dev
```

## Comandos

| Comando | Acción |
| --- | --- |
| `bun run dev` | Inicia Astro en modo desarrollo. |
| `bun run check` | Ejecuta `astro check` para validar Astro y TypeScript. |
| `bun run lint` | Alias de la validación estática del proyecto. |
| `bun run build` | Genera el sitio estático en `dist/`. |
| `bun run preview` | Sirve localmente el último build. |
| `bun test` | Ejecuta los tests de la API de contacto. |

## Arquitectura

- `src/layouts/` contiene la estructura del documento y la composición global.
- `src/components/SEOHead.astro` concentra los metadatos, SEO y datos estructurados.
- `src/styles/` organiza tokens, tipografía, estilos base, movimiento, composición y utilidades.
- Astro genera HTML estático y la integración de sitemap publica el mapa del sitio.

## CI

GitHub Actions instala con el lockfile congelado, ejecuta `astro check` y crea el build de producción.
