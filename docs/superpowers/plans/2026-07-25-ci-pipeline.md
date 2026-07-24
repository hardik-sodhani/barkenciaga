# CI Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GitHub Actions CI with quality gates, Vercel preview+prod deploys, and smoke tests, including Vitest from PR #13.

**Architecture:** Reusable `ci.yml` (`workflow_call`) for quality; `preview.yml` on PRs and `deploy.yml` on `main` each run quality → deploy → smoke. Actions owns deploys; remote Vercel build preserved for Neon migrate.

**Tech Stack:** GitHub Actions, pnpm 10, Node 22, Vitest, Vercel CLI 57.0.0, existing `scripts/smoke.mjs`

## Global Constraints

- Pin Vercel CLI to `vercel@57.0.0` (not `@latest`)
- Remote `vercel deploy` (no `--prebuilt`) so Neon env + migrate work
- Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Do not change demo-bug application behavior
- Vitest suite from PR #13 must remain green (`it.fails` contracts stay)

## File map

| File | Responsibility |
| --- | --- |
| `.github/workflows/ci.yml` | Reusable quality job |
| `.github/workflows/preview.yml` | PR: quality → preview deploy → smoke |
| `.github/workflows/deploy.yml` | main: quality → prod deploy → smoke |
| `package.json` | Add `typecheck` script |
| `README.md` | Document CI + Vercel Git disable note |
| Vitest files | Already merged from PR #13 |

---

### Task 1: Add `typecheck` script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add script**

Add `"typecheck": "tsc --noEmit"` next to `lint`.

- [ ] **Step 2: Verify locally**

Run: `pnpm typecheck`  
Expected: exit 0 (or fix only CI-blocking type errors if any)

---

### Task 2: Create reusable `ci.yml`

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write workflow**

```yaml
name: CI

on:
  workflow_call:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Unit tests
        run: pnpm test

      - name: Build
        run: pnpm build
```

---

### Task 3: Create `preview.yml`

**Files:**
- Create: `.github/workflows/preview.yml`

- [ ] **Step 1: Write workflow**

```yaml
name: Preview

on:
  pull_request:

concurrency:
  group: preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  quality:
    uses: ./.github/workflows/ci.yml

  deploy-preview:
    needs: quality
    runs-on: ubuntu-latest
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    outputs:
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install -g vercel@57.0.0

      - name: Deploy preview
        id: deploy
        run: |
          url=$(vercel deploy --yes --token="${{ secrets.VERCEL_TOKEN }}")
          echo "url=$url" >> "$GITHUB_OUTPUT"
          echo "Preview URL: $url"

  smoke:
    needs: deploy-preview
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Smoke test preview
        env:
          BASE_URL: ${{ needs.deploy-preview.outputs.url }}
        run: pnpm smoke
```

---

### Task 4: Replace `deploy.yml`

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Rewrite for quality → prod → smoke**

Same structure as preview, but:

- `on.push.branches: [main]` + `workflow_dispatch`
- concurrency group `vercel-production`, `cancel-in-progress: false`
- `vercel deploy --prod --yes`
- smoke against prod URL

---

### Task 5: Document in README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add CI section**

Document workflows, required secrets, `pnpm test` / `typecheck`, and instruct to disable Vercel Git Production (and Preview) auto-deploy to avoid duplicates.

---

### Task 6: Verify locally

- [ ] **Step 1: Run** `pnpm install && pnpm lint && pnpm typecheck && pnpm test && pnpm build`  
  Expected: all exit 0

- [ ] **Step 2: Push branch and open PR** so Preview workflow runs end-to-end
