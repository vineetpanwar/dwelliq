-- Plan 3e: AR support
alter table catalog
  add column if not exists usdz_url text;
-- gltf_url already added in Plan 1 migration (20260517_mobile_foundation.sql)
