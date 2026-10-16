import { getConsent, initTracking, setConsent } from "./analytics";

/** Optional, non-modal controls; no analytics provider means no banner. */
export function initAnalyticsConsent(): void {
  const panel = document.getElementById("analytics-consent");
  if (!panel || panel.dataset.initialized === "true") return;
  panel.dataset.initialized = "true";
  initTracking();

  const settings = document.querySelectorAll<HTMLButtonElement>("[data-analytics-settings]");
  let opener: HTMLButtonElement | null = null;
  panel.hidden = getConsent() !== null;
  settings.forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      opener = button;
      panel.hidden = false;
      panel.querySelector<HTMLButtonElement>("[data-consent-choice]")?.focus();
    });
  });
  panel.querySelectorAll<HTMLButtonElement>("[data-consent-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      setConsent(button.dataset.consentChoice === "true");
      panel.hidden = true;
      if (opener) opener.focus();
      else settings[0]?.focus();
    });
  });
}
