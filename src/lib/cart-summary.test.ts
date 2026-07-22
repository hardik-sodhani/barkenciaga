import { describe, expect, it, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  ensureDbReady: vi.fn(),
  readCartId: vi.fn(),
}));

vi.mock("@/db/bootstrap", () => ({ ensureDbReady: mocks.ensureDbReady }));
vi.mock("@/lib/session", () => ({ readCartId: mocks.readCartId }));
vi.mock("@/db", () => ({
  db: {
    select: () => {
      throw new Error("unexpected db access in getCartSummary test");
    },
  },
}));

import { getCartSummary } from "@/lib/cart";

describe("getCartSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns zero totals when there is no active cart", async () => {
    mocks.ensureDbReady.mockResolvedValue(undefined);
    mocks.readCartId.mockResolvedValue(null);

    await expect(getCartSummary()).resolves.toEqual({
      itemCount: 0,
      subtotalCents: 0,
    });
  });

  it("swallows getCart failures and returns zero totals for header badge resilience", async () => {
    mocks.ensureDbReady.mockRejectedValue(new Error("PGlite aborted"));

    await expect(getCartSummary()).resolves.toEqual({
      itemCount: 0,
      subtotalCents: 0,
    });
  });
});
