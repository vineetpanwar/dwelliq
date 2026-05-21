-- Plan 2.5: catalog sync columns
alter table catalog
  add column if not exists is_curated   boolean      not null default false,
  add column if not exists last_seen_at timestamptz,
  add column if not exists source       text         not null default 'curated';
-- source values: 'curated' | 'walmart' | 'ebay' | ...

create index if not exists catalog_source_idx       on catalog (source);
create index if not exists catalog_last_seen_idx    on catalog (last_seen_at);
create index if not exists catalog_curated_idx      on catalog (is_curated) where is_curated = true;

-- Mark all currently-seeded rows as curated so sync doesn't clobber them.
update catalog set is_curated = true where source = 'curated';
