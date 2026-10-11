# SEO — Technical System

This document covers the SEO implementation and current keyword-intent map. Business hierarchy and language rules live in `POSITIONING.md`; content rules live in `CONTENT.md`.

## Single source of truth

`src/components/SEOHead.astro` owns every `<head>` primitive. Pages do not write raw `<meta>`, canonical, OG or JSON-LD outside their own page-level schema block.

`MainLayout.astro` computes `canonicalURL` from `Astro.url.pathname` and passes `title`, `description`, `canonicalURL`, `ogImage`, `ogImageAlt`, `noindex` and `nofollow` to `SEOHead`. `astro.config.mjs` sets `trailingSlash: "always"` and `vercel.json` mirrors it with `"trailingSlash": true` so the host enforces the same normalization; query strings are not copied into canonical URLs.

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
| `application/ld+json` | `Person` + `Brand` + `WebSite` graph | The Person is Francisco Muñoz; FRN.Q is the practice's brand. Person location is Granada without a street address or coordinates; four service areas and verified GitHub `sameAs` are linked. WebSite publisher/creator points to the Person and its subject is the Brand. |

No `<meta name="keywords">`. No geo meta. No fabricated ratings or reviews.

## Canonical and locale

- `site: "https://frnq.es"` in `astro.config.mjs`.
- `<html lang="es">` in `MainLayout`.
- `og:locale = es_ES`.
- frnq.studio is an external link; there is **no** `hreflang` relationship declared between the two sites.

## Canonical host, HTTPS and trailing slashes

- **Canonical host is the apex `frnq.es`** (never `www.frnq.es`). `astro.config.mjs` (`site`), `src/data/site.ts` (`url`), the canonicals/`og:url` emitted by `SEOHead.astro`, the JSON-LD graph and `public/robots.txt` all use `https://frnq.es`. No absolute production URL may use `www` or `http://`.
- The apex ↔ `www` redirect is a **Vercel project domain setting**, not a repository concern. In Vercel the primary domain must be `frnq.es`, with `www.frnq.es` redirecting to it permanently. Do **not** encode the `www` → apex redirect in `vercel.json`: it would conflict with the panel rule and risk a redirect loop.
- HTTPS is enforced by Vercel: `http://` responds with a permanent `308` to the matching `https://` URL and `Strict-Transport-Security` is sent.
- Trailing slashes: `astro.config.mjs` `trailingSlash: "always"` and `vercel.json` `"trailingSlash": true` agree, so the host issues a permanent `308` from `/casos` to `/casos/` (paths with a file extension are unaffected). Canonicals and internal links already use the trailing-slash form, so no internal link passes through a redirect.

## Sitemap

- Integration: `@astrojs/sitemap`; filter excludes `/404/` and `/legal/`.
- `robots.txt` points to `https://frnq.es/sitemap-index.xml`.
- `robots.txt` allows public pages and disallows `/api/`, which is a POST-only contact endpoint.
- The sitemap contains 16 commercial URLs with the current ten published cases: `/`, the four `/soluciones/` routes (`ecommerce`, `b2b`, `sistemas`, `desarrollo-web`), `/casos/`, and ten `/casos/<slug>/` pages. It has no build-time `lastmod` values.
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

The solution `Service` has a page-specific `@id`, uses the `Person` as provider and references the FRN.Q `Brand`; its declared service area is Spain. Granada remains the Person's city, not a forced service-area claim on national-intent pages. Solution breadcrumbs contain exactly two levels, because `/#servicios` is a section anchor rather than an independent page. Case `seo.keywords` are editorial data for JSON-LD, not a `<meta name="keywords">` feed. The case year is visible editorial content; structured data does not infer exact dates from it.
No `Organization` or `LocalBusiness` is asserted: there is no verified public office, street address or listing. Do not publish the approximate city-centre coordinates as the person's location. Person location and visible Granada copy provide the truthful local signal; the legal notice gives the titular and city-level domicile without inventing a street address.

