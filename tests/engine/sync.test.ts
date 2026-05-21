import { describe, it, expect, vi, beforeEach } from "vitest";
import { CatalogSyncer } from "@/lib/engine/sync";
import type { CatalogSource, RemoteProduct } from "@/lib/engine/sources/catalog-source";

class FakeSource implements CatalogSource {
  readonly name = "walmart" as const;
  constructor(private products: RemoteProduct[]) {}
  async fetchByCategory(): Promise<RemoteProduct[]> { return this.products; }
  async isAvailable(): Promise<boolean> { return true; }
}

const upsertMock = vi.fn(async () => ({ error: null }));
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: () => ({
    from: () => ({ upsert: upsertMock }),
  }),
}));

const sampleProduct = (id: string): RemoteProduct => ({
  source: "walmart", remote_id: id, name: "X", retailer: "Walmart",
  category: "sofa", price: 500, image_url: "https://x.jpg", affiliate_url: "",
  rating: 4, in_stock: true, fetched_at: new Date().toISOString(),
});

describe("CatalogSyncer", () => {
  beforeEach(() => upsertMock.mockClear());

  it("fetches from each source × category and upserts", async () => {
    const source = new FakeSource([sampleProduct("walmart-1"), sampleProduct("walmart-2")]);
    const syncer = new CatalogSyncer({
      sources: [source],
      categories: ["sofa", "side-table"],
      perCategory: 10,
    });
    const result = await syncer.run();
    expect(result.fetched).toBe(4);
    expect(result.upserted).toBe(4);
    expect(upsertMock).toHaveBeenCalled();
  });

  it("upserts rows with source + is_curated=false + last_seen_at set", async () => {
    const source = new FakeSource([sampleProduct("walmart-1")]);
    const syncer = new CatalogSyncer({ sources: [source], categories: ["sofa"], perCategory: 5 });
    await syncer.run();
    expect(upsertMock).toHaveBeenCalled();
    const calls = upsertMock.mock.calls as unknown as [unknown][];
    const upsertedArg = calls[0]![0] as Record<string, unknown> | Record<string, unknown>[];
    const rows = (Array.isArray(upsertedArg) ? upsertedArg : [upsertedArg]) as Record<string, unknown>[];
    expect(rows[0]!.is_curated).toBe(false);
    expect(rows[0]!.source).toBe("walmart");
    expect(rows[0]!.last_seen_at).toBeTruthy();
  });
});
