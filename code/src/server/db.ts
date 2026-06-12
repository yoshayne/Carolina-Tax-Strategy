import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
});

export async function query<T extends import("pg").QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<{ rows: T[] }> {
  return pool.query<T>(text, params);
}

// Run schema.sql on boot (idempotent CREATE TABLE IF NOT EXISTS)
export async function initSchema(): Promise<void> {
  // schema.sql lives in src/db; after compile it sits next to dist-server, but we
  // read from a path relative to the compiled file's parent. Try a few locations.
  const candidates = [
    join(__dirname, "../db/schema.sql"),
    join(__dirname, "../../src/db/schema.sql"),
    join(process.cwd(), "src/db/schema.sql"),
    join(process.cwd(), "dist-server/db/schema.sql"),
  ];
  let sql: string | null = null;
  for (const c of candidates) {
    try {
      sql = readFileSync(c, "utf-8");
      break;
    } catch {
      // try next
    }
  }
  if (!sql) {
    console.error("Could not locate schema.sql; skipping schema init");
    return;
  }
  await pool.query(sql);
}
