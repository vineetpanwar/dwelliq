import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({
        data: {
          id: "ps1", brief: { query: "sofa" },
          results: [
            { role: "A", sku: "a", product: { id: "a" }, mood_url: null },
            { role: "B", sku: "b", product: { id: "b" }, mood_url: null },
            { role: "C", sku: "c", product: { id: "c" }, mood_url: null },
          ],
          mood_a_url: "https://x/a.jpg",
          mood_b_url: null,
          mood_c_url: null,
        },
        error: null,
      }) }) }),
    }),
  },
}));

const { GET } = await import("@/app/api/picks/[id]/route");

describe("GET /api/picks/[id]", () => {
  it("merges mood_*_url onto each pick", async () => {
    const res = await GET(new Request("http://x"), { params: Promise.resolve({ id: "ps1" }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.picks[0].mood_url).toBe("https://x/a.jpg");
    expect(body.picks[1].mood_url).toBeNull();
    expect(body.picks[2].mood_url).toBeNull();
  });
});
