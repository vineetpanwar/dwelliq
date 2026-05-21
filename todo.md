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
