# BRK-2 Low-Stock Homepage Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a "Limited quantities" eyebrow on homepage product tiles when any variant has inventory below 6.

**Architecture:** Shared inventory helpers + one batch query on the homepage RSC; ProductTile already accepts `eyebrow` but must overlay it on image tiles; PDP reuses the same threshold.

**Tech Stack:** Next.js App Router RSC, Drizzle ORM / PGlite, Vitest, existing ProductTile / Badge UI.

**Spec:** `docs/superpowers/specs/2026-07-31-brk-2-low-stock-banner-design.md`  
**Jira:** BRK-2

## Global Constraints

- Threshold is strictly `inventory < 6` (not `<=`).
- Eyebrow copy is exactly `Limited quantities`.
- Apply on all homepage product grids (hero, season, editorial splits) — not PLP/search/collection pages.
- Prefer matching existing file style; no new UI libraries.
- Keep imports at top of modules (no inline imports).

---

### Task 1: Inventory helpers + unit tests

**Files:**
- Create: `src/lib/inventory.ts`
- Create: `src/lib/inventory.test.ts`

**Interfaces:**
- Produces:
  - `LOW_STOCK_THRESHOLD = 6`
  - `LOW_STOCK_EYEBROW = "Limited quantities"`
  - `isLowStock(inventory: number): boolean`
  - `getLowStockProductIds(productIds: string[]): Promise<Set<string>>`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it, vi, beforeEach } from "vitest";

const selectMock = vi.fn();
vi.mock("@/db", () => ({
  db: {
    select: (...args: unknown[]) => selectMock(...args),
  },
}));
vi.mock("@/db/bootstrap", () => ({ ensureDbReady: vi.fn() }));

import {
  LOW_STOCK_EYEBROW,
  LOW_STOCK_THRESHOLD,
  getLowStockProductIds,
  isLowStock,
} from "@/lib/inventory";

describe("isLowStock", () => {
  it("is true strictly below the threshold", () => {
    expect(isLowStock(0)).toBe(true);
    expect(isLowStock(5)).toBe(true);
    expect(isLowStock(LOW_STOCK_THRESHOLD - 1)).toBe(true);
  });

  it("is false at or above the threshold", () => {
    expect(isLowStock(6)).toBe(false);
    expect(isLowStock(LOW_STOCK_THRESHOLD)).toBe(false);
    expect(isLowStock(12)).toBe(false);
  });
});

describe("constants", () => {
  it("exports the agreed eyebrow copy and threshold", () => {
    expect(LOW_STOCK_THRESHOLD).toBe(6);
    expect(LOW_STOCK_EYEBROW).toBe("Limited quantities");
  });
});

