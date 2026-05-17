-- Enable pgvector for CLIP/embedding columns
create extension if not exists vector;

-- 1. Extend catalog with mobile-specific columns
create table if not exists catalog (
  id                  text primary key,
  name                text not null,
  category            text not null,
  retailer            text not null,
  price               numeric not null,
  image_url           text not null,
  affiliate_url       text not null,
  styles              text[] not null default '{}',
  household_suit      text[] not null default '{}',
  rating              numeric not null default 0,
  is_local            boolean not null default false,
  local_distance      numeric,
  quality_tier        text not null default 'mid',
  explanation         text,
  embedding           vector(768),
  gltf_url            text,
  updated_at          timestamptz not null default now()
);
create index if not exists catalog_category_idx       on catalog (category);
create index if not exists catalog_styles_idx         on catalog using gin (styles);
create index if not exists catalog_price_idx          on catalog (price);
create index if not exists catalog_local_idx          on catalog (is_local) where is_local = true;
create index if not exists catalog_embedding_ivfflat  on catalog using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- 2. vision_features — one row per photo upload
create table if not exists vision_features (
  photo_id        uuid primary key,
  session_id      text,
  bbox            int[],
  mask_url        text,
  depth_scale_cm  numeric,
  palette         text[] not null default '{}',
  light_temp      text,
  clip_embedding  vector(768),
  created_at      timestamptz not null default now()
);
create index if not exists vision_features_session_idx        on vision_features (session_id);
create index if not exists vision_features_embedding_ivfflat  on vision_features using ivfflat (clip_embedding vector_cosine_ops) with (lists = 100);

-- 3. picks — one row per (photo, query)
create table if not exists picks (
  id              uuid primary key default gen_random_uuid(),
  photo_id        uuid references vision_features(photo_id),
  session_id      text,
  user_id         uuid,
  query           text not null,
  brief           jsonb not null,
  candidates      text[] not null default '{}',
  results         jsonb not null,
  mood_a_url      text,
  mood_b_url      text,
  mood_c_url      text,
  rerank_provider text not null default 'rule-based',
  created_at      timestamptz not null default now()
);
create index if not exists picks_session_idx on picks (session_id);
create index if not exists picks_photo_idx   on picks (photo_id);

-- 4. telemetry_pairs — training corpus for the future evaluator
create table if not exists telemetry_pairs (
  id                  uuid primary key default gen_random_uuid(),
  pick_set_id         uuid not null references picks(id) unique,
  swipe_path          text[] not null default '{}',
  inpaint_seen        text[] not null default '{}',
  ar_opened_sku       text,
  buy_clicked_sku     text,
  filter_changes      jsonb not null default '[]',
  session_duration_ms int,
  rerank_fallback     boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 5. RLS — API routes use service role; deny anon access
alter table catalog          enable row level security;
alter table vision_features  enable row level security;
alter table picks            enable row level security;
alter table telemetry_pairs  enable row level security;
