# SEO — Technical System

This document covers the SEO implementation and current keyword-intent map. Business hierarchy and language rules live in `POSITIONING.md`; content rules live in `CONTENT.md`.

## Single source of truth

`src/components/SEOHead.astro` owns every `<head>` primitive. Pages do not write raw `<meta>`, canonical, OG or JSON-LD outside their own page-level schema block.

`MainLayout.astro` computes `canonicalURL` from `Astro.url.pathname` and passes `title`, `description`, `canonicalURL`, `ogImage`, `ogImageAlt`, `noindex` and `nofollow` to `SEOHead`. `astro.config.mjs` sets `trailingSlash: "always"`; query strings are not copied into canonical URLs.

## What `SEOHead` emits (current)

| Tag | Source | Notes |
|-----|--------|-------|
| `<title>` | layout `title` | Per-page |
| `<meta name="description">` | layout `description` | Keep ≤ 160 chars |
| `<meta name="robots">` | `index, follow` by default; explicit noindex directives by route | Legal pages: `noindex, follow`; `/404/`: `noindex, nofollow` |
| `<link rel="canonical">` | `canonicalURL` | Honors `astro.config.mjs` `site` |
| `og:type`, `og:locale` (`es_ES`), `og:site_name` (`FRN.Q`) | static | — |
| `og:url`, `og:title`, `og:description`, `og:image` | layout props | Default `ogImage` = `/og-image.png` |
| `og:image:width` / `height` | `1200` / `630` | — |
| `og:image:type` | Derived from the image extension | Default is a 1200×630 PNG; case previews are JPEG |
| Twitter card | `summary_large_image` + mirrored title/description/image and image alt | — |
| favicons | `/favicon.svg`, `/favicon.ico` | — |
| `theme-color` | `#f4f3ef` / `#171715` | Updated to match the persisted light/dark theme |
| `application/ld+json` | `Person` + `WebSite` graph | Person is Francisco Muñoz / FRN.Q, with email, Granada `PostalAddress`, four `knowsAbout` areas and verified GitHub `sameAs`; WebSite publisher points to the Person |

No `<meta name="keywords">`. No geo meta. No fabricated ratings or reviews.

## Canonical and locale

- `site: "https://frnq.es"` in `astro.config.mjs`.
- `<html lang="es">` in `MainLayout`.
- `og:locale = es_ES`.
- frnq.studio is an external link; there is **no** `hreflang` relationship declared between the two sites.

## Sitemap

- Integration: `@astrojs/sitemap`; filter excludes `/404/` and `/legal/`.
- `robots.txt` points to `https://frnq.es/sitemap-index.xml`.
- `robots.txt` allows public pages and disallows `/api/`, which is a POST-only contact endpoint.
- The sitemap contains 11 commercial URLs with the current six published cases: `/`, the three `/soluciones/` routes, `/casos/`, and six `/casos/<slug>/` pages. It has no build-time `lastmod` values.
- Legal pages remain accessible with self canonicals and `noindex, follow`; they are not search-target pages and are excluded from the commercial sitemap. This keeps required policy pages available to visitors without presenting them as organic landing pages.

## Robots / noindex

- Default: `index, follow`.
- `/legal/` and `/legal/privacidad/` use `noindex, follow`: they serve compliance and user-information needs, not a distinct search intent.
- `/404/` uses `noindex, nofollow` and is excluded from the sitemap.

## Open Graph images

- Default: `/og-image.png`, rasterized at 1200×630 from `public/og-image.svg`; keep the SVG source and regenerate the PNG after changing its copy or composition.
- Case pages derive a 1200×630 JPEG from the case `cover` via `getImage` and pass it as `ogImage` (`casos/[slug].astro`); their Open Graph image alt comes from the case cover alt.
- OG and Twitter image-alt values describe the corresponding image. No unverified `twitter:site`/creator profile is declared.
- Case-detail covers have intrinsic dimensions and load eager/high-priority; gallery images are lazy. The case archive eagerly loads its first two cards and lazily loads the rest; home case previews are below the opening content and lazy-loaded inside an aspect-ratio frame. No field LCP/Core Web Vitals data is available, so no unsupported performance changes were made.

## Schema.org (current)

| Page | Type | File |
|------|------|------|
| Every page | `Person` + `WebSite` (`Francisco Muñoz` / `FRN.Q`) | `components/SEOHead.astro` |
| Home | Featured published-work `ItemList` + visible-content `FAQPage` | `pages/index.astro` |
| Each `/soluciones/<slug>/` | One matching `Service`, visible-content `FAQPage` + `BreadcrumbList` (Inicio → solution) | `pages/soluciones/[slug].astro` |
| `/casos/` | Published-work `ItemList` + `BreadcrumbList` | `pages/casos/index.astro` |
| `/casos/<slug>/` | `CreativeWork` + `BreadcrumbList` | `pages/casos/[slug].astro` |

The solution `Service` has a page-specific `@id` and uses the `Person` as provider. Its service area is Spain; Granada remains the Person's location rather than a forced service-area claim on national-intent pages. Solution breadcrumbs contain exactly two levels, because `/#servicios` is a section anchor rather than an independent page. Case `seo.keywords` are editorial data for JSON-LD, not a `<meta name="keywords">` feed. The case year is visible editorial content; structured data does not infer exact dates from it.
No `Organization` is asserted as the primary entity. `LocalBusiness` is not used because there is no verified public street address or business listing to support it. Person location and visible Granada copy provide the truthful local signal.

