import { describe, it, expect } from "vitest";
import { NoopAvailabilityChecker } from "@/lib/engine/availability";
import type { Pick } from "@/lib/engine/types";

function pick(sku: string, source: string = "curated"): Pick {
  return {
    role: "A", sku, product: { id: sku, name: "x", category: "sofa", retailer: "X",
      price: 100, image: "", affiliateUrl: "", styles: [],
      householdSuitability: [], rating: 4 },
    rationale: "", match: 0, ar_available: false, mood_url: null,
  };
}

describe("NoopAvailabilityChecker", () => {
  const checker = new NoopAvailabilityChecker();

  it("returns all picks unchanged", async () => {
    const picks = [pick("a"), pick("b"), pick("c")] as [Pick, Pick, Pick];
    const result = await checker.verify(picks);
    expect(result.available).toEqual(picks);
    expect(result.unavailable).toEqual([]);
  });

  it("providerName is 'noop'", () => {
    expect(checker.providerName).toBe("noop");
  });
});
