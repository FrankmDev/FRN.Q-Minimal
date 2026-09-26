# DESIGN — Technical System

This document explains how the visual direction in `ART_DIRECTION.md` is implemented.

## CSS architecture

`src/styles/app.css` is the only global entrypoint. Cascade order is intentional:

```css
@import "./tokens.css";
@import "./typography.css";
@import "./base.css";
@import "./motion.css";
@import "./utilities.css";
```

| File | Responsibility |
|------|----------------|
| `tokens.css` | Semantic color, spacing, typography families, motion and z-index variables. |
| `typography.css` | Global type defaults for body text, headings, paragraphs and links. |
| `base.css` | Element defaults, focus, selection, media and scrollbar. |
| `motion.css` | Global reduced-motion contract. |
| `utilities.css` | Shared container width, rendering and performance helpers. |

Components own their distinctive composition and scoped styles. Keep the global layer small and use existing tokens for color, spacing and motion.

## Tokens

The light-first palette and base system live in `src/styles/tokens.css`:

```css
--bg: #f4f3ef;  --bg-alt: #eae9e4;
--text: #111110; --text-secondary: #343431; --text-muted: #686862;
--accent: #ffe600;
--border: #111110; --border-light: rgb(17 17 16 / 16%);
--shadow-brutal: 6px 6px 0 0 var(--border);
```

- **Fonts:** `--font-sans` (Manrope), `--font-mono` (JetBrains Mono).
- **Space:** `--space-xs … --space-4xl`.
- **Layout:** `--layout-content-width`, `--layout-gutter`, `--layout-header-height`.
- **Motion:** `--motion-ease-out`, transition durations and reveal duration.
- **Corners:** square by default; do not introduce a rounded-card system.

Do not add identity colours outside `tokens.css`. Semantic error or status colours belong only to their functional UI states.

## Home composition

- `Hero.astro` owns the single oversized commercial headline, one brief statement, two local actions and a quiet external portfolio link.
- `Services.astro` maps the four commercial areas in `src/data/services.ts` to large-number blocks with one short description each.
- `HiddenCost.astro` is a two-part, factual comparison with three concise points per side.
- `Projects.astro` reads published cases from Content Collections, selects a small ordered subset for the Home and renders their covers visibly. `/casos/` and case-detail pages retain the complete case content.
- `About.astro` presents Francisco's independent practice and a four-phase, connected process timeline.
- `Contact.astro` keeps the production form contract and behavior from `src/data/contact-contract.ts`, `src/scripts/contact-form.ts` and `api/contact.ts`; visual changes must not remove fields, errors, status messages or accessible relationships. FAQ remains concise and secondary to the form.
- `Footer.astro` closes with the FRN.Q identity, contact, essential navigation and the external portfolio link.

The Home is a commercial visual summary, not a second case archive or a full service/process manual. The Astro data model, Content Collections, routes and JSON-LD remain the sources of truth. `siteConfig.email` is the public contact address and contact API recipient; sender credentials remain environment configuration.

## Typography and layout

Manrope carries display and body content. JetBrains Mono is for short labels, navigation, numbers and factual metadata. Oversized headings and numbers are balanced with short copy, responsive gutters and negative space. Home sections deliberately change composition; avoid repeating a neutral card-grid template.

Use CSS Grid or Flexbox to recompose for mobile. Images have intrinsic aspect ratios or reserved space to prevent layout shifts. Keep long labels and project names able to wrap without horizontal overflow.

## Motion and interaction

- CSS-first, transform/opacity based and restrained; no new animation dependency.
- Centralized `.reveal` behavior belongs to `RevealObserver.astro`.
- Hover is enhancement, never a prerequisite for content or navigation.
- Keep visible keyboard focus and disable non-essential motion under `prefers-reduced-motion: reduce`.

## Accessibility and SEO

- Preserve heading hierarchy, landmarks, labels, error descriptions, accessible names and semantic reading order.
- Decorative geometry and numerals are hidden from assistive technology when they add no content.
- Keep image alt text from the case collection.
- Preserve page metadata, sitemap, canonical URLs, case JSON-LD and visible FAQ content corresponding to structured data.
- One `<h1>` per page; ensure responsive layouts do not change reading order.

## Verification

Do not use browser automation, screenshots or browser inspection. Verify source with `bun run check` and production output with `bun run build`.
