import { describe, expect, it } from "vitest";
import { isPgliteAbort } from "./pglite-errors";

describe("isPgliteAbort", () => {
  it("detects Aborted() in the error message", () => {
    expect(isPgliteAbort(new Error("RuntimeError: Aborted()"))).toBe(true);
  });

  it("detects Aborted() on nested cause", () => {
    expect(
      isPgliteAbort({ message: "query failed", cause: { message: "Aborted()" } }),
    ).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isPgliteAbort(new Error("aborted()"))).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isPgliteAbort(new Error("connection refused"))).toBe(false);
    expect(isPgliteAbort(null)).toBe(false);
    expect(isPgliteAbort("timeout")).toBe(false);
  });
});
