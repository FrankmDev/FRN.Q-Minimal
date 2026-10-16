/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * GA4 Measurement ID (`G-XXXXXXXXXX`). Optional: when it is absent or
   * malformed, `MainLayout` renders no analytics configuration and the
   * first-party layer stays in-page only. Never invent a value here; it must
   * come from the deployment environment (Vercel → Project → Environment
   * Variables).
   */
  readonly PUBLIC_GA4_MEASUREMENT_ID?: string;
}
