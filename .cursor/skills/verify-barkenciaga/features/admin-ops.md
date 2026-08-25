# Admin ops

Admin ops lets a studio user sign in, open `/admin`, change a product price, and see that price on the shopper Couture grid.

## Sub-features

- `admin-sign-in` signs in as `studio@barkenciaga.test`.
- `admin-nav` reveals header link `Admin` and the Ops page.
- `admin-price` saves a new price (cents) on Monogram Quilted Coat.
- `admin-storefront` shows the new price on `/c/couture`.

## How to get to it (user POV)

- Sign out if a customer session is active, then `/sign-in` with `studio@barkenciaga.test`.
- Choose header `Admin`, or open `/admin`.
- Expand the `Monogram Quilted Coat` details row, edit `Price (cents)`, choose `Save`.
- Open `/c/couture` (new tab or same tab).

## Driving it with Cursor browser / capture-http

Preconditions:

- Doctor is green at `http://127.0.0.1:3317`.
- Signed out, or sign out first (`Sign out` in the header).
- Note the coat’s current storefront price before editing so you can restore or at least report the before/after.

- **Sign in.** On `/sign-in`, set `Email` to `studio@barkenciaga.test`. Choose `Sign in`. Header shows `The Studio` and `Admin` (burgundy).
- **Ops.** Choose `Admin`. Heading `Ops`. Page contains `products` / `variants` and a `Products` section with `Monogram Quilted Coat`.
- **Edit price.** Expand `Monogram Quilted Coat`. In `Price (cents)` change the value (e.g. `49500` → `59500`). Choose `Save` on the product-details form (not a variant inventory Save).
- **Storefront.** Open `/c/couture`. The Monogram Quilted Coat tile shows the new formatted price (e.g. `$595.00`).
- **Proof.** Screenshot admin form with the new cents value and Couture with the matching formatted price. Optionally restore `49500` after capturing so the shared `.data` stays demo-default.

## Gotchas

- Non-admins hitting `/admin` redirect to `/sign-in`. `capture-http.sh /admin` without the studio cookie is not a pass.
- Each variant row has its own `Save` for inventory. Product price Save is the left-hand product-details form.
- Price is stored in cents. `$595` means `59500`, not `595`.
- This mutates the shared PGlite file. Restore the seeded price when the run is for proof only, or say in the report that `.data` was left dirty.
- Low inventory (`Only 2 left`) is a variant Save, a different sub-feature; do not conflate it with price.
