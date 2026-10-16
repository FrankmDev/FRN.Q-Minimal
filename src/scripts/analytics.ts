/**
 * Lightweight, first-party event layer.
 *
 * It never bundles a vendor. Every event is dispatched as a `frnq:track`
 * CustomEvent on `window` (in-page only, no network, no cookies, no PII). A
 * single external sink is used only when explicitly configured through
 * `window.__FRNQ_ANALYTICS__` AND consent has been granted for providers that
 * need it. Exactly one provider is ever forwarded to, so events are not
 * duplicated between tools.
 *
 * Enabling a provider:
 *   window.__FRNQ_ANALYTICS__ = { enabled: true, provider: "plausible" };
 *
 * GA4 is the only provider this layer loads itself. It is configured by
 * `MainLayout.astro` from `PUBLIC_GA4_MEASUREMENT_ID` and its `gtag.js` stub +
 * script are injected by `loadAnalyticsProvider()` only after explicit
 * consent. GA4 never sends its own `page_view` (`send_page_view: false`); the
 * first-party `page_view` below is the single source.
 *
 * Consent is retained in memory and localStorage (`frnq:analytics:consent`) and can be set
 * by any existing CMP through `window.__frnqAnalytics.setConsent(true|false)`.
 * With no provider configured there is nothing to consent to and no network
 * request is made.
 */

import { CONTACT_SUBMISSION_ID_PATTERN } from "../data/contact-contract";
import { siteConfig } from "../data/site";

export type TrackProps = Record<string, string | number | boolean | undefined>;

type AnalyticsProvider = "gtag" | "plausible" | "umami" | "dataLayer" | "beacon";

interface AnalyticsConfig {
  enabled?: boolean;
  /** Force a single provider. When omitted, the first available is used. */
  provider?: AnalyticsProvider;
  /** Beacon endpoint, required when `provider: "beacon"`. */
  endpoint?: string;
  /** GA4 Measurement ID (`G-…`). Required for the lazy `gtag` loader. */
  measurementId?: string;
  /** Set false only for providers that legally need no consent. */
  requireConsent?: boolean;
}

interface FrnqAnalyticsApi {
  track: (name: string, props?: TrackProps) => void;
  trackOnce: (id: string, name: string, props?: TrackProps) => void;
  setConsent: (granted: boolean) => void;
  getConsent: () => boolean | null;
}

declare global {
  interface Window {
    __FRNQ_ANALYTICS__?: AnalyticsConfig;
    __frnqAnalytics?: FrnqAnalyticsApi;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (name: string, options?: { props?: TrackProps }) => void;
    umami?: { track: (name: string, props?: TrackProps) => void };
  }
}

const CONSENT_KEY = "frnq:analytics:consent";
const CONSENT_DATE_KEY = "frnq:analytics:consent-at";
const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const SEEN_KEY = "frnq:track:seen";
const CONTEXT_KEY = "frnq:track:context";
const SEEN_LIMIT = 25;
const EVENT_NAME = "frnq:track";

/** GA4 Measurement IDs look like `G-XXXXXXXXXX`; anything else is never used. */
const GA4_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;
const GTAG_SRC = "https://www.googletagmanager.com/gtag/js?id=";

const memorySeen = new Set<string>();
let initialized = false;
let memoryConsent: boolean | null = null;
let pageViewRecorded = false;
let pageViewForwarded = false;
let providerLoaded = false;

/** Categorical page classification used by navigation events; never user data. */
export type PageType =
  | "home"
  | "solution"
  | "guide"
  | "support"
  | "pricing"
  | "agency"
  | "case_index"
  | "case"
  | "legal"
  | "not_found";

/** True only for a syntactically valid GA4 Measurement ID; never invents one. */
export function isGa4MeasurementId(value: unknown): value is string {
  return typeof value === "string" && GA4_ID_PATTERN.test(value.trim());
}

export function pageType(path: string): PageType {
  if (path === "/") return "home";
  if (path.startsWith("/soluciones/")) return "solution";
  if (path === "/casos/") return "case_index";
  if (path.startsWith("/casos/")) return "case";
  if (path.startsWith("/guias/")) return "guide";
  if (path.startsWith("/soporte/")) return "support";
  if (path.startsWith("/precios/")) return "pricing";
  if (path.startsWith("/colaboraciones/")) return "agency";
  if (path.startsWith("/legal/")) return "legal";
  return "not_found";
}

