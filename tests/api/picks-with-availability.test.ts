import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/engine/retrieval", () => ({
  retrieve: vi.fn(async () => [
    { sku: "a", similarity: 0.9, product: { id: "a", name: "A", category: "sofa", retailer: "W",
      price: 500, image: "x", affiliateUrl: "y", styles: [], householdSuitability: [], rating: 4 } },
    { sku: "b", similarity: 0.85, product: { id: "b", name: "B", category: "sofa", retailer: "W",
      price: 800, image: "x", affiliateUrl: "y", styles: [], householdSuitability: [], rating: 4 } },
    { sku: "c", similarity: 0.8, product: { id: "c", name: "C", category: "sofa", retailer: "W",
      price: 600, image: "x", affiliateUrl: "y", styles: [], householdSuitability: [], rating: 4, isLocal: true } },
    { sku: "d", similarity: 0.75, product: { id: "d", name: "D", category: "sofa", retailer: "W",
      price: 700, image: "x", affiliateUrl: "y", styles: [], householdSuitability: [], rating: 4 } },
  ]),
}));

const verifyMock = vi.fn();
vi.mock("@/lib/engine/availability", () => ({
  NoopAvailabilityChecker: class {
    readonly providerName = "noop";
    async verify(picks: { sku: string }[]) { return verifyMock(picks); }
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: {
        photo_id: "ph1", bbox: [0,0,100,100], palette: [], light_temp: "warm",
        clip_embedding: new Array(768).fill(0),
      }, error: null }) }) }),
      insert: vi.fn(async () => ({ error: null })),
      upsert: vi.fn(async () => ({ error: null })),
    }),
  },
}));

const { POST } = await import("@/app/api/picks/route");

describe("POST /api/picks with availability check", () => {
  it("returns picks unchanged when all are available", async () => {
    verifyMock.mockImplementation(async (picks) => ({ available: picks, unavailable: [] }));
    const res = await POST(new Request("http://x", { method: "POST", body: JSON.stringify({
      photo_id: "ph1", query: "sofa", category: "sofa", budget: 1000,
    }) }));
    const body = await res.json();
    expect(body.picks).toHaveLength(3);
    expect(body.picks.map((p: { role: string }) => p.role)).toEqual(["A","B","C"]);
  });

  it("tops up from the next candidate when one is unavailable", async () => {
    verifyMock.mockImplementation(async (picks: { sku: string }[]) => {
      // Mark sku 'b' (likely the B role) as unavailable
      const unavailable = picks.filter((p) => p.sku === "b");
      return { available: picks.filter((p) => p.sku !== "b"), unavailable };
    });
    const res = await POST(new Request("http://x", { method: "POST", body: JSON.stringify({
      photo_id: "ph1", query: "sofa", category: "sofa", budget: 1000,
    }) }));
    const body = await res.json();
    expect(body.picks).toHaveLength(3);
    const skus = body.picks.map((p: { sku: string }) => p.sku);
    expect(skus).not.toContain("b");
  });
});
