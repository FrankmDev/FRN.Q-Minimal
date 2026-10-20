# CONTENT — frnq.es

## Model

frnq.es has five content tiers with different lifecycles:

| Tier | Location | Validation | Lifecycle | Rendering |
|------|----------|------------|-----------|-----------|
| **Data** (structured commercial copy) | `src/data/*.ts` | TypeScript interfaces | Hand-authored, stable | Imported in `.astro` |
| **Solutions** (search-intent landing pages) | `src/data/solutions.ts` + `src/data/services.ts` | TypeScript interfaces | Hand-authored; add only for distinct intent and useful evidence-led scope | Static `/soluciones/<slug>/` routes |
| **Cases** (file-driven case studies) | `src/content/projects/*.md` | `zod` schema in `src/content.config.ts` | Editorial, per project | Astro Content Collections + `getStaticPaths` |
| **Guides** (decision-support articles) | `src/content/guias/*.md` | `zod` schema in `src/content.config.ts` | Editorial, evergreen; add only for a real pre-hire question | Astro Content Collections + `render()` at `/guias/<slug>/` |
| **Form contract** (shared limits/options) | `src/data/contact-contract.ts` | TypeScript constants | Stable contract | Imported by the form and the API |

No CMS. No database. No build-time `fetch` for content.

## Commercial copy (single source of truth)

All editable commercial copy lives in `src/data/*`:

| File | Owns |
|------|------|
| `site.ts` | Identity, url, email, location, external `STUDIO ↗` link, social links |
| `projects.ts` | Collection accessor (`getProjects`), category/status labels, case groups for `/casos/`, case paths |
| `guias.ts` | Guides accessor (`getGuides`), `guidePath` and `formatEditorialDate` |
| `navigation.ts` | Primary navigation and header CTA |
| `services.ts` | The four commercial areas (Home order: Web corporativa & SEO first), each with its problem, outcome and section copy |
| `solutions.ts` | The four focused solution pages: unique metadata, audience, process, integration scope, page-specific blocks (`webDetails`, `b2bDetails`), evidence selection, FAQs and cross-links |
| `pricing.ts` | The public price reference: the published starting points (`START`, `STUDIO`, `PRESENCE`, `BUSINESS`, `SHOPIFY`, `CARE`), the Web Rescue entry offers, the three pricing modes, the written-conditions copy, the `/precios/` FAQ and page copy. Every visible amount comes from here |
| `support.ts` | The FRN.Q Support page (`/soporte/`) copy: differences, capabilities, scope, onboarding and FAQs. The public CARE starting point is read from `pricing.ts`; `/precios/` remains the full reference |
| `web-rescue.ts` | Web Rescue data: the productized Home block (process steps, public entry offers, Granada use cases, "Revisar mi web" CTA, form type `reparacion`) and `webRescuePage`, the metadata, problems, diagnosis scope and FAQs for the repair landing `/soluciones/revision-web/`. Rates read from `pricing.ts` and process is reused by reference, never duplicated |
| `engagement.ts` | Pricing/engagement FAQ, also used in FAQ schema |
| `contact.ts` | Contact methods |
| `contact-result.ts` | Native contact response headings, confirmation and navigation copy |
| `analytics-consent.ts` | Optional analytics notice, accept/reject labels and Footer preferences label |
| `agency-collaboration.ts` | Agency collaboration landing copy, capabilities, expectations and process |

Rules:

- Shared commercial copy is consolidated in `src/data/*`; unique section copy lives in its component. Components consume the shared modules.
- A given piece of copy exists once. Do not duplicate between `data/*`, schema and a component.
- Capability names (design, frontend, SEO, analytics, CRO, accessibility, performance, integrations) appear only as supporting means, never as a top-level service.

## Cases (project case studies)

