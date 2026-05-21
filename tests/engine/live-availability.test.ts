import { describe, it, expect, vi, beforeEach } from "vitest";

const walmartCheck = vi.fn();
const ebayCheck = vi.fn();
vi.mock("@/lib/engine/sources/walmart", () => ({
  WalmartCatalogSource: class { async isAvailable(id: string) { return walmartCheck(id); } },
}));
vi.mock("@/lib/engine/sources/ebay", () => ({
  EbayCatalogSource: class { async isAvailable(id: string) { return ebayCheck(id); } },
}));

import { LiveAvailabilityChecker, getAvailabilityChecker, _resetAvailabilityCache } from "@/lib/engine/live-availability";
import type { Pick } from "@/lib/engine/types";

const pick = (sku: string): Pick => ({
  role: "A", sku, product: { id: sku, name: "x", category: "sofa", retailer: "X",
    price: 100, image: "", affiliateUrl: "", styles: [], householdSuitability: [], rating: 4 },
  rationale: "", match: 0, ar_available: false, mood_url: null,
});

describe("LiveAvailabilityChecker", () => {
  beforeEach(() => {
    walmartCheck.mockReset();
    ebayCheck.mockReset();
    _resetAvailabilityCache();
  });

  it("dispatches to Walmart for walmart-prefixed skus", async () => {
    walmartCheck.mockResolvedValueOnce(true);
    const checker = new LiveAvailabilityChecker({
      walmartConsumerId: "x", walmartPrivateKey: "y",
      ebayClientId: "a", ebayClientSecret: "b",
    });
    const result = await checker.verify([pick("walmart-123")]);
    expect(result.available).toHaveLength(1);
    expect(walmartCheck).toHaveBeenCalledWith("walmart-123");
  });

  it("dispatches to eBay for ebay-prefixed skus", async () => {
    ebayCheck.mockResolvedValueOnce(false);
    const checker = new LiveAvailabilityChecker({
      walmartConsumerId: "x", walmartPrivateKey: "y",
      ebayClientId: "a", ebayClientSecret: "b",
    });
    const result = await checker.verify([pick("ebay-456")]);
    expect(result.unavailable).toHaveLength(1);
  });

  it("returns curated rows as always-available", async () => {
    const checker = new LiveAvailabilityChecker({
      walmartConsumerId: "x", walmartPrivateKey: "y",
      ebayClientId: "a", ebayClientSecret: "b",
    });
    const result = await checker.verify([pick("sofa-001")]);
    expect(result.available).toHaveLength(1);
    expect(walmartCheck).not.toHaveBeenCalled();
  });

  it("getAvailabilityChecker returns LiveAvailabilityChecker when Walmart keys are set", () => {
    process.env.WALMART_CONSUMER_ID = "x";
    process.env.WALMART_PRIVATE_KEY = "y";
    _resetAvailabilityCache();
    const checker = getAvailabilityChecker();
    expect(checker.providerName).toBe("live");
    delete process.env.WALMART_CONSUMER_ID;
    delete process.env.WALMART_PRIVATE_KEY;
  });

  it("getAvailabilityChecker falls back to Noop without keys", () => {
    delete process.env.WALMART_CONSUMER_ID;
    delete process.env.WALMART_PRIVATE_KEY;
    delete process.env.EBAY_CLIENT_ID;
    delete process.env.EBAY_CLIENT_SECRET;
    _resetAvailabilityCache();
    const checker = getAvailabilityChecker();
    expect(checker.providerName).toBe("noop");
  });
});
