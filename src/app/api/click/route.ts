import { CATALOG } from "@/lib/catalog";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, getIp, tooManyRequests } from "@/lib/rate-limit";
import type { Product } from "@/lib/types";

// 120 clicks per IP per minute — generous for browsing, blocks scrapers
const LIMIT = { limit: 120, windowMs: 60 * 1000 };

const AFFILIATE_TAGS: Record<string, string> = {
  Amazon: process.env.AFFILIATE_TAG_AMAZON ?? "",
  Wayfair: process.env.AFFILIATE_TAG_WAYFAIR ?? "",
  IKEA: process.env.AFFILIATE_TAG_IKEA ?? "",
  "West Elm": process.env.AFFILIATE_TAG_WEST_ELM ?? "",
};

function buildRetailerUrl(product: Product): string {
  const tag = AFFILIATE_TAGS[product.retailer] ?? "";
  const q = encodeURIComponent(product.name);

  if (product.affiliateUrl && !product.affiliateUrl.startsWith("#")) {
    const url = new URL(product.affiliateUrl);
    if (tag) url.searchParams.set("tag", tag);
    return url.toString();
  }

  switch (product.retailer) {
    case "Amazon":
      return `https://www.amazon.com/s?k=${q}${tag ? `&tag=${tag}` : ""}`;
    case "Wayfair":
      return `https://www.wayfair.com/keyword.php?keyword=${q}`;
    case "IKEA":
      return `https://www.ikea.com/us/en/search/?q=${q}`;
    case "West Elm":
      return `https://www.westelm.com/search/results.html?words=${q}`;
    default:
      return `https://www.google.com/search?q=${q}+${encodeURIComponent(product.retailer)}+buy`;
  }
}

export async function GET(request: Request) {
  const { ok, resetAt } = rateLimit(`click:${getIp(request)}`, LIMIT);
  if (!ok) return tooManyRequests(resetAt);

  const { searchParams } = new URL(request.url);
  const sku = searchParams.get("sku");
  const option = searchParams.get("option") ?? "A";
  const sessionId = searchParams.get("sid") ?? null;

  if (!sku) return new Response("Missing sku parameter", { status: 400 });

  const product = CATALOG.find((p) => p.id === sku);
  if (!product) return new Response("Unknown SKU", { status: 400 });

  // Non-blocking — let the redirect happen fast
  supabaseAdmin()
    .from("click_events")
    .insert({
      sku,
      option,
      retailer: product.retailer,
      session_id: sessionId,
      referrer: request.headers.get("referer") ?? null,
    })
    .then(({ error }) => {
      if (error) console.error("[click] db error", error.message);
    });

  return Response.redirect(buildRetailerUrl(product), 302);
}
