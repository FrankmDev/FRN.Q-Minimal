# ART DIRECTION — frnq.es

> **STATUS: CURRENT — FROZEN DURING THE CONTENT RECONSTRUCTION.**

This document records the visual direction already implemented. The current task rebuilds strategy, content and documentation; it **does not** change art direction. Any visual change requires a separate, explicit task. `DESIGN.md` owns technical implementation; this document owns intent.

## Why

frnq.es is the **commercial** surface, not the technical portfolio. Its visual job is to feel considered, direct and trustworthy — closer to an industrial editorial system than to a generic agency landing page. The composition stays quiet so the commercial content (problems, outcomes, evidence) leads.

## Aesthetic

**Minimal industrial editorial brutalism.**

- **Brutalist:** composition, scale, hierarchy and contrast; hard borders and hard shadows; sharp corners.
- **Industrial/editorial:** ruled structure, indexes, real metadata, generous negative space, a single restrained accent.
- **Personality:** clarity and rhythm — not decoration, terminal theatre or fake telemetry.

The light `#f4f3ef` base, near-black `#111110` foreground, single yellow accent `#ffe600`, Manrope body and JetBrains Mono metadata are the palette foundation. They are tokens, not per-section choices.

## Composition and rhythm

- One dominant element per viewport, one or two secondary elements, quiet metadata.
- Sections alternate dense / sparse; not every block shares the same template.
- The grid aligns; it does not force a filled layout. Empty space is an active element.
- Asymmetry is allowed, but it must reveal an underlying order.

## Typography and image

- Heavy display headings establish hierarchy; mono carries navigation, indexes and real technical metadata.
- Imagery is rectangular and local (case covers and galleries through `astro:assets`). No rounded images, no generic stock.
- Case imagery is evidence; it is not decorative filler.

## Visual vocabulary

Allowed devices: rules, real section indexes, large numerals, arrows, small squares, technical labels, offset rectangles, hard borders.

Use one to three relevant devices per section, never the whole vocabulary at once.

## Motion

- Precise and fast. One strong interaction per component.
- CSS-first; scroll reveal centralized in `RevealObserver`.
- All motion collapses under `prefers-reduced-motion`.

## Anti-patterns

No fake military UI (CLASSIFIED/CLEARANCE), decorative coordinates, fake percentages or telemetry, arbitrary IDs/hashes, glitch spam, cyberpunk interfaces, SaaS card grids, glassmorphism, rounded containers, gradient blobs or stock photography.

## Accessibility

Structural, not decorative: never communicate through position, color or hover alone; keep headings and copy as real text; mark decoration appropriately; preserve contrast, focus and reduced motion.

## Scope boundary

- The content reconstruction changes copy, data and documentation only.
- It does not touch `tokens.css`, `typography.css`, `utilities.css`, component scoped styles or assets.
- frnq.es and frnq.studio are separate surfaces with separate visual systems. Do not import `.studio` art direction here, and do not link them visually.
