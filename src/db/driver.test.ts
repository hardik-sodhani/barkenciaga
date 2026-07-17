import { describe, expect, it } from "vitest";
import { resolveDatabaseUrl } from "./index";

describe("resolveDatabaseUrl", () => {
  it("prefers DATABASE_URL over POSTGRES_URL", () => {
    expect(
      resolveDatabaseUrl({
        DATABASE_URL: "postgres://primary",
        POSTGRES_URL: "postgres://fallback",
      }),
    ).toBe("postgres://primary");
  });

  it("falls back to POSTGRES_URL when DATABASE_URL is unset", () => {
    expect(
      resolveDatabaseUrl({
        POSTGRES_URL: "postgres://neon",
      }),
    ).toBe("postgres://neon");
  });

  it("returns undefined for local PGlite mode", () => {
    expect(resolveDatabaseUrl({})).toBeUndefined();
  });
});
