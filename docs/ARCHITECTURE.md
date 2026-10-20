# ARCHITECTURE — frnq.es

## Stack (real, current)

| Layer | Choice | Detail |
|-------|--------|--------|
| Framework | Astro | `^7.3.5`, `output: "static"` (no adapter) |
| Language | TypeScript | `^6.0.3` strict |
| Runtime / package manager | Bun | `1.3.14` (`packageManager`) |
| Content | Astro Content Collections | `glob` loader + `zod` via `astro/zod` |
| SEO | `@astrojs/sitemap` `^3.7.4`, custom `SEOHead.astro` | — |
| Styling | CSS | `src/styles/*` + scoped component styles |
| Contact API | Vercel Function | `api/contact.ts` (POST, Resend via `fetch`) |
| Hosting | Vercel | Static `dist/` + `api/` Functions; `vercel.json` enforces `trailingSlash: true`; apex `frnq.es` is the canonical host (primary domain set in the Vercel dashboard) |
| Check | `astro check` | `@astrojs/check` `^0.9.10` |

No React. No state library. No animation library. No CMS. No Resend SDK.

## Rendering strategy

- Static generation only. Every page is pre-rendered at build (`astro build` → `dist/`).
- `getStaticPaths` for `/casos/[slug]/` from the `projects` collection and `/soluciones/[slug]/` from `src/data/solutions.ts`.
- `site: "https://frnq.es"`, `trailingSlash: "always"`, `@astrojs/sitemap` integration. `vercel.json` mirrors `trailingSlash: true` at the host layer.
- Apex `frnq.es` is the canonical host; the `www` → apex redirect is a Vercel dashboard domain setting, not repository config.
- No Astro SSR, adapter or middleware. Contact is a separate Vercel Function.

## Source tree (actual)

