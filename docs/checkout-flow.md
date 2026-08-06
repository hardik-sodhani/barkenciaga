# Checkout Flow

How a shopper goes from a filled bag to a confirmed order in Barkenciaga.

The flow spans three routes (`/cart` → `/checkout` → `/orders/[id]`), one server action
(`checkoutAction`), and the cart/session/dog libraries backed by Drizzle + PGlite.

## End-to-end flow

```mermaid
flowchart TD
    subgraph Browser["Browser"]
        CartPage["/cart page<br/>CartPage (RSC)"]
        CheckoutPage["/checkout page<br/>CheckoutPage (RSC)"]
        OrderPage["/orders/[id]<br/>OrderConfirmation (RSC)"]
    end

    subgraph Server["Server (Next.js App Router)"]
        Action["checkoutAction<br/>src/server/actions/checkout.ts"]
        CartLib["lib/cart<br/>getCart · clearCart<br/>shippingCentsFor · taxCentsFor"]
        SessionLib["lib/session<br/>getSession · readCartId"]
        DogsLib["lib/dogs<br/>getActiveDog"]
    end

    subgraph Data["Data (Drizzle + PGlite)"]
        Carts[("carts / cart_items")]
        Orders[("orders / order_items")]
    end

    CartPage -->|"getCart()"| CartLib
    CartPage -->|"lines.length > 0<br/>Proceed to checkout"| CheckoutPage

    CheckoutPage -->|"getCart()"| CartLib
    CheckoutPage -->|"cart empty → redirect"| CartPage
    CheckoutPage -->|"getSession()"| SessionLib
    CheckoutPage -->|"submit form (action)"| Action

    Action -->|"zod parse (checkoutSchema)"| Action
    Action -->|"getCart()"| CartLib
    Action -->|"getSession()"| SessionLib
    Action -->|"getActiveDog()"| DogsLib
    CartLib --> Carts

    Action -->|"db.transaction:<br/>insert order + items"| Orders
    Action -->|"clearCart()"| Carts
    Action -->|"redirect(/orders/:id)"| OrderPage

    OrderPage -->|"select order + items"| Orders

    classDef page fill:#eef2ff,stroke:#4f46e5,color:#1e1b4b;
    classDef server fill:#ecfdf5,stroke:#059669,color:#064e3b;
    classDef data fill:#fef3c7,stroke:#d97706,color:#78350f;
    class CartPage,CheckoutPage,OrderPage page;
    class Action,CartLib,SessionLib,DogsLib server;
    class Carts,Orders data;
```

## What happens at each step

1. **`/cart`** — `CartPage` calls `getCart()` and computes shipping/tax/total. When the
   bag has lines, it renders a **Proceed to checkout** link to `/checkout`.
2. **`/checkout`** — `CheckoutPage` re-reads the cart; an empty cart **redirects back to
   `/cart`**. It prefills the email from `getSession()` and renders the contact / shipping /
   payment form whose `action` is the `checkoutAction` server action.
3. **`checkoutAction`** — runs on submit:
   - `ensureDbReady()` then validates the form with `checkoutSchema` (Zod).
   - Re-fetches the cart and **throws if it is empty** (guards against stale submits).
   - Loads `getSession()` and `getActiveDog()` for `userId` / `dogName`.
   - Recomputes `subtotal → shipping → tax → total` server-side (never trusts the client).
   - In a single `db.transaction`, inserts the `orders` row and its `order_items`.
   - `clearCart()`, revalidates `/cart` and `/account`, then `redirect(/orders/:id)`.
4. **`/orders/[id]`** — `OrderConfirmation` loads the persisted order and its items and shows
   the confirmation summary and shipping address.

## Related rough edges

- `lib/cart.getCart()` uses sequential per-line `SELECT`s (an N+1 shape) — see
  `TECH_DEBT.md` item 6.
- `checkoutAction` re-derives shipping/tax rather than reusing the values shown on the
  checkout page; both call the same `shippingCentsFor` / `taxCentsFor` helpers so they stay
  in sync.
