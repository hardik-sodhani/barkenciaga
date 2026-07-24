# CI/CD Pipeline Design — Barkenciaga

**Date:** 2026-07-25  
**Status:** Approved for implementation  
**Repo:** https://github.com/hardik-sodhani/barkenciaga

## Goals

Ship a proper GitHub Actions pipeline that:

1. Runs quality gates on every PR and before production deploy
2. Deploys Vercel **preview** on PRs (post-deploy HTTP smoke deferred for now)
3. Deploys Vercel **production** on `main` only after quality passes
4. Folds in Vitest unit tests from PR #13

## Non-goals

- Playwright or expanded e2e beyond `scripts/smoke.mjs`
- Provisioning a separate Neon database per preview
- Changing application/demo-bug behavior
- Editing CI just to silence unrelated failures

## Current state

- `main` has `.github/workflows/deploy.yml` (prod `vercel deploy --prod` only)
- No PR quality gate; no branch protection
- Local scripts: `pnpm lint`, `pnpm build`, `pnpm smoke` (needs `BASE_URL`)
- Vitest + tests land from PR #13 (`pnpm test`)
- Prod build uses remote Vercel build so `vercel.json` `drizzle-kit migrate` sees Neon env vars

## Architecture (Approach 1)

Three workflows, shared quality job via `workflow_call`:

| Workflow | Trigger | Jobs |
| --- | --- | --- |
| `ci.yml` | `workflow_call` only (reusable) | `quality`: install → lint → typecheck → test → build |
| `preview.yml` | `pull_request` | `quality` → `deploy-preview` |
| `deploy.yml` | `push` to `main`, `workflow_dispatch` | `quality` → `deploy-production` |

GitHub Actions owns preview and production deploys (same secrets as today). Disable overlapping Vercel Git auto-deploys for Production (and ideally Preview) in the Vercel project so deploys are not duplicated.

### Quality job

- Node 22, pnpm 10, `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm typecheck` (`tsc --noEmit`)
- `pnpm test` (Vitest)
- `pnpm build` (Next.js; no Neon required for compile)

### Preview / production deploy

- Pin Vercel CLI (e.g. `vercel@57.0.0`), not `@latest`
- Use existing secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Remote deploy (not `--prebuilt`) so Vercel env + `drizzle-kit migrate` keep working
- Capture deployment URL from CLI stdout into `GITHUB_OUTPUT`

### Smoke (deferred)

- `pnpm smoke` remains available locally
- Not run in CI yet (Vercel Deployment Protection blocked unauthenticated preview hits; revisit with `VERCEL_AUTOMATION_BYPASS_SECRET` later)

## Package.json additions

- `test` / `test:watch` (from PR #13)
- `typecheck`: `tsc --noEmit`

## Branch protection (manual, documented)

On `main`, require:

Recommended PR required checks: `Preview / quality`, `Preview / deploy-preview`.

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Preview migrate hits shared Neon | Out of scope to split DBs; relies on existing Vercel Preview env. Document the risk. |
| Duplicate Vercel Git deploys | Document disabling Git production (and preview) auto-deploy in Vercel |
| PR #13 `it.fails` demo contracts | Keep as-is; suite should exit 0 |

## Success criteria

- Opening a PR runs quality then preview deploy
- Merging to `main` runs quality then production deploy
- `pnpm test` is green locally and in CI
- No deploy proceeds if quality fails
