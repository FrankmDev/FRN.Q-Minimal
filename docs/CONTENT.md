# CONTENT — frnq.es

## Model

frnq.es has four content tiers with different lifecycles:

| Tier | Location | Validation | Lifecycle | Rendering |
|------|----------|------------|-----------|-----------|
| **Data** (structured commercial copy) | `src/data/*.ts` | TypeScript interfaces | Hand-authored, stable | Imported in `.astro` |
| **Solutions** (search-intent landing pages) | `src/data/solutions.ts` + `src/data/services.ts` | TypeScript interfaces | Hand-authored; add only for distinct intent and useful evidence-led scope | Static `/soluciones/<slug>/` routes |
| **Cases** (file-driven case studies) | `src/content/projects/*.md` | `zod` schema in `src/content.config.ts` | Editorial, per project | Astro Content Collections + `getStaticPaths` |
| **Form contract** (shared limits/options) | `src/data/contact-contract.ts` | TypeScript constants | Stable contract | Imported by the form and the API |

No CMS. No database. No build-time `fetch` for content.

## Commercial copy (single source of truth)

All editable commercial copy lives in `src/data/*`:

| File | Owns |
|------|------|
| `site.ts` | Identity, url, email, location, external `STUDIO ↗` link, social links |
| `projects.ts` | Collection accessor (`getProjects`), category/status labels, case paths |
| `navigation.ts` | Primary navigation and header CTA |
| `services.ts` | The four commercial areas in priority order and their section copy |
| `solutions.ts` | The three focused solution pages: unique metadata, audience, process, integration scope, FAQs and cross-links |
| `engagement.ts` | Pricing/engagement FAQ, also used in FAQ schema |
| `contact.ts` | Contact methods |

Rules:

- Shared commercial copy is consolidated in `src/data/*`; unique section copy lives in its component. Components consume the shared modules.
- A given piece of copy exists once. Do not duplicate between `data/*`, schema and a component.
- Capability names (design, frontend, SEO, analytics, CRO, accessibility, performance, integrations) appear only as supporting means, never as a top-level service.

## Cases (project case studies)

- **Collection:** `projects` in `src/content.config.ts`.
- **Loader:** `glob({ pattern: "**/*.md", base: "./src/content/projects" })`.
- **Entries (published):** `grn-urban`, `cien-mares`, `fernando-feijoo`, `mata-psicologia`, `wanda-animalart`, `asercord-energia`.
- **Factual source:** frnq.studio holds the canonical project facts; frnq.es may reinterpret commercially but never adds new facts, audiences or outcomes not present in the canonical case.
- **Routes:** `/casos/` archive and `/casos/<slug>/` detail via `getStaticPaths`.
- Optional `serviceArea` connects a published case to `ecommerce`, `b2b` or `sistemas`; solution routes show only matching cases with `status: live`.

### Schema (fields)

```
title, client, category, sector, year, tagline,
context, problem, objective, scope[], solution,
features[{title,description}], decisions[{title,description}],
result, metrics[{label,value,note?}]?, technologies[],
cover{src,alt}, images[{src,alt,caption?}]?,
url?, urlLabel, status, order, serviceArea?,
seo{title,description,keywords}
```

- `category`: `corporate | web | website | product | interactive | ecommerce | b2b` (`web` / `website` render as "Web").
- `status`: `live | in-development | archived`.

### Case-study model

A case study is evidence, not marketing. It explains:

1. **Context** — the business and its situation.
2. **Problem** — what was not working.
3. **Objective** — what the project set out to change.
4. **Scope** — what was delivered.
5. **Solution** — the system built and how it works.
6. **Features / Decisions** — the interface and the reasoning behind it.
7. **Result** — the observable outcome, stated without exaggeration.
8. **Metrics** — optional and only when verifiable.

Do not invent metrics. If a number cannot be evidenced, it does not appear.

### Images

Images are part of the same case entry and resolved by Astro `image()`:

- `cover` — listing card (`src/assets/projects/<case>/cover.avif`).
- `images[]` — gallery (`src/assets/projects/<case>/*.avif`).
- Every image has `alt`; captions are optional.

## FUTURE cases — prepared, not published

The schema already supports the next cases. **No entries exist yet** and they must not be rendered as finished work:

| Case | Area | Status |
|------|------|--------|
| **KingBelt** | Ecommerce D2C / Shopify | In development |
| **Emilio Faraoni** | Portales & Sistemas B2B | In development |

Publish each only when it ships and can carry real evidence. Until then, do not list it in `/casos/` or link it as completed work.

## Engagement and pricing copy

- **Philosophy:** scope-based pricing. Ranges are orientation, never a quote. No guaranteed ROI.
- **Engagement:** scope agreed after discovery; the on-page FAQ describes pricing and collaboration.
- **Budget options:** `CONTACT_BUDGETS` in `src/data/contact-contract.ts` (e.g. "Prefiero comentarlo antes", "Hasta 2.000 €" … "Más de 10.000 €").
- **Project types:** `CONTACT_TYPES` (ecommerce, portal, sistema → "Sistema / integración", web, seo, otro).

The contact form asks for context, not commitment. It must never pressure or imply scarcity.

## Vocabulary

**Use:** ecommerce, Shopify, catálogo, producto, pedidos, clientes profesionales, precios privados, portal, workflow, integración, datos, medición, conversión, SEO técnico/local, analítica, accesibilidad, rendimiento.

**Avoid:** "webs premium", "cero plantillas" as the main pitch, "infraestructura premium", "legados digitales", "tecnología que no caduca", "seguridad bancaria", "ROI garantizado", invented metrics, guarantees without evidence, artificial exclusivity, simplistic attacks on WordPress/plugins, and "nosotros" implying a team.

## How to add content

### New case study

1. Add images under `src/assets/projects/<case>/`.
2. Create `src/content/projects/<slug>.md` with the schema above. Set `order` to continue the sequence, `status:"live"` to publish, and provide a unique `seo.title` (≤ 65 characters) and `seo.description` (≤ 160 characters). Set `serviceArea` only when the case genuinely evidences that service.
3. Keep `result` observable and neutral; add `metrics` only if verified.
4. Run the build and confirm `/casos/<slug>/` is generated.

### Editing commercial copy

Edit shared copy in `src/data/*.ts`; edit unique section copy in its component.

## CURRENT vs FUTURE

**Status: CURRENT.** Home composition is frozen; three search-intent solution routes are part of the static commercial surface.

| Area | Current | Future |
|------|---------|--------|
| Commercial surfaces | Single Spanish site; `/`, three `/soluciones/` routes and `/casos/` present | Further routes only with distinct intent and useful evidence |
| Cases | 6 published, evidence-based | KingBelt and Emilio Faraoni when they ship |
| Pricing | Orientation ranges in the form | No fixed public price list is planned |
| i18n | Spanish only | Not planned; `.studio` is the English surface |

Do not document future content as shipped.
