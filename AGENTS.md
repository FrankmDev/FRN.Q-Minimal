# AGENTS.md — frnq.es

Execution protocol for any agent or developer working in this repository.

## What this is

frnq.es is the **Spanish commercial surface** of FRN.Q, the independent digital practice of Francisco Muñoz (Granada, Spain). It sells outcomes — ecommerce, B2B commerce, systems, web & growth — and links the English professional/technical portfolio at **frnq.studio** externally as `STUDIO ↗` (secondary textual link; never a highlighted CTA).

It is **not** a translation of frnq.studio, **not** an agency, and has **no** language switch or Business Mode.

**Status: CURRENT.** Preserve the existing commercial brutalist identity. The Home leads with **Web, comercio y sistemas**, shows web first and retains Ecommerce/B2B depth. The surface includes four solution pages, a distinct repair landing, agency collaboration, prices, support, ten cases and two decision-support guides. Web Rescue (`#revision-web`) remains the Home entry offer. Add further routes only for distinct intent and useful evidence-led content; no city or doorway pages. Prices live only in `src/data/pricing.ts`.

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
bun test         # contact API tests
bun run qa:build # static output audit, after build
```

## Structure

```
src/
├── components/   Header, Hero, Services, WebRescue, HiddenCost, Projects, About, Contact, Footer, SEOHead, CustomCursor, RevealObserver
├── content/projects/*.md   case studies (slug = filename)
├── content.config.ts
├── data/         site, navigation, services, solutions, pricing, web-rescue, support, engagement, contact, contact-contract, projects
├── layouts/MainLayout.astro
├── pages/        index, soluciones/[slug], soluciones/revision-web, precios/index, soporte/index, casos/index, casos/[slug], guias/index, guias/[slug], legal/index, legal/privacidad, 404
├── scripts/      contact-form, analytics, analytics-consent
└── styles/       app → tokens, typography, base, motion, composition, utilities
api/contact.ts
docs/
```

See `docs/ARCHITECTURE.md` for the full tree and responsibilities.

## Critical rules

- **Read before significant changes:** `docs/POSITIONING.md` → `docs/PRODUCT.md` → `docs/ARCHITECTURE.md` → `docs/CONTENT.md`.
- **Single source of truth.** Commercial copy and solution pages live in `src/data/*`; case content lives in `src/content/projects/*`. Do not duplicate.
- **Evidence only.** No invented metrics, guarantees, testimonials, ratings or outcomes. KingBelt, Emilio Faraoni and Ilifielt are published cases. Never invent sales metrics or outcomes.
- **Commercial hierarchy:** Home acquisition order is Web corporativa & SEO → Ecommerce & Shopify → Portales & Sistemas B2B → Sistemas & Integraciones. Ecommerce and B2B retain their specialisation depth and case emphasis. Design, frontend, SEO, analytics, CRO, accessibility, performance and integrations are supporting capabilities; automation belongs inside Sistemas & Integraciones.
- **Voice.** Yo / el estudio / FRN.Q. Never "nosotros" implying a team that does not exist.
- **Load the visual system skill before touching interfaces.** Any change to a page, component, typography, composition, color, spacing, motion or responsive behavior requires loading `.opencode/skills/frnq-business-visual-system/SKILL.md` first (`skill({ name: "frnq-business-visual-system" })`). It is the official design language of frnq.es and the mandatory gate for visual work. Do not modify interfaces without it.
- **No visual work in content tasks.** Content and documentation changes do not touch CSS, tokens or composition. See `docs/ART_DIRECTION.md` and `docs/DESIGN.md`.
- **`.studio` is external.** Link `STUDIO ↗` as the only portfolio label — header desktop and mobile menu, hero, contact and footer; HABLEMOS stays the only highlighted CTA. Never merge or translate the two surfaces.
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

## Skills (agent tooling)

- `.opencode/skills/frnq-business-visual-system/SKILL.md` — official frnq.es design
  language. Mandatory before any visual change (pages, components, typography,
  composition, motion, responsive). Load with `skill({ name: "frnq-business-visual-system" })`.

## Hierarchy

1. Current code
2. `/docs`
3. This file
4. Local comments

If docs and code disagree, report the discrepancy before making an architectural decision.

## Before pushing

`bun run check` and `bun run build` must pass.
