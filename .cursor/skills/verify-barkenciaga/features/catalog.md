# Catalog and product page

Catalog lets a shopper browse the home editorial, category grids, the AW26 collection, and a product page with color/size and add-to-bag.

## Sub-features

- `home-hero` shows brand copy and the Autumn/Woofer CTA.
- `category-grid` lists Couture / Accessories / Eyewear / Footwear with piece counts.
- `collection-aw26` lists the featured collection including the quilted coat.
- `pdp-coat` renders Monogram Quilted Coat with price and `Add to bag`.
- `category-size-param` loads `/c/<slug>?size=` and `?sort=` from the sidebar links.

## How to get to it (user POV)

- Open `/`.
- Choose a category link in the header or the home category strip (`Couture`, …).
- Choose `AW26` or `Shop Autumn/Woofer '26`.
- Choose a product tile (name is the accessible text of the `/p/<slug>` link).
- Open `/p/monogram-quilted-coat` directly.

## Driving it with fetch.sh / browser

Preconditions:

- Doctor passes.
- Seeded coat slug `monogram-quilted-coat`.

- **Home.** Run `scripts/fetch.sh "/" artifacts/catalog/home`. HTML contains `High fashion.`, `For dogs.`, `Shop Autumn/Woofer`, and `Barkenciaga`.
- **Category.** Run `scripts/fetch.sh "/c/couture" artifacts/catalog/couture`. HTML contains `Couture`, `pieces available`, and at least one `/p/` product link. Eyebrow `Category` and `h1` Couture.
- **Collection.** Run `scripts/fetch.sh "/collections/autumn-woofer-26" artifacts/catalog/aw26`. HTML contains `Autumn` and a link to `/p/monogram-quilted-coat` or the coat name.
- **PDP.** Run `scripts/fetch.sh "/p/monogram-quilted-coat" artifacts/catalog/pdp`. HTML contains `Monogram Quilted Coat`, a price, color controls, size labels `XS`–`XL`, and button text `Add to bag`.
- **Size/sort query (observe, don’t assume correctness).** Run `scripts/fetch.sh "/c/footwear?size=m" artifacts/catalog/footwear-size-m`. Record the `pieces available` count versus unfiltered `/c/footwear`. The size filter in `getProductsForCategory` currently **excludes** products that have the chosen size (inverted `allowed` set). Treat the rendered count as the source of truth; do not fail the drive because it disagrees with “only M in stock.”
- **Proof.** Keep home + PDP HTML/headers. PDP must show the coat name and `Add to bag`.

## Gotchas

- Guest PDP has no `Fit finder` badge; that requires sign-in and an active dog (see sign-in-account).
- `Add to bag` is a client submit of `addToCartAction`, not a GET. Catalog GET proof stops at the enabled button; bag mutation is the bag-checkout feature.
- Product images may be `/_next/image?.../products/` or `/products/` in HTML. Absence of both is a regression (`pnpm smoke` checks this on several routes).
- Category `?sort=price-asc` / `price-desc` / `new` are real sidebar links (`Price ↑`, `Price ↓`, `Newest`, `Featured`).
