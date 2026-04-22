# Demo scripts

Step-by-step flows for running Barkenciaga in customer enablement sessions. Each script is designed to fit a specific Cursor capability story and takes 5-15 minutes of live time.

Before any session:

1. `pnpm dev`
2. Open <http://localhost:3000/showroom> in one tab (presenter&rsquo;s index).
3. Open Cursor next to the browser.

---

## 1. Shopper journey (2 minutes)

**Story arc**: this is a real, working e-commerce site built on a modern stack. Every interaction is a server action round-trip with revalidation.

1. Land on `/`. Call out the brand &mdash; &ldquo;high fashion. for dogs.&rdquo;
2. Click **Shop Autumn/Woofer &lsquo;26** &rarr; /collections/autumn-woofer-26.
3. Click the Monogram Quilted Coat tile &rarr; `/p/monogram-quilted-coat`.
4. Select **M / Ink**, **Add to bag**.
5. Cart count in header increments. Open **Bag** &rarr; `/cart`.
6. **Proceed to checkout**, place the order with the seeded card.
7. Land on `/orders/<id>` confirmation page.

**Talking point**: Every mutation &mdash; add to cart, checkout, variant updates &mdash; is a server action that writes to PGlite via Drizzle and calls `revalidatePath`. Show the code in `src/server/actions/` alongside.

---

## 2. Breed-aware fit finder (5 minutes)

**Story arc**: relational data (`dogs` &harr; `users`) drives real UI personalization without any client state.

1. Sign in as `hello@barkenciaga.test` via `/sign-in`.
2. Open **Account &rarr; Dog profiles** (`/account/dogs`).
3. Click **Shop for Atlas** (Standard Poodle, size L).
4. Header now shows &ldquo;Shopping for Atlas&rdquo; with a chartreuse dot.
5. Open any PDP, e.g. `/p/tech-parka`.
6. The fit-finder badge appears: &ldquo;L recommended for Atlas.&rdquo;
7. Size L is highlighted in the selector.

**Ask Cursor** (live):
> &ldquo;Right now the recommendation falls back one size if the dog&rsquo;s size isn&rsquo;t available. Change the logic so it prefers sizing _up_ over sizing down.&rdquo;

Cursor will find `recommendSizeForDog()` in [`src/lib/dogs.ts`](src/lib/dogs.ts) and edit the search order.

---

## 3. Filter + sort refactor (5-10 minutes)

**Story arc**: cross-file refactor spanning schema, data layer, and UI.

1. Open `/c/footwear`.
2. Show the size filter + sort sidebar (works end-to-end via search params).
3. **Ask Cursor**:
> &ldquo;Add a price-range filter to the Footwear page. Let users set a minimum and maximum (in dollars), and apply it alongside the existing size filter. Keep the UI consistent with the existing filter controls.&rdquo;

Cursor will need to:

- extend [`getProductsForCategory`](src/lib/products.ts) to accept min/max cents
- update [`src/app/c/[category]/page.tsx`](src/app/c/[category]/page.tsx) sidebar
- preserve existing query parameters on link clicks

Expected runtime: 3-5 minutes. Show the PR-style diff before saving.

---

## 4. Admin round-trip (3 minutes)

**Story arc**: full CRUD loop through server actions + `revalidatePath`.

1. Sign out. Sign in as `studio@barkenciaga.test`.
2. Header gains an **Admin** link. Open `/admin`.
3. Expand Monogram Quilted Coat.
4. Change price from $495 to $595 and **Save**.
5. Open `/c/couture` in another tab &mdash; the new price is live.
6. In admin, drop inventory on a variant to 2 and save.
7. Load that PDP &mdash; **Only 2 left** badge appears in the variant selector.

**Talking point**: The whole loop is ~30 lines of code in [`src/server/actions/products.ts`](src/server/actions/products.ts). No client state, no REST API, no fetch handlers.

---

## 5. Feature build: Wishlist (10-15 minutes)

**Story arc**: the headline multi-layer agent demo &mdash; schema migration, server action, UI wiring, and a new page.

1. Sign in as `hello@barkenciaga.test`.
2. Open any PDP.
3. **Ask Cursor**:
> &ldquo;Add a &lsquo;Save for later&rsquo; feature. I want a heart-shaped toggle next to the Add to bag button on every PDP. When signed in, clicking it saves the variant to a wishlist table keyed on user + variant. Add a &lsquo;Wishlist&rsquo; link to the account nav that shows every saved variant with a one-click move-to-bag. Include a Drizzle migration and update the seed if you want. Skip anon users; gate the button with a sign-in CTA when logged out.&rdquo;

Expected Cursor actions:

- Add a `wishlist_items` table to [`src/db/schema.ts`](src/db/schema.ts) with a composite unique index.
- `pnpm drizzle-kit generate` (or have the agent generate the SQL manually).
- Create [`src/server/actions/wishlist.ts`](src/server/actions/wishlist.ts).
- Add a client component to the PDP for the toggle.
- Create `/account/wishlist/page.tsx` with a list and a &ldquo;move to bag&rdquo; action.
- Update `SiteHeader` account dropdown.

Show: migration diff, new action file, new page. Place one item, unwish it, add it to bag.

---

## 6. Figma &harr; code (5 minutes)

**Story arc**: agent-driven design fidelity.

1. Open [`figma/README.md`](figma/README.md) for the file link.
2. Show the PDP node in Figma &mdash; it&rsquo;s the pixel-accurate capture of `/p/monogram-quilted-coat`.
3. Highlight a subtle mismatch (e.g. a label you want bolder, or a padding change).
4. **Ask Cursor**:
> &ldquo;In the Figma file &lsquo;Barkenciaga AW26&rsquo; there&rsquo;s a PDP frame. Inspect it and align the product details spacing + typography in [`src/app/p/[slug]/page.tsx`](src/app/p/[slug]/page.tsx) to match.&rdquo;

The agent will call `get_design_context` and produce a targeted edit. Reload the page to show the match.

---

## 7. Multi-file performance sweep (variant)

**Story arc**: Cursor as a reviewer on multi-file patterns.

1. Ask Cursor:
> &ldquo;Audit the [`getCart`](src/lib/cart.ts) function. It currently issues separate queries for cart_items, variants, and products. Collapse this into a single query using Drizzle&rsquo;s relational API or a join. Keep the public return shape unchanged and add a short comment explaining the trade-off.&rdquo;

Good showcase of multi-step refactors with invariants.

---

## Closing beats

Always end a session at `/showroom` to set up the next flow, or jump to an open ticket from the Sample tickets list.

If a demo has 3 minutes to spare, grep for `DEMO-TODO` in the repo and pick the first one &mdash; these are real, small asks (accessibility, empty state, microcopy) that Cursor can close end-to-end quickly.
