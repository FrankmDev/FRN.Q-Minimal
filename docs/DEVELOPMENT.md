# DEVELOPMENT

## Requirements

- Bun `1.3.14` (see `packageManager` in `package.json`).
- Node 20+ available for tooling.

## Commands

```bash
bun install
bun dev          # localhost:4321
bun run build    # → dist/
bun run preview  # serve dist
bun run check    # astro check
bun run lint     # astro check (alias)
```

There is no separate test runner. Verification is lint + build.

## Environment

- Contact API (server-only, Vercel): `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`.
- Delivery mailbox: `siteConfig.internalEmail` (the public `info@frnq.es` redirects internally to it).
- Never commit secrets. Never log keys.

## Conventions

- **Astro-first.** Static output; no adapter, no SSR, no middleware.
- **Minimal JS.** Scripts live in `src/scripts/*` or component scoped scripts. No animation library.
- **TypeScript strict.** Prefer typed data modules in `src/data/*`.
- **Single source of truth.** Commercial copy lives in `src/data/*`; case content lives in `src/content/projects/*`. Components consume, they do not duplicate.
- **Content vs visual separation.** Content tasks do not modify CSS, tokens or composition.
- **No speculative abstractions.** No universal mega-components; extract only after two real consumers.
- **Accessibility and performance are requirements.**

## Imports

- `astro:content` for collections.
- `astro:assets` (`Image`, `getImage`) for all local images.
- Relative imports within `src/`; `data/*` accessors for typed content.

## Content vs code

| Change | Where |
|--------|-------|
| Commercial copy | `src/data/*.ts` |
| Case study | `src/content/projects/<slug>.md` + `src/assets/projects/<case>/` |
| Layout / structure | `.astro` component (composition only) |
| Visual system | `src/styles/*` (separate visual task only) |

## Engineering constraint

No browser automation. Do not use Playwright, Puppeteer or any similar tool for screenshots or browser inspection. Work is code-only; verify with `bun run check` and `bun run build`.
