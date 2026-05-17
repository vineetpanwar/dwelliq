import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// Server-side client using service role key (bypasses RLS — only for API routes)
export function supabaseAdmin() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

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
