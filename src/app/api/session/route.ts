import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { rateLimit, getIp, tooManyRequests } from "@/lib/rate-limit";

// POST: 20 saves per IP per hour
const POST_LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 };
// GET: 60 reads per IP per minute
const GET_LIMIT  = { limit: 60, windowMs: 60 * 1000 };

export async function POST(request: Request) {
  const { ok, resetAt } = rateLimit(`session-post:${getIp(request)}`, POST_LIMIT);
  if (!ok) return tooManyRequests(resetAt);

  let body: { session_token?: string; onboarding_data: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.onboarding_data || typeof body.onboarding_data !== "object") {
    return Response.json({ error: "Missing onboarding_data" }, { status: 400 });
  }

  const db = supabaseAdmin;
  const token = body.session_token ?? randomUUID();

  const { error } = await db.from("room_sessions").upsert(
    {
      session_token: token,
      onboarding_data: body.onboarding_data,
      last_accessed_at: new Date().toISOString(),
    },
    { onConflict: "session_token" }
  );

  if (error) {
    console.error("[session] db error", error.message);
    return Response.json({ error: "Could not save session" }, { status: 500 });
  }

  return Response.json({ ok: true, session_token: token });
}

export async function GET(request: Request) {
  const { ok, resetAt } = rateLimit(`session-get:${getIp(request)}`, GET_LIMIT);
  if (!ok) return tooManyRequests(resetAt);

  const token = new URL(request.url).searchParams.get("token");
  if (!token) return Response.json({ error: "Missing token" }, { status: 400 });

  const db = supabaseAdmin;
  const { data, error } = await db
    .from("room_sessions")
    .select("onboarding_data, last_accessed_at")
    .eq("session_token", token)
    .single();

  if (error || !data) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  // Update last_accessed_at (non-blocking)
  db.from("room_sessions")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("session_token", token)
    .then(({ error: e }) => {
      if (e) console.error("[session] update error", e.message);
    });

  return Response.json({ onboarding_data: data.onboarding_data });
}
