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
bun test         # unit tests (tests/*.test.mjs)
```

Verification is tests + `astro check` + build.

## Environment

- Contact API (server-only, Vercel): `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (a verified sender, e.g. `FRN.Q <hola@frnq.es>`).
- Optional durable rate limiting: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` + `KV_REST_API_TOKEN`). Without them the limiter uses per-instance memory only. `RATE_LIMIT_SALT` salts the client-IP hash.
- Delivery mailbox: `siteConfig.internalEmail` (the public `info@frnq.es` redirects internally to it).
- Never commit secrets. Never log keys.

### Rate limiting without Upstash/KV (fallback level of protection)

When no store is configured, `checkRateLimit` in `api/contact.ts` uses an in-memory `Map`. Confirmed behavior:

- **Rule:** 5 accepted submissions per rolling 10-minute window per salted client-IP hash; the 6th returns `429` with `Retry-After: 600`. The raw IP is never stored, only its salted SHA-256.
- **Scope:** the Map lives inside a single serverless instance. It is **not** shared across concurrent instances, regions or cold starts, so the effective limit is per warm instance, not per visitor.
- **Protection level: best-effort burst damping, not durable enforcement.** A naive repeat offender hitting the same warm instance is throttled; a distributed or high-concurrency attack that fans out across instances can exceed 5/10 min. It is a spam deterrent, not an abuse guarantee.
- **It never blocks legitimate leads:** a store outage degrades to memory, the honeypot is evaluated before rate limiting, and the memory map is pruned only when it grows past 5000 keys (loose, not per-request, bounding).
- For shared enforcement across instances, configure Upstash/Vercel KV. Do not add a second rate-limit system.

## Analytics

`src/scripts/analytics.ts` is dependency-free and **not connected to any provider by default** (verified against the live site). With no `window.__FRNQ_ANALYTICS__` configured it dispatches in-page `frnq:track` CustomEvents only: no network request, no cookies, no PII. The code supports `gtag`, `plausible`, `umami`, `dataLayer` or a custom `beacon` endpoint, but only one sink is ever used.

Events already emitted (no provider required to fire them): `cta_click` (header/hero, declarative `[data-track]`), `contact_method_click`, `studio_link_click`, and the form's `contact_form_submit`, `contact_form_success`, `contact_form_reset`, with categorical, non-personal props.

### Minimal connection (choose exactly one provider)

1. Load one provider's script once, in `MainLayout.astro` before the tracking module runs.
2. Configure the layer before `initTracking()`:

```html
<script is:inline>
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "plausible" };
</script>
```

Provider options (do not install more than one):

- **Plausible** — `<script defer data-domain="frnq.es" src="https://plausible.io/js/script.js"></script>`, `provider: "plausible"`.
- **Umami** — `<script defer data-website-id="<id>" src="https://<host>/script.js"></script>`, `provider: "umami"`.
- **GA4 / gtag** — the standard gtag snippet, `provider: "gtag"`.
- **GTM dataLayer** — `window.dataLayer = window.dataLayer || []`, `provider: "dataLayer"`.
- **Custom collector** — `{ enabled: true, provider: "beacon", endpoint: "https://…" }`; events are POSTed with `sendBeacon` (fetch fallback).

3. Consent: forwarding requires `getConsent() === true` unless `requireConsent: false`. There is no CMP installed, so a consent UI must call `window.__frnqAnalytics.setConsent(true)`. Set `requireConsent: false` only for a cookieless provider that legally needs no consent — that is a legal decision, not a code default.

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
