import type { ProductCategory } from "@/lib/types";

export interface FetchOptions {
  category: ProductCategory | string;
  limit: number;
  zip?: string;
}

export interface RemoteProduct {
  source: "walmart" | "ebay";
  remote_id: string;
  name: string;
  retailer: string;
  category: string;
  price: number;
  image_url: string;
  affiliate_url: string;
  rating: number;
  in_stock: boolean;
  fetched_at: string;
}

export interface CatalogSource {
  readonly name: "walmart" | "ebay";
  fetchByCategory(opts: FetchOptions): Promise<RemoteProduct[]>;
  isAvailable(remote_id: string): Promise<boolean>;
}
