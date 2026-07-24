# Barkenciaga

> High fashion. For dogs.

A Cursor enablement / demo surface shaped as an enterprise-grade e-commerce site. Built with Next.js 16 (App Router, Server Actions), Drizzle ORM, and PGlite (in-process Postgres), so it runs locally with zero external services.

## Quickstart

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

The first request bootstraps an in-process Postgres database (PGlite), applies migrations from `drizzle/`, and seeds ~25 editorial products across 4 categories. The DB is persisted to `.data/pglite/` between runs.

## Demo credentials

The seed populates two users. No passwords:

- `hello@barkenciaga.test` &mdash; customer with dogs **Luna** (French Bulldog, M) and **Atlas** (Standard Poodle, L).
- `studio@barkenciaga.test` &mdash; admin with access to `/admin` for product, variant, and order ops.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16, App Router, Server Actions, Turbopack |
| UI | Tailwind CSS v4, hand-rolled design system in `src/components/ui/` |
| Data | Drizzle ORM against PGlite (swap driver for Neon/Postgres) |
| Auth | Cookie sessions via `iron-session` (demo-grade) |
| Validation | Zod |
| Icons | lucide-react |
| Fonts | Inter, Cormorant Garamond, JetBrains Mono |

### Swapping PGlite for Neon Postgres

Everything in `src/db/schema.ts` is standard Postgres. To run against Neon:

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

Then:

```bash
pnpm drizzle-kit migrate
```

Remove the PGlite bootstrap flow in `src/db/bootstrap.ts` and keep `seedIfEmpty()` if you want the same seed in production.

## Project layout

```
src/
  app/                 - routes (home, /c, /p, /cart, /checkout, /account, /admin, /showroom, ...)
  components/
    ui/                - shadcn-style primitives (Button, Input, Card, Badge)
    commerce/          - ProductTile, VariantSelector, CartLines
    layout/            - SiteHeader, SiteFooter
  db/
    schema.ts          - Drizzle schema (users, dogs, products, variants, carts, orders, ...)
    seed-data.ts       - Editorial catalog copy and seed shapes
    seed.ts            - Transactional seed runner
    bootstrap.ts       - Migration runner + seed-if-empty (PGlite-only)
    index.ts           - Drizzle client
  lib/                 - products, cart, session, dogs, utils
  server/actions/      - cart, auth, dogs, checkout, products (admin)
drizzle/               - Generated SQL migrations (do not hand-edit)
figma/README.md        - Figma file link and contents
.data/                 - PGlite data directory (gitignored)
DEMO_SCRIPTS.md        - Canned flows for enablement sessions
```

## The demo loop

`/showroom` is the presenter&rsquo;s home base &mdash; it lists canned flows, sample tickets, and direct jumps into key routes. Start there when running an enablement session.

See [`DEMO_SCRIPTS.md`](DEMO_SCRIPTS.md) for turn-by-turn scripts.

## Figma

Every shipped screen is mirrored in a Figma file generated via the Figma MCP capture pipeline. See [`figma/README.md`](figma/README.md) for the file URL and per-screen node ids.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server on :3000 |
| `pnpm build` | Production build |
| `pnpm start` | Run built production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm test` | Vitest unit tests |
| `pnpm smoke` | HTTP smoke against `BASE_URL` (default `http://localhost:3000`) |
| `pnpm drizzle-kit generate` | Re-generate SQL migrations from schema |
| `pnpm tsx src/db/seed.ts` | Manually re-run the seed |

## CI / CD

GitHub Actions owns quality gates and Vercel deploys:

| Workflow | When | What |
| --- | --- | --- |
| `Preview` | Pull requests | Lint → typecheck → unit tests → build → Vercel preview → smoke |
| `Deploy` | Push to `main` | Same quality gate → Vercel production → smoke |

Required GitHub Actions secrets (already used for production deploys):

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**Avoid double deploys:** In the Vercel project settings, disable Git-triggered Production (and ideally Preview) deployments so only these Actions workflows deploy.

**Suggested branch protection** on `main`: require `Preview / quality` and `Preview / smoke` before merge.

## Intentional rough edges

The codebase contains a small number of intentional TODOs and realistic shortcuts. They exist so that enablement sessions have genuine places to send Cursor. Grep for `DEMO-TODO` to find them.

## License

Internal Cursor enablement / demo surface. Not for redistribution.