Google Business Profile is an external eligibility decision, not a site schema target. Do not create or claim a profile for an online-only business with no in-person customer contact. If the business is eligible as a service-area business, use the real-world name and service area, and hide the address if customers are not received there. Never invent a public office, phone, hours, reviews or service areas.

## Search intent and URL map

| Canonical URL | Primary intent | Target boundary |
|------|------|------|
| `/` | Ecommerce, B2B portals and corporate web for businesses; brand/entity and contact conversion | Summarizes the four areas without turning the page into a long guide |
| `/soluciones/ecommerce/` | Ecommerce development, Shopify stores and D2C online shops | Storefront/catalogue/checkout; B2B-specific customer pricing stays on the B2B page |
| `/soluciones/b2b/` | B2B order portals, customer accounts, private catalogues/prices | Manufacturers, distributors and wholesalers with professional buyers; platform-agnostic |
| `/soluciones/sistemas/` | ERP/CRM/system integrations and operational workflows | Data flows and internal operations; automation is a supporting capability |
| `/casos/` | Published client/project work | Archive and navigation, not a service landing page |
| `/soluciones/desarrollo-web/` | Corporate and custom web design/development, technical SEO, performance, accessibility and measurement | One canonical page covers national and Granada-local relevance; no city or doorway page. B2B portals stay on the B2B page, integrations on systems |
| `/casos/<slug>/` | Project/client/sector-specific long-tail | Each page targets its own documented project and does not claim ecommerce/B2B outcomes without a published case |
| Home section `#sol-growth` | Web corporativa & SEO overview, linking to the canonical page | Remains the fourth commercial area; the dedicated route carries the search intent |

Each published case has a unique, factual `seo.title` and `seo.description`. Public case routes and archive entries include `status: live` plus authorised `in-development` entries (`publicPreview: true`). `kingbelt` sets `serviceArea: ecommerce` and `emilio-faraoni` sets `serviceArea: b2b`, so the matching solution routes list them as evidence with a contextual solution link. `/soluciones/desarrollo-web/` adds corporate/web/website cases (including `asercord-energia`, `cien-mares`, `lucia-millan-psicologia`, `wanda-animalart` and `ilifielt`) as evidence by `category` without asserting an unverified `serviceArea`; those cases link back to it from their own detail page.

### Demand evidence and limits (reviewed 2026-09-28)

