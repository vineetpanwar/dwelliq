import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      upsert: vi.fn(async () => ({ error: null })),
    }),
  },
}));

const { POST } = await import("@/app/api/vision/route");

describe("POST /api/vision", () => {
  it("rejects missing photo_id", async () => {
    const res = await POST(new Request("http://x/api/vision", {
      method: "POST",
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(400);
  });

  it("returns VisionFeatures of expected shape", async () => {
    const res = await POST(new Request("http://x/api/vision", {
      method: "POST",
      body: JSON.stringify({
        photo_id: "00000000-0000-0000-0000-000000000001",
        tap_point: { x: 0.5, y: 0.6 },
        session_id: "sess-1",
        photo_url: "https://example.com/p.jpg",
      }),
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.photo_id).toBeDefined();
    expect(body.bbox).toHaveLength(4);
    expect(body.clip_embedding).toHaveLength(768);
    expect(["warm", "neutral", "cool"]).toContain(body.light_temp);
    expect(Array.isArray(body.palette)).toBe(true);
  });
});
