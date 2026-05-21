import { describe, it, expect, vi, beforeEach } from "vitest";

const createMock = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: class Anthropic {
    messages = { create: (args: unknown) => createMock(args) };
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: () => ({
    storage: { from: () => ({
      createSignedUrl: vi.fn(async () => ({ data: { signedUrl: "https://signed/photo.jpg" }, error: null })),
    }) },
  }),
}));

import { ClaudeSonnetReranker, getReranker, _resetRerankerCache } from "@/lib/engine/rerank";

const baseInput = {
  photo_id: "ph1",
  features: { photo_id: "ph1", bbox: [0,0,100,100] as [number,number,number,number],
    mask_url: null, depth_scale_cm: null, palette: ["#c9974a"], light_temp: "warm" as const,
    clip_embedding: new Array(768).fill(0) },
  brief: { query: "side table", category: "side-table" as const, budget: 500 },
  candidates: [
    { sku: "a", similarity: 0.9, product: { id: "a", name: "Walnut", category: "side-table" as const,
      retailer: "W", price: 240, image: "https://a.jpg", affiliateUrl: "y",
      styles: [] as string[], householdSuitability: [] as string[], rating: 4 } },
    { sku: "b", similarity: 0.85, product: { id: "b", name: "Stretch", category: "side-table" as const,
      retailer: "W", price: 600, image: "https://b.jpg", affiliateUrl: "y",
      styles: [] as string[], householdSuitability: [] as string[], rating: 4 } },
    { sku: "c", similarity: 0.8, product: { id: "c", name: "Local", category: "side-table" as const,
      retailer: "L", price: 300, image: "https://c.jpg", affiliateUrl: "y", isLocal: true,
      styles: [] as string[], householdSuitability: [] as string[], rating: 4 } },
  ],
};

describe("ClaudeSonnetReranker", () => {
  beforeEach(() => { createMock.mockReset(); _resetRerankerCache(); });

  it("parses 3 picks with A/B/C roles", async () => {
    createMock.mockResolvedValueOnce({
      content: [{ type: "text", text: JSON.stringify({
        picks: [
          { role: "A", sku: "a", match: 95, rationale: "Warm walnut echoes your sofa." },
          { role: "B", sku: "b", match: 88, rationale: "Solid premium pick." },
          { role: "C", sku: "c", match: 80, rationale: "Local boutique." },
        ],
      }) }],
    });
    const reranker = new ClaudeSonnetReranker("test-key");
    const result = await reranker.rerank(baseInput as never);
    expect(result.picks).toHaveLength(3);
    expect(result.picks.map(p => p.role)).toEqual(["A","B","C"]);
    expect(result.picks[0].rationale).toContain("walnut");
  });

  it("strips code fences if Claude wraps JSON", async () => {
    createMock.mockResolvedValueOnce({
      content: [{ type: "text", text: "```json\n" + JSON.stringify({
        picks: [
          { role: "A", sku: "a", match: 90, rationale: "x" },
          { role: "B", sku: "b", match: 80, rationale: "y" },
          { role: "C", sku: "c", match: 70, rationale: "z" },
        ],
      }) + "\n```" }],
    });
    const reranker = new ClaudeSonnetReranker("test-key");
    const result = await reranker.rerank(baseInput as never);
    expect(result.picks).toHaveLength(3);
  });

  it("throws on malformed JSON (route falls back to rule-based)", async () => {
    createMock.mockResolvedValueOnce({ content: [{ type: "text", text: "not json at all" }] });
    const reranker = new ClaudeSonnetReranker("test-key");
    await expect(reranker.rerank(baseInput as never)).rejects.toThrow(/parse/i);
  });

  it("getReranker returns ClaudeSonnetReranker when ANTHROPIC_API_KEY is set", () => {
    process.env.ANTHROPIC_API_KEY = "test";
    const reranker = getReranker();
    expect(reranker.providerName).toBe("claude-sonnet");
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("getReranker falls back to rule-based when no key", () => {
    delete process.env.ANTHROPIC_API_KEY;
    _resetRerankerCache();
    const reranker = getReranker();
    expect(reranker.providerName).toBe("rule-based");
  });
});
