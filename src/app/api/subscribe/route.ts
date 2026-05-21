import { supabaseAdmin } from "@/lib/supabase";
import { resend, FROM_EMAIL, buildWelcomeEmail } from "@/lib/resend";
import { generateUnsubscribeToken } from "@/lib/unsubscribe-token";
import { rateLimit, getIp, tooManyRequests, isValidEmail } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/csrf";

// 5 signups per IP per hour
const LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

export async function POST(request: Request) {
  const csrf = checkCsrf(request); if (csrf) return csrf;
  const { ok, resetAt } = rateLimit(`subscribe:${getIp(request)}`, LIMIT);
  if (!ok) return tooManyRequests(resetAt);

  let body: { email: string; room_data?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  const db = supabaseAdmin;

  const { error: dbError } = await db
    .from("email_subscriptions")
    .upsert(
      { email, room_data: body.room_data ?? null, unsubscribed_at: null },
      { onConflict: "email" }
    );

  if (dbError) {
    console.error("[subscribe] db error", dbError.message);
    return Response.json({ error: "Could not save subscription" }, { status: 500 });
  }

  try {
    const token = generateUnsubscribeToken(email);
    const unsubscribeUrl = `https://dwelliq-ten.vercel.app/api/unsubscribe?token=${token}`;
    await resend.emails.send({ from: FROM_EMAIL, ...buildWelcomeEmail(email, unsubscribeUrl) });
  } catch (err) {
    console.error("[subscribe] resend error", err);
  }

  return Response.json({ ok: true });
}
