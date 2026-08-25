# Barkenciaga verification map

This directory is the maintained source for verifying the user-facing storefront. Read this index before driving, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-barkenciaga/scripts/launch.sh` so the origin is `http://127.0.0.1:3317` (or `VERIFY_PORT`).
- Unset `DATABASE_URL` and `POSTGRES_URL`.
- Run `.cursor/skills/verify-barkenciaga/scripts/doctor.sh` and require `Barkenciaga` on `/` and `Showroom` on `/showroom`.
- Never drive `http://localhost:3000` or any instance that is not in `run/state.env`.
- Seeded catalog includes Monogram Quilted Coat (`/p/monogram-quilted-coat`) and search term `quilted`.

## Driving conventions

- Start every recipe from the baseline unless its preconditions say otherwise.
- Prefer accessible names and route paths over CSS selectors or coordinates.
- Treat emails and SKU/product slugs as literal.
- Read-only pages may use `capture-http.sh`. Mutations use the Cursor browser.
- Do not reset `.data` as part of ordinary cleanup. Proof artifacts stay in `evidence/`.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes a screenshot or HTML capture with the word `Barkenciaga` visible and the route identifiable.
- Mutation proof includes a second user-facing view (bag, order confirmation, or admin list).
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted URL and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features`
2. `How to get to it (user POV)`
3. `Driving it with Cursor browser / capture-http`
4. `Gotchas`

## Features

- [Catalog browse](./catalog-browse.md) covers home, AW26, category, and PDP.
- [Search](./search.md) covers header search, query results, and empty state.
- [Bag and checkout](./shopper-bag-checkout.md) covers add to bag, cart, and demo place-order.
- [Fit finder](./fit-finder.md) covers customer sign-in and shopping for Atlas.
- [Admin ops](./admin-ops.md) covers studio sign-in, `/admin`, and live price on Couture.
