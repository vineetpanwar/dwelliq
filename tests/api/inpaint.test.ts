import { describe, it, expect, vi } from "vitest";

const updateMock = vi.fn(async () => ({ error: null }));
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({
        data: { id: "ps1", photo_id: "ph1", results: [
          { role: "A", sku: "a", product: { id: "a", image: "https://photo.jpg" } },
          { role: "B", sku: "b", product: { id: "b", image: "https://photo.jpg" } },
          { role: "C", sku: "c", product: { id: "c", image: "https://photo.jpg" } },
        ]},
        error: null,
      }) }) }),
      update: () => ({ eq: updateMock }),
    }),
    storage: {
      from: () => ({
        getPublicUrl: () => ({ data: { publicUrl: "https://photo.jpg" } }),
        createSignedUrl: async () => ({ data: { signedUrl: "https://photo.jpg?token=stub" }, error: null }),
      }),
    },
  }),
}));

const { POST } = await import("@/app/api/inpaint/route");

describe("POST /api/inpaint", () => {
  it("rejects missing pick_set_id", async () => {
    const res = await POST(new Request("http://x", { method: "POST", body: JSON.stringify({}) }));
    expect(res.status).toBe(400);
  });

  it("kicks off 3 stub jobs and returns ok", async () => {
    const res = await POST(new Request("http://x", {
      method: "POST", body: JSON.stringify({ pick_set_id: "ps1" }),
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.jobs).toHaveLength(3);
  });
});
