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
│   ├── Services.astro             # four commercial areas from data/services
│   ├── HiddenCost.astro           # frequent-operations problems (symptoms)
│   ├── Projects.astro             # home cases teaser from the collection
│   ├── About.astro                # studio intro, capabilities, process
│   ├── Contact.astro              # contact + form + privacy note + FAQ + STUDIO ↗
│   ├── Footer.astro               # contact, nav incl. legal links, STUDIO ↗, social
│   ├── SEOHead.astro              # all <head> primitives + Person/Brand/WebSite graph
│   ├── CustomCursor.astro         # desktop cursor enhancement
│   └── RevealObserver.astro       # scroll reveal for `.reveal`
├── content.config.ts              # defineCollection("projects")
├── content/projects/*.md          # 10 published cases (slug = filename)
├── data/
│   ├── site.ts                    # identity, url, email, location, portfolioLink, socialLinks
│   ├── navigation.ts              # navItems, headerCta
│   ├── services.ts                # serviceAreas (4, priority order) + servicesCopy
│   ├── solutions.ts               # copy, metadata, FAQs, process and page-specific blocks for 4 solution routes
│   ├── engagement.ts              # pricing/engagement FAQ (also used for FAQ schema)
│   ├── contact.ts                 # contact methods
│   ├── contact-contract.ts        # shared form contract (limits, types, budgets)
│   └── projects.ts                # getProjects / getPublishedProjects / getFeaturedProjects / categoryLabels / casePath
├── layouts/MainLayout.astro       # html shell: SEOHead + fonts + styles + Cursor/Reveal
├── pages/
│   ├── index.astro                # Home
│   ├── soluciones/[slug].astro    # /soluciones/{ecommerce,b2b,sistemas,desarrollo-web}/
│   ├── casos/index.astro          # /casos/ published-case archive
│   ├── casos/[slug].astro         # /casos/<slug>/ published case detail
│   ├── legal/index.astro          # aviso legal
│   ├── legal/privacidad.astro     # política de privacidad (form notice links here)
│   └── 404.astro
├── scripts/
│   ├── analytics.ts               # first-party, consent-gated event layer
│   └── contact-form.ts            # client form handling
└── styles/                        # app.css cascade: tokens, typography, base, motion, utilities
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
| `/` | `pages/index.astro` | Hero → Services → HiddenCost (Operación) → Projects → About → Contact |
| `/soluciones/<slug>/` | `pages/soluciones/[slug].astro` | Static route from `data/solutions.ts`; page-specific `Service`, Inicio → solution `BreadcrumbList`, visible FAQ + `FAQPage` |
| `/casos/` | `pages/casos/index.astro` | Published-case archive (`getPublishedProjects()`), `ItemList` + `BreadcrumbList` |
| `/casos/<slug>/` | `pages/casos/[slug].astro` | `getStaticPaths` from published entries, `CreativeWork` schema, next-case link |
| `/legal/` | `pages/legal/index.astro` | Aviso legal; accessible, `noindex, follow`, excluded from sitemap |
| `/legal/privacidad/` | `pages/legal/privacidad.astro` | Política de privacidad; accessible, `noindex, follow`, excluded from sitemap |
| `/404/` | `pages/404.astro` | `noindex, nofollow`, excluded from sitemap |
| `POST /api/contact` | `api/contact.ts` | Vercel Function, not an Astro route |

## Data flow

```
content/projects/*.md  --(astro:content)-->  data/projects.ts (getProjects / getPublishedProjects)
                                                ├── Projects.astro      (home teaser)
                                                ├── casos/index.astro   (/casos/)
                                                └── casos/[slug].astro  (/casos/<slug>/)

data/services.ts (serviceAreas)  -->  Services.astro
data/solutions.ts (solutionPages) -->  pages/soluciones/[slug].astro + service-card links
content/projects/*.md (status: live) --> public case archive and static detail routes
content/projects/*.md (serviceArea) --> related solution-case lists + contextual case-to-solution link
content/projects/*.md (category, via evidenceCategories) --> corporate-web solution evidence list
data/site.ts (portfolioLink)     -->  Hero.astro, Header/Footer, Contact.astro
data/site.ts (email = info@frnq.studio)     --> footer, contact methods, legal pages
           (internalEmail = info@frnq.studio) --> api/contact.ts delivery mailbox
data/contact-contract.ts         -->  Contact.astro, scripts/contact-form.ts, api/contact.ts
scripts/analytics.ts             -->  MainLayout.astro (all pages) + scripts/contact-form.ts
```

## Contact API

- File: `api/contact.ts` (Vercel `/api` convention). Astro stays static.
- Provider: Resend HTTP API via `fetch` (`https://api.resend.com/emails`). No SDK. The request carries an explicit timeout.
- Env (server-only): `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`. Delivery target: `siteConfig.internalEmail` (the public `info@frnq.studio` address, same mailbox).
- Optional env: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` + `KV_REST_API_TOKEN`) enable a durable rate-limit store shared across serverless instances; without them the limiter degrades to instance memory. `RATE_LIMIT_SALT` salts the client-IP hash. The memory fallback is best-effort burst damping (5 accepted / 10 min per salted IP, per warm instance), not durable enforcement across instances; the exact scope is documented in `DEVELOPMENT.md`.
- Contract: POST + JSON or URL-encoded (no-JS fallback); validates against `src/data/contact-contract.ts`; honeypot field; rate limited on a salted client-IP hash (not the raw address) with `Retry-After` on 429; consistent `{ success, error?, errors? }`; Resend failures and timeouts are logged server-side and never leaked. Success echoes an opaque `ref` used only for analytics de-duplication.

## Analytics

`src/scripts/analytics.ts` is a first-party, dependency-free event layer initialized once from `MainLayout.astro`. It always dispatches in-page `frnq:track` events (no network, no cookies, no PII) and forwards to at most one external sink (`gtag`, `plausible`, `umami`, `dataLayer` or a beacon endpoint) only when one is configured in `window.__FRNQ_ANALYTICS__` and consent has been granted. Commercial clicks use declarative `[data-track]` attributes; the form reports submit/success/reset with categorical, non-personal props, de-duplicated by the server-returned `ref`. **No provider is configured in the repository**, so in production it dispatches in-page events only and sends nothing to any third party. The minimal single-provider connection (script + `window.__FRNQ_ANALYTICS__` + consent) is documented in `DEVELOPMENT.md` → Analytics.

## CURRENT vs FUTURE

**Status: CURRENT.** The home composition and visual identity are frozen; four intent-led solution routes extend the existing static surface.

| Area | Current | Future |
|------|---------|--------|
| Commercial surface | `/`, `/soluciones/{ecommerce,b2b,sistemas,desarrollo-web}/`, `/casos/`, Spanish | Further routes only with distinct intent and useful evidence |
| Cases | 10 published, evidence-based; public routes expose `status: live` plus authorised `in-development` entries (`publicPreview: true`) | Add verified outcomes as evidence becomes available |
| Commercial copy | Shared identity, navigation, services and solution pages in `src/data/*`; cases in the collection | Evolve as required |
| i18n | Spanish only | Not planned (`.studio` is the English surface) |
| Theme | Light by default; persistent light/dark toggle in the header | — |

Do not document future work as shipped.
