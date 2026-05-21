import { createSign } from "node:crypto";
import type { CatalogSource, FetchOptions, RemoteProduct } from "./catalog-source";

const API_BASE = "https://developer.api.walmart.com/api-proxy/service/affil/product/v2";

interface WalmartConfig {
  consumerId: string;
  privateKey: string;
  keyVersion?: string;
}

interface WalmartItem {
  itemId: number;
  name: string;
  salePrice?: number;
  msrp?: number;
  categoryNode?: string;
  thumbnailImage?: string;
  largeImage?: string;
  affiliateAddToCartUrl?: string;
  productTrackingUrl?: string;
  customerRating?: string;
  stock?: string;
  brandName?: string;
}

interface WalmartSearchResponse {
  items: WalmartItem[];
  totalResults?: number;
}

export class WalmartCatalogSource implements CatalogSource {
  readonly name = "walmart" as const;
  private readonly cfg: Required<WalmartConfig>;

  constructor(cfg: WalmartConfig) {
    this.cfg = { keyVersion: "1", ...cfg };
  }

  async fetchByCategory(opts: FetchOptions): Promise<RemoteProduct[]> {
    const url = new URL(`${API_BASE}/search`);
    url.searchParams.set("query", opts.category);
    url.searchParams.set("numItems", String(opts.limit));
    if (opts.zip) url.searchParams.set("zip", opts.zip);

    const res = await fetch(url.toString(), { headers: this.signedHeaders() });
    if (!res.ok) throw new Error(`Walmart ${res.status}: ${url.pathname}`);
    const body = (await res.json()) as WalmartSearchResponse;
    return (body.items ?? []).map((it) => this.toRemoteProduct(it));
  }

  async isAvailable(remote_id: string): Promise<boolean> {
    const itemId = remote_id.replace(/^walmart-/, "");
    const url = new URL(`${API_BASE}/items/${itemId}`);
    const res = await fetch(url.toString(), { headers: this.signedHeaders() });
    if (!res.ok) return false;
    const body = (await res.json()) as WalmartSearchResponse;
    const item = body.items?.[0];
    return item?.stock === "Available";
  }

  private signedHeaders(): Record<string, string> {
    const timestamp = Date.now().toString();
    const toSign = `${this.cfg.consumerId}\n${timestamp}\n${this.cfg.keyVersion}\n`;
    const signer = createSign("RSA-SHA256");
    signer.update(toSign);
    const signature = signer.sign(this.cfg.privateKey, "base64");
    return {
      "WM_CONSUMER.ID": this.cfg.consumerId,
      "WM_CONSUMER.INTIMESTAMP": timestamp,
      "WM_SEC.AUTH_SIGNATURE": signature,
      "WM_SEC.KEY_VERSION": this.cfg.keyVersion,
      Accept: "application/json",
    };
  }

  private toRemoteProduct(it: WalmartItem): RemoteProduct {
    return {
      source: "walmart",
      remote_id: `walmart-${it.itemId}`,
      name: it.name,
      retailer: "Walmart",
      category: (it.categoryNode ?? "").toLowerCase(),
      price: it.salePrice ?? it.msrp ?? 0,
      image_url: it.largeImage ?? it.thumbnailImage ?? "",
      affiliate_url: it.affiliateAddToCartUrl ?? it.productTrackingUrl ?? "",
      rating: parseFloat(it.customerRating ?? "0") || 0,
      in_stock: it.stock === "Available",
      fetched_at: new Date().toISOString(),
    };
  }
}
