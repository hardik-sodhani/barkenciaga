import "server-only";
import path from "node:path";
import fs from "node:fs";
import { sql } from "drizzle-orm";
import { db, resetDbHard, usingExternalPostgres } from "./index";
import { seedIfEmpty } from "./seed";
import { isPgliteAbort } from "./pglite-errors";

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
      // On external Postgres (Neon), schema migrations are applied ahead of
      // deploy via `drizzle-kit migrate`; the file-replay path below is
      // PGlite-only (it relies on the PGlite result `.rows` shape and on the
      // self-heal/reset flow). We still seed-if-empty so a fresh database is
      // populated on first boot.
      if (usingExternalPostgres) {
        await seedIfEmpty();
        return;
      }
      try {
        await runMigrations();
        await seedIfEmpty();
      } catch (err) {
        if (!isPgliteAbort(err)) throw err;
        // PGlite WASM aborted - the on-disk dir is almost always corrupt from
        // an uncleanly-killed previous process. Wipe and retry once so dev
        // startup self-heals instead of serving 500s.
        console.warn(
          "[barkenciaga] PGlite aborted during bootstrap; resetting .data and retrying",
        );
        await resetDbHard();
        await runMigrations();
        await seedIfEmpty();
      }
    })();
  }
  return globalThis.__barkenciagaBootstrap;
}