```
vercel.json                        # Host config: trailingSlash true (apex canonical host is a dashboard setting)

api/
└── contact.ts                     # Vercel Function — POST /api/contact (Resend via fetch)

src/
├── assets/projects/<case>/        # mockup-01.avif … mockup-05.avif per case (01 = cover + first gallery image)
├── components/
│   ├── Header.astro               # sticky nav; anchors + STUDIO ↗ (desktop, mobile menu)
│   ├── Hero.astro                 # intro, solution index, STUDIO ↗ link
│   ├── Services.astro             # accent feature plate + offset-shadow plates for the four commercial areas
│   ├── WebRescue.astro            # Web Rescue block (Home): review/repair offers, Granada use cases
│   ├── HiddenCost.astro           # frequent-operations problems (symptoms)
│   ├── Projects.astro             # home cases teaser from the collection
│   ├── About.astro                # studio intro, capabilities, process
│   ├── Contact.astro              # contact + form + privacy note + FAQ + STUDIO ↗
│   ├── AgencyCollaboration.astro  # dedicated agency collaboration landing
│   ├── AnalyticsConsent.astro     # optional non-modal accept/reject controls, only with a valid GA4 ID
│   ├── Footer.astro               # contact, nav incl. legal links, STUDIO ↗, social
│   ├── SEOHead.astro              # all <head> primitives + Person/Brand/WebSite graph
│   ├── CustomCursor.astro         # desktop cursor enhancement
│   └── RevealObserver.astro       # scroll reveal for `.reveal`
├── content.config.ts              # defineCollection("projects", "guias")
├── content/projects/*.md          # 10 published cases (slug = filename)
├── content/guias/*.md             # editorial guides, structured frontmatter + Markdown body (slug = filename)
├── data/
│   ├── site.ts                    # identity, url, email, location, portfolioLink, socialLinks
│   ├── navigation.ts              # navItems, headerCta
│   ├── services.ts                # serviceAreas (4, priority order) + servicesCopy
│   ├── solutions.ts               # copy, metadata, FAQs, process and page-specific blocks for 4 solution routes
│   ├── pricing.ts                 # public price reference: starting points, Web Rescue offers, modes, terms, FAQ, /precios/ copy
│   ├── web-rescue.ts              # Web Rescue copy: process, public entry offers, Granada use cases, CTA type + repair landing page
│   ├── support.ts                 # FRN.Q Support copy for /soporte/ (differences, capabilities, scope, onboarding, FAQs); CARE price read from pricing.ts
│   ├── agency-collaboration.ts    # collaboration landing copy for /colaboraciones/agencias/
│   ├── engagement.ts              # pricing/engagement FAQ (also used for FAQ schema)
│   ├── contact.ts                 # contact methods
│   ├── contact-contract.ts        # shared form contract (limits, types, budgets)
│   ├── contact-result.ts          # copy for the API's native HTML success/error response
│   ├── analytics-consent.ts       # consent-control copy
│   ├── projects.ts                # getProjects / getPublishedProjects / getFeaturedProjects / categoryLabels / statusLabels / caseGroups / casePath
│   └── guias.ts                   # getGuides / guidePath / formatEditorialDate (guides collection accessor)
├── layouts/MainLayout.astro       # html shell: SEOHead + fonts + styles + Cursor/Reveal
├── pages/
│   ├── index.astro                # Home
│   ├── soluciones/[slug].astro    # /soluciones/{ecommerce,b2b,sistemas,desarrollo-web}/
│   ├── soluciones/revision-web.astro # /soluciones/revision-web/ repair-intent landing (shared data/web-rescue.ts)
│   ├── precios/index.astro        # /precios/ public price reference (data/pricing.ts)
│   ├── soporte/index.astro        # /soporte/ FRN.Q Support continuity page (data/support.ts)
│   ├── colaboraciones/agencias/index.astro # /colaboraciones/agencias/ collaboration landing
│   ├── casos/index.astro          # /casos/ published-case archive
│   ├── casos/[slug].astro         # /casos/<slug>/ published case detail
│   ├── guias/index.astro          # /guias/ editorial guide index
│   ├── guias/[slug].astro         # /guias/<slug>/ guide detail (Content Collection + render)
│   ├── legal/index.astro          # aviso legal
│   ├── legal/privacidad.astro     # política de privacidad (form notice links here)
│   ├── contact-result.css.ts      # prerendered stylesheet endpoint for native contact responses
│   └── 404.astro
├── scripts/
│   ├── analytics.ts               # first-party, consent-gated event layer
│   ├── analytics-consent.ts       # consent choice, persistence and Footer preferences
│   └── contact-form.ts            # client form handling
└── styles/                        # app.css cascade + native contact-result.css

scripts/verify-build.mjs            # generated HTML audit (bun run qa:build)
tests/*.test.mjs                    # contact API/client, analytics/consent and commercial contracts
```

## Layer responsibilities

| Layer | Responsibility |
|-------|----------------|
| `pages/` | Composition only. Wire layout + Header/Footer + sections. |
| `components/` | Reusable blocks owning their scoped `<style>` and small scripts. |
| `data/` | Typed, hand-authored commercial copy and accessors. Leaf nodes. |
| `content/` | File-driven case studies, schema-validated. |
| `layouts/` | Global shell (`MainLayout`). |
| `styles/` | Global cascade split by responsibility. |
| `api/` | Vercel Functions. Not imported by `src/` pages. |

**Anti-rules:**

- No data duplication: a piece of copy lives once, in `data/` or in the collection.
- No structured content hard-coded in components when a data module owns it.
- No visual restructuring inside content tasks.
- No browser automation.

## Routing

