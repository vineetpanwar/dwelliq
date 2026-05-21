import { supabaseAdmin } from "@/lib/supabase";
import { embedImageUrl } from "@/lib/engine/embedding";
import type { VisionFeatures, LightTemp } from "@/lib/engine/types";

interface Body {
  photo_id?: string;
  session_id?: string;
  photo_url?: string;
  tap_point?: { x: number; y: number };
}

export async function POST(request: Request) {
  let body: Body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.photo_id) {
    return Response.json({ error: "Missing photo_id" }, { status: 400 });
  }

  const features = await buildStubFeatures(body);

  const db = supabaseAdmin();
  const { error } = await db.from("vision_features").upsert({
    photo_id: features.photo_id,
    session_id: body.session_id ?? null,
    bbox: features.bbox,
    mask_url: features.mask_url,
    depth_scale_cm: features.depth_scale_cm,
    palette: features.palette,
    light_temp: features.light_temp,
    clip_embedding: features.clip_embedding,
  });

  if (error) {
    console.error("[vision] db error", error.message);
    return Response.json({ error: "Could not persist features" }, { status: 500 });
  }

  return Response.json(features);
}

async function buildStubFeatures(body: Body): Promise<VisionFeatures> {
  const tap = body.tap_point ?? { x: 0.5, y: 0.5 };
  // Synthesise a 30%-of-frame bbox centred on the tap point (frame is 1000×1000 logical units).
  const w = 300, h = 300;
  const bbox: [number, number, number, number] = [
    Math.round(tap.x * 1000 - w / 2),
    Math.round(tap.y * 1000 - h / 2),
    w, h,
  ];

  const seed = body.photo_url ?? body.photo_id ?? "fallback";
  const clip_embedding = await embedImageUrl(seed);

  // Deterministic palette + light temp from the seed.
  const hash = [...seed].reduce((a, c) => (a + c.charCodeAt(0)) >>> 0, 0);
  const lightTemps: LightTemp[] = ["warm", "neutral", "cool"];
  const light_temp = lightTemps[hash % 3];
  const palette = ["#C9974A", "#7A9E8A", "#5C5550", "#0A0908", "#FDFAF6"].slice(0, 5);

  return {
    photo_id: body.photo_id!,
    bbox,
    mask_url: null,
    depth_scale_cm: null,
    palette,
    light_temp,
    clip_embedding,
  };
}
