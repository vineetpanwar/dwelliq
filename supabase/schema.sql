-- Run this in your Supabase project's SQL editor

-- Email subscriptions (price alert sign-ups)
create table if not exists email_subscriptions (
  id               uuid default gen_random_uuid() primary key,
  email            text not null,
  room_data        jsonb,
  created_at       timestamptz default now(),
  unsubscribed_at  timestamptz,
  constraint email_subscriptions_email_key unique (email)
);

-- Click events (affiliate link analytics)
create table if not exists click_events (
  id          uuid default gen_random_uuid() primary key,
  sku         text not null,
  option      text not null,          -- A | B | C
  retailer    text,
  session_id  text,
  referrer    text,
  created_at  timestamptz default now()
);
create index if not exists click_events_sku_idx on click_events (sku);
create index if not exists click_events_created_at_idx on click_events (created_at);

-- Room sessions (persist onboarding across devices / page refreshes)
create table if not exists room_sessions (
  id               uuid default gen_random_uuid() primary key,
  session_token    text unique not null,
  onboarding_data  jsonb not null,
  created_at       timestamptz default now(),
  last_accessed_at timestamptz default now()
);
create index if not exists room_sessions_token_idx on room_sessions (session_token);

-- Row Level Security: anonymous reads via anon key are blocked;
-- API routes use the service role key which bypasses RLS.
alter table email_subscriptions enable row level security;
alter table click_events enable row level security;
alter table room_sessions enable row level security;