| Path | File | Notes |
|------|------|-------|
| `/` | `pages/index.astro` | Hero → Services → WebRescue (Revisión web) → HiddenCost (Operación) → Projects → About → Contact |
| `/colaboraciones/agencias/` | `pages/colaboraciones/agencias/index.astro` | Dedicated collaboration landing with published case evidence and contact form preselection |
| `/soluciones/<slug>/` | `pages/soluciones/[slug].astro` | Static route from `data/solutions.ts`; page-specific `Service`, Inicio → solution `BreadcrumbList`, visible FAQ + `FAQPage` |
| `/soluciones/revision-web/` | `pages/soluciones/revision-web.astro` | Repair-intent landing (static file, resolved before `[slug].astro`); shares `data/web-rescue.ts` for process, offers and note; `Service` + 2 `Offer` + `BreadcrumbList` + visible `FAQPage`; CTA preseeds `reparacion` |
| `/casos/` | `pages/casos/index.astro` | Published-case archive (`getPublishedProjects()`) grouped by commercial type with `caseGroups` + a static type index; flagship emphasis for the ecommerce and B2B references; `ItemList` + `BreadcrumbList` |
| `/casos/<slug>/` | `pages/casos/[slug].astro` | `getStaticPaths` from published entries, compact `summary` business reading, solution panel with `?tipo=` CTA (`getSolutionForCase`), `CreativeWork` schema, next-case link |
| `/guias/` | `pages/guias/index.astro` | Editorial guide index (`getGuides()`), `ItemList` + `BreadcrumbList`; no categories, pagination or CMS |
| `/guias/<slug>/` | `pages/guias/[slug].astro` | `getStaticPaths` + `render()` from the `guias` collection; `Article` + Inicio → Guías → guide `BreadcrumbList`, visible references and a single service CTA |
| `/precios/` | `pages/precios/index.astro` | Public price reference from `data/pricing.ts`; groups offers by solution and scope, `OfferCatalog` (only published amounts) + Inicio → Precios `BreadcrumbList` + visible `FAQPage` |
| `/soporte/` | `pages/soporte/index.astro` | FRN.Q Support continuity page from `data/support.ts`; `Service` (+ `Offer` for the CARE starting point) + `FAQPage` + `BreadcrumbList`; the CARE amount is read from `data/pricing.ts` |
| `/legal/` | `pages/legal/index.astro` | Aviso legal; accessible, `noindex, follow`, excluded from sitemap |
| `/legal/privacidad/` | `pages/legal/privacidad.astro` | Política de privacidad; accessible, `noindex, follow`, excluded from sitemap |
| `/404/` | `pages/404.astro` | `noindex, nofollow`, excluded from sitemap |
| `/contact-result.css` | `pages/contact-result.css.ts` | Static stylesheet for the native API response; no extra HTML landing or sitemap entry |
| `POST /api/contact` | `api/contact.ts` | Vercel Function, not an Astro route; JSON for enhanced submit or native HTML based on Accept |

## Data flow

```
content/projects/*.md  --(astro:content)-->  data/projects.ts (getProjects / getPublishedProjects / caseGroups)
                                                ├── Projects.astro      (home teaser + flagship area label)
                                                ├── casos/index.astro   (/casos/, grouped by type)
                                                └── casos/[slug].astro  (/casos/<slug>/, summary + solution panel)

content/guias/*.md   --(astro:content)-->  data/guias.ts (getGuides)
                                                ├── guias/index.astro    (/guias/)
                                                ├── guias/[slug].astro   (/guias/<slug>/)
                                                └── MainLayout.astro     (analytics route allowlist)

data/services.ts (serviceAreas)  -->  Services.astro, About.astro (specialities), case solution panels
data/solutions.ts (solutionPages) -->  pages/soluciones/[slug].astro + service-card links
content/projects/*.md (live or in-development + publicPreview) --> public case archive and static detail routes
content/projects/*.md (serviceArea) --> related solution-case lists, flagship emphasis
content/projects/*.md (category, via getSolutionForCase) --> case-to-solution link + ?tipo= CTA on every case page
content/projects/*.md (category, via evidenceCategories) --> corporate-web solution evidence list
data/site.ts (portfolioLink)     -->  Hero.astro, Header/Footer, Contact.astro
data/site.ts (email = info@frnq.studio)     --> footer, contact methods, legal pages
           (internalEmail = info@frnq.studio) --> api/contact.ts delivery mailbox
data/contact-contract.ts         -->  Contact.astro, scripts/contact-form.ts, api/contact.ts
data/web-rescue.ts               -->  WebRescue.astro + index.astro (Home Service schema) + solutions.ts (corporate-web FAQ) + pages/soluciones/revision-web.astro
data/web-rescue.ts (webRescuePage.path) --> MainLayout.astro (analytics route allowlist)
data/pricing.ts                  -->  data/web-rescue.ts (rescue amounts) --> Home + repair landing + solutions FAQ
data/pricing.ts                  -->  pages/precios/index.astro (visible prices + OfferCatalog schema)
data/support.ts                  -->  pages/soporte/index.astro + Services.astro + MainLayout.astro (analytics allowlist) + data/pricing.ts (CARE amount)
data/agency-collaboration.ts     -->  pages/colaboraciones/agencias/index.astro
scripts/analytics.ts             -->  MainLayout.astro (all pages) + scripts/contact-form.ts
PUBLIC_GA4_MEASUREMENT_ID (build env) --> MainLayout.astro (inline config) --> scripts/analytics.ts (lazy gtag after consent)
                                    └── AnalyticsConsent.astro + Footer preferences + conditional privacy notice
data/contact-result.ts + data/site.ts --> api/contact.ts (native HTML result)
styles/tokens.css + styles/contact-result.css --> pages/contact-result.css.ts (static stylesheet)
```

