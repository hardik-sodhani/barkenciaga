import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import path from "node:path";
import fs from "node:fs";
import * as schema from "./schema";

/**
 * Barkenciaga uses PGlite - real Postgres running in-process - so the demo site
 * works with zero external setup. For production, swap this file for a
 * Neon/postgres-js driver (the Drizzle schema is identical).
 *
 *   import { drizzle } from "drizzle-orm/postgres-js";
 *   import postgres from "postgres";
 *   const client = postgres(process.env.DATABASE_URL!);
 *   export const db = drizzle(client, { schema });
 */

type DbType = ReturnType<typeof drizzle<typeof schema>>;

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_DIR = path.join(DATA_DIR, "pglite");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

declare global {
  var __barkenciagaDb: DbType | undefined;
  var __barkenciagaPg: PGlite | undefined;
  var __barkenciagaDbReady: Promise<void> | undefined;
}

function initDb(): { db: DbType; client: PGlite } {
  if (globalThis.__barkenciagaDb && globalThis.__barkenciagaPg) {
    return { db: globalThis.__barkenciagaDb, client: globalThis.__barkenciagaPg };
  }

  ensureDir(DB_DIR);
  const client = new PGlite(DB_DIR);
  const db = drizzle(client, { schema });

  globalThis.__barkenciagaPg = client;
  globalThis.__barkenciagaDb = db;
  return { db, client };
}

export const { db, client: pgClient } = initDb();
export { schema };
