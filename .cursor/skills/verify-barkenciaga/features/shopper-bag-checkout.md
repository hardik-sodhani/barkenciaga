# Bag and checkout

Bag and checkout let a shopper pick a size and color on a PDP, add a variant to the bag, review lines, and place a demo order that lands on an order confirmation page.

## Sub-features

- `bag-add` adds Monogram Quilted Coat (size M, color Ink) and increments the header bag count.
- `bag-view` shows the line on `/cart` under heading `The Bag`.
- `bag-checkout` opens `/checkout` from `Proceed to checkout`.
- `bag-place-order` submits the seeded demo card and reaches `Thank you.` with an order id.

## How to get to it (user POV)

- From `/p/monogram-quilted-coat`, choose size `M`, color `Ink`, then `Add to bag`.
- Choose header `Bag (n)`.
- On `/cart`, choose `Proceed to checkout`.
- On `/checkout`, fill shipping and choose `Place order — …`.

## Driving it with Cursor browser / capture-http

Preconditions:

- Doctor is green at `http://127.0.0.1:3317`.
- Browser session starts with an empty bag (`Bag (0)`), or note the starting count and assert n+1.
- Do not use `capture-http.sh` for this feature; cart and checkout are cookie-scoped Server Actions.

- **Open PDP.** Go to `/p/monogram-quilted-coat`. Heading is `Monogram Quilted Coat`.
- **Select variant.** Choose color `Ink` and size `M`. The color eyebrow includes `Ink`; size `M` looks selected.
- **Add.** Choose `Add to bag`. The button may read `Adding...` then `Add to bag` again. Header bag count increases by 1.
- **Bag.** Choose `Bag`. Heading is `The Bag`. A line named `Monogram Quilted Coat` is present. Summary shows Subtotal, Shipping, Tax, Total.
- **Checkout.** Choose `Proceed to checkout`. Heading is `Final steps.` Order aside still lists the coat.
- **Place order.** Fill `Street address` `1 Studio Lane`, `City` `Milan`, `State / Region` `NY`, `Postal code` `10001`. Leave email (any valid) and the default card `4242424242424242` / `12/29` / `123`. Choose the button whose name starts with `Place order`. Land on `/orders/<id>` with `Order confirmed`, `Thank you.`, and `Order <id>`.
- **Proof.** Screenshot PDP after add (bag count) and confirmation (`Thank you.` + order id). Optionally GET `/admin` only after studio sign-in — that is a different feature.

## Gotchas

- Add to bag does not navigate; the DEMO-TODO cart count waits for the server action. Wait for `Bag (n)` to change, not a fixed sleep.
- Empty bag redirects `/checkout` to `/cart` and shows `Start shopping` instead of `Proceed to checkout`.
- Demo payment accepts any 12+ digit card; no charge is made. Proof is the confirmation page, not a processor.
- `Empty bag` clears lines. Do not click it before capturing the add proof.
- Quantity buttons `-` / `+` are unlabeled except the glyphs; prefer leaving qty at 1.
