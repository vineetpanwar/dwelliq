import { describe, it, expect } from "vitest";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";

describe("e2e · happy path", () => {
  it("upload → vision → picks → inpaint → fetch by id", async () => {
    // 1. Get an upload URL
    const upRes = await fetch(`${BASE}/api/upload-url`, { method: "POST" });
    expect(upRes.status).toBe(200);
    const { photo_id } = await upRes.json();

    // 2. Run vision (stub) — we skip the actual PUT to storage; vision doesn't read the bytes in Plan 1
    const vRes = await fetch(`${BASE}/api/vision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo_id, photo_url: `https://stub/${photo_id}.jpg`, tap_point: { x: 0.6, y: 0.7 }, session_id: "e2e-session" }),
    });
    expect(vRes.status).toBe(200);

    // 3. Generate picks
    const pRes = await fetch(`${BASE}/api/picks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo_id, query: "sofa", category: "sofa", budget: 1000, session_id: "e2e-session" }),
    });
    expect(pRes.status).toBe(200);
    const picks = await pRes.json();
    expect(picks.picks).toHaveLength(3);
    expect(picks.picks.map((p: { role: string }) => p.role)).toEqual(["A", "B", "C"]);

    // 4. Kick off inpaint
    const iRes = await fetch(`${BASE}/api/inpaint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pick_set_id: picks.pick_set_id }),
    });
    expect(iRes.status).toBe(200);

    // 5. Fetch by id; mood URLs should be populated
    const gRes = await fetch(`${BASE}/api/picks/${picks.pick_set_id}`);
    expect(gRes.status).toBe(200);
    const got = await gRes.json();
    expect(got.picks[0].mood_url).toBeTruthy();
    expect(got.picks[1].mood_url).toBeTruthy();
    expect(got.picks[2].mood_url).toBeTruthy();

    // 6. Log a swipe event
    const tRes = await fetch(`${BASE}/api/telemetry/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pick_set_id: picks.pick_set_id, type: "pick_swiped", role: "B" }),
    });
    expect(tRes.status).toBe(200);
  }, 30_000);
});
