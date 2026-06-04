import type { Config } from "drizzle-kit";

// Schema migrations should run over a direct (unpooled) connection. Neon's
// pooled endpoint runs PgBouncer in transaction mode, which is fine for the
// app's queries but not ideal for DDL migrations.
const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL;

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  ...(databaseUrl ? { dbCredentials: { url: databaseUrl } } : {}),
} satisfies Config;
