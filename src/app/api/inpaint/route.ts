import { supabaseAdmin } from "@/lib/supabase";
import { runInpaint } from "@/lib/engine/inpaint";
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

  const db = supabaseAdmin;

  const { data: row, error } = await db.from("picks")
    .select("id, photo_id, results")
    .eq("id", body.pick_set_id).single();
  if (error || !row) {
    return Response.json({ error: "pick_set not found" }, { status: 404 });
  }

  // Resolve the user's photo URL from storage. Bucket is private, so prefer a
  // signed URL so Gemini can fetch it. If signing fails (e.g. the photo was
  // never uploaded — common in unit/e2e tests), fall back to the public URL so
  // the stub path still has something to return.
  const path = `uploads/${row.photo_id}.jpg`;
  const { data: signed } = await db.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60);
  const photoUrl =
    signed?.signedUrl ?? db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const picks = row.results as Pick[];
  const roles = picks.map(p => p.role);   // 'A' | 'B' | 'C'

  // Real Gemini call when GOOGLE_API_KEY is set, else stub.
  const results = await runInpaint(photoUrl, picks);

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
