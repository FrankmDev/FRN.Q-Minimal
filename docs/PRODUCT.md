# PRODUCT — frnq.es

## What this is

frnq.es is the Spanish **commercial surface** of FRN.Q, the independent digital practice of **Francisco Muñoz** (Granada, Spain). It is a static Astro site whose job is to explain what FRN.Q solves, show published work, and convert interest into a conversation. The homepage summarizes the offer; three focused solution routes cover distinct commercial search intents.

The professional/technical portfolio lives separately at **frnq.studio** (English) and is linked externally as `STUDIO ↗` everywhere (header, hero, mobile menu, contact and footer). HABLEMOS is the only highlighted CTA.

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
9. **Keep the home identity stable.** The existing home composition, visual identity and shared tokens remain frozen. Focused SEO routes reuse the existing design language; do not redesign the commercial surface.
10. **Progressive enhancement.** The site works without JS; JS adds polish.

## Commercial model

The hierarchy (see `POSITIONING.md`):

1. ECOMMERCE & SHOPIFY
2. PORTALES & SISTEMAS B2B
3. SISTEMAS & INTEGRACIONES
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

**Status: CURRENT.** The homepage composition is frozen. The current organic-search scope includes three static solution pages supported by distinct intent and enough factual scope to explain the services. No redesign, city doorway pages or additional routes without separate evidence.

### COMPLETE — Spanish commercial surface

- Single-page composition: Hero → Solutions → Operation → Cases → Studio → Contact, plus Footer.
- Content driven by `src/data/*`: `site`, `navigation`, `services`, `solutions`, `contact`, `contact-contract`, `projects`, `engagement`.
- Contact form with validation contract and Aviso legal / Privacidad pages under `/legal/`.
- Documentation set in `docs/`.
- frnq.studio linked externally as `STUDIO ↗`.

### CURRENT — Search-intent solution pages

- `/soluciones/ecommerce/` — ecommerce and Shopify development for D2C businesses.
- `/soluciones/b2b/` — customer portals, private catalogues/pricing and B2B orders.
- `/soluciones/sistemas/` — business-system integrations and operational workflows.
- `/soluciones/web-seo/` is not created: web/SEO remains the fourth supporting capability, and current evidence does not justify a distinct broad landing page.
- Pages explain scope, audiences, process, integrations and FAQs. They state clearly when no directly related case has been published.

### COMPLETE — Published work

- Six published cases rendered from the `projects` content collection (via `src/data/projects.ts`).
- Neutral, factual descriptions with no outcome claims.

### FUTURE — prepared, not shipped

- **KingBelt** — Ecommerce D2C / Shopify. In development.
- **Emilio Faraoni** — Portales & Sistemas B2B. In development.
- Both stay unpublished until they ship with real evidence; no entries exist yet.

### FUTURE — not committed

- Case studies with evidenced outcomes (context, problem, users, system, flow, architecture, measurement).
- More service or location pages only if distinct intent and useful evidence-led content justify them.
- No language switch, no Business Mode, no hreflang work.

No deliverable is documented as done before its code and content exist. Documents mark CURRENT vs FUTURE explicitly.

## Engineering constraint

No browser automation. Do not use Playwright, Puppeteer or any similar tool for screenshots or browser inspection. Site work is code-only (`bun run build`); the site is never inspected in a browser.
