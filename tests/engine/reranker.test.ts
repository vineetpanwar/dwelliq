import { describe, it, expect } from "vitest";
import { RuleBasedReranker } from "@/lib/engine/reranker";
import type { Candidate, RerankerInput } from "@/lib/engine/types";
import type { Product } from "@/lib/types";

function product(over: Partial<Product> = {}): Product {
  return {
    id: "p1", name: "Test Sofa", category: "sofa", retailer: "Amazon",
    price: 800, image: "x", affiliateUrl: "y",
    styles: ["warm-mid-century"], householdSuitability: ["solo"],
    rating: 4.4, qualityTier: "mid", ...over,
  };
}

function candidate(p: Product, similarity = 0.9): Candidate {
  return { sku: p.id, product: p, similarity };
}

const baseInput: Omit<RerankerInput, "candidates"> = {
  photo_id: "ph1",
  features: {
    photo_id: "ph1",
    bbox: [0, 0, 100, 100], mask_url: null, depth_scale_cm: null,
    palette: ["#c9974a"], light_temp: "warm",
    clip_embedding: new Array(768).fill(0),
  },
  brief: { query: "sofa", category: "sofa", budget: 1000 },
};

describe("RuleBasedReranker", () => {
  const reranker = new RuleBasedReranker();

  it("emits exactly 3 picks with roles A, B, C in order", async () => {
    const candidates = [
      candidate(product({ id: "in",     price: 800,  qualityTier: "mid"     })),
      candidate(product({ id: "stretch",price: 1400, qualityTier: "premium" })),
      candidate(product({ id: "local",  price: 900,  isLocal: true, localDistance: 8 })),
      candidate(product({ id: "extra",  price: 700  })),
    ];
    const result = await reranker.rerank({ ...baseInput, candidates });
    expect(result.picks).toHaveLength(3);
    expect(result.picks.map(p => p.role)).toEqual(["A", "B", "C"]);
  });

  it("A pick is within budget", async () => {
    const candidates = [
      candidate(product({ id: "in",     price: 800,  qualityTier: "mid"     })),
      candidate(product({ id: "stretch",price: 1400, qualityTier: "premium" })),
      candidate(product({ id: "local",  price: 900,  isLocal: true, localDistance: 8 })),
    ];
    const result = await reranker.rerank({ ...baseInput, candidates });
    expect(result.picks[0].product.price).toBeLessThanOrEqual(baseInput.brief.budget!);
  });

  it("B pick is over budget but within stretch ceiling (1.5×)", async () => {
    const candidates = [
      candidate(product({ id: "in",     price: 800,  qualityTier: "mid"     })),
      candidate(product({ id: "stretch",price: 1400, qualityTier: "premium" })),
      candidate(product({ id: "local",  price: 900,  isLocal: true })),
    ];
    const result = await reranker.rerank({ ...baseInput, candidates });
    expect(result.picks[1].product.price).toBeGreaterThan(baseInput.brief.budget!);
    expect(result.picks[1].product.price).toBeLessThanOrEqual(baseInput.brief.budget! * 1.5);
  });

  it("C pick is local when a local exists", async () => {
    const candidates = [
      candidate(product({ id: "in",     price: 800 })),
      candidate(product({ id: "stretch",price: 1400 })),
      candidate(product({ id: "local",  price: 900, isLocal: true, localDistance: 5 })),
    ];
    const result = await reranker.rerank({ ...baseInput, candidates });
    expect(result.picks[2].product.isLocal).toBe(true);
  });

  it("falls back gracefully when fewer than 3 distinct candidates fit role criteria", async () => {
    // All same product — must still produce 3 picks, no duplicates if avoidable.
    const candidates = [
      candidate(product({ id: "only", price: 800 })),
      candidate(product({ id: "two",  price: 900 })),
    ];
    const result = await reranker.rerank({ ...baseInput, candidates });
    expect(result.picks).toHaveLength(3);
  });

  it("providerName is 'rule-based'", () => {
    expect(reranker.providerName).toBe("rule-based");
  });
});
