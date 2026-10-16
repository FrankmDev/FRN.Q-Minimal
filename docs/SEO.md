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
- The sitemap contains 23 commercial URLs with the current ten published cases: `/`, the four `/soluciones/` routes (`ecommerce`, `b2b`, `sistemas`, `desarrollo-web`), `/soluciones/revision-web/`, `/precios/`, `/soporte/`, `/guias/` and its two guides, `/colaboraciones/agencias/`, `/casos/`, and ten `/casos/<slug>/` pages. It has no build-time `lastmod` values.
- Legal pages remain accessible with self canonicals and `noindex, follow`; they are not search-target pages and are excluded from the commercial sitemap. This keeps required policy pages available to visitors without presenting them as organic landing pages.

## Robots / noindex

- Default: `index, follow`.
- `/legal/` and `/legal/privacidad/` use `noindex, follow`: they serve compliance and user-information needs, not a distinct search intent.
- `/404/` uses `noindex, nofollow` and is excluded from the sitemap.

## Open Graph images

- Default: `/og-image.png`, rasterized at 1200×630 from `public/og-image.svg`; keep the SVG source and regenerate the PNG after changing its copy or composition.
- Case pages derive a 1200×630 JPEG from the case `cover` via `getImage` and pass it as `ogImage` (`casos/[slug].astro`); their Open Graph image alt comes from the case cover alt.
- OG and Twitter image-alt values describe the corresponding image. No unverified `twitter:site`/creator profile is declared.
- Case-detail covers have intrinsic dimensions and load eager/high-priority; gallery images are lazy. The case archive eagerly loads its first two cards and lazily loads the rest; home case previews have responsive `srcset`/`sizes`, intrinsic dimensions and lazy loading inside an aspect-ratio frame. No field LCP/Core Web Vitals data or measured performance improvement is claimed.

## Schema.org (current)

| Page | Type | File |
|------|------|------|
| Every page | `Person` + `Brand` + `WebSite` (`Francisco Muñoz` / `FRN.Q`) | `components/SEOHead.astro` |
| Home | Featured published-work `ItemList` + visible-content `FAQPage` + Web Rescue `Service` (offers with public prices) | `pages/index.astro` |
| Each `/soluciones/<slug>/` | One matching `Service`, visible-content `FAQPage` + `BreadcrumbList` (Inicio → solution) | `pages/soluciones/[slug].astro` |
| `/soluciones/revision-web/` | Repair `Service` with two public `Offer`s + visible-content `FAQPage` + `BreadcrumbList` | `pages/soluciones/revision-web.astro` |
| `/colaboraciones/agencias/` | Collaboration `Service` + `BreadcrumbList` | `pages/colaboraciones/agencias/index.astro` |
| `/casos/` | Published-work `ItemList` + `BreadcrumbList` | `pages/casos/index.astro` |
| `/casos/<slug>/` | `CreativeWork` + `BreadcrumbList` | `pages/casos/[slug].astro` |
| `/soporte/` | `Service` with CARE minimum monthly `Offer` + visible-content `FAQPage` + `BreadcrumbList` (Inicio → Soporte) | `pages/soporte/index.astro` |
| `/precios/` | `OfferCatalog` (only offers with a published amount) + visible-content `FAQPage` + `BreadcrumbList` (Inicio → Precios) | `pages/precios/index.astro` |
| `/guias/` | Guide `ItemList` + `BreadcrumbList` | `pages/guias/index.astro` |
| `/guias/<slug>/` | `Article` + `BreadcrumbList`, with authored editorial dates | `pages/guias/[slug].astro` |