- Live Google Suggest samples showed local-commercial phrasing for `tienda online Granada` and `diseño tienda online Granada`; `shopify Granada` had no suggestion expansion. This supports mentioning Granada naturally, not forcing it into national service titles.
- `pedidos B2B` suggested `sistema de pedidos B2B`, `portal de pedidos B2B` and `plataforma de pedidos B2B`; `tienda online B2B` also appeared. These are distinct, commercially relevant terms for the buyer problem; `portal B2B` alone also returned branded/navigational intent. `ecommerce B2B España` had no suggestion expansion, so it is not treated as a measured seed term.
- `integración ERP` expanded to ERP/CRM, WMS, system and data-integration wording, supporting a distinct integrations route. `conector ERP Shopify` had no suggestion expansion and its SERP was vendor-led, so it is not a primary target.
- Distributor/wholesaler wording was weaker: `software para distribuidores` had little expansion; `software para mayoristas` suggested a wholesale-software variant. These stay supporting use-case language, not dedicated pages.
- Shopify/ecommerce development showed a separate commercial and price-comparison intent; the B2B results were predominantly platform/demo-led. Pages are problem-led, scope-based and do not promise results or list invented prices.
- `diseño web Granada` and `SEO Granada` have local-commercial suggestions, but those terms are more competitive. The decision (2026-10-08) was to fold local Granada relevance into the single corporate-web route as natural copy rather than create a city page or a separate local landing page.
- Evidence sources: [Google Suggest: pedidos B2B](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=pedidos%20B2B), [Google Suggest: integración ERP](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=integraci%C3%B3n%20ERP), [Google Suggest: tienda online Granada](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=tienda%20online%20Granada), [Google Suggest: Shopify Granada](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=shopify%20Granada), [Google Suggest: diseño web Granada](https://suggestqueries.google.com/complete/search?client=firefox&hl=es&q=dise%C3%B1o%20web%20Granada), [Shopify B2B commerce](https://www.shopify.com/es-es/plus/solutions/b2b-ecommerce).
- Autocomplete and provider SERP snippets are query/intent evidence, not search volume, CPC, ranking difficulty or proof of traffic. Search Console and paid keyword-tool data were not available.

## Contracts

- One `<h1>` per page; headings are real text.
- `title` unique per page; solution titles ≤ 65 chars and descriptions unique and ≤ 160 chars.
- Canonical must be absolute and match the served URL.
- Do not add schema types without real, verifiable data behind them.
- Do not invent metrics, ratings, reviews or outcomes in structured data.

## Freeze status

**READY FOR INDEXING / FROZEN.** Verified 2026-09-28 (base surface), re-verified 2026-10-08 (corporate-web route) and 2026-10-10 (case media refresh). The 2026-10-11 content/SEO pass broadened the web offer without changing the Home H1 or composition, realigned solution metadata and added corporate-web typologies and contact events. The closure audit made measurement/editing conditional on scope, labelled in-development solution evidence, identified GRN Urban as FRN.Q's own product/SEO laboratory and corrected route-context, consent, 429 and conversion-accounting issues. Analytics still has no external provider; see `DEVELOPMENT.md` for activation and consent requirements.

Verification: `bun test` (38 passing, including offline enhanced-submit flows), `bun run check` (0 diagnostics) and `bun run build` (19 static pages). The commercial sitemap contains 16 URLs; output checks cover unique metadata, apex canonicals, robots, one H1 per page, 55 valid JSON-LD blocks, 23 matching FAQ question/answer pairs, internal routes/fragments, an exact 19-path analytics allowlist and distinct solution CTA placements. CSS, scoped styles, assets, API/contract, legal pages, domain configuration and the Home/Hero source remain unchanged in the closure audit; no pixel-identical geometry is asserted after copy changes. The existing OG image dimensions were verified in the preceding output audit and the assets were not changed. No new routes, blog or doorway pages were added. Production email delivery, authenticated portal data, Search Console indexing, field Core Web Vitals and backlinks remain external verification; the portal's canonical HTTPS failure is documented in `PRODUCT.md`.

### Host and redirect audit — 2026-10-11

Re-checked against real production HTTP. The previous 2026-10-08 Vercel primary-domain mismatch is resolved; no repository domain, redirect or canonical changes are needed.

- `https://frnq.es/` returns `200`; `https://www.frnq.es/` permanently redirects (`308`) to the apex. Live canonicals, `og:url`, JSON-LD, sitemap and `robots.txt` use `https://frnq.es`.
- Live directives confirmed: `index, follow` on Home, `/casos/` and the `/soluciones/` routes; `noindex, follow` on `/legal/` and `/legal/privacidad/`; `noindex, nofollow` on `/404/`; `Disallow: /api/`. Unknown paths return `404` and `/api/contact` is not crawlable.
- HTTP and non-slash routes permanently redirect (`308`) to the HTTPS/trailing-slash form. Unknown routes and `/404/` return `404`; the commercial sitemap still contains 16 URLs.

## Current semantic territory

The copy may describe ecommerce, Shopify, B2B commerce, portals, private pricing, orders, systems, automation, integrations, data, corporate and custom web design/development, web architecture, frontend, visibility, measurement, conversion, technical/local SEO, analytics, CRO, accessibility and performance — only where accurate to the page and actual scope. This is not a keyword list.

## Deferred

- `hreflang`: not applicable while frnq.studio is a separate external surface.
- `/soluciones/web-seo/` as a separate URL: not created. The corporate-web intent lives in `/soluciones/desarrollo-web/`; a second, overlapping SEO landing page would duplicate it.
- City/local pages (e.g. `/desarrollo-web-granada/`): not created. Granada relevance is covered inside the single canonical page to avoid doorway pages.
- Search Console indexing, deployed HTTP/status behavior, field Core Web Vitals and backlinks: verify after deployment using Search Console, URL Inspection and field data. The repository contains no measured ranking or traffic data.
