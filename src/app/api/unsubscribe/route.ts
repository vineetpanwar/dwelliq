import { supabaseAdmin } from "@/lib/supabase";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { NextResponse } from "next/server";

const BASE = "https://dwelliq-ten.vercel.app";

// GET /api/unsubscribe?token=xxx  — linked from emails
// POST /api/unsubscribe?token=xxx — Gmail one-click List-Unsubscribe-Post
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const email = verifyUnsubscribeToken(token);

  if (!email) {
    return NextResponse.redirect(`${BASE}/unsubscribe?status=invalid`);
  }

  const { error } = await supabaseAdmin
    .from("email_subscriptions")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email);

  if (error) {
    console.error("[unsubscribe] db error", error.message);
    return NextResponse.redirect(`${BASE}/unsubscribe?status=error`);
  }

  return NextResponse.redirect(`${BASE}/unsubscribe?status=success`);
}

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const email = verifyUnsubscribeToken(token);

  if (!email) return new Response("Invalid token", { status: 400 });

  const { error } = await supabaseAdmin
    .from("email_subscriptions")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email);

  if (error) {
    console.error("[unsubscribe] db error", error.message);
    return new Response("Error", { status: 500 });
  }

  return new Response("Unsubscribed", { status: 200 });
}
