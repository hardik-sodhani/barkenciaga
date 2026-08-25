# Search

Search lets a shopper find catalog pieces by a query string, see a result count, and distinguish no matches from an empty query.

## Sub-features

- `search-open` opens `/search` from the header.
- `search-match` returns products for `quilted`, including Monogram Quilted Coat.
- `search-empty` shows `No match.` for a nonsense query.
- `search-blank` shows the Find a piece heading with no result count when `q` is empty.

## How to get to it (user POV)

- Choose header link `Search`.
- Submit the search field on `/search` (GET `?q=`).
- Open `/search?q=quilted` directly.

## Driving it with Cursor browser / capture-http

Preconditions:

- Doctor is green at `http://127.0.0.1:3317`.

- **Header entry.** Choose `Search`. The heading reads `Find a piece.` and a search field is focused (placeholder mentions `quilted`).
- **Match.** Fill the search field with `quilted` and submit, or capture `/search?q=quilted`. Run `scripts/capture-http.sh "/search?q=quilted" "search/quilted.html"`. The page contains a result count (`result` / `results` for `quilted`) and a link to `Monogram Quilted Coat`.
- **Empty.** Open `/search?q=volcano`. Capture `search/empty.html`. The page contains `No match.` and `Try a shorter, simpler term.`
- **Blank.** Open `/search`. There is no `results for` line and no `No match.` empty state.
- **Proof.** Keep `evidence/search/quilted.html` showing `Barkenciaga`, the query, and `Monogram Quilted Coat`.

## Gotchas

- Results are capped at 20 with no pagination (intentional DEMO-TODO). Do not treat a missing 21st hit as a harness failure.
- The form is GET. A fetch of `/search?q=quilted` is the same user path as submitting the field.
- Matching is catalog search, not a client filter. Wait for the document to contain the count line, not a fixed sleep.
