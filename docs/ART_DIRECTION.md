# ART DIRECTION — frnq.es

## Purpose

frnq.es is the Spanish commercial surface of FRN.Q: an independent digital practice led by Francisco Muñoz. The Home is a visual commercial summary, not a complete catalogue of every service, process and capability. It should make the offer legible quickly and lead visitors towards selected work or direct contact.

## Aesthetic

**Commercial brutalism with strong visual composition.**

- **Brutalist:** oversized type and numerals, hard borders, sharp corners and occasional offset shadows.
- **Industrial:** direct labels, ruled divisions, compact mono details and purposeful alignment.
- **Compositional:** scale shifts, asymmetry, image-led case rows and deliberate changes in density between sections.
- **Commercial:** the Home leads with web and the improvement of existing sites, then ecommerce, B2B commerce and systems; design, development, SEO, analytics and integrations support those outcomes.

The warm off-white `#f4f3ef`, near-black `#111110` and yellow `#ffe600` remain the shared palette. Manrope carries display and body text; JetBrains Mono is reserved for concise functional details. Do not add identity colours per section.

An optional dark theme inverts the paper and ink roles while retaining the same yellow accent and hard-edged composition.

## Composition and content density

- One main idea per section; use one strong heading and at most one short supporting paragraph.
- Give the Home negative space and visible pacing. Avoid repeating the same capability in the hero, service cards, studio introduction and contact area.
- Let numerals, contrast, image crops and large type carry the visual weight; prose is supporting information.
- Services remain four compact areas. The Home leads with **Web corporativa & SEO** as a full-width feature plate and follows with the other three as a ruled commercial index; each area states one problem, one outcome and a link to its page. Operational friction is a visual comparison, not a long problem catalogue.
- The **Revisión y reparación web** (Web Rescue) block keeps the same ruled headings, mono labels, hard frames and yellow accent as the rest of the Home; it introduces no second visual identity and stays a single compact section.
- Cases remain factual and sourced from Content Collections. The Home shows a small selection; `/casos/` holds the full case studies.
- The studio section introduces the person and a four-step process at most. Contact is the close: keep the real form, reduce surrounding promotion.
- Use a marquee only when it acts as a deliberate graphic gesture. It is not a required section device.

## Typography and image

- Large, heavy headings lead; sentence case or uppercase is chosen for composition, not applied indiscriminately.
- Mono labels stay small and useful: section cues, numbers, dates and navigation.
- Case imagery is rectangular, local and factual. Let selected covers be visible in the Home list; do not turn each row into a miniature case study.
- Keep imagery evidence-led. Do not add stock art or invented project outcomes.

## Visual vocabulary

Rules, giant numerals, arrows, yellow fields, hard frames, off-axis alignment, image strips and occasional hard shadows are available. Use a small number of devices per section and vary composition across sections rather than applying one card template throughout.

## Motion

- CSS-first, concise and purposeful: a strong hover response or a restrained entrance is enough.
- Scroll reveal is centralized in `RevealObserver` where possible.
- Respect `prefers-reduced-motion`; interactions and content remain usable without motion or JavaScript.

## Anti-patterns

No false metrics, guarantees, testimonials, availability claims or invented outcomes. Do not revive “Webs Premium / Cero plantillas” or the old template-versus-infrastructure pitch. Avoid SaaS layouts, rounded neutral cards, glass, gradient blobs, stock imagery, decorative telemetry and `.studio`-style editorial minimalism.

## Accessibility and boundaries

- Structure remains semantic, keyboard-operable and understandable without colour, hover or layout position.
- Preserve clear focus states, accessible names, form labels and reduced-motion support.
- The Home keeps its visual identity and adds one commercial block (Web Rescue). The four SEO solution routes reuse the same typography, palette, hard-edge language and tokens; they do not introduce a second visual identity or redesign the commercial surface.
- frnq.es and frnq.studio are separate surfaces. frnq.studio is linked everywhere as `STUDIO ↗` (secondary textual link); HABLEMOS is the only highlighted CTA. Do not merge or translate its visual system.

## Agent tooling

This direction is operationalized for agents in the mandatory skill
`.opencode/skills/frnq-business-visual-system/SKILL.md`. Load it before designing
or modifying any frnq.es interface.
