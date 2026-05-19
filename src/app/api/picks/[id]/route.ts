import { supabaseAdmin } from "@/lib/supabase";
import type { Pick } from "@/lib/engine/types";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const db = supabaseAdmin();
  const { data, error } = await db.from("picks")
    .select("id, brief, results, mood_a_url, mood_b_url, mood_c_url, created_at")
    .eq("id", id).single();
  if (error || !data) {
    return Response.json({ error: "pick_set not found" }, { status: 404 });
  }

  const moods: Record<string, string | null> = {
    A: data.mood_a_url,
    B: data.mood_b_url,
    C: data.mood_c_url,
  };
  const picks = (data.results as Pick[]).map(p => ({ ...p, mood_url: moods[p.role] ?? p.mood_url ?? null }));

  return Response.json({
    pick_set_id: data.id,
    brief: data.brief,
    picks,
    created_at: data.created_at,
  });
}