The price catalog distinguishes fixed `price` from starting `minPrice`; CARE is a `UnitPriceSpecification` with `billingDuration: "P1M"` both here and on support, with taxes excluded. No offer asserts inventory/availability or fabricated results. All public amounts come from `data/pricing.ts`. FAQ markup matches the visible native disclosure content; valid FAQ schema is not a promise of a Google rich result.

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
| `/colaboraciones/agencias/` | Technical development collaboration and white-label delivery for agencies and studios | Reinforcement or delegated execution with agreed scope, review and delivery; no implied larger team or public agency-client takeover |
| `/casos/` | Published client/project work | Archive and navigation, not a service landing page |
| `/soluciones/desarrollo-web/` | Corporate and custom web design/development: creating or redesigning a website, technical SEO, performance, accessibility and measurement | Design/development intent (new or rebuilt sites). Repairing, recovering or improving an existing site is the dedicated `/soluciones/revision-web/` route; B2B portals stay on the B2B page, integrations on systems |
| `/soluciones/revision-web/` | Repairing, updating, recovering and improving a website that already exists (WordPress, Elementor, WooCommerce or custom); bugs, forms, responsive, performance and technical SEO of a live site | Fixing and improving an existing site without rebuilding it; creating or redesigning a site stays on `/soluciones/desarrollo-web/` |
| `/casos/<slug>/` | Project/client/sector-specific long-tail | Each page targets its own documented project and does not claim ecommerce/B2B outcomes without a published case |
| `/guias/` | Editorial index of decision-support guides | Navigation and topic hub only; it does not compete with the service pages |
| `/guias/reparar-o-rehacer-una-web/` | Pre-hire question: repair vs rebuild an existing website | Decision criteria and risk; the service offer and prices stay on `/` (`#revision-web`), `/soluciones/revision-web/` and `/soluciones/desarrollo-web/` |
| `/guias/cuanto-cuesta-una-web-profesional/` | Pre-hire question: what forms the price of a professional website | Explains the drivers of scope and cost; it publishes no price list, so it does not compete with the scoped proposal |
| Home section `#sol-growth` | Web corporativa & SEO overview, linking to the canonical page | Presented first on the Home as the priority feature plate; the dedicated route carries the search intent |
| Home section `#revision-web` | Web review and repair (WordPress, Elementor, WooCommerce), local Granada business use cases | A single productized entry block on the Home; its detail, process and offers continue on `/soluciones/revision-web/` |
| `/soporte/` | Post-launch maintenance, minor changes and evolution of existing sites and systems | Continuity service, scope agreed in writing. No unlimited support or generic response times; the public CARE starting point (from 49 €/mes) is read from `pricing.ts`; evolution, SEO, data and integrations quoted through a specific agreement |
| `/precios/` | Price and budget research: what a web, a store, maintenance or a repair costs before contacting | Scope-specific starting points and the Web Rescue entry offers read from `pricing.ts`; B2B, systems, integrations and custom ecommerce stay discovery-led, with no published figure |

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

## Verification history

The following records preserve the scope and counts **at the time of each pass**; they are not the current output totals. The current closure is recorded below. Earlier Home copy, route counts and pending-consent notes are historical, not implementation instructions.

**READY FOR INDEXING / FROZEN.** Verified 2026-09-28 (base surface), re-verified 2026-10-08 (corporate-web route) and 2026-10-10 (case media refresh). The 2026-10-11 content/SEO pass broadened the web offer without changing the Home H1 or composition, realigned solution metadata and added corporate-web typologies and contact events. The closure audit made measurement/editing conditional on scope, labelled in-development solution evidence, identified GRN Urban as FRN.Q's own product/SEO laboratory and corrected route-context, consent, 429 and conversion-accounting issues. Analytics added the navigation events (`page_view`, `solution_view`, `case_view`) and a consent-gated GA4 wiring, but no Measurement ID or CMP exists yet, so nothing is measured in production; see `DEVELOPMENT.md` for activation and consent requirements.

Verification: `bun test` (38 passing, including offline enhanced-submit flows), `bun run check` (0 diagnostics) and `bun run build` (19 static pages). The commercial sitemap contains 16 URLs; output checks cover unique metadata, apex canonicals, robots, one H1 per page, 55 valid JSON-LD blocks, 23 matching FAQ question/answer pairs, internal routes/fragments, an exact 19-path analytics allowlist and distinct solution CTA placements. CSS, scoped styles, assets, API/contract, legal pages, domain configuration and the Home/Hero source remain unchanged in the closure audit; no pixel-identical geometry is asserted after copy changes. The existing OG image dimensions were verified in the preceding output audit and the assets were not changed. No new routes, blog or doorway pages were added. Production email delivery, authenticated portal data, Search Console indexing, field Core Web Vitals and backlinks remain external verification; the portal's canonical HTTPS failure is documented in `PRODUCT.md`.

### Web Rescue and Granada pass — 2026-10-12

