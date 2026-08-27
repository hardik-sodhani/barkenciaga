# Search

Search lets a shopper open the Find a piece screen, query the seeded catalog by name/subtitle/description, open a matching product, and tell a miss from an empty query.

## Sub-features

- `search-open` opens search from the header with no query.
- `search-match` returns title matches for `quilted` including Monogram Quilted Coat.
- `search-open-result` follows a result tile to the PDP.
- `search-empty` shows `No match.` for a query with zero hits.
- `search-blank` does not show `No match.` when `q` is missing or whitespace.

## How to get to it (user POV)

- Choose the `Search` link in the site header (always visible).
- Open `/search` directly.
- Submit the on-page search field (`name="q"`) as GET, or load `/search?q=<term>`.

## Driving it with fetch.sh / browser

Preconditions:

- Doctor passes at `$BASE_URL`.
- Seed includes Monogram Quilted Coat.

- **Header entry.** Load home, then `/search`. Run `scripts/fetch.sh "/search" artifacts/search/blank`. HTML contains heading `Find a piece.` and a search input; it does not contain `No match.`
- **Title match.** Run `scripts/fetch.sh "/search?q=quilted" artifacts/search/match`. HTML contains `Quilted`, `Monogram Quilted Coat`, and a line like `N result` / `N results` for `"quilted"`. Link href `/p/monogram-quilted-coat` is present.
- **Open result (browser).** From `/search?q=quilted`, choose the `Monogram Quilted Coat` tile (link wrapping the product name). The PDP `h1` is `Monogram Quilted Coat`.
- **Empty state.** Run `scripts/fetch.sh "/search?q=zzzznomatch" artifacts/search/empty`. HTML contains `No match.` and `Try a shorter, simpler term.` and does not contain `Monogram Quilted Coat` as a tile.
- **Proof.** Keep `artifacts/search/match.html` plus `match.headers.txt` (HTTP 200) and `empty.html` plus `empty.headers.txt`. Match artifacts must identify Barkenciaga, the query, and the coat. Empty artifacts must identify `No match.`

## Gotchas

- Results are hard-capped at 20 with no pagination. A short query can look “complete” while more rows exist in the DB.
- Blank `/search` returns no tiles and no empty dashed panel; `No match.` only appears when `q` is non-empty and the query hits zero rows.
- Search is case-insensitive substring on name, subtitle, and description — `quilted` matches the coat; nonsense tokens should miss.
- Placeholder text mentions `quilted`, `rain`, and `bow tie`; those are hints, not a second index.
- Do not use `pnpm smoke`’s `/search?q=quilted` check as the only artifact; copy headers and HTML into `artifacts/search/`.
