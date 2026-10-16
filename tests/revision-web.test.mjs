import { expect, test } from "bun:test";
import { CONTACT_TYPES } from "../src/data/contact-contract.ts";
import { webRescueCopy, webRescuePage } from "../src/data/web-rescue.ts";
import { resolvePreselectType } from "../src/scripts/contact-form.ts";

// The repair landing sends its CTA to the shared Home form with `?tipo=reparacion`.
// These checks pin the contract the CTA depends on so a rate/type rename cannot
// silently break the preselect.

test("'Reparación / mejora web' stays a valid contact type", () => {
  const entry = CONTACT_TYPES.find((type) => type.value === "reparacion");
  expect(entry?.label).toBe("Reparación / mejora web");
});

test("the repair CTA preselects the shared reparacion type", () => {
  expect(webRescuePage.cta.type).toBe("reparacion");
  expect(resolvePreselectType(webRescuePage.cta.type)).toBe("reparacion");
  expect(resolvePreselectType("not-a-real-type")).toBeUndefined();
  expect(resolvePreselectType(null)).toBeUndefined();
});

test("shared rates, process and note are reused by reference, not copied", () => {
  expect(webRescuePage.prices).toBe(webRescueCopy.prices);
  expect(webRescuePage.steps).toBe(webRescueCopy.steps);
  expect(webRescuePage.note).toBe(webRescueCopy.note);
});

test("the 99 € diagnosis keeps its 30-day discount", () => {
  const diagnosis = webRescueCopy.prices.find((price) =>
    price.title.includes("Diagnóstico"),
  );
  expect(diagnosis?.price).toBe("99 €");
  expect(diagnosis?.detail).toContain("30 días");

  const landing = webRescueCopy.prices.find((price) =>
    price.title.includes("landing"),
  );
  expect(landing?.price).toBe("desde 299 €");
});
