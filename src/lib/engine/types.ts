import type { Product, ProductCategory, StylePreference } from "@/lib/types";

export type LightTemp = "warm" | "neutral" | "cool";

export interface VisionFeatures {
  photo_id: string;
  bbox: [number, number, number, number];
  mask_url: string | null;
  depth_scale_cm: number | null;
  palette: string[];
  light_temp: LightTemp;
  clip_embedding: number[];
}

export interface Candidate {
  sku: string;
  product: Product;
  similarity: number;
}

export interface Pick {
  role: "A" | "B" | "C";
  sku: string;
  product: Product;
  rationale: string;
  match: number;
  ar_available: boolean;
  mood_url: string | null;
}

export interface PickSet {
  pick_set_id: string;
  brief: Brief;
  inferred: { style: StylePreference; palette: string[]; light_temp: LightTemp };
  picks: [Pick, Pick, Pick];
}

export interface Brief {
  query: string;
  category?: ProductCategory;
  budget?: number;
  zip?: string;
}

export interface RerankerInput {
  photo_id: string;
  features: VisionFeatures;
  candidates: Candidate[];
  brief: Brief;
}

export interface Reranker {
  readonly providerName: string;
  rerank(input: RerankerInput): Promise<PickSet>;
}
