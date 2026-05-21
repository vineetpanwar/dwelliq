import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateKeyPairSync } from "node:crypto";
import { WalmartCatalogSource } from "@/lib/engine/sources/walmart";

const fetchMock = vi.fn();
global.fetch = fetchMock as unknown as typeof fetch;

// Generate a real RSA key pair for testing the signing logic (not the fake PEM
// from the plan — that won't actually sign).
let TEST_PEM: string;
beforeEach(() => {
  fetchMock.mockReset();
  if (!TEST_PEM) {
    const { privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
      publicKeyEncoding: { type: "spki", format: "pem" },
    });
    TEST_PEM = privateKey;
  }
});

describe("WalmartCatalogSource", () => {
  it("fetchByCategory calls Walmart I/O search with signed headers", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [{
          itemId: 12345, name: "Walnut Table", salePrice: 199.99,
          categoryNode: "Furniture", thumbnailImage: "https://x/a.jpg",
          affiliateAddToCartUrl: "https://goto.walmart.com/c/?u=...",
          customerRating: "4.5", stock: "Available",
        }],
      }),
    });
    const src = new WalmartCatalogSource({ consumerId: "test", privateKey: TEST_PEM });
    const results = await src.fetchByCategory({ category: "side-table", limit: 10, zip: "10003" });
    expect(results).toHaveLength(1);
    expect(results[0].source).toBe("walmart");
    expect(results[0].remote_id).toBe("walmart-12345");
    expect(results[0].price).toBe(199.99);
    expect(results[0].in_stock).toBe(true);
    const callOpts = fetchMock.mock.calls[0][1];
    expect(callOpts.headers["WM_CONSUMER.ID"]).toBe("test");
    expect(callOpts.headers["WM_SEC.AUTH_SIGNATURE"]).toBeTruthy();
  });

  it("throws on non-2xx", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ error: "unauthorized" }) });
    const src = new WalmartCatalogSource({ consumerId: "test", privateKey: TEST_PEM });
    await expect(src.fetchByCategory({ category: "sofa", limit: 5 })).rejects.toThrow(/401/);
  });

  it("isAvailable returns true when API says in stock", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [{ itemId: 12345, stock: "Available" }] }),
    });
    const src = new WalmartCatalogSource({ consumerId: "test", privateKey: TEST_PEM });
    expect(await src.isAvailable("walmart-12345")).toBe(true);
  });

  it("isAvailable returns false when stock is not 'Available'", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [{ itemId: 12345, stock: "Not Available" }] }),
    });
    const src = new WalmartCatalogSource({ consumerId: "test", privateKey: TEST_PEM });
    expect(await src.isAvailable("walmart-12345")).toBe(false);
  });
});
