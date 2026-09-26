# frnq.es — Documentation Index

Source of truth for strategy, content, architecture and visual system of the Spanish commercial surface of FRN.Q. Code is the first truth; these documents are the second.

**Constraint:** no browser automation. Do not use Playwright, Puppeteer or any similar tool for screenshots or browser inspection. Work is code-only (`bun run build`).

## Order of reading

Read in this order before any significant change:

1. `POSITIONING.md` — what frnq.es is, audience, commercial hierarchy, language and evidence rules.
2. `PRODUCT.md` — purpose, principles, commercial model, roadmap.
3. `ARCHITECTURE.md` — real stack, tree, routing, data flow, CURRENT vs FUTURE.
4. `CONTENT.md` — content model, data modules, cases, engagement/pricing, how to add.
5. `SEO.md` — technical SEO wiring.
6. `ART_DIRECTION.md` → `DESIGN.md` — visual direction and its technical implementation.

Task-specific:

| Task | Read |
|------|------|
| Strategy / positioning | `POSITIONING.md` → `PRODUCT.md` |
| Copy or content | `CONTENT.md` |
| SEO / meta / schema | `SEO.md` |
| Visual / CSS | `ART_DIRECTION.md` → `DESIGN.md` |
| Tooling, commands, conventions | `DEVELOPMENT.md` |

## What each document contains

- **POSITIONING.md** — commercial definition, audience, hierarchy, value proposition, exclusions, `.es ↔ .studio` relationship, evidence rules, pricing philosophy.
- **PRODUCT.md** — product purpose, principles, commercial model, roadmap.
- **ARCHITECTURE.md** — stack, directory tree, layer responsibilities, routing, contact API, CURRENT vs FUTURE.
- **CONTENT.md** — data modules, cases collection and schema, vocabulary, how to add content.
- **SEO.md** — `<head>` primitives, canonical, robots, sitemap, OG, Schema.org.
- **DESIGN.md** — CSS architecture, tokens, typography, motion, accessibility.
- **ART_DIRECTION.md** — current visual direction, composition, vocabulary, scope boundary.
- **DEVELOPMENT.md** — commands, conventions, environment, principles.

## Hierarchy

1. Current code
2. `/docs`
3. `AGENTS.md`
4. Local comments

If docs and code disagree, report the discrepancy before making an architectural decision.
