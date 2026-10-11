# PRODUCT — frnq.es

## What this is

frnq.es is the Spanish **commercial surface** of FRN.Q, the independent digital practice of **Francisco Muñoz** (Granada, Spain). It is a static Astro site whose job is to explain what FRN.Q solves, show published work, and convert interest into a conversation. The homepage summarizes the offer; four focused solution routes cover distinct commercial search intents.

The professional/technical portfolio lives separately at **frnq.studio** (English) and is linked externally as `STUDIO ↗` everywhere (header, hero, mobile menu, contact and footer). HABLEMOS is the only highlighted CTA.

Client delivery can include **FRN.Q Portal** (`client.frnq.studio`), a separate private surface: an invite-only, read-only reference center (project information, files, billing and configured systems). It is not a public SaaS and has no open registration. frnq.es only mentions it in the after-launch FAQ. At the 2026-10-11 check the domain resolves, but its HTTPS certificate does not cover `client.frnq.studio` (`curl` error 60); the Vercel alias reaches the login page. No public "Acceso clientes" link is published until canonical HTTPS works. Domain attachment/DNS and certificate provisioning are an external hosting action, not a portal-backend change.

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

**Status: CURRENT.** The homepage composition is frozen. The current organic-search scope includes four static solution pages supported by distinct intent and enough factual scope to explain the services. No redesign, city doorway pages or additional routes without separate evidence.

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
- `/soluciones/desarrollo-web/` — corporate and custom web design/development, technical SEO, performance, accessibility and measurement, with national scope and natural Granada relevance on one canonical page.
- Pages explain scope, audiences, typologies, capabilities, process, deliverables/maintenance, integrations and FAQs. They state clearly when no directly related case has been published.
- No separate `/soluciones/web-seo/` or city page is created: those intents fold into the corporate-web route to avoid duplication.

### COMPLETE — Published work

- Ten published cases rendered from the `projects` content collection (via `src/data/projects.ts`).
- Neutral, factual descriptions with no outcome claims.
- Seven are `status: live`; KingBelt, Emilio Faraoni and Ilifielt are published as `status: in-development` with `publicPreview: true` and a visible status label.

### FUTURE — prepared, not shipped

- **KingBelt** and **Emilio Faraoni** remain in development: the storefront and the B2B system are publicly visible, but operational validation and commercial metrics are not asserted.
- Both already expose `serviceArea` (`ecommerce` / `b2b`) so the matching solution route can list them as evidence.
- Assigned outcomes are added only when real, verifiable evidence exists.

### FUTURE — not committed

- Case studies with evidenced outcomes (context, problem, users, system, flow, architecture, measurement).
- More service or location pages only if distinct intent and useful evidence-led content justify them.
- No language switch, no Business Mode, no hreflang work.

No deliverable is documented as done before its code and content exist. Documents mark CURRENT vs FUTURE explicitly.

## Engineering constraint

No browser automation. Do not use Playwright, Puppeteer or any similar tool for screenshots or browser inspection. Site work is code-only (`bun run build`); the site is never inspected in a browser.
