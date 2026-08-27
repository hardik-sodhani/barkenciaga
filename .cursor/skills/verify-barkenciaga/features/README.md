# Barkenciaga verification map

This directory is the maintained source for verifying user-facing Barkenciaga behavior. Read this index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Storefront healthy at `http://127.0.0.1:3000` unless a worktree instance set `BASE_URL`.
- `scripts/doctor.sh` exits 0.
- Seeded catalog includes `Monogram Quilted Coat` (`/p/monogram-quilted-coat`) and search term `quilted`.
- Seeded users (no passwords): `hello@barkenciaga.test` (dogs Luna, Atlas) and `studio@barkenciaga.test` (admin).
- Do not start a second Next process in this checkout (shared `.data/pglite`).
- Never drive an origin that doctor rejected.

## Driving conventions

- Start from the feature’s preconditions. GET proofs use `scripts/fetch.sh`. Mutations use the real browser against `$BASE_URL`.
- Prefer link text, button labels, and labeled inputs (`email`, `q`, size `M`) over CSS or coordinates.
- Treat commands as literal.
- Do not empty the user’s bag or change admin prices on an adopted (`OWNED=0`) instance unless the task requires that mutation; prefer GET-only proofs there.

## Proof and skip reporting

- Capture request headers and resulting HTML, not only a screenshot.
- Mutation proof includes a second route (cart, category, header).
- Record the feature file and entry point with every artifact directory.
- If an entry point cannot be reached, report the attempted URL or control and the unmet precondition. Do not call a different path “the same feature.”

## Feature entry contract

Each feature file starts with an H1 and one paragraph, then exactly four H2s: `Sub-features`, `How to get to it (user POV)`, `Driving it with fetch.sh / browser`, `Gotchas`.

## Features

- [Search](./search.md) — header search, querystring, matches, empty state.
- [Catalog and product page](./catalog.md) — home, categories, AW26, PDP.
- [Bag and checkout](./bag-checkout.md) — add to bag, cart, place order.
- [Sign-in and dog profiles](./sign-in-account.md) — demo auth and fit finder.
- [Admin ops](./admin.md) — studio catalog edits.
