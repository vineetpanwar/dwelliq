import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import type Stripe from "stripe";

// Raw body required for Stripe signature verification — do not parse with Next.js body parser.
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook/stripe] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error("[webhook/stripe] handler error", err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok");
}

async function handleEvent(event: Stripe.Event) {
  const db = supabaseAdmin;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      await db.from("subscriptions").upsert({
        stripe_customer_id:     session.customer as string,
        stripe_subscription_id: session.subscription as string,
        email:                  session.customer_email ?? session.customer_details?.email,
        plan:                   session.metadata?.plan ?? "pro",
        status:                 "active",
        trial_end:              null,
      }, { onConflict: "stripe_subscription_id" });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await db.from("subscriptions")
        .update({
          status:    sub.status,
          plan:      sub.metadata?.plan ?? "pro",
          trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
        })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db.from("subscriptions")
        .update({ status: "cancelled" })
        .eq("stripe_subscription_id", sub.id);
      break;
    }
  }
}
