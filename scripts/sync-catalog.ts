import { CatalogSyncer } from "../src/lib/engine/sync";
import { WalmartCatalogSource } from "../src/lib/engine/sources/walmart";
import { EbayCatalogSource } from "../src/lib/engine/sources/ebay";
import type { CatalogSource } from "../src/lib/engine/sources/catalog-source";

const CATEGORIES = [
  "sofa", "coffee-table", "side-table", "floor-lamp", "area-rug",
  "accent-chair", "wall-art", "plant", "curtains", "bookshelf",
];

function buildSources(): CatalogSource[] {
  const sources: CatalogSource[] = [];
  if (process.env.WALMART_CONSUMER_ID && process.env.WALMART_PRIVATE_KEY) {
    sources.push(new WalmartCatalogSource({
      consumerId: process.env.WALMART_CONSUMER_ID,
      privateKey: process.env.WALMART_PRIVATE_KEY,
    }));
  }
  if (process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET) {
    sources.push(new EbayCatalogSource({
      clientId: process.env.EBAY_CLIENT_ID,
      clientSecret: process.env.EBAY_CLIENT_SECRET,
    }));
  }
  return sources;
}

async function main() {
  const sources = buildSources();
  if (sources.length === 0) {
    console.warn("[sync] no sources configured — set WALMART_* or EBAY_* env vars in .env.local");
    process.exit(0);
  }

  console.log(`[sync] running with sources: ${sources.map((s) => s.name).join(", ")}`);
  const syncer = new CatalogSyncer({
    sources,
    categories: CATEGORIES,
    perCategory: parseInt(process.env.SYNC_PER_CATEGORY ?? "10"),
    zip: process.env.SYNC_DEFAULT_ZIP,
  });

  const t0 = Date.now();
  const result = await syncer.run();
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  console.log(`[sync] done in ${elapsed}s — fetched=${result.fetched} upserted=${result.upserted} errors=${result.errors.length}`);
  if (result.errors.length > 0) {
    console.error(JSON.stringify(result.errors, null, 2));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[sync] fatal:", err);
  process.exit(1);
});
