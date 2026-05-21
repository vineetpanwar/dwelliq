import Stripe from "stripe";

// Lazy singleton — not instantiated at build time so missing env vars don't break static generation.
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
  }
  return _stripe;
}

export const PRICES = {
  pro:    process.env.STRIPE_PRO_PRICE_ID!,
  studio: process.env.STRIPE_STUDIO_PRICE_ID!,
} as const;

export type Plan = keyof typeof PRICES;

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dwelliq-ten.vercel.app";

export const CHECKOUT_URLS = {
  success: `${BASE}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel:  `${BASE}/pricing`,
};
