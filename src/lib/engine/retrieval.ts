import { supabaseAdmin } from "@/lib/supabase";
import type { Candidate, Brief, VisionFeatures } from "./types";
import type { Product, ProductCategory } from "@/lib/types";

/**
 * Retrieve top-K candidates using a Supabase RPC that combines:
 *   - cosine ANN over `catalog.embedding` vs the photo's CLIP embedding
 *   - filters: category, price ceiling, optional local-only
 *
 * The RPC must exist in the Supabase project. See `supabase/migrations/20260517_mobile_foundation.sql`
 * for the create statement (Task 7 adds it as a follow-up migration).
 */
export async function retrieve(features: VisionFeatures, brief: Brief, k = 30): Promise<Candidate[]> {
  const db = supabaseAdmin();

  const { data, error } = await db.rpc("match_catalog", {
    query_embedding: features.clip_embedding,
    p_category: brief.category ?? null,
    p_price_max: brief.budget ? brief.budget * 1.5 : null,
    p_local_only: false,
    match_count: k,
  });

  if (error) {
    console.error("[retrieve] rpc error:", error.message);
    return [];
  }

  return (data ?? []).map((r: RawCatalogRow): Candidate => ({
    sku: r.id,
    similarity: r.similarity ?? 0,
    product: rowToProduct(r),
  }));
}

interface RawCatalogRow {
  id: string;
  name: string;
  category: ProductCategory;
  retailer: string;
  price: number;
  image_url: string;
  affiliate_url: string;
  styles: string[];
  household_suit: string[];
  rating: number;
  is_local: boolean;
  local_distance: number | null;
  quality_tier: "budget" | "mid" | "premium" | null;
  similarity: number;
}

function rowToProduct(r: RawCatalogRow): Product {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    retailer: r.retailer,
    price: r.price,
    image: r.image_url,
    affiliateUrl: r.affiliate_url,
    styles: r.styles as Product["styles"],
    householdSuitability: r.household_suit as Product["householdSuitability"],
    rating: r.rating,
    isLocal: r.is_local,
    localDistance: r.local_distance ?? undefined,
    qualityTier: r.quality_tier ?? "mid",
  };
}
