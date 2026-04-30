<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

**Product**: Barkenciaga — a dog fashion e-commerce demo built with Next.js 16 (App Router + Turbopack), Drizzle ORM, and PGlite (in-process Postgres). Zero external services required.

### Running the app

- `pnpm dev` starts the Next.js dev server on `:3000`. PGlite auto-bootstraps on the first request: it runs SQL migrations from `drizzle/`, seeds ~25 products across 4 categories, and persists data to `.data/pglite/`.
- `pnpm db:reset` wipes `.data/` so the next `pnpm dev` re-migrates and re-seeds.

### Key commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Lint | `pnpm lint` (ESLint 9, flat config) |
| Smoke tests | `pnpm smoke` (requires dev server running) |
| Build | `pnpm build` |
| Reset DB | `pnpm db:reset` |

### Demo accounts (no passwords)

- `hello@barkenciaga.test` — customer with dogs Luna and Atlas
- `studio@barkenciaga.test` — admin with access to `/admin`

### Gotchas

- The esbuild build-scripts warning from `pnpm install` is cosmetic; esbuild ships pre-built platform binaries and works without running its postinstall script.
- PGlite self-heals on corrupt WAL — if the DB gets into a bad state, `pnpm db:reset` is the fastest fix.
- Smoke tests (`pnpm smoke`) require a running dev server on `:3000`; they are not standalone.