- **Collection:** `projects` in `src/content.config.ts`.
- **Loader:** `glob({ pattern: "**/*.md", base: "./src/content/projects" })`.
- **Entries (public):** `emilio-faraoni`, `kingbelt`, `grn-urban`, `cien-mares`, `fernando-feijoo`, `mata-psicologia`, `wanda-animalart`, `asercord-energia`, `lucia-millan-psicologia`, `ilifielt`.
- **Factual source:** frnq.studio holds the canonical project facts; frnq.es may reinterpret commercially but never adds new facts, audiences or outcomes not present in the canonical case.
- **Routes:** `/casos/` archive and `/casos/<slug>/` detail via `getStaticPaths`; all public entries use `status: live` (`getPublishedProjects()` in `src/data/projects.ts` still supports authorised `in-development` entries with `publicPreview: true`).
- Optional `serviceArea` records which solution a case genuinely evidences (`ecommerce`, `b2b`, `sistemas`). Solution routes show the matching published cases, and it also drives the flagship emphasis (`ecommerce` → accent plate, `b2b` → inverted ink plate) on `/casos/`, the Home teaser and the case page. Only assign it when the case genuinely evidences that service (currently `kingbelt` → `ecommerce`, `emilio-faraoni` → `b2b`).
- **Every published case links to a commercial solution.** `getSolutionForCase()` in `src/data/solutions.ts` resolves `serviceArea` first and otherwise maps the case `category` to the solution it demonstrates (`corporate` / `web` / `website` / `product` / `interactive` → `growth`), so the case page always closes with a solution panel and a `?tipo=` CTA (`solutionContactTypes`). No case page is a dead end.
- `/soluciones/desarrollo-web/` additionally selects evidence by `category` (`corporate`, `web`, `website`) through `evidenceCategories`, so it can show published corporate-web projects as proof without asserting an unverified `serviceArea`.
- `/casos/` groups cases by commercial type with `caseGroups` (ecommerce, B2B, web and own product, interactive work) and a static type index with anchors and counts. Grouping is authored in `src/data/projects.ts`; there are no client-side filters.
- The Home reads the first four published cases in authored order, including Cien Mares and Ilifielt. All ten cases are published as `status: live`.

### Schema (fields)

```
title, client, category, sector, year, tagline,
summary{business,challenge,delivered,decision,outcome},
context, problem, objective, scope[], solution,
features[{title,description}], decisions[{title,description}],
result, metrics[{label,value,note?}]?, technologies[],
cover{src,alt}, images[{src,alt,caption?}]?,
url?, urlLabel, status, order, serviceArea?,
seo{title,description,keywords}
```

- `category`: `corporate | web | website | product | interactive | ecommerce | b2b` (`web` / `website` render as "Web").
- `status`: `live | in-development | archived`.
- `summary`: the compact business reading rendered above the long narrative on `/casos/<slug>/` (Negocio, Reto, Alcance ejecutado, Decisión clave, Resultado verificable). Each field is a single short statement; it must be true and verifiable, never an invented metric or outcome.

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

- `cover` — listing card (`src/assets/projects/<case>/mockup-01.avif`).
- `images[]` — gallery (`src/assets/projects/<case>/mockup-01.avif` … `mockup-05.avif`; `mockup-01` is both the cover and the first gallery image).
- Every image has `alt`; captions are optional.

## Ecommerce and B2B reference cases

Both **KingBelt** and **Emilio Faraoni** are published with status `live`, with no sales or commercial results attributed. Ilifielt is also published as a live case. GRN Urban is explicitly a product owned by FRN.Q and an SEO laboratory, with no unverified traffic or growth figures.

- **KingBelt:** publicly accessible storefront with catalogue and product UI. Shopify commerce architecture is documented, but commercial metrics are not asserted.
- **Emilio Faraoni:** catalogue, verified professional access, protected pricing, baskets and order requests implemented in the repository.
- Every case now ships five optimised AVIF UI mockups per project (`mockup-01.avif` … `mockup-05.avif`); `mockup-01` is the cover and first gallery image. Source PNGs are not kept in the repository.

## Engagement and pricing copy

- **Philosophy:** scope-based pricing. Published starting points orient a defined scope; they are never a universal quote or a fixed total. No guaranteed ROI.
- **Engagement:** scope agreed after discovery; the on-page FAQ describes pricing and collaboration. Projects are invoiced by milestones fixed in the proposal.
- **Public price reference:** `src/data/pricing.ts` is the single source of truth, published on `/precios/`. It carries the starting points (`START` from 690 €, `STUDIO` from 990 €, `PRESENCE` from 1.390 €, `BUSINESS` from 1.990 €, `SHOPIFY` from 3.190 €, `CARE` from 49 €/mes), the Web Rescue entry offers and the discovery-led scopes (B2B portals, systems, integrations and custom ecommerce) with no public figure.
- **Web Rescue:** productized public prices — Diagnóstico Web 360 (99 €, discounted from an eligible repair hired within 30 days) and landing repair (from 299 €); larger repairs are quoted after the review. Amounts live in `pricing.ts`, shown on the Home `#revision-web` block, on `/soluciones/revision-web/`, on `/precios/` and in the corporate-web FAQ.
- **Budget options:** `CONTACT_BUDGETS` in `src/data/contact-contract.ts` (e.g. "Prefiero comentarlo antes", "Hasta 500 €", "Hasta 2.000 €" … "Más de 10.000 €").
- **Project types:** `CONTACT_TYPES` (ecommerce, portal, sistema → "Sistema / integración", web, reparacion → "Reparación / mejora web", seo, soporte, agencia → "Agencia / white-label", otro). Solution, repair, support and agency CTAs use their matching `?tipo=` value.

