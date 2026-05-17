This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Mobile Backend (Plan 1)

This branch (`mobile-foundation`) adds the API surface the dwelliq Expo mobile app will consume.

**New endpoints:**
- `POST /api/upload-url` — presigned URL for direct photo upload to Supabase Storage
- `POST /api/vision` — returns stub VisionFeatures (Plan 3 wires real SAM 2 + Depth + CLIP)
- `POST /api/picks` — retrieves candidates and reranks → A/B/C picks
- `GET  /api/picks/[id]` — fetch a pick set, including mood URLs as they stream in
- `POST /api/inpaint` — kicks off stub inpaint jobs (Plan 3 wires real Gemini)
- `POST /api/telemetry/event` — funnel + training-pair logger

**New tables:** `vision_features`, `picks`, `telemetry_pairs`. The `catalog` table is extended with `embedding vector(768)`, `gltf_url`, and `updated_at`.

**Local setup:**
```bash
cp .env.local.example .env.local       # fill in Supabase credentials
npm install
# In Supabase SQL editor, paste & run supabase/migrations/20260517_mobile_foundation.sql
npm run db:seed-catalog
npm run db:backfill-embeddings
npm run dev
```

**Run tests:**
```bash
npm test                                                                 # unit + route tests (32 tests)
npm run dev &                                                            # in another terminal
E2E_BASE_URL=http://localhost:3000 npx vitest run tests/e2e/happy-path.test.ts
```

See `~/Desktop/TUM/docs/superpowers/plans/2026-05-17-dwelliq-backend-foundation.md` for the implementation plan and `~/Desktop/TUM/docs/superpowers/specs/2026-05-16-dwelliq-mobile-app-design.md` for the design spec.
