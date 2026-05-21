import { supabaseAdmin } from "@/lib/supabase";
import { retrieve } from "@/lib/engine/retrieval";
import { RuleBasedReranker } from "@/lib/engine/reranker";
import type { Brief, VisionFeatures } from "@/lib/engine/types";
import type { ProductCategory } from "@/lib/types";
import { checkCsrf } from "@/lib/csrf";

interface Body {
  photo_id?: string;
  query?: string;
  category?: ProductCategory;
  budget?: number;
  zip?: string;
  session_id?: string;
  user_id?: string;
}

const reranker = new RuleBasedReranker();

export async function POST(request: Request) {
  const csrf = checkCsrf(request); if (csrf) return csrf;
  let body: Body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.photo_id || !body.query) {
    return Response.json({ error: "Missing photo_id or query" }, { status: 400 });
  }

  const db = supabaseAdmin;

  // 1. Load VisionFeatures for this photo.
  const { data: vf, error: vfErr } = await db
    .from("vision_features").select("*").eq("photo_id", body.photo_id).single();
  if (vfErr || !vf) {
    return Response.json({ error: "Vision features not found for photo_id" }, { status: 404 });
  }

  const features: VisionFeatures = {
    photo_id: vf.photo_id,
    bbox: vf.bbox as [number, number, number, number],
    mask_url: vf.mask_url,
    depth_scale_cm: vf.depth_scale_cm,
    palette: vf.palette,
    light_temp: vf.light_temp ?? "neutral",
    clip_embedding: vf.clip_embedding,
  };

  const brief: Brief = {
    query: body.query,
    category: body.category,
    budget: body.budget,
    zip: body.zip,
  };

  // 2. Retrieve candidates.
  const candidates = await retrieve(features, brief, 30);
  if (candidates.length === 0) {
    return Response.json({ error: "No catalog matches" }, { status: 404 });
  }

  // 3. Rerank.
  const pickSet = await reranker.rerank({
    photo_id: body.photo_id,
    features,
    candidates,
    brief,
  });

  // 4. Persist picks + telemetry shell.
  const pickSetId = pickSet.pick_set_id;
  const insErr = await db.from("picks").insert({
    id: pickSetId,
    photo_id: body.photo_id,
    session_id: body.session_id ?? null,
    user_id: body.user_id ?? null,
    query: body.query,
    brief,
    candidates: candidates.map(c => c.sku),
    results: pickSet.picks,
    rerank_provider: reranker.providerName,
  });
  if (insErr.error) {
    console.error("[picks] insert error", insErr.error.message);
    return Response.json({ error: "Could not persist picks" }, { status: 500 });
  }

  const { error: telErr } = await db.from("telemetry_pairs").upsert({
    pick_set_id: pickSetId,
    swipe_path: [],
    inpaint_seen: [],
    filter_changes: [],
  }, { onConflict: "pick_set_id" });
  if (telErr) {
    console.warn("[picks] telemetry shell write failed:", telErr.message);
    // non-fatal — picks response still returned
  }

  return Response.json(pickSet);
}
