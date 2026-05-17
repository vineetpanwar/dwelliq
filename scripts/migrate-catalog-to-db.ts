import { CATALOG } from "../src/lib/catalog";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("[seed-catalog] missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key);

async function main() {
  const rows = CATALOG.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    retailer: p.retailer,
    price: p.price,
    image_url: p.image,
    affiliate_url: p.affiliateUrl,
    styles: p.styles,
    household_suit: p.householdSuitability,
    rating: p.rating,
    is_local: p.isLocal ?? false,
    local_distance: p.localDistance ?? null,
    quality_tier: p.qualityTier ?? "mid",
    explanation: p.explanation ?? null,
  }));

  const { error } = await db.from("catalog").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("[seed-catalog] error:", error.message);
    process.exit(1);
  }
  console.log(`[seed-catalog] upserted ${rows.length} rows`);
}

main().catch((err) => {
  console.error("[seed-catalog] unexpected error:", err);
  process.exit(1);
});