describe("getLowStockProductIds", () => {
  beforeEach(() => {
    selectMock.mockReset();
  });

  it("returns an empty set when given no product ids", async () => {
    await expect(getLowStockProductIds([])).resolves.toEqual(new Set());
    expect(selectMock).not.toHaveBeenCalled();
  });

  it("returns distinct product ids that have any low-stock variant", async () => {
    selectMock.mockReturnValue({
      from: () => ({
        where: async () => [
          { productId: "p1" },
          { productId: "p1" },
          { productId: "p2" },
        ],
      }),
    });

    const result = await getLowStockProductIds(["p1", "p2", "p3"]);
    expect(result).toEqual(new Set(["p1", "p2"]));
    expect(selectMock).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm vitest run src/lib/inventory.test.ts
```

Expected: module not found / FAIL.

- [ ] **Step 3: Implement `src/lib/inventory.ts`**

```ts
import "server-only";
import { db } from "@/db";
import { productVariants } from "@/db/schema";
import { and, inArray, lt } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";

export const LOW_STOCK_THRESHOLD = 6;
export const LOW_STOCK_EYEBROW = "Limited quantities";

export function isLowStock(inventory: number): boolean {
  return inventory < LOW_STOCK_THRESHOLD;
}

export async function getLowStockProductIds(
  productIds: string[],
): Promise<Set<string>> {
  if (productIds.length === 0) return new Set();
  await ensureDbReady();
  const rows = await db
    .selectDistinct({ productId: productVariants.productId })
    .from(productVariants)
    .where(
      and(
        inArray(productVariants.productId, productIds),
        lt(productVariants.inventory, LOW_STOCK_THRESHOLD),
      ),
    );
  return new Set(rows.map((r) => r.productId));
}
```

Note: `isLowStock` and constants must be importable from client components. If `server-only` blocks the variant selector, split pure helpers into `src/lib/inventory-shared.ts` (no server-only) and keep the query in `inventory.ts`, re-exporting shared symbols. Prefer the split if `variant-selector.tsx` is a client component.

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm vitest run src/lib/inventory.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/inventory.ts src/lib/inventory-shared.ts src/lib/inventory.test.ts
git commit -m "feat(BRK-2): add shared low-stock inventory helpers"
```

---

### Task 2: ProductTile image eyebrow + PDP shared threshold

**Files:**
- Modify: `src/components/commerce/product-tile.tsx`
- Modify: `src/components/commerce/variant-selector.tsx`

**Interfaces:**
- Consumes: `isLowStock` / `LOW_STOCK_THRESHOLD` from shared inventory module
- Produces: ProductTile renders `eyebrow` overlay whenever provided, including image tiles

- [ ] **Step 1: Update ProductTile to overlay eyebrow on image tiles**

When `eyebrow` is set, render the same bone pill used for gradient tiles, positioned at the bottom of the media frame, for both image and non-image cases. Keep `brandLine` fallback only for the non-image path when `eyebrow` is omitted (current behavior).

Sketch:

```tsx
{(eyebrow || !hasImage) && (
  <div className="absolute inset-0 flex items-end p-5 pointer-events-none">
    <span className="bg-bone/90 px-2.5 py-1 text-xs font-medium tracking-[0.18em] uppercase text-ink">
      {eyebrow ?? product.brandLine}
    </span>
  </div>
)}
```

Only show the fallback brandLine when `!hasImage`. When `hasImage && !eyebrow`, show nothing.

Correct condition:

```tsx
{hasImage
  ? eyebrow && (
      <div className="absolute inset-0 z-10 flex items-end p-5 pointer-events-none">
        <span className="bg-bone/90 px-2.5 py-1 text-xs font-medium tracking-[0.18em] uppercase text-ink">
          {eyebrow}
        </span>
      </div>
    )
  : (
      <div className="absolute inset-0 flex items-end p-5">
        <span className="bg-bone/90 px-2.5 py-1 text-xs font-medium tracking-[0.18em] uppercase text-ink">
          {eyebrow ?? product.brandLine}
        </span>
      </div>
    )}
```

- [ ] **Step 2: Point variant-selector at shared `isLowStock`**

Replace `inventory < 6` with `isLowStock(inventory)` imported from the non-server-only shared module.

- [ ] **Step 3: Typecheck**

```bash
pnpm typecheck
```

- [ ] **Step 4: Commit**

```bash
git add src/components/commerce/product-tile.tsx src/components/commerce/variant-selector.tsx
git commit -m "feat(BRK-2): surface low-stock eyebrow on product tiles"
```

---

### Task 3: Wire homepage + smoke assertion

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `scripts/smoke.mjs`

**Interfaces:**
- Consumes: `getLowStockProductIds`, `LOW_STOCK_EYEBROW`

- [ ] **Step 1: Update HomePage**

After loading featured collections, collect every product id rendered on the page (hero slice, season slice, editorial slices), call `getLowStockProductIds` once, and pass:

```tsx
eyebrow={lowStock.has(p.id) ? LOW_STOCK_EYEBROW : undefined}
```

to every homepage `ProductTile`.

- [ ] **Step 2: Assert smoke content on `/`**

Change the `/` route entry to also require `Limited quantities` (seeded Tartan / Destructed / Opera Cape ensure it appears):

```js
{ path: "/", contains: "Limited quantities", expectsImage: true },
```

Keep a separate check or combine carefully — the smoke helper only supports one `contains` string. Prefer asserting `Limited quantities` on `/` (Barkenciaga still appears in header via layout). If the header brand string is needed, add a second route entry for `/` with `contains: "Barkenciaga"` OR extend smoke to accept `containsAll: string[]`. Prefer the minimal change: `contains: "Limited quantities"` is enough if layout always renders; verify layout includes "Barkenciaga".

- [ ] **Step 3: Run unit tests + typecheck + lint**

```bash
pnpm vitest run src/lib/inventory.test.ts
pnpm typecheck
pnpm lint
```

- [ ] **Step 4: Manual / smoke against local server**

```bash
pnpm dev &
# wait for ready
pnpm smoke
```

Expected: `/` OK and includes Limited quantities.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx scripts/smoke.mjs
git commit -m "feat(BRK-2): badge low-stock products on homepage"
```

---

### Task 4: Validation + PR

- [ ] **Step 1: Full test suite**

```bash
pnpm test
pnpm typecheck
pnpm lint
```

- [ ] **Step 2: Push and open draft PR** referencing BRK-2, linking the design doc and acceptance criteria.

- [ ] **Step 3: Comment on Jira BRK-2** with branch name, PR URL, and verification notes (optional if write tools available).