function slugFromPath(path: string, prefix: string): string | undefined {
  if (!path.startsWith(prefix)) return undefined;
  const slug = path.slice(prefix.length).replace(/\/+$/, "");
  return slug && !slug.includes("/") ? slug : undefined;
}

type FunnelContext = { last_solution?: string; last_case?: string };

function allowedPages(): Set<string> {
  const paths = typeof document === "undefined"
    ? ""
    : document.documentElement.dataset.trackPages ?? "";
  return new Set(paths.split("|").filter(Boolean));
}

function currentPage(pages = allowedPages()): string {
  // Unknown URLs can contain personal data; never emit them, even on a 404.
  return pages.has(window.location.pathname) ? window.location.pathname : "/404/";
}

function removeSession(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Storage is optional, not a prerequisite for contact or navigation.
  }
}

function canRememberContext(): boolean {
  const consent = getConsent();
  if (consent === false) return false;
  const config = window.__FRNQ_ANALYTICS__;
  return !config?.enabled || config.requireConsent === false || consent === true;
}

function funnelContext(pages = allowedPages()): FunnelContext {
  if (!canRememberContext()) {
    removeSession(CONTEXT_KEY);
    return {};
  }

  const raw = readSession(CONTEXT_KEY);
  const context: FunnelContext = {};
  if (raw) {
    try {
      const stored: unknown = JSON.parse(raw);
      if (stored && typeof stored === "object") {
        for (const key of ["last_solution", "last_case"] as const) {
          const value = (stored as Record<string, unknown>)[key];
          const prefix = key === "last_solution" ? "/soluciones/" : "/casos/";
          if (typeof value === "string" && pages.has(value) && value.startsWith(prefix) && value !== "/casos/") {
            context[key] = value;
          }
        }
      }
    } catch {
      // Malformed context is discarded, never forwarded.
    }
  }

  const page = currentPage(pages);
  if (page.startsWith("/soluciones/")) {
    if (context.last_solution !== page) delete context.last_case;
    context.last_solution = page;
  } else if (page.startsWith("/casos/") && page !== "/casos/") {
    context.last_case = page;
  }

  const serialized = JSON.stringify(context);
  if (raw !== serialized) {
    if (Object.keys(context).length) writeSession(CONTEXT_KEY, serialized);
    else removeSession(CONTEXT_KEY);
  }
  return context;
}

function safeProps(props: TrackProps): TrackProps {
  const result: TrackProps = {};
  // Only the categorical props used by this site are eligible for forwarding.
  for (const key of ["location", "label", "method", "slug", "type", "budget", "reason", "hasCompany"]) {
    const value = props[key];
    if (key === "hasCompany") {
      if (typeof value === "boolean") result[key] = value;
    } else if (typeof value === "string" && value.length <= 120 && !/[@\u0000-\u001F\u007F]/.test(value)) {
      result[key] = value;
    }
  }
  return result;
}

function isSeenId(id: unknown): id is string {
  return typeof id === "string" && (
    id === "contact-view" ||
    (id.startsWith("submit:") && CONTACT_SUBMISSION_ID_PATTERN.test(id.slice(7)))
  );
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); tracking degrades safely.
  }
}

function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore: in-memory de-dup still applies for the current document.
  }
}

export function getConsent(): boolean | null {
  // An explicit choice must take effect even if persistence fails or is stale.
  if (memoryConsent !== null) return memoryConsent;
  const value = readStorage(CONSENT_KEY);
  const chosenAt = Number(readStorage(CONSENT_DATE_KEY));
  if (!Number.isFinite(chosenAt) || chosenAt <= 0 || chosenAt > Date.now() || Date.now() - chosenAt >= CONSENT_MAX_AGE) return null;
  if (value === "granted") return true;
  if (value === "denied") return false;
  return null;
}

export function setConsent(granted: boolean): void {
  memoryConsent = granted;
  writeStorage(CONSENT_KEY, granted ? "granted" : "denied");
  writeStorage(CONSENT_DATE_KEY, String(Date.now()));
  const config = window.__FRNQ_ANALYTICS__;
  if (config?.provider === "gtag" && isGa4MeasurementId(config.measurementId)) {
    // GA4's explicit opt-out also stops a library that is already loaded.
    (window as unknown as Record<string, unknown>)[`ga-disable-${config.measurementId.trim()}`] = !granted;
  }
  if (!granted) {
    removeSession(CONTEXT_KEY);
    removeSession(SEEN_KEY);
    clearGaCookies();
  }
  window.dispatchEvent(
    new CustomEvent("frnq:consent", { detail: { granted } }),
  );
  // Granting consent may be the first moment GA4 is allowed to load.
  if (granted) loadAnalyticsProvider();
}