Business Plan & Pricing V3.1 update. The Home keeps its composition, Hero H1 ("Ecommerce y B2B") and visual system, and gains one block: **Revisión y reparación web** (`#revision-web`) with the public Web Rescue offers (Diagnóstico Web 360 99 €, landing repair from 299 €, larger repairs quoted after the review), the process Diagnóstico → Presupuesto → Reparación → Verificación and a discreet Granada use-case block. The Hero subtext now states the three outcomes (presencia digital, canales de venta, sistemas conectados) without income guarantees.

- Home metadata: title unchanged; description now names the repair offer.
- New `Service` (`#revision-web`) on Home with `Offer`s for the two public prices; visible content matches the schema. No rating, review or outcome claims.
- `/soluciones/desarrollo-web/` title/description/intro, typologies, capabilities and FAQ add repair/recovery of existing sites (WordPress, Elementor, WooCommerce) and reference the diagnosis by name.
- Contact contract adds the type `reparacion` ("Reparación / mejora web") and the budget "Hasta 500 €". The Home CTA "Revisar mi web" opens the form with that type preselected; a `?tipo=<known value>` deep link does the same and strips the parameter. The corporate-web typologies section links to the same offer with `/?tipo=reparacion#contacto`. The API still validates the value; no money or PII is added to analytics.
- No new routes, city pages or sector pages were added. The sitemap still contains 16 URLs.

Verification: `bun test` (40 passing, including two type-preselection cases), `bun run check` (0 diagnostics across 38 files) and `bun run build` (19 static pages). Output checks: one H1 per page, unique titles/descriptions within limits, absolute apex canonicals, no broken internal links or fragments, `#revision-web` present, 56 valid JSON-LD blocks and 25 matching FAQ question/answer pairs. Responsive, accessibility and form-flow checks are code-level; there is no browser automation by policy.

### Repair landing page — 2026-10-16

Adds `/soluciones/revision-web/` as a dedicated repair-intent route for businesses that need to fix, update, recover or improve an existing website without rebuilding it. It reuses the shared Web Rescue data (`src/data/web-rescue.ts`): process, offers and note are read from `webRescueCopy`, the diagnosis from `webRescueDiagnosis` and the public `Offer`s from `webRescueOffers`, so no rate or block text is duplicated.

- Intent boundary: `/soluciones/revision-web/` covers repairing a live site (bugs, forms, responsive, performance, technical SEO, broken functions); creating or redesigning a site stays on `/soluciones/desarrollo-web/`. The `#revision-web` Home block links here for detail.
- Offers match the visible content: Diagnóstico Web 360 (99 €, discounted from an eligible repair within 30 days) as an accent plate, landing repair (from 299 €) and larger repairs quoted after the review. The `Service` publishes the same two `Offer`s as the Home block.
- Diagnosis scope is explicit (what it includes and what it excludes) on a dedicated inverted panel.
- CTA "Solicitar revisión" opens the shared Home form with `?tipo=reparacion#contacto`, pre-selecting "Reparación / mejora web". A unit test pins the contract (`reparacion` type, shared price/process references, 30-day discount).
- Contextual links: Home `#revision-web` block, `/soluciones/desarrollo-web/` repair section and the footer.

Verification (isolated worktree at the current commit): `bun test` (44 passing), `bun run check` (0 errors, 40 files) and `bun run build` (20 pages, +1 route). Output checks on `/soluciones/revision-web/`: one H1, unique 46-char title, 154-char description, apex canonical with trailing slash, and `Service` + 2 `Offer` + `BreadcrumbList` + `FAQPage` (6 Q/A) JSON-LD coherent with the visible prices.

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

### Guides and organic-capture audit — 2026-10-16

Added a lightweight `/guias/` section: two editorial, decision-support articles built with Astro Content Collections (`guias`), no CMS, pagination or category archive. `/guias/` lists them with `ItemList` + `BreadcrumbList`; each guide uses `render()` with an `Article` schema (`datePublished`, `dateModified`, `articleSection`) and an Inicio → Guías → guide `BreadcrumbList`. Guides publish no price list and currently carry a single CTA each: `reparar-o-rehacer-una-web` → contact with type `reparacion`; `cuanto-cuesta-una-web-profesional` → contact.

Internal linking: both routes are linked from the footer on every page (no orphan pages), each guide links to the other and to `/soluciones/desarrollo-web/`, and `MainLayout` adds `/guias/` and each guide to the analytics route allowlist. Both routes are included in the sitemap and allowed by `robots.txt`.

