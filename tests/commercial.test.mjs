import { expect, test } from "bun:test";
import { publicAmounts, pricingGroups, lineAmount, rescueOffers } from "../src/data/pricing.ts";
import { solutionPages, solutionContactTypes } from "../src/data/solutions.ts";
import { serviceAreas } from "../src/data/services.ts";
import { isContactType } from "../src/data/contact-contract.ts";
import { supportPrice } from "../src/data/support.ts";
import { webRescueCopy, webRescueOffers } from "../src/data/web-rescue.ts";
import { agencyCollaboration } from "../src/data/agency-collaboration.ts";

test("the approved public price references stay central and discovery-led work has no figure", () => {
  expect(publicAmounts.map(({ minimum }) => minimum)).toEqual([690, 990, 1390, 1990, 3190, 49]);
  expect(rescueOffers.slice(0, 2).map(({ amount }) => amount)).toEqual([99, 299]);
  expect(supportPrice.amount).toBe(publicAmounts.find(({ id }) => id === "care").minimum);
  for (const group of pricingGroups) {
    for (const offer of group.offers) {
      expect(offer.mode === "scoped" ? lineAmount(offer) === undefined : lineAmount(offer) > 0).toBe(true);
    }
  }
  expect(webRescueOffers().map((offer) => offer.price ?? offer.priceSpecification.minPrice)).toEqual(webRescueCopy.prices.filter(({ amount }) => amount).map(({ amount }) => amount));
});

test("Home keeps web first and every solution resolves to a valid consultation type", () => {
  expect(serviceAreas.map(({ id }) => id)).toEqual(["growth", "ecommerce", "b2b", "sistemas"]);
  for (const solution of solutionPages) expect(isContactType(solutionContactTypes[solution.id])).toBe(true);
  expect(isContactType(agencyCollaboration.contactType)).toBe(true);
  expect(agencyCollaboration.process.at(-1).title).toBe("QA y entrega");
});
