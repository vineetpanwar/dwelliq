import { NextRequest } from "next/server";
import { CatalogSyncer } from "@/lib/engine/sync";
import { WalmartCatalogSource } from "@/lib/engine/sources/walmart";
import { EbayCatalogSource } from "@/lib/engine/sources/ebay";
import type { CatalogSource } from "@/lib/engine/sources/catalog-source";

const CATEGORIES = [
  "sofa", "coffee-table", "side-table", "floor-lamp", "area-rug",
  "accent-chair", "wall-art", "plant", "curtains", "bookshelf",
];

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

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

  if (sources.length === 0) {
    return Response.json({ ok: true, skipped: "no sources configured" });
  }

  const result = await new CatalogSyncer({
    sources, categories: CATEGORIES,
    perCategory: 10, zip: process.env.SYNC_DEFAULT_ZIP,
  }).run();

  return Response.json({ ok: result.errors.length === 0, ...result });
}
