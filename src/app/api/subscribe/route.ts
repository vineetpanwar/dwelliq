import { supabaseAdmin } from "@/lib/supabase";
import { resend, FROM_EMAIL, buildWelcomeEmail } from "@/lib/resend";

export async function POST(request: Request) {
  let body: { email: string; room_data?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Upsert: if email exists, update room_data and clear unsubscribed_at
  const { error: dbError } = await db
    .from("email_subscriptions")
    .upsert(
      {
        email,
        room_data: body.room_data ?? null,
        unsubscribed_at: null,
      },
      { onConflict: "email" }
    );

  if (dbError) {
    console.error("[subscribe] db error", dbError.message);
    return Response.json({ error: "Could not save subscription" }, { status: 500 });
  }

  // Send welcome email (non-fatal if it fails)
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      ...buildWelcomeEmail(email),
    });
  } catch (err) {
    console.error("[subscribe] resend error", err);
  }

  return Response.json({ ok: true });
}
