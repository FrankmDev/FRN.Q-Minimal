# AGENTS.md — frnq.es

Execution protocol for any agent or developer working in this repository.

## What this is

frnq.es is the **Spanish commercial surface** of FRN.Q, the independent digital practice of Francisco Muñoz (Granada, Spain). It sells outcomes — ecommerce, B2B commerce, systems, web & growth — and links the English professional/technical portfolio at **frnq.studio** externally as `STUDIO` in the header and `PORTFOLIO / EN` elsewhere.

It is **not** a translation of frnq.studio, **not** an agency, and has **no** language switch or Business Mode.

- Read `docs/POSITIONING.md` for the business definition and language rules.
- Read `docs/PRODUCT.md` for principles and roadmap.

## Stack

Astro 7 (static) · TypeScript strict · Bun 1.3 · Astro Content Collections · `@astrojs/sitemap`. No React, no animation library. Contact API is a Vercel Function (`api/contact.ts`).

## Commands

```bash
bun install
bun dev
bun run build
bun run check    # astro check
bun run lint     # alias of check
```

## Structure

```
src/
├── components/   Header, Hero, Services, HiddenCost, Projects, About, Contact, Footer, SEOHead, CustomCursor, RevealObserver
├── content/projects/*.md   case studies (slug = filename)
├── content.config.ts
├── data/         site, navigation, services, process, home, about, engagement, contact, contact-contract, projects
├── layouts/MainLayout.astro
├── pages/        index, casos/index, casos/[slug], 404
├── scripts/      contact-form
└── styles/       app → tokens, typography, base, motion, composition, utilities
api/contact.ts
docs/
```

See `docs/ARCHITECTURE.md` for the full tree and responsibilities.

## Critical rules

- **Read before significant changes:** `docs/POSITIONING.md` → `docs/PRODUCT.md` → `docs/ARCHITECTURE.md` → `docs/CONTENT.md`.
- **Single source of truth.** Commercial copy lives in `src/data/*`; case content lives in `src/content/projects/*`. Do not duplicate.
- **Evidence only.** No invented metrics, guarantees, testimonials, ratings or outcomes. Future cases (KingBelt, Emilio Faraoni) are prepared, not published.
- **Commercial hierarchy** (priority order): 1 Ecommerce & Shopify · 2 Portales / Commerce B2B · 3 Sistemas & Automatización · 4 Web, SEO & Growth. Design, frontend, SEO, analytics, CRO, accessibility, performance and integrations are supporting capabilities, never the headline.
- **Voice.** Yo / el estudio / FRN.Q. Never "nosotros" implying a team that does not exist.
- **No visual work in content tasks.** Content and documentation changes do not touch CSS, tokens or composition. See `docs/ART_DIRECTION.md` and `docs/DESIGN.md`.
- **`.studio` is external.** Link `STUDIO ↗` from the header and `PORTFOLIO / EN ↗` in contact/footer contexts; never merge or translate the two surfaces.
- **No browser automation.** Do not use Playwright, Puppeteer or any similar tool for screenshots or browser inspection. Verify in code only (`bun run check`, `bun run build`).

## Docs (source of truth after code)

- `docs/README.md` — index + reading order
- `docs/POSITIONING.md` — business definition, hierarchy, language, evidence, pricing
- `docs/PRODUCT.md` — purpose, principles, roadmap
- `docs/ARCHITECTURE.md` — stack, tree, routing, data flow, CURRENT vs FUTURE
- `docs/CONTENT.md` — data model, cases, vocabulary, how to add
- `docs/SEO.md` — technical SEO wiring
- `docs/ART_DIRECTION.md` — current visual direction and scope boundary
- `docs/DESIGN.md` — CSS system, tokens, typography, motion, accessibility
- `docs/DEVELOPMENT.md` — commands, conventions, environment

## Hierarchy

1. Current code
2. `/docs`
3. This file
4. Local comments

If docs and code disagree, report the discrepancy before making an architectural decision.

## Before pushing

`bun run check` and `bun run build` must pass.
