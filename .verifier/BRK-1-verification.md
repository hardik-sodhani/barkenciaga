# BRK-1 Wishlist — Verifier evidence

Branch verified: orch/brk-1-wishlist/wishlist-feature

## Automated gate (all pass)
- pnpm install → up to date
- pnpm lint → 0 errors (2 pre-existing warnings in admin/page.tsx, variant-selector.tsx; not wishlist)
- pnpm typecheck → 0 errors
- pnpm test → 25/25 pass; src/lib/wishlist.test.ts (3 tests) covers add idempotency, remove, toggle
- pnpm build → success; /account/wishlist route present

## Fresh PGlite boot
- rm -rf .data; pnpm dev; GET / → 200; log: "[barkenciaga] seeded 4 categories, 26 products, 3 collections"
- 0002_blue_malcolm_colcord.sql applied by bootstrap replay with no bootstrap error

## Runtime flow (real browser, recorded)
1. Sign in hello@barkenciaga.test → /account
2. PDP /p/braided-lead → "Save for later" toggles to "Saved" (filled heart)
3. Reload PDP → still "Saved" (server persistence)
4. /account/wishlist → item listed w/ PDP link + Remove
5. Remove → empty state "Nothing saved yet."
6. Signed-out save on PDP → redirected to /sign-in

## Known non-blocker
- Intermittent "Unhandled Rejection: RuntimeError: Aborted()" from PGlite (async-handled; requests still 200). Pre-existing quirk, matches upstream note.
