import { CATALOG } from "@/lib/catalog";
import { supabaseAdmin } from "@/lib/supabase";
import type { Product } from "@/lib/types";

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
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get("sku");
  const option = searchParams.get("option") ?? "A";
  const sessionId = searchParams.get("sid") ?? null;

  if (!sku) {
    return new Response("Missing sku parameter", { status: 400 });
  }

  const product = CATALOG.find((p) => p.id === sku);
  if (!product) {
    return new Response("Unknown SKU", { status: 400 });
  }

  // Log click to Supabase (non-blocking — don't await, let redirect happen fast)
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

  const destination = buildRetailerUrl(product);
  return Response.redirect(destination, 302);
}
