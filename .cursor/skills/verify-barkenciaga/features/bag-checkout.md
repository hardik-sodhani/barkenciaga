# Bag and checkout

Bag and checkout let a shopper add a variant, see it in The Bag with a header count, and place a demo order that lands on an order confirmation.

## Sub-features

- `bag-empty` shows empty cart copy and `Start shopping`.
- `add-to-bag` increments header `Bag (N)` and lists the line on `/cart`.
- `checkout-form` loads `/checkout` when the bag is non-empty.
- `place-order` submits contact, address, and demo card and reaches `/orders/<id>`.

## How to get to it (user POV)

- Header `Bag (N)` → `/cart`.
- On a PDP, choose color and size, then `Add to bag`.
- On `/cart` with lines, choose `Proceed to checkout`.
- Empty bag CTA `Start shopping` → `/collections/autumn-woofer-26`.
- `Empty bag` clears lines (destructive on a shared instance).

## Driving it with fetch.sh / browser

Preconditions:

- Doctor passes.
- Prefer an owned instance (`OWNED=1`) for mutations so you do not rewrite the user’s cart. On `OWNED=0`, GET `/cart` only unless the task requires a mutation.

- **Empty bag (GET).** Run `scripts/fetch.sh "/cart" artifacts/bag/cart`. If the session cookie has no lines, HTML contains `The Bag`, `Empty and waiting.`, and `Start shopping`. If lines already exist on an adopted server, do not treat that as a failed empty-state; record the line names instead.
- **Add to bag (browser).** Open `/p/monogram-quilted-coat`. Choose color `Ink` if present, size `M`, then `Add to bag` (button; pending label `Adding...`). Header should show `Bag (` with a count ≥ 1. Open `Bag` → `/cart`. HTML contains `Monogram Quilted Coat` and `Proceed to checkout`.
- **Checkout (browser).** Choose `Proceed to checkout`. Heading `Final steps.` Form fields: `email`, `line1`, `city`, `region`, `postalCode`, `country` (default `US`), `cardNumber` (seeded `4242424242424242`), `cardExpiry`, `cardCvc`. Submit `Place order —`.
- **Confirmation.** Land on `/orders/<id>`. Fetch that path (cookie required) or screenshot; HTML should show the order identity and coat line.
- **Proof.** Capture PDP after click is insufficient. Keep `/cart` HTML (or screenshot) showing the coat **and** header count, plus order URL after place-order.

## Gotchas

- Guest cart is the iron-session cookie `barkenciaga_session`. `fetch.sh` without that cookie always sees an empty bag — use the browser (or replay the cookie) for add-to-bag proof.
- Checkout GET with an empty cart **redirects to `/cart`** (follow or `redirect: manual`).
- Demo payment makes no charge. Card `4000000000000002` exercises the
  recoverable decline state; other valid 12+ digit demo numbers succeed.
- `Empty bag` is a server action. Do not run it on an adopted instance unless restoring state is part of the task.
- Header count updates after the server action finishes (no optimistic increment; `DEMO-TODO`).
