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

export const DATA_DIR = path.join(process.cwd(), ".data");
export const DB_DIR = path.join(DATA_DIR, "pglite");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

declare global {
  var __barkenciagaDb: DbType | undefined;
  var __barkenciagaPg: PGlite | undefined;
  var __barkenciagaDbReady: Promise<void> | undefined;
  var __barkenciagaShutdownHooked: boolean | undefined;
}

// PGlite persists a WAL-style journal under .data/pglite. If the process is
// killed mid-write (SIGKILL, hard crash, some escalated SIGTERMs), the WASM
// refuses to reopen the dir and aborts with RuntimeError: Aborted() on the
// very first query. Flushing on normal exit prevents that.
function registerShutdownHooks(client: PGlite) {
  if (globalThis.__barkenciagaShutdownHooked) return;
  globalThis.__barkenciagaShutdownHooked = true;

  let closing = false;
  const close = async (signal?: NodeJS.Signals) => {
    if (closing) return;
    closing = true;
    try {
      await client.close();
    } catch {
      // best-effort; we're shutting down anyway
    }
    if (signal) process.exit(0);
  };

  process.once("SIGINT", () => void close("SIGINT"));
  process.once("SIGTERM", () => void close("SIGTERM"));
  process.once("beforeExit", () => void close());
}

function openClient(): PGlite {
  ensureDir(DB_DIR);
  return new PGlite(DB_DIR);
}

function initDb(): { db: DbType; client: PGlite } {
  if (globalThis.__barkenciagaDb && globalThis.__barkenciagaPg) {
    return { db: globalThis.__barkenciagaDb, client: globalThis.__barkenciagaPg };
  }

  const client = openClient();
  const realDb = drizzle(client, { schema });

  globalThis.__barkenciagaPg = client;
  globalThis.__barkenciagaDb = realDb;
  registerShutdownHooks(client);
  return { db: realDb, client };
}

/**
 * Nuke the on-disk PGlite directory and reopen a fresh client. Used by the
 * bootstrap self-heal path when the previous run left a corrupt WAL behind.
 * Callers should also re-run migrations + seed.
 */
export function resetDbHard(): void {
  try {
    globalThis.__barkenciagaPg?.close();
  } catch {
    // ignore; we're about to delete the files anyway
  }
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  globalThis.__barkenciagaDb = undefined;
  globalThis.__barkenciagaPg = undefined;
  globalThis.__barkenciagaBootstrap = undefined;
  initDb();
}

initDb();

// Exported as a Proxy so `resetDbHard()` can swap the underlying client
// without invalidating `import { db } from "./index"` bindings elsewhere.
export const db = new Proxy({} as DbType, {
  get(_target, prop, receiver) {
    const current = globalThis.__barkenciagaDb;
    if (!current) throw new Error("Barkenciaga db not initialized");
    return Reflect.get(current as object, prop, receiver);
  },
}) as DbType;

export const pgClient = new Proxy({} as PGlite, {
  get(_target, prop, receiver) {
    const current = globalThis.__barkenciagaPg;
    if (!current) throw new Error("Barkenciaga PGlite client not initialized");
    return Reflect.get(current as object, prop, receiver);
  },
}) as PGlite;

export { schema };