## Contact API

- File: `api/contact.ts` (Vercel `/api` convention). Astro stays static.
- Provider: Resend HTTP API via `fetch` (`https://api.resend.com/emails`). No SDK. The request carries an explicit timeout.
- Env (server-only): `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`. Delivery target: `siteConfig.internalEmail` (the public `info@frnq.studio` address, same mailbox).
- Optional env: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` + `KV_REST_API_TOKEN`) enable a durable rate-limit store shared across serverless instances; without them the limiter degrades to instance memory. `RATE_LIMIT_SALT` salts the client-IP hash. The memory fallback is best-effort burst damping (5 non-honeypot attempts / 10 min per salted IP, per warm instance), not durable enforcement across instances; the exact scope is documented in `DEVELOPMENT.md`. A hash failure uses a shared bucket, never an unhashed address.
- Contract: POST + JSON or URL-encoded (no-JS fallback); validates against `src/data/contact-contract.ts`; honeypot field; rate limited on a salted client-IP hash (not the raw address) with `Retry-After` on 429. Enhanced requests receive `{ success, error?, errors? }`; success echoes an opaque `ref` used only for analytics de-duplication. `Accept: text/html` receives a Spanish success/error document preserving the actual status, with no submitted data reflected, no cache, noindex and restrictive CSP. No 303 redirect is used. Provider failures/timeouts are not exposed to visitors; real email delivery is an external check.

## Analytics

`src/scripts/analytics.ts` is the first-party, dependency-free event layer initialized once from `MainLayout.astro`. It emits navigation and commercial/contact events in-page; forwarding requires one configured provider and the applicable consent. GA4 is the only auto-loaded provider: a valid build-time `PUBLIC_GA4_MEASUREMENT_ID` renders its configuration, the built-in `AnalyticsConsent` controls and Footer preferences. `gtag.js` loads only after permission; a choice is valid for 180 days. Withdrawal blocks forwarding, sets the GA opt-out, clears per-tab context/dedup storage and deletes accessible first-party GA cookies.

The route allowlist comes from solution data, published cases and guides; unknown paths become `/404/`. GA4 receives a canonical allowlisted `page_location`, empty referrer and categorical title, with ads signals disabled. Only categorical event props and permitted last-consulted solution/case context are eligible. Context is not persisted before permission for a consent-required provider. Confirmed form conversions require the JSON response to echo the current opaque request ID; native HTML and legacy URL parameters are not measured receipts. The 2026-10-16 production HTTP audit found no GA4 configuration or ID; local tests do not prove production reception. Activation, required GA4-side Enhanced Measurement settings and external verification are documented in `DEVELOPMENT.md` → Analytics.

## CURRENT vs FUTURE

**Status: CURRENT.** The home composition keeps its visual identity and gains one commercial block (Web Rescue); four intent-led solution routes extend the existing static surface.

| Area | Current | Future |
|------|---------|--------|
| Commercial surface | `/`, `/soluciones/{ecommerce,b2b,sistemas,desarrollo-web}/`, `/casos/`, Spanish | Further routes only with distinct intent and useful evidence |
| Cases | 10 published, evidence-based, all `status: live` | Add verified outcomes as evidence becomes available |
| Commercial copy | Shared identity, navigation, services and solution pages in `src/data/*`; cases in the collection | Evolve as required |
| i18n | Spanish only | Not planned (`.studio` is the English surface) |
| Theme | Light by default; persistent light/dark toggle in the header | — |

Do not document future work as shipped.
