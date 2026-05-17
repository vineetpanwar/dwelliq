import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(url, key);
const dir = path.resolve("supabase/migrations");
const files = readdirSync(dir).filter(f => f.endsWith(".sql")).sort();

for (const f of files) {
  const sql = readFileSync(path.join(dir, f), "utf-8");
  console.log(`[migrate] running ${f}`);
  const { error } = await db.rpc("exec_sql", { sql });
  if (error) {
    console.error(`[migrate] ${f} failed:`, error.message);
    process.exit(1);
  }
  console.log(`[migrate] ${f} OK`);
}