Audit of the existing surface (code + build output, no Search Console): one `<h1>` per page, unique titles, descriptions ≤ 160 characters, absolute apex canonicals, correct `index`/`noindex` directives, no broken internal links or fragments, and `Article`/`Service`/`CreativeWork`/`ItemList`/`FAQPage`/`BreadcrumbList` JSON-LD parsing cleanly. Granada remains a natural signal on `/` and `/soluciones/desarrollo-web/` (no city or doorway page). Observations without ranking data: (1) repair intent now overlaps between `/soluciones/desarrollo-web/` and `/soluciones/revision-web/` and the Home `#revision-web` block — a hypothesis to re-check in Search Console, not a measured cannibalisation; (2) no dedicated pricing page existed at that review; a public price reference (`/precios/`) was added later the same day (see the Precios pass below).

Verification for this pass: `bun run check` (0 diagnostics) and `bun run build` (25 static pages, including `/guias/` and both guides). Output checks: sitemap contains `/guias/`, `/guias/reparar-o-rehacer-una-web/` and `/guias/cuanto-cuesta-una-web-profesional/`; canonicals match the served paths; zero broken internal links/fragments; one H1 per page. No Search Console, ranking, traffic or field-data claims are made. Responsive and accessibility checks are code-level only (no browser automation by policy).

### Home commercial reorganization — 2026-10-16

Reorganises the Home to capture web work first while keeping the four commercial areas intact. The Hero H1 becomes "WEB, COMERCIO Y SISTEMAS." with the primary CTA "Cuéntame qué necesitas" (to the form) and the secondary "Ver proyectos" (to `/casos/`). Home metadata now leads with design and development web alongside ecommerce and B2B.

- `src/data/services.ts` reorders the four areas (Home order: Web corporativa & SEO, Ecommerce & Shopify, Portales & Sistemas B2B, Sistemas & Integraciones) and adds a one-line `problem` per area. The public labels, `problems[]` and `includes[]` are unchanged, so the solution routes' eyebrow, breadcrumb, `Service` name and evidence selection are unaffected.
- `Services.astro` presents the first area as a full-width accent feature plate and the rest as a ruled commercial index; each entry states one problem, one outcome and a link to its solution page. Panel anchors `#sol-growth`, `#sol-ecommerce`, `#sol-b2b` and `#sol-sistemas` are preserved.
- The `#revision-web` Web Rescue block keeps its role as the fast entry offer and links to the existing `/soluciones/revision-web/` route; no new route was added on the Home. About and Contact copy were trimmed to remove overlap with the Hero.
- One `<h1>` per page preserved; each section keeps an `h2` and service entries use `h3`.

Verification: `bun test` (56 passing), `bun run check` (0 errors, 0 warnings) and `bun run build` (26 pages). Output checks: one H1 on the Home, all four `#sol-*` anchors present, the Hero CTA targets `#contacto` and the secondary action targets `/casos/`, and every internal link/fragment resolves. Responsive and accessibility checks are code-level only (no browser automation by policy).

### Precios reference — 2026-10-16

Adds `/precios/` (`pages/precios/index.astro`) as the public price reference, driven by the new `src/data/pricing.ts`. The page groups the offers by solution and scope (Ecommerce & Shopify, Portales & Sistemas B2B, Sistemas & Integraciones, Web corporativa & SEO, Mantenimiento y soporte, Revisión y reparación web), distinguishes **precio de partida**, **alcance definido** and **presupuesto personalizado**, states the written conditions on scope changes, external costs, taxes and maintenance, answers the pricing/payment FAQ and closes with the "Pedir propuesta" CTA.

- Published amounts (all read from `pricing.ts`): START from 690 €, STUDIO from 990 €, PRESENCE from 1.390 €, BUSINESS from 1.990 €, SHOPIFY from 3.190 € and CARE from 49 €/mes, plus the Web Rescue entry offers (Diagnóstico Web 360 99 €, landing repair from 299 €). B2B portals, systems, integrations and custom ecommerce stay discovery-led and render "Presupuesto" with no figure.
- Schema: `OfferCatalog` (only offers with a real published amount) + visible-content `FAQPage` + `BreadcrumbList` (Inicio → Precios). The visible price and the `minPrice` come from the same module, so a visible amount cannot drift from its structured data. No rating, review or outcome claim.
- Single source of truth: `web-rescue.ts` now reads its entry offers from `pricing.ts`, so the Home `#revision-web` block, `/soluciones/revision-web/` and the corporate-web FAQ share the same numbers. Any amount literal was removed from metadata and FAQ copy.
- Links: footer nav ("Precios"), the Services footer ("Precios públicos"), each `/soluciones/` related nav and the `/soporte/` related nav; `/precios/` links back to the four solution routes. `MainLayout` adds `/precios/` to the analytics route allowlist.

