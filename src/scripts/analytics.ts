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
 * Consent is read from localStorage (`frnq:analytics:consent`) and can be set
 * by any existing CMP through `window.__frnqAnalytics.setConsent(true|false)`.
 * With no provider configured there is nothing to consent to and no network
 * request is made.
 */

export type TrackProps = Record<string, string | number | boolean | undefined>;

type AnalyticsProvider = "gtag" | "plausible" | "umami" | "dataLayer" | "beacon";

interface AnalyticsConfig {
  enabled?: boolean;
  /** Force a single provider. When omitted, the first available is used. */
  provider?: AnalyticsProvider;
  /** Beacon endpoint, required when `provider: "beacon"`. */
  endpoint?: string;
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
const SEEN_KEY = "frnq:track:seen";
const SEEN_LIMIT = 25;
const EVENT_NAME = "frnq:track";

const memorySeen = new Set<string>();
let initialized = false;

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
  const value = readStorage(CONSENT_KEY);
  if (value === "granted") return true;
  if (value === "denied") return false;
  return null;
}

export function setConsent(granted: boolean): void {
  writeStorage(CONSENT_KEY, granted ? "granted" : "denied");
  window.dispatchEvent(
    new CustomEvent("frnq:consent", { detail: { granted } }),
  );
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

export function track(name: string, props: TrackProps = {}): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { name, props } }));

  const sink = resolveSink();
  if (!sink) return;

  const requireConsent = window.__FRNQ_ANALYTICS__?.requireConsent !== false;
  if (requireConsent && getConsent() !== true) return;

  try {
    sink(name, props);
  } catch {
    // A failing provider must never break the page or the form.
  }
}

/** Fires once per id, across reloads within the session, to avoid duplicates. */
export function trackOnce(id: string, name: string, props: TrackProps = {}): void {
  if (memorySeen.has(id)) return;

  const seen = readSession(SEEN_KEY);
  let ids: string[] = [];
  if (seen) {
    try {
      const parsed: unknown = JSON.parse(seen);
      if (Array.isArray(parsed)) ids = parsed.filter((id): id is string => typeof id === "string");
    } catch {
      ids = [];
    }
  }
  if (ids.includes(id)) {
    memorySeen.add(id);
    return;
  }

  memorySeen.add(id);
  writeSession(SEEN_KEY, JSON.stringify([...ids, id].slice(-SEEN_LIMIT)));
  track(name, props);
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
  }
}
