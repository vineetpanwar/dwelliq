import { describe, it, expect, vi, beforeEach } from "vitest";
import { EbayCatalogSource } from "@/lib/engine/sources/ebay";

const fetchMock = vi.fn();
global.fetch = fetchMock as unknown as typeof fetch;

describe("EbayCatalogSource", () => {
  beforeEach(() => fetchMock.mockReset());

  it("fetchByCategory exchanges client creds for token, then queries", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "abc123", expires_in: 7200 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          itemSummaries: [{
            itemId: "v1|123|0", title: "Walnut Side Table",
            price: { value: "85.00", currency: "USD" },
            image: { imageUrl: "https://x/img.jpg" },
            itemAffiliateWebUrl: "https://ebay.com/itm/123?campid=...",
            seller: { feedbackScore: 200 },
            buyingOptions: ["FIXED_PRICE"],
          }],
        }),
      });
    const src = new EbayCatalogSource({ clientId: "id", clientSecret: "secret" });
    const results = await src.fetchByCategory({ category: "side-table", limit: 10 });
    expect(results).toHaveLength(1);
    expect(results[0].source).toBe("ebay");
    expect(results[0].remote_id).toBe("ebay-v1|123|0");
    expect(results[0].price).toBe(85);
    const tokenCall = fetchMock.mock.calls[0][1];
    expect(tokenCall.headers.Authorization).toMatch(/^Basic /);
    const searchCall = fetchMock.mock.calls[1][1];
    expect(searchCall.headers.Authorization).toBe("Bearer abc123");
  });

  it("caches the token across calls", async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "abc", expires_in: 7200 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ itemSummaries: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ itemSummaries: [] }) });
    const src = new EbayCatalogSource({ clientId: "id", clientSecret: "secret" });
    await src.fetchByCategory({ category: "sofa", limit: 5 });
    await src.fetchByCategory({ category: "rug", limit: 5 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("isAvailable returns true when item exists", async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "abc", expires_in: 7200 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ itemId: "v1|123|0", availabilityStatus: "AVAILABLE" }) });
    const src = new EbayCatalogSource({ clientId: "id", clientSecret: "secret" });
    expect(await src.isAvailable("ebay-v1|123|0")).toBe(true);
  });
});
