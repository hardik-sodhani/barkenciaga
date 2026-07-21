import { describe, expect, it } from "vitest";

/** Mirrors signInAction email normalization in auth.ts */
function normalizeSignInEmail(raw: FormDataEntryValue | null): string {
  return String(raw ?? "").trim().toLowerCase();
}

describe("signInAction email normalization", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeSignInEmail("  hello@barkenciaga.test  ")).toBe(
      "hello@barkenciaga.test",
    );
  });

  it("lowercases mixed-case addresses", () => {
    expect(normalizeSignInEmail("Hello@Barkenciaga.TEST")).toBe(
      "hello@barkenciaga.test",
    );
  });

  it("returns empty string when email is missing", () => {
    expect(normalizeSignInEmail(null)).toBe("");
  });
});
