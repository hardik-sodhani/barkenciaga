import "server-only";
import path from "node:path";
import fs from "node:fs";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { seedIfEmpty } from "./seed";

declare global {
  var __barkenciagaBootstrap: Promise<void> | undefined;
}

async function runMigrations() {
  const dir = path.join(process.cwd(), "drizzle");
  if (!fs.existsSync(dir)) return;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  await db.execute(sql`CREATE TABLE IF NOT EXISTS __migrations (
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);

  const applied = await db.execute<{ name: string }>(sql`SELECT name FROM __migrations`);
  const appliedNames = new Set(applied.rows.map((r) => r.name));

  for (const file of files) {
    if (appliedNames.has(file)) continue;
    const full = path.join(dir, file);
    const contents = fs.readFileSync(full, "utf8");
    const statements = contents
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await db.execute(sql.raw(stmt));
    }
    await db.execute(
      sql`INSERT INTO __migrations (name) VALUES (${file})`,
    );
  }
}

export async function ensureDbReady(): Promise<void> {
  if (!globalThis.__barkenciagaBootstrap) {
    globalThis.__barkenciagaBootstrap = (async () => {
      await runMigrations();
      await seedIfEmpty();
    })();
  }
  return globalThis.__barkenciagaBootstrap;
}
