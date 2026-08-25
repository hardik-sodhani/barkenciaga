---
name: verify-barkenciaga
description: Drive the Barkenciaga Next.js storefront in a real browser/HTTP session to prove user-facing behavior (catalog, search, bag/checkout, fit finder, admin). Use when verifying UI changes, demo flows, or before claiming a shopper/admin path works.
---

# Verify Barkenciaga

Barkenciaga is a Next.js 16 App Router storefront (Tailwind, Drizzle, in-process PGlite). A user shops in the browser at a local origin. There is no product CLI. Mutations go through Server Actions, not a public JSON API — HTTP GET is enough to prove catalog/search; bag, checkout, sign-in, fit finder, and admin require a real browser.

Read the feature map in [features/README.md](features/README.md) before driving. Drive the mapped entry points, not a convenient shortcut.

## Launch

Repo root: the git root that contains `package.json` named `barkenciaga`.

Default verification origin is **`http://127.0.0.1:3317`**, not `:3000`. Do not attach to a server you did not start.

```bash
.cursor/skills/verify-barkenciaga/scripts/launch.sh
```

The helper double-forks Next into its own session so the server keeps running after the launch command exits (agent shells otherwise reap it). Ready when the script prints `ready pid=… url=http://127.0.0.1:3317` and `/` returns HTML containing `Barkenciaga`. First request also migrates and seeds PGlite into `.data/pglite/` (cwd-relative). Launch waits up to 60s.

Override port with `VERIFY_PORT`. Unset `DATABASE_URL` / `POSTGRES_URL` so the app uses PGlite.

Teardown (after evidence is written):

```bash
.cursor/skills/verify-barkenciaga/scripts/cleanup.sh
```

## Doctor

Run before the first drive, after any failed drive, and whenever the instance looks off:

```bash
.cursor/skills/verify-barkenciaga/scripts/doctor.sh
```

Pass means: the pid in `run/state.env` is alive, it owns the listener on `VERIFY_PORT`, `/` contains `Barkenciaga`, `/showroom` contains `Showroom`, and home HTML has no `text-ink-40` class (same a11y check as `pnpm smoke`).

If doctor fails because another `next dev` is already running on this checkout, stop that process (ask the user if it is theirs). Do not drive `http://localhost:3000`.

## Drive

1. `doctor.sh`
2. Open the feature file under `features/` and follow its recipe.
3. **Catalog and search (read-only):** Cursor browser **or** `capture-http.sh` (GET is the real user path for those pages).
4. **Bag, checkout, sign-in, dogs, admin:** Cursor browser only. Do not POST invented Server Action IDs.

Browser handles (stable in this repo):

| Control | How to find it |
|---|---|
| Home | link `Barkenciaga` |
| Categories | links `Couture`, `Accessories`, `Eyewear`, `Footwear` |
| Collection | link `AW26` or `Shop Autumn/Woofer '26` |
| Search | header link `Search`; searchbox placeholder mentions `quilted` |
| Bag | link whose name starts with `Bag` |
| Sign in | header link `Sign in`; email textbox `Email`; button `Sign in` |
| Add to bag | PDP button `Add to bag` (busy label `Adding...`) |
| Size | buttons `XS` `S` `M` `L` `XL` |
| Color | buttons named the color, e.g. `Ink` |
| Checkout | link `Proceed to checkout`; button whose name starts with `Place order` |
| Fit finder | after activating Atlas, header `Shopping for Atlas`; PDP text `recommended for Atlas` |
| Admin | header link `Admin` (only after `studio@barkenciaga.test`) |

HTTP capture:

```bash
.cursor/skills/verify-barkenciaga/scripts/capture-http.sh "/search?q=quilted" "search/quilted.html"
```

Optional extra check once the instance is up: `BASE_URL="$VERIFY_BASE_URL" pnpm smoke` from repo root (reads `VERIFY_BASE_URL` from `run/state.env`).

## Evidence

Write under `.cursor/skills/verify-barkenciaga/evidence/<feature-id>/`. Gitignores `evidence/` and `run/`. Proof must survive cleanup.

Standards:

- Exercise the real shopper/admin path. Do not call `src/server/actions/*` from a script, do not write `.data` by hand, do not use Vitest as UI proof.
- Capture the action and the resulting state (e.g. click Add to bag **and** `Bag (1)` / `/cart` line), not only the last screenshot.
- Side effects: order confirmation shows `Order <id>` and `/admin` lists that email; cart empty state vs a named line.
- First request seeds the catalog. Do not treat seed-file contents as proof that the running UI rendered them — fetch or screenshot the page.
- Demo checkout does not charge a card. Prove the confirmation page and the order id, not a payment provider.

Minimum artifacts per drive: HTML capture **or** screenshot plus accessible snapshot/notes, with the feature id in the path.

## Cleanup

`cleanup.sh` SIGTERMs the pid tree recorded at launch (then SIGKILL if needed). It does **not** kill by process name, does **not** touch `:3000`, does **not** delete `evidence/`, and does **not** run `pnpm db:reset`. Cart/order rows from a mutation stay in `.data` until someone resets the demo DB.

## Helpers

All scripts are executable. Run them from any cwd; they locate the skill dir themselves.

| Script | Invocation |
|---|---|
| Launch | `.cursor/skills/verify-barkenciaga/scripts/launch.sh` |
| Doctor | `.cursor/skills/verify-barkenciaga/scripts/doctor.sh` |
| Capture GET | `.cursor/skills/verify-barkenciaga/scripts/capture-http.sh "/path" "feature/file.html"` |
| Cleanup | `.cursor/skills/verify-barkenciaga/scripts/cleanup.sh` |

State file: `.cursor/skills/verify-barkenciaga/run/state.env` (`VERIFY_PID`, `VERIFY_PORT`, `VERIFY_BASE_URL`, `VERIFY_LOG`).

## Isolate

Two Next processes cannot safely share this checkout’s `.data/pglite`. Launch refuses if another `next dev`/`next start` is running. A second checkout (git worktree) is the way to run side by side: each worktree has its own `.data` and should use a distinct `VERIFY_PORT`.
