export type StylePreference =
  | "warm-mid-century"
  | "scandinavian-minimal"
  | "modern-glam"
  | "earthy-organic"
  | "eclectic-maximalist";

export type HouseholdType =
  | "solo"
  | "couple"
  | "family-kids"
  | "family-pets"
  | "roommates";

export type ProductCategory =
  | "sofa"
  | "coffee-table"
  | "side-table"
  | "floor-lamp"
  | "area-rug"
  | "accent-chair"
  | "wall-art"
  | "plant"
  | "curtains"
  | "bookshelf";

export interface OnboardingData {
  room: string;
  dimensions: { length: number; width: number };
  budget: number;
  style: StylePreference;
  household: HouseholdType;
  primaryUse: string;
  existingPieces: string;
  postcode: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  retailer: string;
  price: number;
  image: string;
  affiliateUrl: string;
  styles: StylePreference[];
  householdSuitability: HouseholdType[];
  rating: number;
  isLocal?: boolean;
  localDistance?: number;
  qualityTier?: "budget" | "mid" | "premium";
  explanation?: string;
  gltf_url?: string | null;
  usdz_url?: string | null;
}

export interface RecommendationSet {
  category: ProductCategory;
  categoryLabel: string;
  optionA: Product & { explanation: string };
  optionB: Product & { explanation: string };
  optionC: Product & { explanation: string };
  categoryBudget: number;
}
