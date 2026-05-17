import { createClient } from "@supabase/supabase-js";
import { stubEmbedFromImageUrl } from "../src/lib/engine/embedding-stub";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("[backfill] missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key);

async function main() {
  const { data, error } = await db
    .from("catalog")
    .select("id, image_url, styles, name")
    .is("embedding", null);

  if (error) {
    console.error("[backfill] select error:", error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.log("[backfill] no rows needing embeddings");
    return;
  }

  console.log(`[backfill] embedding ${data.length} rows…`);
  for (const row of data) {
    // Seed combines image URL + styles + name so similar-style items cluster.
    const seed = `${row.image_url}::${(row.styles ?? []).join(",")}::${row.name}`;
    const emb = await stubEmbedFromImageUrl(seed);
    const { error: uerr } = await db.from("catalog").update({ embedding: emb }).eq("id", row.id);
    if (uerr) {
      console.error(`[backfill] ${row.id} failed:`, uerr.message);
    }
  }
  console.log("[backfill] done");
}

main().catch((err) => {
  console.error("[backfill] unexpected error:", err);
  process.exit(1);
});
