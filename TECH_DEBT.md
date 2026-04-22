# Seeded tech debt

These are intentional, realistic rough edges in the codebase. They&rsquo;re sized for live demos: each one is a 2-10 minute fix that exercises multiple files.

Each item is also marked with a `DEMO-TODO:` comment in the source so it&rsquo;s grep-able during a session.

## Good for short demos (2-5 min)

1. **Optimistic cart UI is missing.** Today the Add to bag button shows a flat &ldquo;Adding...&rdquo; state. The cart count updates on next render. Wire in `useOptimistic` in [`src/components/commerce/variant-selector.tsx`](src/components/commerce/variant-selector.tsx) so the header cart count increments immediately.

2. **Empty cart state is plain.** [`src/components/commerce/cart-lines.tsx`](src/components/commerce/cart-lines.tsx) has a simple empty state. Add a &ldquo;Recommended for you&rdquo; row that pulls 3 random products from the DB.

3. **Search has no pagination.** [`src/app/search/page.tsx`](src/app/search/page.tsx) caps results at 20. Add a `limit`/`offset` or cursor-based pagination.

4. **PDP does not link back to collections.** Product detail shows category breadcrumb but doesn&rsquo;t surface what collections it&rsquo;s in. Pull `collection_products` and render chips.

## Good for longer demos (5-15 min)

5. **Inventory drops below zero on add-to-cart race.** [`src/server/actions/cart.ts`](src/server/actions/cart.ts) doesn&rsquo;t decrement inventory. Add inventory guards in a transaction, and surface a friendly error when someone races to the last one.

6. **N+1 query in [`getCart`](src/lib/cart.ts).** Three sequential SELECTs: items, variants, products. Collapse with a single JOIN or `with: { ... }` relational query.

7. **No `/c/couture` size filter for XS / XL when nothing matches.** The filter just shows an empty state. Disable or grey-out filter options that would produce zero results (consistent with best-in-class commerce).

8. **Account orders page loads every order at once.** [`src/app/account/page.tsx`](src/app/account/page.tsx) selects all orders for the user. Paginate.

9. **Admin has no bulk ops.** Inventory edits are per-row. Add a bulk-update server action that accepts an array of `{id, inventory}`.

## Architectural asks (15+ min)

10. **Session is cookie-only; no refresh tokens or expiry.** Swap `iron-session` for NextAuth/Clerk (behind a feature flag) for a realistic demo of auth provider migration.

11. **No real payments.** Wire the checkout page to Stripe Checkout or the Stripe Payment Element behind `STRIPE_SECRET_KEY`. Keep the mocked path for offline demos.

12. **PGlite on every request.** Production should hit Neon. Write a `getDb()` factory that picks driver based on `DATABASE_URL` being set.

## Post Images + Accessibility v1 (closed Apr 2026)

The following issues have been addressed by the Images + Accessibility v1 update and are **no longer** live tech debt:

- ~~Product tiles rendered `product-tile-gradient` with `mix-blend-difference` overlay text.~~ Replaced with Next `<Image>` + editorial flat-lay WebPs under `public/products/`. Gradient retained as a fallback for `imagePath === null`.
- ~~`--ink-40` (3.0:1 on bone) was used as a text color in 11 files.~~ Demoted to borders/dividers only. All text usages swept to `--ink-65` (9.6:1). The smoke script now grep-fails on any `text-ink-40` in rendered HTML.
- ~~No `:focus-visible` treatment.~~ Added a global burgundy focus ring with 2px offset in [src/app/globals.css](src/app/globals.css).
- ~~Eyebrow at 0.7rem / 0.24em tracking / `ink-60`.~~ Bumped to 0.78rem, 0.18em, `ink-80`.

The contrast audit board lives in Figma under `Access + Imagery v1` → `Section / Color tokens v2`.

## How to surface these during demos

Grep for the tag:

```bash
rg DEMO-TODO src/
```

Every tag is tied to a file listed above, and every file is listed in [DEMO_SCRIPTS.md](DEMO_SCRIPTS.md).
