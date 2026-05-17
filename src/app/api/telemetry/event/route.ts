import { supabaseAdmin } from "@/lib/supabase";

const KNOWN_EVENTS = new Set([
  "vision_complete",
  "picks_shown",
  "pick_swiped",
  "inpaint_viewed",
  "ar_opened",
  "filter_changed",
  "buy_clicked",
  "session_end",
] as const);

interface Body {
  pick_set_id?: string;
  type?: string;
  role?: "A" | "B" | "C";
  sku?: string;
  from?: unknown;
  to?: unknown;
  duration_ms?: number;
}

export async function POST(request: Request) {
  let body: Body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.pick_set_id || !body.type || !KNOWN_EVENTS.has(body.type as never)) {
    return Response.json({ error: "Missing or unknown event" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: cur, error: readErr } = await db
    .from("telemetry_pairs").select("*").eq("pick_set_id", body.pick_set_id).single();
  if (readErr || !cur) {
    return Response.json({ error: "telemetry row not found" }, { status: 404 });
  }

  const patch: Record<string, unknown> = {};

  switch (body.type) {
    case "pick_swiped":
      if (body.role) patch.swipe_path = [...cur.swipe_path, body.role];
      break;
    case "inpaint_viewed":
      if (body.sku) patch.inpaint_seen = Array.from(new Set([...cur.inpaint_seen, body.sku]));
      break;
    case "ar_opened":
      if (body.sku) patch.ar_opened_sku = body.sku;
      break;
    case "buy_clicked":
      if (body.sku) patch.buy_clicked_sku = body.sku;
      break;
    case "filter_changed":
      patch.filter_changes = [
        ...((cur.filter_changes ?? []) as unknown[]),
        { from: body.from, to: body.to, at_ms: Date.now() },
      ];
      break;
    case "session_end":
      if (typeof body.duration_ms === "number") patch.session_duration_ms = body.duration_ms;
      break;
    case "picks_shown":
    case "vision_complete":
      // No-op for now; just confirms the funnel step happened.
      patch.updated_at = new Date().toISOString();
      break;
  }

  if (Object.keys(patch).length === 0) {
    return Response.json({ ok: true, noop: true });
  }

  patch.updated_at = new Date().toISOString();
  const { error } = await db.from("telemetry_pairs").update(patch).eq("pick_set_id", body.pick_set_id);
  if (error) {
    console.error("[telemetry] update error", error.message);
    return Response.json({ error: "Could not write telemetry" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
