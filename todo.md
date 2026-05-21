# DwellIQ Todo

## Soon — Plan 3 services

- [ ] Wire real SAM 2 + Depth + CLIP into `/api/vision`
- [ ] Wire real Gemini inpainting into `/api/inpaint`
- [ ] Stream mood image URLs as they complete

### Catalog sync activation (Plan 2.5 — code already in place)

- [ ] Apply `supabase/migrations/20260520_catalog_sync.sql` in Supabase SQL editor
- [ ] Walmart consumerId + privateKey in `.env.local`
- [ ] eBay clientId + clientSecret in `.env.local`
- [ ] Run `npm run sync` locally — verify rows land with `source IN ('walmart', 'ebay')`
- [ ] Deploy to Vercel
- [ ] Set CRON_SECRET in Vercel project env
- [ ] Confirm first hourly cron run in Vercel logs

### Plan 3 activation (code already in place)

Phase 3b — Claude rerank:
- [ ] `ANTHROPIC_API_KEY` in `.env.local`
- [ ] Verify designer-voice rationale in `/api/picks` response (rationale references concrete photo details)

Phase 3d — SAM 2 + Depth (optional polish):
- [ ] `REPLICATE_API_TOKEN` already required for CLIP (Phase 3a, upstream); same key powers SAM/Depth
- [ ] Pin actual Depth Anything v2 model version in `src/lib/engine/depth.ts` (currently placeholder)

Phase 3e — AR wiring:
- [ ] Apply `supabase/migrations/20260521_ar_columns.sql`
- [ ] Source GLB/USDZ files for ~50 hero SKUs (manual; biggest blocker)
- [ ] Upload to a Supabase Storage bucket (e.g. `gltf-models/`)
- [ ] Populate `catalog.gltf_url` / `catalog.usdz_url` for those rows
- [ ] Verify AR button appears in mobile result screen for AR-ready picks

Phase 3f — Live availability:
- [ ] `WALMART_*` + `EBAY_*` keys in `.env.local` (already needed for Plan 2.5 sync)
- [ ] Verify `/api/picks` swaps an out-of-stock pick with the next candidate

Phase 3g — Observability + rate limits:
- [ ] `SENTRY_DSN` in Vercel project env
- [ ] Confirm error capture in Sentry dashboard
- [ ] Adjust `RATE_LIMIT_PICKS_PER_SEC` / `RATE_LIMIT_UPLOAD_PER_SEC` to production scale
