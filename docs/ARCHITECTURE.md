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
| Check | `astro check` | `@astrojs/check` `^0.9.10` |

No React. No state library. No animation library. No CMS. No Resend SDK.

## Rendering strategy

- Static generation only. Every page is pre-rendered at build (`astro build` → `dist/`).
- `getStaticPaths` for `/casos/[slug]/` from the `projects` collection and `/soluciones/[slug]/` from `src/data/solutions.ts`.
- `site: "https://frnq.es"`, `@astrojs/sitemap` integration.
- No Astro SSR, adapter or middleware. Contact is a separate Vercel Function.

## Source tree (actual)

```
api/
└── contact.ts                     # Vercel Function — POST /api/contact (Resend via fetch)

src/
├── assets/projects/<case>/        # cover.avif + gallery AVIF per case
├── components/
│   ├── Header.astro               # sticky nav; anchors + STUDIO ↗ (desktop, mobile menu)
│   ├── Hero.astro                 # intro, solution index, STUDIO ↗ link
│   ├── Services.astro             # four commercial areas from data/services
│   ├── HiddenCost.astro           # frequent-operations problems (symptoms)
│   ├── Projects.astro             # home cases teaser from the collection
│   ├── About.astro                # studio intro, capabilities, process
│   ├── Contact.astro              # contact + form + privacy note + FAQ + STUDIO ↗
│   ├── Footer.astro               # contact, nav incl. legal links, STUDIO ↗, social
│   ├── SEOHead.astro              # all <head> primitives + Person/WebSite graph
│   ├── CustomCursor.astro         # desktop cursor enhancement
│   └── RevealObserver.astro       # scroll reveal for `.reveal`
├── content.config.ts              # defineCollection("projects")
├── content/projects/*.md          # 6 published cases (slug = filename)
├── data/
│   ├── site.ts                    # identity, url, email, location, portfolioLink, socialLinks
│   ├── navigation.ts              # navItems, headerCta
│   ├── services.ts                # serviceAreas (4, priority order) + servicesCopy
│   ├── solutions.ts               # copy, metadata, FAQs and process for 3 solution routes
│   ├── engagement.ts              # pricing/engagement FAQ (also used for FAQ schema)
│   ├── contact.ts                 # contact methods
│   ├── contact-contract.ts        # shared form contract (limits, types, budgets)
│   └── projects.ts                # getProjects / getPublishedProjects / getFeaturedProjects / categoryLabels / casePath
├── layouts/MainLayout.astro       # html shell: SEOHead + fonts + styles + Cursor/Reveal
├── pages/
│   ├── index.astro                # Home
│   ├── soluciones/[slug].astro    # /soluciones/{ecommerce,b2b,sistemas}/
│   ├── casos/index.astro          # /casos/ published-case archive
│   ├── casos/[slug].astro         # /casos/<slug>/ published case detail
│   ├── legal/index.astro          # aviso legal
│   ├── legal/privacidad.astro     # política de privacidad (form notice links here)
│   └── 404.astro
├── scripts/contact-form.ts        # client form handling
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
data/site.ts (portfolioLink)     -->  Hero.astro, Header/Footer, Contact.astro
data/site.ts (email = info@frnq.es)     --> footer, contact methods, legal pages
           (internalEmail = info@frnq.studio) --> api/contact.ts delivery mailbox
data/contact-contract.ts         -->  Contact.astro, scripts/contact-form.ts, api/contact.ts
```

## Contact API

- File: `api/contact.ts` (Vercel `/api` convention). Astro stays static.
- Provider: Resend HTTP API via `fetch` (`https://api.resend.com/emails`). No SDK.
- Env (server-only): `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`. Delivery target: `siteConfig.internalEmail` (the public `info@frnq.es` redirects internally to it).
- Contract: POST + JSON or URL-encoded (no-JS fallback); validates against `src/data/contact-contract.ts`; honeypot field; consistent `{ success, error?, errors? }`; no internal errors leaked.

## CURRENT vs FUTURE

**Status: CURRENT.** The home composition and visual identity are frozen; three intent-led solution routes extend the existing static surface.

| Area | Current | Future |
|------|---------|--------|
| Commercial surface | `/`, `/soluciones/{ecommerce,b2b,sistemas}/`, `/casos/`, Spanish | Further routes only with distinct intent and useful evidence |
| Cases | 6 published, evidence-based; public routes expose `status: live` only | KingBelt, Emilio Faraoni when shipped |
| Commercial copy | Shared identity, navigation, services and solution pages in `src/data/*`; cases in the collection | Evolve as required |
| i18n | Spanish only | Not planned (`.studio` is the English surface) |
| Theme | Light by default; persistent light/dark toggle in the header | — |

Do not document future work as shipped.
