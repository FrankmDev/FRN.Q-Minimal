---
name: frnq-business-visual-system
description: Mandatory visual system for frnq.es interfaces. Defines the current brutalist-commercial identity (Manrope + JetBrains Mono, #f4f3ef / #111110 / #ffe600, hard geometry, per-section composition, tokens, motion, responsive, accessibility) and the explicit bans against generic SaaS UI. Load before creating or modifying any frnq.es page, component, block, typography, composition, motion or responsive behavior.
license: MIT
compatibility: opencode
metadata:
  audience: design-and-frontend
  project: frnq.es
  scope: visual-identity
  opencode/slash: "true"
---

# frnq.es — Business Visual System

The official design language of **frnq.es**, the Spanish commercial surface of FRN.Q.
This skill is **mandatory** for every visual change: new pages, new blocks, new
components, and any edit to typography, composition, spacing, motion, color or
responsive behavior.

It describes the identity that **already exists in the codebase**. It does not
propose a redesign. If a change would require redesigning the surface, stop and
report it instead.

## What this identity is

**Commercial brutalism, industrial and compositional.**

- **Brutalist** — oversized type and numerals, hard `3px` borders, sharp corners,
  hard offset shadows (`6–16px 0 0`), no soft depth.
- **Industrial** — direct uppercase labels, ruled divisions, compact mono details,
  numbered sequences (`01 / 02`), slot-aligned signage.
- **Compositional** — deliberate scale shifts, asymmetry, off-axis alignment and
  visible changes in density between sections. Every section is composed, not filled.
- **Commercial** — communicates outcomes first (Ecommerce, B2B, systems, web) and
  leads the eye quickly to a single highlighted CTA.

## What this identity is not

- It is **not** a generic SaaS marketing template.
- It is **not** frnq.studio. `.studio` is a separate English editorial-minimal
  surface. Never import its visual language, spacing or restraint.
- It is **not** a card system. Components are plates, rules, numerals and type.

## Read the current interface first

Before designing anything, inspect the real implementation. Read in this order:

1. `src/pages/index.astro` — the section order and page shell.
2. `src/components/Hero.astro` — the single oversized commercial headline, the two
   local actions and the accent plate.
3. `src/components/Header.astro` — logo badge, bracket nav, theme toggle, yellow
   progress bar and mobile menu.
4. `src/components/Services.astro` — web-first accent feature plate followed by
   the three other service areas as offset-shadow plates on a three-column grid.
5. `src/components/WebRescue.astro` — ruled process, offset-shadow price plates,
   inverted market panel.
6. `src/components/HiddenCost.astro` — two-sided comparison, accent plus markers.
7. `src/components/Projects.astro` — ruled case rows with visible covers.
8. `src/components/About.astro` — grid intro and the inverted process panel.
9. `src/components/Contact.astro` and `src/components/Footer.astro` — the close.
10. `src/pages/soluciones/[slug].astro` and `src/pages/casos/*` — how the same
    vocabulary scales to inner pages.

Then read the sources of truth: `docs/ART_DIRECTION.md` → `docs/DESIGN.md` →
`docs/POSITIONING.md`. Code is the first truth, docs are the second.

**Extract the language, not the layout.** Reuse devices — the section tag plate,
the `title-mark` slab, dashed top rules, mono numerals, offset-shadow frames,
asymmetric headers, inverted ink panels, hard arrows (`→ ↗ ↘ ↑`). Do **not** copy a
previous section's grid and repeat it. The system deliberately changes composition
between sections.

## Palette and theme

Three colours carry the identity. Use the tokens, never raw hex in components.

| Role | Light (`:root`) | Dark (`[data-theme="dark"]`) |
|------|-----------------|------------------------------|
| Paper | `--bg` `#f4f3ef` | `--bg` `#171715` |
| Paper alt | `--bg-alt` `#eae9e4` | `--bg-alt` `#242421` |
| Elevated | `--bg-elevated` `#fbfaf7` | `--bg-elevated` `#2b2b27` |
| Ink | `--text` `#111110` | `--text` `#f4f3ef` |
| Ink secondary | `--text-secondary` `#343431` | `#d8d7d1` |
| Ink muted | `--text-muted` `#686862` | `#aaa99f` |
| Accent | `--accent` `#ffe600` | `#ffe600` (unchanged) |
| Ink on accent | `--text-on-accent` `#111110` | `#111110` |
| Border | `--border` `#111110` | `#f4f3ef` |
| Hairline | `--border-light` `rgb(17 17 16 / 16%)` | `rgb(244 243 239 / 18%)` |

- `--error` / `--success` exist **only** for functional form/status states. Never
  use them decoratively.
- Inverted regions use `background: var(--text); color: var(--bg);` and keep the
  accent for markers, numerals and rules. Always keep yellow-readable ink via
  `--text-on-accent`.
- Any new colour, per-section identity colour, gradient or tint is forbidden.
- The dark theme **inverts paper and ink roles**, it does not restyle. Any new
  surface must be verified in both themes (including SVG `data:` strokes and
  `currentColor` borders).

## Typography

- **Manrope** (`--font-sans`) carries display and body. **JetBrains Mono**
  (`--font-mono`) is reserved for short functional detail: section tags, labels,
  navigation, numbers, prices, metadata, counts. Mono is never used for prose.
- Weights: body 400–600, labels 600–700, display 800. The `800` weight is the
  signature; headings default to it through `--heading-weight`.
- Display headings: `clamp()` sizing, `line-height` 0.9–0.98, negative tracking
  (−0.05em to −0.085em), uppercase where composition calls for it — not
  indiscriminately. `.section-title` / `.st-light` are the deliberate lightweight
  exception (weight 300).
- Small labels: `0.625rem–0.8125rem`, weight 700, `letter-spacing` 0.06em–0.14em,
  uppercase.
- Prose is supporting: headings carry the weight, paragraphs stay short. Cap line
  length (`max-width` 27–46ch for support copy, ~68ch for the widest body copy).

## Geometry and structure

- **Radius is square.** `--radius-none: 0` is the default; do not introduce a
  rounded-card system. The only existing radii are small functional circles (the
  custom-cursor dot, mockup/status dots) and the thin scrollbar; no rounded panels,
  cards, buttons or inputs.
- **Borders are structural**: `3px` for plates/buttons, `4px` for hero/footer/form
  edges, `2px` for inline labels, `1px`/`--border-light` for hairlines.
- **Shadows are hard and offset only**: `--shadow-brutal` `6px 6px 0 0`,
  `--shadow-brutal-hover` `12px 12px 0 0`, `--shadow-brutal-lg` `16px 16px 0 0`, or
  an accent offset (`8px 8px 0 var(--accent)`). No blur, no layered soft depth.
- **Section top rules** use `repeating-linear-gradient(90deg, var(--border) 0 18px,
  transparent 18px 36px)` — the dashed industrial divider. It is functional
  structure, not decorative gradient.
- **The section tag** is a shared plate (`.section-tag`) that straddles the top
  rule: mono uppercase with a yellow square. Inner pages reuse it in flow
  (`.section-tag--inline` or the `soluciones` override).
- **`title-mark`** is the yellow underline slab used to mark the emphasized line of
  a section title.
- The page background carries a 32px grid and a 0.04-opacity noise layer
  (`body::before` / `body::after`). Leave them intact.
- Offset geometry, rotated decorative rings and slightly rotated numerals are
  allowed in small doses. Use a few devices per section, not all of them.

## Composition and per-section variance

- **One main idea per section.** One strong heading and at most one short
  supporting paragraph. Do not restate the same capability across hero, services,
  studio and contact.
- **Vary the composition.** The Home alternates: centered-asymmetric hero →
  web-first feature plate + ruled service index → ruled 4-step + offset price plates + inverted panel →
  two-sided comparison → ruled case rows → grid intro + inverted process panel →
  split contact. A new page must choose its own sequence; never default to a
  three-card grid.
- **Asymmetry is deliberate**: right-aligned section headings, offset numbering,
  unequal grid fractions (`0.78fr / 1.22fr`, `1.15fr / 0.85fr`), off-axis titles.
- **Respect hierarchy of weight**: numerals, contrast, oversized type and image
  crops carry attention; prose supports.
- Let big type be big and let negative space exist. Resist filling every region.

## Commercial hierarchy

Keep the depth and evidence of Ecommerce and B2B, while distinguishing the
**Home acquisition order** from the longer-term specialisation:

1. Web corporativa & SEO (Web & Growth) — the Home accent feature plate.
2. Ecommerce & Shopify.
3. Portales & Sistemas B2B.
4. Sistemas & Integraciones.

The case archive retains ecommerce accent / B2B inverted emphasis. Do not
rebuild the Home into the superseded 2×2 service grid. On inverted surfaces,
use `--text-accent-inverse` for accent text: yellow on ink in light mode, ink on
paper in dark mode. Yellow text on the inverted light panel is not readable.

Design, frontend, SEO, analytics, CRO, accessibility, performance and integrations
are **supporting capabilities**, never the headline. `HABLEMOS` (or the section
equivalent) is the only highlighted CTA; `STUDIO ↗` is always a secondary textual
link. Never merge or translate the two surfaces.

## CSS, tokens and Astro implementation

- **Native CSS only.** Astro scoped `<style>` per component. No Tailwind, no CSS-in-JS,
  no animation library, no new runtime dependency.
- **Use existing tokens** from `src/styles/tokens.css` for color, space, motion and
  z-index. Use `--space-*` for rhythm, `--transition-*` / `--motion-ease-out` for
  timing. Do not hardcode hex, ms or px shadow values that a token already covers.
- The global layer stays small (`tokens → typography → base → motion → utilities`).
  Components own their distinctive composition; do not dump one-off rules into
  `utilities.css`.
- **Data and copy live in `src/data/*`** and `src/content/projects/*`. Components
  render data; they do not hardcode structured content. Preserve the single source
  of truth.
- Reuse existing primitives: `.container`, `.section-tag`, `.title-mark`, the hard
  CTA pattern (3px border + accent offset shadow + hover `translate(-4px,-4px)` with
  a larger shadow), mono labels, ruled lists.
- **Evidence only.** No invented metrics, guarantees, testimonials, ratings or
  outcomes. KingBelt and Emilio Faraoni are in-development reference cases, not
  completed launches.

## Motion and interaction

- CSS-first, `transform`/`opacity` based, concise. A strong hover response or one
  restrained entrance is enough.
- Scroll reveal is centralized in `RevealObserver.astro` (`.reveal`, `.reveal-left`).
  Do not add a second reveal mechanism.
- Hover is enhancement, never a prerequisite for content or navigation.
- Always add a `@media (prefers-reduced-motion: reduce)` branch that disables the
  transitions/animations you introduce. Global reduced-motion handling already
  exists in `motion.css`; keep your additions consistent.
- Keep the custom cursor behavior intact (disabled on touch and reduced motion).

## Responsive recomposition

- **Recompose, don't shrink.** Use CSS Grid/Flexbox to change the layout per
  breakpoint: multi-column grids collapse, right-aligned headings flip to left,
  horizontal processes rotate to vertical rails.
- Fluid sizing with `clamp()` for type and spacing. Existing practical breakpoints:
  `380px`, `500px`, `540px`, `560px`, `640px`, `720px`, `760px`, `768px`, `820px`,
  `899px`, `900px`, `1024px`. Reuse them; do not invent a parallel scale.
- Fixed decisions worth preserving: header nav switches at `1024px`; the desktop
  hover cursor-mockup only runs on fine pointers above `768px`.
- Justify oversized display type on the narrowest viewport so it does not overflow
  (`overflow-wrap: anywhere` on long titles, tuned `font-size` at `≤380px`).
- Reserve space for images (aspect ratios) to prevent layout shift. Long labels must
  wrap without horizontal scroll.

## Accessibility (non-negotiable)

- Semantic HTML and landmarks; one `<h1>` per page. Mobile recomposition must not
  change reading order.
- **Visible focus** everywhere: `outline: 3px solid var(--text); outline-offset: 3px`
  (`4px` on CTAs, `-3px`/accent inside inverted case rows). Never remove focus
  outlines. The global `:focus-visible` rule is the baseline.
- Content and meaning must survive without color, hover or layout position. Do not
  rely on the yellow accent alone to signal meaning.
- Decorative geometry, numerals and glyphs get `aria-hidden="true"`.
- Preserve accessible names, labels, `aria-describedby`, error/status messaging and
  every field in the contact form contract. Never remove validation, errors or
  status regions for the sake of visuals.
- Maintain contrast in both themes, including yellow-on-ink surfaces.

## Anti-patterns — hard bans

Reject these in any generated design:

1. **Generic SaaS layouts** — centered hero + three equal feature cards + logo
   strip + testimonial + pricing tiers. This structure is forbidden.
2. **Rounded cards** — no 8/12/16px radii, no pill buttons, no rounded inputs.
3. **Glassmorphism** — no new frosted panels or blurs. The header's existing
   `backdrop-filter` is the only exception; do not add more.
4. **Gradients and glows** — no decorative gradients, blobs, mesh, soft glows or
   colored drop shadows. Only the functional dashed rules and grid lines remain.
5. **Decorative iconography** — no icon sets or illustration packs. Use typographic
   marks (`→ ↗ ↘ ↑ + − [ ] ✕`) and mono numerals.
6. **Repetitive blocks** — never apply one card template to every section.
7. **Excess text** — no paragraphs that restate the heading; no multi-paragraph
   feature blurbs; no FAQ walls inside marketing sections.
8. **Off-palette color** — no indigo/violet/blue-purple "AI" palettes, per-section
   colors or extra accents.
9. **Soft depth** — no blurred or multi-layer shadows; only hard offset shadows.
10. **frnq.studio editorial minimalism** — do not import its restraint, whitespace
    ratios or neutrals.
11. **False evidence** — no invented metrics, testimonials, guarantees or outcomes.

## How to design a new page

1. Read the interface files in the order listed above.
2. List the devices you can reuse (tag plate, `title-mark`, dashed rules, mono
   labels, numbered sequences, offset-shadow frames, inverted panels, hard arrows).
3. Choose a composition **per section** and write down the sequence before coding.
   Confirm no two sections repeat the same layout.
4. Map every piece of content to the existing data modules; add data to
   `src/data/*` (or a new content entry) instead of hardcoding in the component.
5. Compose with tokens, native CSS and the component's scoped `<style>`.
6. Recompose for the existing breakpoints.
7. Add reduced-motion handling and verify focus, contrast and reading order in both
   themes.
8. Keep the commercial hierarchy and the single highlighted CTA.
9. Verify with `bun run check` and `bun run build`.

## Pre-delivery checklist

- [ ] Palette limited to the three colours plus functional states; tokens used, no raw hex.
- [ ] Light and dark themes both correct (including SVG and `currentColor`).
- [ ] Manrope for display/body, JetBrains Mono only for functional detail.
- [ ] Square corners, hard offset shadows, no new radius or blur.
- [ ] At most one heading + one short support paragraph per section.
- [ ] Composition differs from neighbouring sections; asymmetry is intentional.
- [ ] Commercial hierarchy respected; `HABLEMOS` remains the only highlighted CTA;
      `STUDIO ↗` stays a secondary text link.
- [ ] Responsive recomposition at existing breakpoints; no overflow; no layout shift.
- [ ] Visible focus, semantics, labels, reduced-motion and both-theme contrast intact.
- [ ] No banned pattern from the anti-patterns list appears.
- [ ] Content comes from `src/data/*` / content collections; no invented evidence.
- [ ] `bun run check` and `bun run build` pass.

## Verification

No browser automation. Do not use Playwright, Puppeteer, screenshots or browser
inspection. Verify in code only: `bun run check` (`astro check`) and
`bun run build`. Report what actually ran; never claim a visual inspection that did
not occur.