Verification: `bun test` (56 passing), `bun run check` (0 errors, 0 warnings, 51 files) and `bun run build` (26 static pages; sitemap 23 URLs). Output checks on `/precios/`: one H1, 32-char title, 142-char description, apex canonical with trailing slash, 4 JSON-LD blocks, 8 `Offer`s whose `minPrice` values (690, 990, 1390, 1990, 3190, 49, 99, 299) match the 8 visible amounts exactly, and the four discovery-led rows publish no figure. Four-digit amounts use the `.` group separator, consistent with the site's existing "2.000 €" copy. Responsive and accessibility checks are code-level only (no browser automation by policy).

## Current commercial closure — 2026-10-16

Preserved the existing uncommitted Home, routes, guides, case and pricing work; no duplicate implementation or additional commercial route was needed. This closure corrects the remaining integration and conversion gaps:

- Web creation/redesign and existing-site repair have distinct primary intents. All four solution CTAs select the matching consultation type; support, repair and agency routes also preselect their own types. Agency scope includes development, review, QA and delivery while keeping the agency-client relationship explicit.
- The Home selects four cases, including the live Cien Mares web case. KingBelt, Emilio Faraoni and Ilifielt remain visibly in development. No unsupported results or metrics were added.
- Diagnosis scope, access, deliverable, exclusions and the eligible 30-day repair discount are explicit. Approved amounts remain in `pricing.ts`; tax/external-cost terms are visible. Fixed/minimum pricing and the CARE monthly period are distinguished in schema. Agency collaboration has its own factual `Service` schema.
- Native contact POST now receives real success/error HTML, not a static-page redirect. Enhanced and API validation share limits and options; no personal data is reflected in the result or forwarded as analytics props. Contact FAQs use native disclosures.
- Optional GA4 has accept/reject controls, reopenable preferences, expiry and withdrawal handling, safe configured URL parameters and an `Arguments` command queue. It stays off without a valid environment ID; production reception is not asserted. See `DEVELOPMENT.md` for mandatory GA4-side settings and activation.
- Home previews have responsive sources and dimensions; accent text on inverted surfaces follows the theme-aware contrast token. The default OG copy/PNG matches the current offer. No browser inspection or measured Core Web Vitals improvement is claimed.

Final local verification on this state:

| Check | Result |
|-------|--------|
| `bun test` | 66 pass, 0 fail |
| `bun run check` | 0 errors, 0 warnings, 0 hints (59 files) |
| `bun run build` | Successful static build; 26 HTML pages plus the contact-result CSS endpoint |
| `bun run qa:build` | 26 pages, 23 sitemap URLs, 80 parsed JSON-LD blocks, 50 visible/schema FAQ pairs; metadata, robots/canonicals, heading structure, ARIA references, internal links/fragments, local assets, prices, case status and CTA types pass |
| Isolated GA4 fixture build + output audit | Same output checks pass with a non-production test ID; consent controls/preferences are present only in the configured build and no vendor script is rendered before permission |
| `git diff --check` | No whitespace errors |

The audit is reproducible in `scripts/verify-build.mjs` and accepts an optional output-directory argument. No screenshots, browser automation, real form submission, commit, push or deployment was performed.

### External checks and owner-supplied facts still required

- Configure a real GA4 ID, disable automatic Enhanced Measurement/user-provided-data collection, review retention/provider settings and verify DebugView reception with acceptance/rejection/withdrawal. No production measurement is claimed from a local fixture.
- Verify Resend sender/environment and an authorised real message all the way to the recipient mailbox; mock tests prove response handling, not delivery.
- Review Search Console, sitemap submission/indexation, field performance and actual lead quality after deployment. No rankings, traffic or commercial uplift are asserted.
- Complete legal review using real owner details: the current notice identifies Francisco Muñoz, city and email but does not provide a NIF or full address. Do not invent or publish private identity data without the owner's approved details. Review legal bases, retention and provider/international-transfer terms as part of that review.
