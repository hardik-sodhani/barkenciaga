import { describe, expect, it, vi } from "vitest";
import { recommendSizeForDog } from "@/lib/dogs";

vi.mock("@/db", () => ({ db: {} }));
vi.mock("@/db/bootstrap", () => ({ ensureDbReady: vi.fn() }));

describe("recommendSizeForDog", () => {
  it("returns the dog bucket when that size is in stock", () => {
    expect(recommendSizeForDog({ sizeBucket: "m" }, ["s", "m", "l"])).toBe("m");
  });

  it("sizes up when only larger variants exist", () => {
    expect(recommendSizeForDog({ sizeBucket: "m" }, ["l", "xl"])).toBe("l");
  });

  it("sizes down when only smaller variants exist", () => {
    expect(recommendSizeForDog({ sizeBucket: "m" }, ["xs", "s"])).toBe("s");
  });

  it("returns null when no adjacent size is available", () => {
    expect(recommendSizeForDog({ sizeBucket: "m" }, [])).toBe(null);
  });

  // BRK-17: fit finder currently prefers sizing down before up.
  it.fails("prefers sizing up over down when both are available (BRK-17)", () => {
    expect(recommendSizeForDog({ sizeBucket: "m" }, ["s", "l"])).toBe("l");
  });
});
