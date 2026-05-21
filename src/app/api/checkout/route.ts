import { getStripe, PRICES, CHECKOUT_URLS } from "@/lib/stripe";
import type { Plan } from "@/lib/stripe";
import { checkCsrf } from "@/lib/csrf";
import { rateLimit, getIp, tooManyRequests } from "@/lib/rate-limit";

const LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 };

export async function POST(request: Request) {
  const csrf = checkCsrf(request); if (csrf) return csrf;
  const { ok, resetAt } = rateLimit(`checkout:${getIp(request)}`, LIMIT);
  if (!ok) return tooManyRequests(resetAt);

  let body: { plan?: string; email?: string };
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const plan = body.plan as Plan | undefined;
  if (!plan || !PRICES[plan]) {
    return Response.json({ error: "Invalid plan. Use 'pro' or 'studio'." }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      ...(body.email ? { customer_email: body.email } : {}),
      subscription_data: {
        trial_period_days: plan === "pro" ? 14 : undefined,
        metadata: { plan },
      },
      success_url: CHECKOUT_URLS.success,
      cancel_url:  CHECKOUT_URLS.cancel,
      metadata: { plan },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] stripe error", err);
    return Response.json({ error: "Could not create checkout session" }, { status: 500 });
  }
}
