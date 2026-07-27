import { afterEach, describe, expect, it } from "vitest";
import {
  ORDER_TOKEN_TTL_MS,
  signOrderToken,
  verifyOrderToken,
} from "@/lib/session";

const ORIGINAL_SECRET = process.env.ORDER_TOKEN_SECRET;

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) {
    delete process.env.ORDER_TOKEN_SECRET;
  } else {
    process.env.ORDER_TOKEN_SECRET = ORIGINAL_SECRET;
  }
});

describe("signOrderToken / verifyOrderToken", () => {
  it("accepts a freshly signed token for the same order", () => {
    process.env.ORDER_TOKEN_SECRET = "unit-test-order-token-secret";
    const now = Date.UTC(2026, 6, 27, 12, 0, 0);
    const orderId = "ord_abc123";
    const token = signOrderToken(orderId, now);
    expect(verifyOrderToken(orderId, token, now)).toBe(true);
  });

  it("rejects a token for a different order id", () => {
    process.env.ORDER_TOKEN_SECRET = "unit-test-order-token-secret";
    const now = Date.UTC(2026, 6, 27, 12, 0, 0);
    const token = signOrderToken("ord_abc123", now);
    expect(verifyOrderToken("ord_other", token, now)).toBe(false);
  });

  it("rejects an expired token", () => {
    process.env.ORDER_TOKEN_SECRET = "unit-test-order-token-secret";
    const issuedAt = Date.UTC(2026, 6, 1, 12, 0, 0);
    const token = signOrderToken("ord_abc123", issuedAt);
    const afterTtl = issuedAt + ORDER_TOKEN_TTL_MS + 1_000;
    expect(verifyOrderToken("ord_abc123", token, afterTtl)).toBe(false);
  });

  it("rejects a tampered signature", () => {
    process.env.ORDER_TOKEN_SECRET = "unit-test-order-token-secret";
    const now = Date.UTC(2026, 6, 27, 12, 0, 0);
    const token = signOrderToken("ord_abc123", now);
    const [expiresAt, signature] = token.split(".");
    const flipped = signature.endsWith("a")
      ? `${signature.slice(0, -1)}b`
      : `${signature.slice(0, -1)}a`;
    expect(verifyOrderToken("ord_abc123", `${expiresAt}.${flipped}`, now)).toBe(
      false,
    );
  });

  it("does not reuse SESSION_PASSWORD as the HMAC secret", () => {
    process.env.ORDER_TOKEN_SECRET = "dedicated-order-secret";
    process.env.SESSION_PASSWORD =
      "session-password-that-must-not-sign-order-tokens-32+";
    const now = Date.UTC(2026, 6, 27, 12, 0, 0);
    const orderId = "ord_abc123";
    const token = signOrderToken(orderId, now);

    // Flip only the order-token secret; session password stays the same.
    process.env.ORDER_TOKEN_SECRET = "different-order-secret";
    expect(verifyOrderToken(orderId, token, now)).toBe(false);
  });
});
