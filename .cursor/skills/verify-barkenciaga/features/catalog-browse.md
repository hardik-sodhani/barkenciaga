# Catalog browse

Catalog browse lets a shopper move from the home editorial surface into a collection or category and open a named product page with price and imagery.

## Sub-features

- `catalog-home` shows the brand line and AW26 shop CTA.
- `catalog-aw26` lists Autumn/Woofer ’26 pieces including Monogram Quilted Coat.
- `catalog-category` opens a category (Couture) with a piece count.
- `catalog-pdp` opens `/p/monogram-quilted-coat` with heading, price, and Add to bag.

## How to get to it (user POV)

- Open `/` and choose `Shop Autumn/Woofer '26`.
- Choose header link `AW26`.
- Choose header link `Couture` (or Accessories / Eyewear / Footwear).
- Choose a product tile named `Monogram Quilted Coat` or open `/p/monogram-quilted-coat`.

## Driving it with Cursor browser / capture-http

Preconditions:

- Doctor is green at `http://127.0.0.1:3317`.
- Seeded catalog is present (first request completed).

- **Home.** Open `/`. Run `scripts/capture-http.sh "/" "catalog-browse/home.html"` or screenshot the hero. The page contains `High fashion.`, `For dogs.`, `Barkenciaga`, and a `Shop Autumn/Woofer '26` link.
- **AW26.** Choose `Shop Autumn/Woofer '26` or `AW26`. Capture `/collections/autumn-woofer-26`. The page contains `Autumn` and `Monogram Quilted Coat`.
- **Category.** Choose `Couture`. Capture `/c/couture`. The heading is `Couture` and copy includes `pieces available`.
- **PDP.** Choose the `Monogram Quilted Coat` tile. Capture `/p/monogram-quilted-coat`. The heading is `Monogram Quilted Coat`, a price is visible (seeded `$495.00`), and a button `Add to bag` exists.
- **Proof.** Keep `evidence/catalog-browse/*.html` (or screenshots) that show the home CTA, the coat on AW26 or Couture, and the PDP heading together with the site header `Barkenciaga`.

## Gotchas

- Category filters live in the sidebar (`All sizes`, `M`, `Price ↑`). A Couture page with `?size=` applied is not the unfiltered catalog proof.
- Product tiles are the whole card link; the accessible name is the product name (plus subtitle in the image alt).
- `$495.00` can change if someone used admin on this `.data`. Assert the heading and Add to bag; treat price as observed, not hardcoded, unless this checkout is a fresh seed.