## Search intent and URL map

| Canonical URL | Primary intent | Target boundary |
|------|------|------|
| `/` | General digital solutions for businesses; brand/entity and contact conversion | Summarizes the four areas without turning the page into a long guide |
| `/soluciones/ecommerce/` | Ecommerce development, Shopify stores and D2C online shops | Storefront/catalogue/checkout; B2B-specific customer pricing stays on the B2B page |
| `/soluciones/b2b/` | B2B order portals, customer accounts, private catalogues/prices | Manufacturers, distributors and wholesalers with professional buyers; platform-agnostic |
| `/soluciones/sistemas/` | ERP/CRM/system integrations and operational workflows | Data flows and internal operations; automation is a supporting capability |
| `/casos/` | Published client/project work | Archive and navigation, not a service landing page |
| `/casos/<slug>/` | Project/client/sector-specific long-tail | Each page targets its own documented project and does not claim ecommerce/B2B outcomes without a published case |
| Home section `#sol-growth` | Web, SEO & Growth, including natural Granada-local relevance | Remains the fourth supporting area; no `/soluciones/web-seo/` page |

Each published case has a unique, factual `seo.title` and `seo.description`. Public case routes and archive entries are filtered to `status: live`. The six current cases have no `serviceArea`, so none is presented as evidence for ecommerce, B2B or systems. KingBelt and Emilio Faraoni remain unpublished; after delivery and documentation, they may set `serviceArea: ecommerce` / `serviceArea: b2b` and appear on the matching solution route with a contextual solution link.

### Demand evidence and limits (reviewed 2026-09-28)

- Live Google Suggest samples showed local-commercial phrasing for `tienda online Granada` and `diseño tienda online Granada`; `shopify Granada` had no suggestion expansion. This supports mentioning Granada naturally, not forcing it into national service titles.
- `pedidos B2B` suggested `sistema de pedidos B2B`, `portal de pedidos B2B` and `plataforma de pedidos B2B`; `tienda online B2B` also appeared. These are distinct, commercially relevant terms for the buyer problem; `portal B2B` alone also returned branded/navigational intent. `ecommerce B2B España` had no suggestion expansion, so it is not treated as a measured seed term.
- `integración ERP` expanded to ERP/CRM, WMS, system and data-integration wording, supporting a distinct integrations route. `conector ERP Shopify` had no suggestion expansion and its SERP was vendor-led, so it is not a primary target.
- Distributor/wholesaler wording was weaker: `software para distribuidores` had little expansion; `software para mayoristas` suggested a wholesale-software variant. These stay supporting use-case language, not dedicated pages.
- Shopify/ecommerce development showed a separate commercial and price-comparison intent; the B2B results were predominantly platform/demo-led. Pages are problem-led, scope-based and do not promise results or list invented prices.
- `diseño web Granada` and `SEO Granada` have local-commercial suggestions, but those terms are more competitive and the offer is secondary; they stay supporting content rather than a broad new landing page.
- Evidence sources: [Google Suggest: pedidos B2B](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=pedidos%20B2B), [Google Suggest: integración ERP](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=integraci%C3%B3n%20ERP), [Google Suggest: tienda online Granada](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=tienda%20online%20Granada), [Google Suggest: Shopify Granada](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=shopify%20Granada), [Google Suggest: diseño web Granada](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=dise%C3%B1o%20web%20Granada), [Shopify B2B commerce](https://www.shopify.com/es-es/plus/solutions/b2b-ecommerce).
- Autocomplete and provider SERP snippets are query/intent evidence, not search volume, CPC, ranking difficulty or proof of traffic. Search Console and paid keyword-tool data were not available.

## Contracts

- One `<h1>` per page; headings are real text.
- `title` unique per page; solution titles ≤ 65 chars and descriptions unique and ≤ 160 chars.
- Canonical must be absolute and match the served URL.
- Do not add schema types without real, verifiable data behind them.
- Do not invent metrics, ratings, reviews or outcomes in structured data.

## Freeze status

**READY FOR INDEXING / FROZEN.** Verified 2026-09-28: `bun test` (3 passing), `bun run check` (0 errors/warnings), `bun run build` (14 static pages). The generated commercial sitemap contains exactly 11 URLs; canonicals, titles, descriptions, robots directives, JSON-LD, page headings, internal routes/fragments and OG image dimensions passed the output audit. The route set is `/`, `/soluciones/ecommerce/`, `/soluciones/b2b/`, `/soluciones/sistemas/`, `/casos/` and the six currently published cases. No blog, city page or `/soluciones/web-seo/` is part of this release. Only post-deployment evidence remains external: Search Console indexing, field Core Web Vitals and backlinks.

## Current semantic territory

The copy may describe ecommerce, Shopify, B2B commerce, portals, private pricing, orders, systems, automation, integrations, data, visibility, measurement, conversion, technical/local SEO, analytics, CRO, accessibility and performance — only where accurate to the page and actual scope. This is not a keyword list.

## Deferred

- `hreflang`: not applicable while frnq.studio is a separate external surface.
- `/soluciones/web-seo/`: deferred; the current site evidence does not justify a distinct broad landing page, and Web/SEO remains a supporting commercial area.
- Search Console indexing, deployed HTTP/status behavior, field Core Web Vitals and backlinks: verify after deployment using Search Console, URL Inspection and field data. The repository contains no measured ranking or traffic data.