The contact form asks for context, not commitment. It must never pressure or imply scarcity. Never write an amount outside `pricing.ts`: the page and its `OfferCatalog` schema read the same numbers, distinguishing fixed `price` from starting `minPrice`, excluding applicable taxes and declaring the CARE monthly period. Diagnosis conditions define the reviewed scope, access, deliverable and when the discount applies; do not imply an unlimited audit or a free repair.

## Vocabulary

**Use:** ecommerce, Shopify, catálogo, producto, pedidos, clientes profesionales, precios privados, portal, workflow, integración, datos, medición, conversión, diseño y desarrollo web a medida, web corporativa, SEO técnico/local, analítica, accesibilidad, rendimiento, reparación de webs, recuperación y ampliación, WordPress, Elementor, WooCommerce, Search Console, Perfil de Empresa en Google.

**Avoid:** "webs premium", "cero plantillas" as the main pitch, "infraestructura premium", "legados digitales", "tecnología que no caduca", "seguridad bancaria", "ROI garantizado", invented metrics, guarantees without evidence, artificial exclusivity, simplistic attacks on WordPress/plugins, and "nosotros" implying a team.

## How to add content

### New case study

1. Add images under `src/assets/projects/<case>/`.
2. Create `src/content/projects/<slug>.md` with the schema above. Write `summary` as the compact business reading (business, challenge, delivered scope, key decision, verifiable outcome), then the full narrative. Set `order` to maintain the intended ranking, `status:"live"` for completed work (or explicit `publicPreview:true` with `in-development` for an in-progress case), and provide a unique `seo.title` (≤ 65 characters) and `seo.description` (≤ 160 characters). Set `serviceArea` only when the case genuinely evidences that service; otherwise the case category already links it to the web solution.
3. Keep `result` observable and neutral; add `metrics` only if verified.
4. Run the build and confirm `/casos/<slug>/` is generated.

### Editing commercial copy

Edit shared copy in `src/data/*.ts`; edit unique section copy in its component.

### New guide

Guides answer a single pre-hire question and lead to the matching service. They are not a blog: no categories, pagination, comments, author pages or CMS.

1. Create `src/content/guias/<slug>.md`. The slug is the filename and the public path (`/guias/<slug>/`).
2. Fill the frontmatter required by the `guias` schema: `title`, `h1`, `category`, `published` (ISO `YYYY-MM-DD`), optional `updated`, `readingTime`, `order`, `lead`, `keyPoints` (≥ 2), `limits` (≥ 2), `cta {label, href, note}`, optional `references` (public, verifiable URLs only), optional `related`, and a unique `seo.title` (≤ 65) and `seo.description` (≤ 160).
3. Write the article in the Markdown body using `##` for the numbered sections, `###` for sub-sections, lists for criteria and reasoned examples.
4. Keep the CTA pointed at one real service or at the contact form; no invented prices, guarantees or outcomes.
5. Run the build and confirm `/guias/<slug>/` and its sitemap entry are generated.

## CURRENT vs FUTURE

**Status: CURRENT.** Home composition is frozen; four search-intent solution routes, a repair landing, a support page, a guides section and a public price reference are part of the static commercial surface.

| Area | Current | Future |
|------|---------|--------|
| Commercial surfaces | Single Spanish site; `/`, four `/soluciones/` routes, `/soluciones/revision-web/`, `/soporte/`, `/precios/`, `/guias/`, `/casos/` present; Home includes the Web Rescue block | Further routes only with distinct intent and useful evidence |
| Cases | 10 cases, all published as `status: live` | Add verified UI captures and measurable outcomes as evidence becomes available |
| Pricing | `/precios/` publishes the scope-specific starting points and the Web Rescue entry offers from `pricing.ts`; B2B, systems, integrations and custom ecommerce stay discovery-led | Keep the published starting points current; no universal price list |
| i18n | Spanish only | Not planned; `.studio` is the English surface |

Do not document future content as shipped.
