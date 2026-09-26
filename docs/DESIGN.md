# DESIGN — Technical System

This document explains **how** the current visual direction is implemented. Read `ART_DIRECTION.md` for intent and the scope boundary.

> **Status:** CURRENT. The visual system is implemented and **frozen for the content/strategy reconstruction** described in `POSITIONING.md`. That work changes meaning and structure, not composition or CSS. Any visual change requires a separate, explicit task.

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
| `typography.css` | Global type defaults for `body`, headings, paragraphs and links. |
| `base.css` | Element defaults, focus, selection, media, scrollbar. |
| `motion.css` | Global reduced-motion contract. |
| `utilities.css` | Rendering, containment and performance helpers. |

Components and sections own their distinctive layout, motion and scoped `<style>`. Global files provide shared constraints only.

## Tokens (current)

Light-first, semantic variables on `:root`:

```css
--bg: #f4f3ef;  --bg-alt: #eae9e4;
--text: #111110; --text-secondary: #343431; --text-muted: #686862;
--accent: #ffe600;
--border: #111110; --border-light: rgb(17 17 16 / 16%); --border-strong: #111110;
--shadow-brutal: 6px 6px 0 0 var(--border);
```

- **Fonts:** `--font-sans` (Manrope), `--font-mono` (JetBrains Mono).
- **Space scale:** `--space-xs … --space-4xl`.
- **Layout:** `--layout-content-width`, `--layout-gutter`.
- **Motion:** `--motion-ease-out` (cubic-bezier 0.16, 1, 0.3, 1) with fast/base durations and `--motion-reveal-duration`.
- **Radius:** sharp corners in scoped component styles.

Do not introduce new identity colors outside `tokens.css`.

## Typography

| Role | Family | Use |
|------|--------|-----|
| Body / UI | Manrope | Copy, headings, form inputs. |
| Functional | JetBrains Mono | Navigation, indexes, labels, technical metadata. |

Headings are heavy (800) with tight tracking (`-0.04em`) and balanced text. Body copy uses `text-wrap: pretty`.

## Composition primitives

`utilities.css` provides the shared container width and responsive gutters. Section layouts remain in their scoped component styles.

## Motion and interaction

- CSS-first; animate `transform` and `opacity` where possible.
- One strong interaction per component.
- No animation dependency (no GSAP, no WebGL, no decorative canvas).
- Scroll reveal is centralized in `RevealObserver.astro` over `.reveal`.
- `motion.css` collapses animation/transition globally under `prefers-reduced-motion: reduce`.

## Accessibility

- Headings and copy are real text.
- Decorative geometry is hidden from assistive technology (`aria-hidden`).
- Meaning never depends on color, position or hover alone.
- Visible focus and WCAG contrast preserved.
- Keyboard use and reduced motion preserved.
- One `<h1>` per page; semantic reading order regardless of visual placement.

## Responsive

Mobile is a recomposition, not a scaled desktop. Keep the dominant hierarchy and negative space; reduce secondary metadata; avoid horizontal overflow.

## Scope boundary (content reconstruction)

- No changes to `tokens.css`, `typography.css`, `utilities.css` or component scoped styles as part of content-only work.
- No new components, no restyling, no layout changes.
- Content and CSS are separate concerns: this reconstruction touches copy and documentation only.

## Engineering constraint

No browser automation. Do not use Playwright, Puppeteer or any similar tool for screenshots or browser inspection. Verify in code only (`bun run build`).
