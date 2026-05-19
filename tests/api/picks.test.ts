import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/engine/retrieval", () => ({
  retrieve: vi.fn(async () => [
    { sku: "sofa-001", similarity: 0.92, product: {
      id: "sofa-001", name: "Rivet", category: "sofa", retailer: "Amazon",
      price: 799, image: "x", affiliateUrl: "y",
      styles: ["warm-mid-century"], householdSuitability: ["solo"], rating: 4.4,
      qualityTier: "mid",
    }},
    { sku: "sofa-002", similarity: 0.88, product: {
      id: "sofa-002", name: "Article Premium", category: "sofa", retailer: "Article",
      price: 1499, image: "x", affiliateUrl: "y",
      styles: ["warm-mid-century"], householdSuitability: ["solo"], rating: 4.7,
      qualityTier: "premium",
    }},
    { sku: "sofa-006", similarity: 0.85, product: {
      id: "sofa-006", name: "Haven Local", category: "sofa", retailer: "Haven",
      price: 920, image: "x", affiliateUrl: "y",
      styles: ["warm-mid-century"], householdSuitability: ["solo"], rating: 4.5,
      qualityTier: "mid", isLocal: true, localDistance: 6,
    }},
  ]),
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: () => ({
    from: (table: string) => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: {
        photo_id: "ph1", bbox: [0,0,100,100], palette: [], light_temp: "warm",
        clip_embedding: new Array(768).fill(0),
      }, error: null }) }) }),
      insert: vi.fn(async () => ({ error: null })),
      upsert: vi.fn(async () => ({ error: null })),
    }),
  }),
}));

const { POST } = await import("@/app/api/picks/route");

describe("POST /api/picks", () => {
  it("rejects missing photo_id or query", async () => {
    const r1 = await POST(new Request("http://x", { method: "POST", body: JSON.stringify({ query: "sofa" }) }));
    expect(r1.status).toBe(400);
    const r2 = await POST(new Request("http://x", { method: "POST", body: JSON.stringify({ photo_id: "p1" }) }));
    expect(r2.status).toBe(400);
  });

  it("returns A/B/C picks", async () => {
    const res = await POST(new Request("http://x", {
      method: "POST",
      body: JSON.stringify({
        photo_id: "ph1", query: "sofa", category: "sofa", budget: 1000, session_id: "s1",
      }),
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.pick_set_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(body.picks).toHaveLength(3);
    expect(body.picks.map((p: { role: string }) => p.role)).toEqual(["A", "B", "C"]);
  });
});