function clearGaCookies(): void {
  if (typeof document === "undefined") return;
  const names = (document.cookie ?? "").split(";").map((cookie) => cookie.trim().split("=")[0]);
  const hostname = window.location.hostname;
  if (!hostname) return;
  // Only GA cookies: do not touch theme, consent or another service's data.
  for (const name of names.filter((name) => /^_ga(?:_[A-Za-z0-9_]+)?$/.test(name))) {
    for (const domain of ["", `; Domain=${hostname}`, `; Domain=.${hostname}`]) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax; Secure`;
    }
  }
}

function resolveSink(): ((name: string, props: TrackProps) => void) | null {
  const config = window.__FRNQ_ANALYTICS__;
  if (!config?.enabled) return null;

  const endpoint = config.endpoint;
  if (config.provider === "beacon" || (endpoint && !config.provider)) {
    if (!endpoint) return null;
    return (name, props) => {
      const body = JSON.stringify({ event: name, props });
      if (typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      } else {
        void fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => undefined);
      }
    };
  }

  const order: AnalyticsProvider[] = config.provider
    ? [config.provider]
    : ["gtag", "plausible", "umami", "dataLayer"];

  for (const provider of order) {
    if (provider === "gtag" && typeof window.gtag === "function") {
      return (name, props) => window.gtag?.("event", name, props);
    }
    if (provider === "plausible" && typeof window.plausible === "function") {
      return (name, props) => window.plausible?.(name, { props });
    }
    if (provider === "umami" && window.umami && typeof window.umami.track === "function") {
      return (name, props) => window.umami?.track(name, props);
    }
    if (provider === "dataLayer" && Array.isArray(window.dataLayer)) {
      return (name, props) => window.dataLayer?.push({ event: name, ...props });
    }
  }

  return null;
}

function dispatch(name: string, props: TrackProps): void {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { name, props } }));
}

function consentAllowsForwarding(): boolean {
  const consent = getConsent();
  if (consent === false) return false;
  // Only an explicitly consent-exempt provider may forward without a choice.
  return window.__FRNQ_ANALYTICS__?.requireConsent === false || consent === true;
}

/** Sends one event to the single configured sink. True when it was sent. */
function forward(name: string, props: TrackProps): boolean {
  if (!consentAllowsForwarding()) return false;
  const sink = resolveSink();
  if (!sink) return false;
  try {
    sink(name, props);
    return true;
  } catch {
    // A failing provider must never break the page or the form.
    return false;
  }
}

export function track(name: string, props: TrackProps = {}): void {
  if (typeof window === "undefined") return;

  // A tracking failure is never a user-facing failure: navigation, the contact
  // form and the rest of the page must keep working.
  try {
    const pages = allowedPages();
    const detail: TrackProps = { ...safeProps(props), ...funnelContext(pages), page: currentPage(pages) };

    dispatch(name, detail);
    forward(name, detail);
  } catch {
    // Ignore: analytics is best-effort.
  }
}

/** Fires once per id, across reloads within the session, to avoid duplicates. */
export function trackOnce(id: string, name: string, props: TrackProps = {}): void {
  if (typeof window === "undefined" || !isSeenId(id)) return;
  if (memorySeen.has(id)) return;

  const remember = canRememberContext();
  const seen = remember ? readSession(SEEN_KEY) : null;
  let ids: string[] = [];
  if (seen) {
    try {
      const parsed: unknown = JSON.parse(seen);
      if (Array.isArray(parsed)) ids = parsed.filter(isSeenId);
    } catch {
      ids = [];
    }
  }
  if (ids.includes(id)) {
    memorySeen.add(id);
    return;
  }

  memorySeen.add(id);
  if (remember) writeSession(SEEN_KEY, JSON.stringify([...ids, id].slice(-SEEN_LIMIT)));
  track(name, props);
}

function baseDetail(): TrackProps {
  const pages = allowedPages();
  return { page: currentPage(pages), ...funnelContext(pages) };
}

/**
 * Records the document's single `page_view` (and the solution/case entry event)
 * exactly once. A reload is a new document and therefore a new view; a second
 * `initTracking()` in the same document is a no-op, so navigation never
 * double-counts.
 */
export function trackPageView(): void {
  if (typeof window === "undefined" || pageViewRecorded) return;
  pageViewRecorded = true;

  try {
    const pages = allowedPages();
    const page = currentPage(pages);
    const type = pageType(page);
    const detail: TrackProps = { ...baseDetail(), page_type: type };

    dispatch("page_view", detail);
    if (forward("page_view", detail)) pageViewForwarded = true;

    const prefix = type === "solution" ? "/soluciones/" : type === "case" ? "/casos/" : "";
    if (prefix) {
      const name = type === "solution" ? "solution_view" : "case_view";
      const slug = slugFromPath(page, prefix);
      const entry: TrackProps = { page, page_type: type, ...(slug ? { slug } : {}) };
      dispatch(name, entry);
      forward(name, entry);
    }
  } catch {
    // Navigation must continue even if this module fails.
  }
}

/**
 * Loads the GA4 stub and `gtag.js`, only after explicit consent. GA4 is
 * non-essential and sets identifiers, so nothing is requested beforehand.
 * No-ops for every other provider: their own script is loaded by the CMP.
 * Returns whether a provider is active for this document.
 */
export function loadAnalyticsProvider(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  const config = window.__FRNQ_ANALYTICS__;
  if (!config?.enabled || config.provider !== "gtag") return false;
  if (providerLoaded) return true;

  const id = typeof config.measurementId === "string" ? config.measurementId.trim() : "";
  if (!isGa4MeasurementId(id)) return false;
  if (getConsent() !== true) return false;

  try {
    const dataLayer: unknown[] = Array.isArray(window.dataLayer)
      ? window.dataLayer
      : (window.dataLayer = []);
    window.gtag = function (..._args: unknown[]) {
      // The Google tag command queue expects Arguments objects, not arrays.
      dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    // The first-party layer owns `page_view`; GA4 must not send its own.
    (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false;
    window.gtag("config", id, {
      send_page_view: false,
      // GA4 also collects automatic parameters, outside our custom props.
      // Never let it infer a raw URL, query, fragment, referrer or 404 title.
      page_location: new URL(currentPage(), siteConfig.url).toString(),
      page_referrer: "",
      page_title: pageType(currentPage()),
      cookie_domain: window.location.hostname,
      cookie_path: "/",
      cookie_expires: CONSENT_MAX_AGE / 1000,
      cookie_update: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `${GTAG_SRC}${encodeURIComponent(id)}`;
    document.head.appendChild(script);
    providerLoaded = true;
  } catch {
    // A blocked script or CDN failure must not break the page.
    return false;
  }

  // Consent can arrive after the first view: forward it once the sink exists.
  if (pageViewRecorded && !pageViewForwarded) {
    try {
      const detail: TrackProps = { ...baseDetail(), page_type: pageType(currentPage()) };
      if (forward("page_view", detail)) pageViewForwarded = true;
      const page = currentPage();
      const type = pageType(page);
      const prefix = type === "solution" ? "/soluciones/" : type === "case" ? "/casos/" : "";
      if (prefix) forward(type === "solution" ? "solution_view" : "case_view", { page, page_type: type, slug: slugFromPath(page, prefix) });
    } catch {
      // Ignore: the next navigation will carry a page view.
    }
  }

  return true;
}

function dataProps(el: Element): TrackProps {
  const props: TrackProps = {};
  for (const attr of Array.from(el.attributes)) {
    if (!attr.name.startsWith("data-track-")) continue;
    const key = attr.name.slice("data-track-".length).replace(/-/g, "_");
    if (key) props[key] = attr.value;
  }
  return props;
}

/** Delegated tracking for `[data-track]` elements. Safe to call more than once. */
export function initTracking(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest("[data-track]");
      if (!el) return;
      const name = el.getAttribute("data-track");
      if (!name) return;
      track(name, dataProps(el));
    },
    true,
  );

  if (typeof window !== "undefined") {
    window.__frnqAnalytics = { track, trackOnce, setConsent, getConsent };
    // Load first so an already-granted consent is not missed by the page view.
    loadAnalyticsProvider();
  }

  // One navigation record per document, after the funnel context is stored.
  trackPageView();
}
