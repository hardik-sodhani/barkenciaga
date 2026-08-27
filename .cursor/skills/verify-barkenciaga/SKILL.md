---
name: verify-barkenciaga
description: Drive the Barkenciaga Next.js storefront (web UI on localhost) the way a shopper or studio admin would — launch or adopt a local instance, doctor it, exercise catalog/search/bag/auth/admin, and keep HTTP/HTML proof. Use when proving a UI change, demo flow, or regression on the live app, not when Vitest alone is enough.
---

# Verify Barkenciaga

Barkenciaga is a local-only fashion-for-dogs storefront (Next.js App Router + PGlite). Users touch the **web UI**. There is no first-party CLI. Vitest and `pnpm smoke` are supporting checks; they do not replace driving the mapped user paths.

This skill is for the next agent, mid-task, with no prior context.

## Launch

Repo root is three levels above this skill (`barkenciaga/`). Documented start is `pnpm install` then `pnpm dev` (Next 16: `next dev --hostname 127.0.0.1 --port 3000`). Default URL: `http://127.0.0.1:3000`. First successful request migrates SQL under `drizzle/` and seeds ~25 products plus two users into `.data/pglite/` (cwd-relative; gitignored). No passwords. `DATABASE_URL` / `POSTGRES_URL` switch the app onto external Postgres — verification assumes those are **unset**.

**PGlite is not isolatable by port.** Two Next processes in the same checkout share `.data/pglite` and will corrupt the WAL. Do not start a second server here. To isolate, use a separate git worktree (its own cwd and `.data`), then `pnpm install` and `pnpm exec next dev --hostname 127.0.0.1 --port 3017`.

From the repo root:

```bash
.cursor/skills/verify-barkenciaga/scripts/launch.sh
.cursor/skills/verify-barkenciaga/scripts/doctor.sh
```

`launch.sh` adopts `http://127.0.0.1:3000` when that origin already returns Barkenciaga home (`OWNED=0`). Otherwise it starts `pnpm exec next dev --hostname 127.0.0.1 --port 3000` and records the pid (`OWNED=1`). Ready means `GET /` is HTTP 200 and the HTML contains `Barkenciaga` and `High fashion` (poll up to ~90s; first boot is slow).

Override with `PORT`, `HOST`, `BASE_URL` if you are on a worktree instance.

Teardown is `scripts/cleanup.sh` (see Cleanup).

## Doctor

Run whenever the instance looks off, and always before a drive:

```bash
.cursor/skills/verify-barkenciaga/scripts/doctor.sh
```

Pass means `GET $BASE_URL/` is 200, brand copy is present, and the body is not an `Application error` page. Fail means do not drive. If launch wrote `.run/state`, doctor prints `owned` and `pid`.

## Drive

No Playwright/Cypress in this repo. Drive in this order:

1. **HTTP GET** through `scripts/fetch.sh` for any route that is a document GET (home, category, PDP, search querystring, cart empty state, sign-in form, showroom). This is the same class of check as `pnpm smoke` (`scripts/smoke.mjs`, `BASE_URL` default `http://localhost:3000`) but you still capture per-feature artifacts and assert the feature file’s strings.
2. **Browser** (Cursor browser tools, or any CDP session pointed at `$BASE_URL`) for Server Actions: sign-in, add to bag, checkout, shop-for-dog, admin save. Prefer accessible names and `id`/`name` from the feature files over coordinates.

```bash
.cursor/skills/verify-barkenciaga/scripts/fetch.sh "/search?q=quilted" artifacts/search/match
```

Writes `artifacts/search/match.html` and `artifacts/search/match.headers.txt` under this skill directory.

Stable handles (current UI):

| Surface | Handle |
| --- | --- |
| Header brand | link text `Barkenciaga` → `/` |
| Categories | links `Couture`, `Accessories`, `Eyewear`, `Footwear` → `/c/<slug>` |
| Collection | `AW26` and home CTA `Shop Autumn/Woofer '26` → `/collections/autumn-woofer-26` |
| Search | header link `Search` → `/search`; searchbox `name="q"`; GET submit |
| Auth | `Sign in` → `/sign-in`; email `id="email"` `name="email"`; button `Sign in`; seeded `hello@barkenciaga.test` / `studio@barkenciaga.test` |
| Bag | header `Bag (N)` → `/cart`; PDP submit `Add to bag`; checkout link `Proceed to checkout` |
| PDP fixture | `/p/monogram-quilted-coat`, heading `Monogram Quilted Coat`; color buttons use the color name; size buttons `XS`…`XL` |
| Fit finder (signed in, dog active) | badge text `Fit finder` plus `recommended for <dog>` |
| Account dogs | `Shop for Atlas` / `Shop for Luna`; header `Shopping for <name>` |
| Admin | header `Admin` after studio sign-in; `/admin` heading `Ops`; product `<details>` summary is the product name; `Save` on the product form |

Do not POST invented REST endpoints. Mutations go through the real forms / client `addToCartAction`. Guest cart is cookie-backed (`barkenciaga_session`); capture `Bag (` count and `/cart` HTML after add, not only the PDP.

Read `features/README.md` and the matching feature file before driving. A proof that uses one convenient GET while the map lists a browser mutation is incomplete for that sub-feature.

## Evidence

Store proof under `.cursor/skills/verify-barkenciaga/artifacts/<feature>/`. Keep it after cleanup.

Standards:

- Exercise the user path (header, form, querystring), not Drizzle or Vitest as the only proof.
- Capture the action (request path + status headers) and the resulting HTML (product name, result count, empty copy, cart line).
- For mutations, capture a second view (`/cart`, `/c/couture` after admin price change, header after `Shop for Atlas`).
- Do not treat `pnpm smoke` alone as a feature proof; it is a coarse route walk.
- Search is capped at 20 with no pagination (`DEMO-TODO` on the search page). Assert the rendered count, not an unbounded catalog.

## Cleanup

```bash
.cursor/skills/verify-barkenciaga/scripts/cleanup.sh
```

Kills **only** the pid in `.run/state` when `OWNED=1`. If `OWNED=0` (adopted the user’s server), it does not kill anything. Removes `.run/state` only. Never `kill` by process name `node`/`next`. Never delete `artifacts/`. Never `rm -rf .data` unless the agent is explicitly resetting the demo DB (`pnpm db:reset`).

## Helpers

All scripts are executable. Invoke from repo root as shown. They source `scripts/common.sh`.

| Script | What it does |
| --- | --- |
| `scripts/launch.sh` | Adopt or start Next; write `.run/state` |
| `scripts/doctor.sh` | GET `/` brand check |
| `scripts/fetch.sh <path> <stem>` | Save headers + HTML |
| `scripts/cleanup.sh` | Stop owned pid only |

`.run/` is gitignored. `pnpm smoke` remains available as an extra HTTP sweep after a drive, not instead of it.
