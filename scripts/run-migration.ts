/**
 * run-migration.ts — batch-applies every *.sql file in supabase/migrations/.
 *
 * PREREQUISITE: this script calls db.rpc("exec_sql", { sql }), which is NOT a
 * built-in Supabase function.  You must create it in the project before the
 * script will work:
 *
 *   create or replace function exec_sql(sql text)
 *   returns void language plpgsql security definer as $$
 *   begin execute sql; end;
 *   $$;
 *
 * For Plan 1 (initial setup) the recommended path is to paste each migration
 * file directly into the Supabase SQL editor — this script is provided for
 * future automated use once exec_sql has been installed in the project.
 */
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(url, key);
const dir = path.join(__dirname, "..", "supabase", "migrations");
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
