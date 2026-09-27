# SEO — Technical System

This document covers **how SEO is wired**, not a keyword plan. Semantic territory and language rules live in `POSITIONING.md`; content rules live in `CONTENT.md`.

## Single source of truth

`src/components/SEOHead.astro` owns every `<head>` primitive. Pages do not write raw `<meta>`, canonical, OG or JSON-LD outside their own page-level schema block.

`MainLayout.astro` computes `canonicalURL` from `Astro.url.pathname` and passes `title`, `description`, `canonicalURL`, `ogImage` and `noindex` to `SEOHead`.

## What `SEOHead` emits (current)

| Tag | Source | Notes |
|-----|--------|-------|
| `<title>` | layout `title` | Per-page |
| `<meta name="description">` | layout `description` | Keep ≤ 160 chars |
| `<meta name="robots">` | `noindex ? "noindex, nofollow" : "index, follow"` | — |
| `<link rel="canonical">` | `canonicalURL` | Honors `astro.config.mjs` `site` |
| `og:type`, `og:locale` (`es_ES`), `og:site_name` (`FRN.Q`) | static | — |
| `og:url`, `og:title`, `og:description`, `og:image` | layout props | Default `ogImage` = `/og-image.svg` |
| `og:image:width` / `height` | `1200` / `630` | — |
| `og:image:type` | `image/svg+xml` | Matches the default OG asset |
| Twitter card | `summary_large_image` + mirrored title/description/image | — |
| favicons | `/favicon.svg`, `/favicon.ico`, apple-touch | — |
| `theme-color` | `#f4f3ef` / `#171715` | Updated to match the persisted light/dark theme |
| `application/ld+json` | `Organization` | `name: FRN.Q`, `url`, `email`, `PostalAddress` (Granada, ES) |

No `<meta name="keywords">`. No geo meta. No fabricated ratings or reviews.

## Canonical and locale

- `site: "https://frnq.es"` in `astro.config.mjs`.
- `<html lang="es">` in `MainLayout`.
- `og:locale = es_ES`.
- frnq.studio is an external link; there is **no** `hreflang` relationship declared between the two sites.

## Sitemap

- Integration: `@astrojs/sitemap`; filter excludes `/404`.
- `robots.txt` points to `https://frnq.es/sitemap-index.xml`.
- The sitemap contains the public Spanish surface: `/`, `/casos/`, and each `/casos/<slug>/`.

## Robots / noindex

- Default: `index, follow`.
- `/404` is `noindex` (layout prop) and excluded from the sitemap.

## Open Graph images

- Default: `/og-image.svg`.
- Case pages derive a 1200×630 JPEG from the case `cover` via `getImage` and pass it as `ogImage` (`casos/[slug].astro`).

## Schema.org (current)

| Page | Type | File |
|------|------|------|
| Every page | `Organization` (`FRN.Q`) | `components/SEOHead.astro` |
| `/casos/` | `ItemList` + `BreadcrumbList` | `pages/casos/index.astro` |
| `/casos/<slug>/` | `CreativeWork` + `BreadcrumbList` | `pages/casos/[slug].astro` |
| Home (`Projects.astro`) | `ItemList` of cases | `components/Projects.astro` |

Case `seo.keywords` are editorial data for JSON-LD, not a `<meta name="keywords">` feed. `dateCreated` uses the case `year`.

## Contracts

- One `<h1>` per page; headings are real text.
- `description` unique per page and ≤ 160 chars.
- Canonical must be absolute and match the served URL.
- Do not add schema types without real, verifiable data behind them.
- Do not invent metrics, ratings, reviews or outcomes in structured data.

## Current semantic territory

The copy may describe ecommerce, Shopify, B2B commerce, portals, private pricing, orders, systems, automation, integrations, data, visibility, measurement, conversion, technical/local SEO, analytics, CRO, accessibility and performance — only where accurate to the page and actual scope. This is not a keyword list.

## Deferred

- `hreflang`: not applicable while frnq.studio is a separate external surface.
- Dedicated service landing pages: only with a separate product decision.
