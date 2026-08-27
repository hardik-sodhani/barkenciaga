# Admin ops

Studio admin lets an operator edit product copy/price and variant inventory, then see those values on the storefront.

## Sub-features

- `admin-gate` sends non-admins to sign-in.
- `admin-list` shows products, variants, and recent orders under heading `Ops`.
- `admin-save-product` persists name/subtitle/price/description via `Save` on the product form.
- `admin-save-inventory` persists a variant inventory number via the row `Save`.
- `storefront-reflects` shows the new price on category/PDP after save.

## How to get to it (user POV)

- Sign in as `studio@barkenciaga.test`, then header `Admin` → `/admin`.
- Expand a product `<details>` whose summary is the product name (e.g. Monogram Quilted Coat).
- `View PDP →` opens `/p/<slug>`.

## Driving it with fetch.sh / browser

Preconditions:

- Doctor passes.
- Prefer `OWNED=1`. Changing price/inventory on an adopted demo DB is a real write; restore values after proof.

- **Gate (GET, no cookie).** Run `scripts/fetch.sh "/admin" artifacts/admin/gate`. Expect redirect to `/sign-in` (follow and confirm Sign in, or inspect `307` in headers with `curl -D` without `-L`).
- **Ops (browser, studio session).** Open `/admin`. HTML contains `Ops`, `products`, `variants`, `Recent orders`, and `Monogram Quilted Coat`.
- **Price round-trip (browser).** Expand Monogram Quilted Coat. Field `Price (cents)` (`name="priceCents"`). Change a value, `Save`. Open `/c/couture` or the PDP. The displayed dollar price matches the new cents. Restore the original cents and Save again.
- **Low inventory (browser).** Set a variant `inventory` to `2`, row `Save`. Load that PDP with that size/color selected. Badge `Only 2 left` appears when inventory is &lt; 6. Restore inventory.
- **Proof.** Capture `/admin` in the studio session (HTML or screenshot with `Ops` and the product name) **and** the storefront page showing the edited price or `Only N left`. A save flash on admin alone is not enough.

## Gotchas

- Guest `fetch.sh /admin` will not contain `Ops`.
- Price field is **cents**, not dollars. `$495` is `49500`.
- Inventory badge: `&lt; 6` → `Only N left`; otherwise `N in stock`.
- Restoring seed values is part of cleanup for this feature, not deletion of `artifacts/admin/`.
