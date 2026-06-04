# BRK-8 — Paginate account order history

## Context

- **Project:** `hardik-barkenciaga` (Barkenciaga demo app)
- **Ticket:** BRK-8 (inferred from `TECH_DEBT.md` item 8 and `DEMO-TODO` in `src/app/account/page.tsx`; Jira MCP was not available in this environment)
- **Problem:** `/account` loads every order for the signed-in user in one query. Demo accounts with many orders will slow the page and bloat the HTML.

## Goal

Show order history in pages (default 10 per page) using a `?page=` query parameter, with prev/next navigation and a clear range indicator.

## Non-goals

- Cursor-based pagination (offset is sufficient for demo scale)
- Changing admin order list (`/admin` already uses `.limit(20)`)
- Order detail page changes

## Implementation plan

### 1. Data layer — `src/lib/orders.ts`

- Export `ORDERS_PAGE_SIZE = 10`
- Add `getOrdersPage(userId, page)`:
  - `count(*)` for total orders (Drizzle `count()`)
  - `select` with `where`, `orderBy(desc(createdAt))`, `limit`, `offset`
  - Return `{ orders, total, page, pageSize, totalPages }`
  - Clamp `page` to `[1, totalPages]` (or 1 when empty)

### 2. Account UI — `src/app/account/page.tsx`

- Accept `searchParams: Promise<{ page?: string }>`
- Replace unbounded `db.select().from(orders)` with `getOrdersPage`
- Remove `DEMO-TODO` comment
- Render pagination controls when `totalPages > 1`:
  - “Showing X–Y of Z orders”
  - Previous / Next links preserving `/account?page=N`
  - Disable styling on bounds (page 1 / last page)

### 3. Demo data — seed

- Add ~24 historical `orders` rows for `usr_demo_customer` in `seed-data.ts` + `seed.ts`
- Stagger `createdAt` so sort order is obvious
- Orders only (no `order_items` required for list view)

### 4. Documentation

- Mark item 8 resolved in `TECH_DEBT.md` (move to closed section like Images + A11y v1)

### 5. Verification

- `pnpm build`
- `pnpm lint`
- Manual: sign in as `hello@barkenciaga.test`, open `/account`, confirm page 1 shows 10 orders, `/account?page=2` shows remainder, prev/next work

## Acceptance criteria

- [ ] Account page fetches at most `ORDERS_PAGE_SIZE` orders per request
- [ ] `?page=` controls which slice is shown; invalid pages clamp safely
- [ ] Pagination UI appears when the user has more than one page of orders
- [ ] Seeded demo customer has enough orders to exercise pagination in demos
- [ ] `DEMO-TODO` on account page removed; `TECH_DEBT.md` updated

## Files touched

| File | Change |
|------|--------|
| `src/lib/orders.ts` | New |
| `src/app/account/page.tsx` | Paginated fetch + UI |
| `src/db/seed-data.ts` | Demo order fixtures |
| `src/db/seed.ts` | Insert demo orders |
| `TECH_DEBT.md` | Close item 8 |
