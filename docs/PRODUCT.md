# PRODUCT — frnq.es

## What this is

frnq.es is the Spanish **commercial surface** of FRN.Q, the independent digital practice of **Francisco Muñoz** (Granada, Spain). It is a single, static, high-performance Astro site whose job is to explain what FRN.Q solves, show published work, and convert interest into a conversation.

The professional/technical portfolio lives separately at **frnq.studio** (English) and is linked externally as `STUDIO ↗` in the header and `PORTFOLIO / EN ↗` in contact/footer contexts.

See `POSITIONING.md` for the authoritative business definition and language rules.

## Purpose of the site

1. Explain the commercial offer in business terms (problems → outcomes).
2. Show published work credibly, without invented results.
3. Establish trust through directness and evidence, not claims.
4. Convert interest into contact.

## Product principles

1. **One platform, one surface.** A single Spanish commercial site. No modes, no language switch, no parallel `/es/` route.
2. **Problem-first copy.** Every block starts from a real business problem, then the outcome.
3. **Evidence over claims.** No metric, guarantee or testimonial without proof.
4. **Single person, stated openly.** Direct execution by Francisco Muñoz. Never imply a larger team.
5. **One source of truth per content type.** All editable copy and lists live in `src/data/*` and are consumed by components. Components do not hardcode structured content.
6. **Capabilities as means.** Design, frontend, SEO, analytics, CRO, accessibility, performance and integrations support the commercial areas; they are never sold as the headline.
7. **Simplicity over cleverness.** Static Astro, minimal JS, CSS-driven motion, no unnecessary runtime.
8. **Performance and accessibility are requirements**, not aspirations.
9. **No visual work in the content reconstruction.** Copy and documentation change; composition and CSS do not.
10. **Progressive enhancement.** The site works without JS; JS adds polish.

## Commercial model

The hierarchy (see `POSITIONING.md`):

1. ECOMMERCE & SHOPIFY
2. PORTALES / COMMERCE B2B
3. SISTEMAS & AUTOMATIZACIÓN
4. WEB, SEO & GROWTH

Engagement is either a closed project, a continuous (non-retainer) collaboration, or a discovery session. Pricing is scope-specific and agreed after discovery; public numbers are orientation only.

## What frnq.es is not

- Not a translation of frnq.studio.
- Not an agency.
- Not a portfolio-first art piece (that is `.studio`).
- Not a template marketplace or a "premium web" boutique.
- Not a blog or content publication.
- Not a multi-mode platform.

## Roadmap

No dates. Conceptual order.

### CURRENT — Spanish commercial surface

- Single-page composition: Hero → Services → Problems → Projects → Studio/About → Contact, plus Footer.
- Content driven by `src/data/*`: `site`, `navigation`, `services`, `process`, `projects`, `engagement`, `contact`, `home`, `about`.
- Documentation set in `docs/`.
- frnq.studio linked externally as portfolio.

### CURRENT — Published work

- Six published projects rendered from `src/data/projects.ts`.
- Neutral, factual descriptions with no outcome claims.

### FUTURE — prepared, not shipped

- **KingBelt** — Ecommerce D2C / Shopify. In development.
- **Emilio Faraoni** — Sistema / Portal B2B. In development.
- Both are documented as `futureCases` and stay unpublished until they ship with real evidence.

### FUTURE — not committed

- Case studies with evidenced outcomes (context, problem, users, system, flow, architecture, measurement).
- Dedicated service pages if a distinct product decision requires them.
- No language switch, no Business Mode, no hreflang work.

No deliverable is documented as done before its code and content exist. Documents mark CURRENT vs FUTURE explicitly.

## Engineering constraint

No browser automation. Do not use Playwright, Puppeteer or any similar tool for screenshots or browser inspection. Site work is code-only (`bun run build`); the site is never inspected in a browser.
