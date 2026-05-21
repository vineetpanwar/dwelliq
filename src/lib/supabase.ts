import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// Server-side singleton using service role key (bypasses RLS — only for API routes)
export const supabaseAdmin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type EmailSubscription = {
  id: string;
  email: string;
  room_data: Record<string, unknown> | null;
  created_at: string;
  unsubscribed_at: string | null;
};

export type ClickEvent = {
  id: string;
  sku: string;
  option: string;
  retailer: string | null;
  session_id: string | null;
  created_at: string;
};

export type RoomSession = {
  id: string;
  session_token: string;
  onboarding_data: Record<string, unknown>;
  created_at: string;
  last_accessed_at: string;
};

export type VisionFeaturesRow = {
  photo_id: string;
  session_id: string | null;
  bbox: number[] | null;
  mask_url: string | null;
  depth_scale_cm: number | null;
  palette: string[];
  light_temp: "warm" | "neutral" | "cool" | null;
  clip_embedding: number[] | null;
  created_at: string;
};

export type PicksRow = {
  id: string;
  photo_id: string | null;
  session_id: string | null;
  user_id: string | null;
  query: string;
  brief: Record<string, unknown>;
  candidates: string[];
  results: unknown;
  mood_a_url: string | null;
  mood_b_url: string | null;
  mood_c_url: string | null;
  rerank_provider: string;
  created_at: string;
};

export type TelemetryPairRow = {
  id: string;
  pick_set_id: string;
  swipe_path: string[];
  inpaint_seen: string[];
  ar_opened_sku: string | null;
  buy_clicked_sku: string | null;
  filter_changes: unknown[];
  session_duration_ms: number | null;
  rerank_fallback: boolean;
  created_at: string;
  updated_at: string;
};
