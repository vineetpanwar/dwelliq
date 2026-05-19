# Dwelliq Backend — Operator Setup TODO

Bring this branch (`mobile-foundation`) live against your Supabase project. Once the boxes below are checked, the mobile app in [`vineetpanwar/dwelliq-mobile`](https://github.com/vineetpanwar/dwelliq-mobile) can talk to a real backend end-to-end.

See `docs/superpowers/specs/2026-05-16-dwelliq-mobile-app-design.md` and `docs/superpowers/plans/2026-05-17-dwelliq-backend-foundation.md` in the parent workspace for the underlying design.

---

## Today — what you need to do with Supabase only

### 1. Fill `.env.local`

```bash
cp .env.local.example .env.local
```

Edit and set **only these three** values (the rest stay empty until Plan 3):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=room-photos
```

Where to find them in the Supabase dashboard:

- **Project URL** + **anon public** key → Project Settings → API
- **service_role** key → same page (⚠️ secret — never commit, never ship to mobile)

- [ ] `.env.local` is filled and not committed (it's gitignored)

### 2. Apply the migration SQL

In the Supabase dashboard → **SQL Editor** → paste the entire contents of:

```
supabase/migrations/20260517_mobile_foundation.sql
```

…and run it.

Verify with:

```sql
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('catalog','vision_features','picks','telemetry_pairs');
```

Expected: 4 rows.

Also confirm the `match_catalog` function exists:

```sql
select proname from pg_proc where proname = 'match_catalog';
```

- [ ] All 4 tables exist
- [ ] `match_catalog` function exists

### 3. Create the Storage bucket

Supabase dashboard → **Storage** → New bucket:

- **Name:** `room-photos`
- **Public:** OFF (we use signed upload URLs)

- [ ] Bucket `room-photos` exists, private

### 4. Seed the catalog + embeddings

From the repo root:

```bash
npm install                                # if not done already
npm run db:seed-catalog
npm run db:backfill-embeddings
```

Expected output:

```
[seed-catalog] upserted ~200 rows
[backfill] embedding ~200 rows…
[backfill] done
```

Verify:

```sql
select count(*) from catalog;                                    -- ~200
select count(*) from catalog where embedding is not null;        -- same
```

- [ ] `catalog` has ~200 rows, all with embeddings

### 5. Start the backend

```bash
npm run dev
```

Smoke test from another terminal:

```bash
curl -X POST http://localhost:3000/api/upload-url
# Expected: {"photo_id":"...","upload_url":"https://...","path":"uploads/...jpg"}
```

- [ ] `npm run dev` boots cleanly
- [ ] `/api/upload-url` returns a JSON body with `photo_id` + `upload_url`

### 6. Wire the mobile app to this backend

In `~/Desktop/dwelliq-mobile/`:

```bash
cp .env.local.example .env.local
```

Edit and set:

```
EXPO_PUBLIC_API_BASE_URL=http://<your-LAN-IP>:3000
EXPO_PUBLIC_AR_LAUNCHER_PAGE=https://dwelliq.com/ar-launcher.html
```

Find your LAN IP:

- macOS: `ipconfig getifaddr en0` (Wi-Fi) or `en1` (Ethernet)
- Result looks like `192.168.1.x` or `10.0.0.x`

⚠️ **`localhost` only works in the iOS simulator.** Physical iPhones/Androids cannot reach `localhost` on your dev machine — use the LAN IP.

- [ ] Mobile `.env.local` filled
- [ ] `npx expo start` boots, app reaches the Result swipe screen with mood-image stubs

### 7. Run the e2e test (optional, end-of-day confidence check)

In one terminal:

```bash
npm run dev
```

In another:

```bash
E2E_BASE_URL=http://localhost:3000 npx vitest run tests/e2e/happy-path.test.ts
```

Expected: 1 test passing in ~3–5 s. Exercises `upload-url → vision → picks → inpaint → fetch-by-id → telemetry`.

- [ ] E2E green

---

## Soon — Plan 3 services (AI engine + affiliate)

These unlock the real "AI designer" quality. None are blocking for the v1 walkthrough — the app works with stubs until each key is added.

### AI services

| Service | What it powers | Env var | Where to get it |
|---|---|---|---|
| **Replicate** | SAM 2 + Depth Anything + CLIP (real vision features) | `REPLICATE_API_TOKEN` | [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) |
| **Anthropic** | Claude Sonnet vision rerank (designer-voice rationale) | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) → API keys |
| **Google AI** | Gemini 2.5 Flash image inpaint (real mood photos) | `GOOGLE_API_KEY` | [aistudio.google.com](https://aistudio.google.com/) → Get API key |

- [ ] Replicate token created (needed for vision)
- [ ] Anthropic key created (needed for rerank)
- [ ] Google AI key created (needed for inpaint)

### Live catalog fallback

| Service | What it powers | Env var | Where to get it |
|---|---|---|---|
| **Walmart Developer** | Live catalog fallback (when curated returns <3 matches) | `WALMART_API_KEY` | [developer.walmart.com](https://developer.walmart.com/) (signup, ~1–2 day approval) |
| **eBay Browse** | Live catalog fallback (secondary) | `EBAY_APP_ID` | [developer.ebay.com](https://developer.ebay.com/) → App key |

- [ ] Walmart key approved
- [ ] eBay app key created

### Affiliate revenue (when you start driving real traffic)

Current catalog uses stub affiliate URLs (e.g., `#affiliate-sofa-001`) — they 404 but don't crash anything. To collect commission, replace them with real tracked URLs.

| Network | Retailers it covers | Where to sign up |
|---|---|---|
| **Amazon Associates** | All Amazon SKUs | [affiliate-program.amazon.com](https://affiliate-program.amazon.com/) (free, instant; needs ≥3 sales / 180 days to stay active) |
| **Impact** | Walmart, Wayfair, Article, many more | [impact.com](https://impact.com/) → publisher signup |
| **CJ Affiliate** | West Elm, Pottery Barn, others | [cj.com](https://cj.com/) |
| **Rakuten Advertising** | Various mid-tier brands | [rakutenadvertising.com](https://rakutenadvertising.com/) |

- [ ] Amazon Associates tag created
- [ ] Impact account approved
- [ ] At least 100 catalog SKUs updated with real affiliate URLs

### Production deploy targets

- **Vercel** — for the Next.js backend. Connect `vineetpanwar/dwelliq` (or upstream once merged) → deploy `mobile-foundation` to a preview URL, then `main` to production. Set all the env vars above as Vercel project secrets.
- **App Store + Play Store** — via EAS Build (`eas build --profile production --platform ios|android`). Bundle id is `com.dwelliq.mobile`.

- [ ] Vercel project created for `dwelliq` repo
- [ ] All env vars copied into Vercel
- [ ] EAS project initialised (`eas init`)
- [ ] First TestFlight + Play Internal builds shipped

---

## Reference — what each file does

| File | What it is |
|---|---|
| `supabase/migrations/20260517_mobile_foundation.sql` | The whole schema migration. Paste in SQL editor to apply. |
| `scripts/migrate-catalog-to-db.ts` | Seeds the `catalog` table from `src/lib/catalog.ts`'s `CATALOG` constant. |
| `scripts/backfill-stub-embeddings.ts` | Computes the stub 768-d embedding for each row missing one. |
| `scripts/run-migration.ts` | Batch runner — for future migrations. Requires `exec_sql` function in Supabase (see header comment in the file). |
| `src/lib/engine/` | The AI engine: `Reranker` interface, `RuleBasedReranker` (v0), stub embedding/inpaint helpers. |
| `src/app/api/upload-url`, `vision`, `picks`, `picks/[id]`, `inpaint`, `telemetry/event` | Six new route handlers. |
| `tests/e2e/happy-path.test.ts` | Operator-run end-to-end test (excluded from default `npm test`). |

---

## Quick troubleshooting

| Symptom | Fix |
|---|---|
| `npm run dev` errors on missing env vars | `.env.local` not in repo root, or quote/space issue around values |
| `npm run db:seed-catalog` errors `relation "catalog" does not exist` | You didn't apply the migration in step 2 |
| `npm run db:backfill-embeddings` says `no rows needing embeddings` immediately | Catalog wasn't seeded — run step 4's first command first |
| `match_catalog does not exist` | Migration SQL didn't include the RPC. Re-paste the full file and re-run. |
| Mobile app shows "Designing…" forever | Backend not running, wrong LAN IP, or device not on the same network as the dev machine |
| `/api/inpaint` succeeds but mood images don't show | `room-photos` bucket missing or not named exactly `room-photos` — recheck step 3 |
| `/api/picks` returns 404 "Vision features not found" | Mobile skipped the `/api/vision` step. The Camera screen handles this; if you're hitting the API by hand, call `/api/vision` first. |
| Repeating `--legacy-peer-deps` warnings on `npm install` | Environmental (jest-expo / jest 29 lock). Not a problem; tests run fine. |
