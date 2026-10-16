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
bun run qa:build # audit generated HTML; run after build
```

Verification is tests + `astro check` + build + `qa:build`. The static audit checks unique metadata, canonical/robots/sitemap alignment, heading structure, ARIA references, local links/fragments/assets, JSON-LD and visible FAQ agreement, published prices, in-development case labels and CTA preselection. It does not replace manual accessibility/responsive review, deployed API verification or field measurements; no browser automation is used.

`bun run qa:build /absolute/path/to/output` audits an isolated build too. It also checks that accept/reject controls and Footer preferences exist exactly when GA4 configuration is rendered, with no direct Google tag script in the HTML before permission. A fixture Measurement ID is for a local build only; do not add one to production configuration.

## Environment

- Contact API (server-only, Vercel): `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (a verified sender, e.g. `FRN.Q <info@frnq.studio>`).
- Optional GA4 (client, build-time): `PUBLIC_GA4_MEASUREMENT_ID` (a `G-…` Measurement ID). Absent or malformed → no analytics configuration is rendered and the layer stays in-page only. `PUBLIC_*` values ship in the HTML, so the ID is public by design and never a secret.
- Optional durable rate limiting: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` + `KV_REST_API_TOKEN`). Without them the limiter uses per-instance memory only. `RATE_LIMIT_SALT` salts the client-IP hash.
- Delivery mailbox: `siteConfig.internalEmail` (the same address as the public contact, `info@frnq.studio`; no redirect involved).
- Never commit secrets. Never log keys.

### Rate limiting without Upstash/KV (fallback level of protection)

When no store is configured, `checkRateLimit` in `api/contact.ts` uses an in-memory `Map`. Confirmed behavior:

- **Rule:** 5 non-honeypot attempts per 10-minute window, counted from the first attempt for each salted client-IP hash; later attempts return `429` with `Retry-After` for the remaining window. Invalid submissions also consume attempts. The raw IP is never stored; if SHA-256 is unavailable, requests share a fallback bucket rather than storing an address in clear text.
- **Scope:** the Map lives inside a single serverless instance. It is **not** shared across concurrent instances, regions or cold starts, so the effective limit is per warm instance, not per visitor.
- **Protection level: best-effort burst damping, not durable enforcement.** A naive repeat offender hitting the same warm instance is throttled; a distributed or high-concurrency attack that fans out across instances can exceed 5/10 min. It is a spam deterrent, not an abuse guarantee.
- **Degraded operation:** a store outage falls back to memory and the honeypot is evaluated before rate limiting. Expired memory entries are pruned on the existing-key path when the map grows past 5000 keys; this is not a hard size cap. Visitors sharing an IP (or the hash-unavailable bucket) share a limit; the response offers email as an alternative.
- For shared enforcement across instances, configure Upstash/Vercel KV. Do not add a second rate-limit system.

## Contact responses and no-JS flow

The shared contract in `src/data/contact-contract.ts` supplies the HTML limits/options, client validation and API validation. `POST /api/contact` accepts JSON or URL-encoded form data. Enhanced submissions request JSON and show inline states; a normal navigation with `Accept: text/html` receives a standalone Spanish result page with the actual success/error status, field-error messages, a return link and an email alternative. There is no success redirect or query-string receipt.

The native result is `no-store`, `noindex, nofollow`, has a restrictive CSP and never reflects submitted personal data. `/contact-result.css` is a prerendered CSS endpoint reusing the existing tokens; Astro remains static. Honeypot acknowledgements are not delivered or counted as enhanced conversions. Success means the mail provider accepted the request, not proof of inbox delivery. Tests mock the provider: a real delivery check still requires the configured deployment and an authorised submission.

## Analytics

`src/scripts/analytics.ts` is dependency-free and **not connected to any provider by default**. With no `window.__FRNQ_ANALYTICS__` configured it dispatches in-page `frnq:track` CustomEvents only: no network request, no cookies, no PII. The code supports `gtag`, `plausible`, `umami`, `dataLayer` or a custom `beacon` endpoint, but only one sink is ever used. GA4 is the only provider the layer loads itself (see below); every other vendor script must be loaded by the consent layer.

Events already emitted (no provider required to fire them): `page_view` (once per document, with a categorical `page_type`), `solution_view` / `case_view` (entering an allowlisted solution or case page), `cta_click`, `case_click`, `contact_view` (first contact view in the session), `contact_method_click` (email / direct contact, via `method`), `studio_link_click`, `contact_form_start` (first field engagement in the document), `contact_form_submit`, `contact_form_success`, `contact_form_error` and `contact_form_reset`. Solution CTA placements are distinct: `solution_hero`, `solution_buyer_journey`, `solution_deliverables` and `solution_related`; case links use `solution_evidence`.

- `page` is checked against a build-generated route allowlist including solutions, published cases and guides (`MainLayout.astro`); unknown paths become `/404/`. Query strings and unknown props are never forwarded.
- `page_view` / `solution_view` / `case_view` fire once per document (`initTracking()` is idempotent); a browser reload is a new document and therefore a new view. `page_type` is derived from the route allowlist (`home`, `solution`, `guide`, `support`, `pricing`, `agency`, `case_index`, `case`, `legal`, `not_found`), never from the raw URL.
- `last_solution` / `last_case` retain only allowlisted, last-consulted paths in per-tab `sessionStorage`, so contact events keep commercial context without changing the API payload. This is last-viewed context, not a claim of first-touch/campaign attribution. With no provider the context stays local. It is not remembered for a consent-required provider before permission, and denial clears it and blocks forwarding even for an exempt provider. An explicit consent choice also applies in memory when `localStorage` fails; blocked session storage degrades safely, without cross-page context.
- Form props contain only approved type/budget values and `hasCompany`, never name, email, company text or message. Error reasons distinguish `rate_limited` (429), `validation`, `request_failed`, `server`, `invalid_response`, `timeout`, `offline` and `network`.
- `contact_form_success` requires an OK JSON response with `success: true` and the current opaque submission ID echoed by the API; honeypot acknowledgements are not counted. Dedup storage accepts only opaque submission IDs and `contact-view`.
- Legacy `?contacto=enviado&ref=…` is not a verified receipt: it neither hides the form nor reports conversion. Return parameters are removed without storing their values; unrelated campaign parameters are preserved in the browser but not forwarded to GA4. The native POST result is rendered by the API without a tracking script and is not measured as a confirmed conversion.

### GA4 (implemented; off until configured and consented)

GA4 is the only provider the layer loads itself. `MainLayout.astro` reads the
build-time variable `PUBLIC_GA4_MEASUREMENT_ID`; when it is a valid `G-…`
Measurement ID it renders one inline configuration
(`{ enabled: true, provider: "gtag", measurementId, requireConsent: true }`).
When the variable is absent or malformed nothing is rendered and the layer stays
in-page only.

- **No identifier is invented or committed.** The ID must come from the
  deployment environment (Vercel → Project → Environment Variables). Add it for
  Production (and Preview if wanted) and redeploy: `PUBLIC_*` values are inlined
  at build time, so a rebuild is required for a change to take effect.
- **Consent-gated loading.** `loadAnalyticsProvider()` injects the `gtag.js`
  stub and script only after `getConsent() === true`. Before consent there is no
  network request, no cookie and no `dataLayer`. GA4 is non-essential and is
  never treated as an exempt provider.
- **Built-in choice.** A valid configured ID also renders `AnalyticsConsent.astro` with accept/reject controls and a Footer preferences button. No provider means no banner. The choice is valid for 180 days, can be changed at any time and still applies in memory if storage is blocked. No external CMP dependency is required. Withdrawal stops forwarding, sets GA4's opt-out flag, clears per-tab analytics context/dedup storage and deletes accessible first-party `_ga` cookies.
- **GA4 privacy defaults.** The command queue uses `Arguments` objects. Configured `page_location` contains only an allowlisted canonical route, `page_referrer` is empty and `page_title` is categorical, including on unknown URLs. Google signals and advertising personalisation are disabled; cookies use the current host, expire after 180 days and are not renewed automatically. These controls do not make GA4 cookieless or remove the need to review the provider's settings and legal terms.
- **One page view.** GA4 is configured with `send_page_view: false`; the
  first-party `page_view` is the single source, so page views are not
  double-counted. If consent is granted after the first view, that view is
  forwarded once.
- **Durable de-dup.** `initTracking()` runs once per document; confirmed
  submissions are de-duplicated by opaque submission ID in `sessionStorage`.
- **Fail-safe.** A blocked script, a failing provider or unavailable storage
  never breaks navigation, the contact form or the page.

**Still pending outside the code (not verifiable here):**

1. A real GA4 Measurement ID in the Vercel environment. At the 2026-10-16 HTTP audit the live Home exposed no configuration, tag or Measurement ID. Local emission tests are **not** proof of production measurement or access to the hosting environment.
2. In the GA4 web stream, disable **all Enhanced Measurement** (automatic page views, scrolls, outbound links, site search, video, downloads and form interactions). The first-party layer owns events and safe URL parameters; automatic collection could duplicate events or collect data outside that layer. Also disable any separately configured user-provided-data collection and audit existing Google tags/GTM before enabling this ID.
3. Review data retention, internal-traffic filters, Google signals/ads settings, processor terms and international-transfer disclosures. Do not claim an EU-only processing setting or legal certification from this implementation.
4. Verify acceptance, rejection, withdrawal and actual event reception in the configured deployment. A lightweight banner is implemented; legal review and reception checks remain external.

### Verifying reception in GA4 DebugView

The layer only proves the event was **emitted**; reception is proven in GA4.

1. Set `PUBLIC_GA4_MEASUREMENT_ID` and rebuild/redeploy.
2. Enable debug mode for your own browser (for example with the Google Analytics Debugger extension) and open GA4 → Admin → Data display → **DebugView**. Opening DebugView alone does not enable debug events. Do not add permanent `debug_mode` to production. Because consent is required, reception stays empty until consent is granted — that is expected, not a bug.
3. Grant consent through the built-in banner and reload. Events appear as they fire: `page_view`, then
   `solution_view` / `case_view` on those pages, `contact_form_start` on the
   first field focus, `contact_method_click` on the email card, and
   `contact_form_success` only after a real, server-confirmed submission.
4. Inspect the parameters of each event: `page`, `page_type`, `last_solution`,
   `last_case`, `location`, `label`, `method`, `slug`, `type`, `budget`,
   `hasCompany`, `reason`. No name, email, message or other free text is sent.
5. Sanity checks: a reload gives a new `page_view` (expected); re-running
   `initTracking()` in the same document does not; repeating a submission with
    the same opaque ID counts once.
6. Verify that no GA request occurs before accepting, after rejecting or after withdrawal from Footer preferences; inspect `page_location`, `page_title` and `page_referrer` for canonical/categorical values, including on a URL containing a dummy query and unknown path. Recheck that Enhanced Measurement is off. This is a manual deployment checklist, not a claim of checks run by the agent.

### Alternatives (load at most one; the CMP owns the vendor script)

These remain supported but are not auto-loaded by `analytics.ts`; if one is
chosen instead of GA4, load its script yourself (consent-aware) and configure
`window.__FRNQ_ANALYTICS__` before `initTracking()`:

```html
<script is:inline>
  window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "plausible" };
