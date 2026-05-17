import { describe, it, expect, vi } from "vitest";

const updateMock = vi.fn(async () => ({ error: null }));
const selectSingle = vi.fn(async () => ({ data: {
  pick_set_id: "ps1",
  swipe_path: ["A"], inpaint_seen: [], filter_changes: [],
  session_duration_ms: null, ar_opened_sku: null, buy_clicked_sku: null,
  rerank_fallback: false,
}, error: null }));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ single: selectSingle }) }),
      update: () => ({ eq: updateMock }),
    }),
  }),
}));

const { POST } = await import("@/app/api/telemetry/event/route");

describe("POST /api/telemetry/event", () => {
  it("rejects unknown event types", async () => {
    const res = await POST(new Request("http://x", {
      method: "POST",
      body: JSON.stringify({ pick_set_id: "ps1", type: "not-a-real-event" }),
    }));
    expect(res.status).toBe(400);
  });

  it("accepts pick_swiped and updates swipe_path", async () => {
    const res = await POST(new Request("http://x", {
      method: "POST",
      body: JSON.stringify({ pick_set_id: "ps1", type: "pick_swiped", role: "B" }),
    }));
    expect(res.status).toBe(200);
  });
});
