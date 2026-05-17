import { supabaseAdmin } from "@/lib/supabase";
import { runInpaintStubs } from "@/lib/engine/inpaint-stub";
import type { Pick } from "@/lib/engine/types";

interface Body { pick_set_id?: string }

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "room-photos";

export async function POST(request: Request) {
  let body: Body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.pick_set_id) {
    return Response.json({ error: "Missing pick_set_id" }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { data: row, error } = await db.from("picks")
    .select("id, photo_id, results")
    .eq("id", body.pick_set_id).single();
  if (error || !row) {
    return Response.json({ error: "pick_set not found" }, { status: 404 });
  }

  // Resolve the user's photo URL from storage.
  const path = `uploads/${row.photo_id}.jpg`;
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(path);
  const photoUrl = pub.publicUrl;

  const picks = row.results as Pick[];
  const roles = picks.map(p => p.role);   // 'A' | 'B' | 'C'

  // Plan 1 stub: returns photoUrl keyed by role. Plan 3 will key by actual SKU.
  const results = await runInpaintStubs(photoUrl, roles);

  // Write into the columns. Use a 50ms delay so the GET /api/picks/[id]
  // streaming UX in mobile (Plan 2) has something to observe.
  await new Promise(r => setTimeout(r, 50));
  const { error: updateErr } = await db.from("picks").update({
    mood_a_url: results["A"] ?? null,
    mood_b_url: results["B"] ?? null,
    mood_c_url: results["C"] ?? null,
  }).eq("id", body.pick_set_id);
  if (updateErr) {
    console.warn("[inpaint] mood-url update failed:", updateErr.message);
    // non-fatal — caller still gets ok:true; GET /api/picks/[id] will reflect nulls
  }

  return Response.json({ ok: true, jobs: roles.map(r => ({ role: r, status: "done" })) });
}
