import { supabaseAdmin } from "@/lib/supabase";
import { stubEmbedFromImageUrl } from "./embedding-stub";
import type { CatalogSource, RemoteProduct } from "./sources/catalog-source";

export interface SyncOptions {
  sources: CatalogSource[];
  categories: string[];
  perCategory?: number;
  zip?: string;
  /** Inject for tests; default = stubEmbedFromImageUrl. Plan 3 swaps in real CLIP. */
  embedder?: (url: string) => Promise<number[]>;
}

export interface SyncResult {
  fetched: number;
  upserted: number;
  errors: { source: string; category: string; message: string }[];
}

export class CatalogSyncer {
  constructor(private readonly opts: SyncOptions) {}

  async run(): Promise<SyncResult> {
    const out: SyncResult = { fetched: 0, upserted: 0, errors: [] };
    const embed = this.opts.embedder ?? stubEmbedFromImageUrl;
    const db = supabaseAdmin();

    for (const source of this.opts.sources) {
      for (const category of this.opts.categories) {
        try {
          const items = await source.fetchByCategory({
            category,
            limit: this.opts.perCategory ?? 10,
            zip: this.opts.zip,
          });
          out.fetched += items.length;

          const usable = items.filter((p) => p.image_url && p.price > 0);
          if (usable.length === 0) continue;

          const styles = await this.tagStylesIfAvailable(usable);

          const rows = await Promise.all(
            usable.map(async (p) => ({
              id: p.remote_id,
              name: p.name,
              category: p.category || category,
              retailer: p.retailer,
              price: p.price,
              image_url: p.image_url,
              affiliate_url: p.affiliate_url,
              styles: styles.get(p.remote_id) ?? [],
              household_suit: [],
              rating: p.rating,
              is_local: false,
              quality_tier: "mid",
              is_curated: false,
              source: source.name,
              last_seen_at: new Date().toISOString(),
              embedding: await embed(p.image_url),
            }))
          );

          // Sync rows have retailer-prefixed ids (e.g., walmart-12345); curated
          // rows use simple prefixes like sofa-001. No collision possible, so
          // a straight upsert by `id` is safe.
          const { error } = await db.from("catalog").upsert(rows, { onConflict: "id" });
          if (error) {
            out.errors.push({ source: source.name, category, message: error.message });
          } else {
            out.upserted += rows.length;
          }
        } catch (err) {
          out.errors.push({ source: source.name, category, message: (err as Error).message });
        }
      }
    }
    return out;
  }

  private async tagStylesIfAvailable(items: RemoteProduct[]): Promise<Map<string, string[]>> {
    const out = new Map<string, string[]>();
    if (!process.env.ANTHROPIC_API_KEY) return out;

    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const batch = items.slice(0, 20);
      const resp = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: `Tag each product with 1-3 styles from: warm-mid-century, scandinavian-minimal, modern-glam, earthy-organic, eclectic-maximalist. Return JSON: { "tags": { "<sku>": ["<style>", ...] } }`,
        messages: [{
          role: "user",
          content: [
            ...batch.map((p) => ({ type: "image" as const, source: { type: "url" as const, url: p.image_url } })),
            { type: "text" as const, text: JSON.stringify({ products: batch.map((p) => ({ sku: p.remote_id, name: p.name })) }) },
          ],
        }],
      });
      const textBlock = resp.content.find((c) => c.type === "text") as { type: "text"; text: string } | undefined;
      const text = textBlock?.text ?? "";
      const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      const parsed = JSON.parse(cleaned) as { tags: Record<string, string[]> };
      for (const [sku, tags] of Object.entries(parsed.tags ?? {})) {
        out.set(sku, tags);
      }
    } catch (err) {
      console.warn("[sync] style tagging failed, leaving styles empty:", (err as Error).message);
    }
    return out;
  }
}
