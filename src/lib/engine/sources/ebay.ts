import type { CatalogSource, FetchOptions, RemoteProduct } from "./catalog-source";

const API_BASE = "https://api.ebay.com/buy/browse/v1";
const TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";

interface EbayConfig {
  clientId: string;
  clientSecret: string;
  marketplace?: string;
}

interface EbayItemSummary {
  itemId: string;
  title: string;
  price?: { value: string; currency: string };
  image?: { imageUrl: string };
  thumbnailImages?: Array<{ imageUrl: string }>;
  itemAffiliateWebUrl?: string;
  itemWebUrl?: string;
  seller?: { feedbackScore?: number };
  buyingOptions?: string[];
}

interface EbaySearchResponse {
  itemSummaries?: EbayItemSummary[];
  total?: number;
}

interface EbayItemDetail {
  itemId: string;
  availabilityStatus?: string;
}

export class EbayCatalogSource implements CatalogSource {
  readonly name = "ebay" as const;
  private readonly cfg: Required<EbayConfig>;
  private cachedToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(cfg: EbayConfig) {
    this.cfg = { marketplace: "EBAY_US", ...cfg };
  }

  async fetchByCategory(opts: FetchOptions): Promise<RemoteProduct[]> {
    const token = await this.getToken();
    const url = new URL(`${API_BASE}/item_summary/search`);
    url.searchParams.set("q", opts.category);
    url.searchParams.set("limit", String(opts.limit));

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": this.cfg.marketplace,
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error(`eBay ${res.status}: search`);
    const body = (await res.json()) as EbaySearchResponse;
    return (body.itemSummaries ?? []).map((it) => this.toRemoteProduct(it));
  }

  async isAvailable(remote_id: string): Promise<boolean> {
    const itemId = remote_id.replace(/^ebay-/, "");
    const token = await this.getToken();
    const res = await fetch(`${API_BASE}/item/${encodeURIComponent(itemId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": this.cfg.marketplace,
      },
    });
    if (!res.ok) return false;
    const body = (await res.json()) as EbayItemDetail;
    return body.availabilityStatus === "AVAILABLE" || body.availabilityStatus === undefined;
  }

  private async getToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.tokenExpiresAt - 60_000) return this.cachedToken;

    const auth = Buffer.from(`${this.cfg.clientId}:${this.cfg.clientSecret}`).toString("base64");
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
    });
    if (!res.ok) throw new Error(`eBay token ${res.status}`);
    const body = await res.json() as { access_token: string; expires_in: number };
    this.cachedToken = body.access_token;
    this.tokenExpiresAt = Date.now() + body.expires_in * 1000;
    return this.cachedToken;
  }

  private toRemoteProduct(it: EbayItemSummary): RemoteProduct {
    const value = it.price ? parseFloat(it.price.value) : 0;
    return {
      source: "ebay",
      remote_id: `ebay-${it.itemId}`,
      name: it.title,
      retailer: "eBay",
      category: "",
      price: value,
      image_url: it.image?.imageUrl ?? it.thumbnailImages?.[0]?.imageUrl ?? "",
      affiliate_url: it.itemAffiliateWebUrl ?? it.itemWebUrl ?? "",
      rating: it.seller?.feedbackScore ? Math.min(5, it.seller.feedbackScore / 200) : 4,
      in_stock: !!it.buyingOptions?.includes("FIXED_PRICE"),
      fetched_at: new Date().toISOString(),
    };
  }
}
