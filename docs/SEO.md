# SEO — Technical System

This document covers the SEO implementation and current keyword-intent map. Business hierarchy and language rules live in `POSITIONING.md`; content rules live in `CONTENT.md`.

## Single source of truth

`src/components/SEOHead.astro` owns every `<head>` primitive. Pages do not write raw `<meta>`, canonical, OG or JSON-LD outside their own page-level schema block.

`MainLayout.astro` computes `canonicalURL` from `Astro.url.pathname` and passes `title`, `description`, `canonicalURL`, `ogImage`, `ogImageAlt` and `noindex` to `SEOHead`.

## What `SEOHead` emits (current)

| Tag | Source | Notes |
|-----|--------|-------|
| `<title>` | layout `title` | Per-page |
| `<meta name="description">` | layout `description` | Keep ≤ 160 chars |
| `<meta name="robots">` | `noindex ? "noindex, nofollow" : "index, follow"` | — |
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

- Integration: `@astrojs/sitemap`; filter excludes `/404` and `/legal/`.
- `robots.txt` points to `https://frnq.es/sitemap-index.xml`.
- `robots.txt` allows public pages and disallows `/api/`, which is a POST-only contact endpoint.
- The sitemap contains the indexable commercial surface: `/`, the three `/soluciones/` routes, `/casos/`, and each published `/casos/<slug>/`.
- Legal pages remain accessible and indexable, with self canonicals, but are excluded from the commercial sitemap and keyword map.

## Robots / noindex

- Default: `index, follow`.
- `/404` is `noindex` (layout prop) and excluded from the sitemap.

## Open Graph images

- Default: `/og-image.png`, rasterized at 1200×630 from `public/og-image.svg`; keep the SVG source and regenerate the PNG after changing its copy or composition.
- Case pages derive a 1200×630 JPEG from the case `cover` via `getImage` and pass it as `ogImage` (`casos/[slug].astro`); their Open Graph image alt comes from the case cover alt.
- OG and Twitter image-alt values describe the corresponding image. No unverified `twitter:site`/creator profile is declared.

## Schema.org (current)

| Page | Type | File |
|------|------|------|
| Every page | `Person` + `WebSite` (`Francisco Muñoz` / `FRN.Q`) | `components/SEOHead.astro` |
| Home | Four visible `Service` nodes (`provider` = Person; Granada + Spain) | `pages/index.astro` |
| Each `/soluciones/<slug>/` | Matching `Service`, visible-content `FAQPage` + `BreadcrumbList` | `pages/soluciones/[slug].astro` |
| `/casos/` | `ItemList` + `BreadcrumbList` | `pages/casos/index.astro` |
| `/casos/<slug>/` | `CreativeWork` + `BreadcrumbList` | `pages/casos/[slug].astro` |
| Home | Featured-project `ItemList` | `pages/index.astro` |

Case `seo.keywords` are editorial data for JSON-LD, not a `<meta name="keywords">` feed. The case year is visible editorial content; structured data does not infer exact dates from it.
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

Each published case has a unique, factual `seo.title` and `seo.description`. KingBelt and Emilio Faraoni remain unpublished; once complete, their cases can set `serviceArea: ecommerce` / `serviceArea: b2b` and appear automatically on the matching solution route.

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

## Current semantic territory

The copy may describe ecommerce, Shopify, B2B commerce, portals, private pricing, orders, systems, automation, integrations, data, visibility, measurement, conversion, technical/local SEO, analytics, CRO, accessibility and performance — only where accurate to the page and actual scope. This is not a keyword list.

## Deferred

- `hreflang`: not applicable while frnq.studio is a separate external surface.
- `/soluciones/web-seo/`: deferred; the current site evidence does not justify a distinct broad landing page, and Web/SEO remains a supporting commercial area.
- Local ranking, HTTP status/redirect behavior and Core Web Vitals: verify on the deployed domain with Search Console, URL Inspection and PageSpeed Insights. The repository contains no measured traffic or field data.