</script>
```

- **Plausible** — `<script defer data-domain="frnq.es" src="https://plausible.io/js/script.js"></script>`, `provider: "plausible"`.
- **Umami** — `<script defer data-website-id="<id>" src="https://<host>/script.js"></script>`, `provider: "umami"`.
- **GTM dataLayer** — `window.dataLayer = window.dataLayer || []`, `provider: "dataLayer"`.
- **Custom collector** — `{ enabled: true, provider: "beacon", endpoint: "https://…" }`; events are POSTed with `sendBeacon` (fetch fallback).

Consent: forwarding requires `getConsent() === true` unless `requireConsent: false`; explicit denial blocks both. Set `requireConsent: false` only for a cookieless provider that legally needs no consent — that is a legal decision, not a code default. Review the privacy notice and the provider's own page-view collection before enabling it.

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

## Case images

- Mockups live in `src/assets/projects/<case>/` as `mockup-01.avif` … `mockup-05.avif`; `mockup-01` is the cover and the first gallery image.
- Sources are optimised once with Sharp to AVIF (quality `90`, effort `8`, `4:4:4`, native resolution preserved). Source PNGs are not committed.
- Sizes are generated by `astro:assets` at build time. Cover and detail view request AVIF at quality `90`; gallery and archive cards at `88`; the home preview at `88`. Do not add widths above the source resolution.

## Content vs code

| Change | Where |
|--------|-------|
| Commercial copy | `src/data/*.ts` |
| Case study | `src/content/projects/<slug>.md` + `src/assets/projects/<case>/` |
| Layout / structure | `.astro` component (composition only) |
| Visual system | `src/styles/*` (separate visual task only) |

## Engineering constraint

No browser automation. Do not use Playwright, Puppeteer or any similar tool for screenshots or browser inspection. Work is code-only; verify with `bun run check` and `bun run build`.
