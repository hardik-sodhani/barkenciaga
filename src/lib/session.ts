import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";

/** Guest order share-link TTL (~7 days). */
export const ORDER_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Dedicated secret for signed order share links. Must not reuse SESSION_PASSWORD.
 * Demo fallback keeps local/dev usable when the env var is unset.
 */
function getOrderTokenSecret(): string {
  return (
    process.env.ORDER_TOKEN_SECRET ??
    "barkenciaga-order-token-demo-secret-not-for-production-use"
  );
}

export type SessionData = {
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: "customer" | "admin";
  activeDogId?: string;
  cartId?: string;
};

export type BarkenciagaSession = {
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: "customer" | "admin" | null;
  activeDogId: string | null;
  cartId: string | null;
};

const sessionPassword =
  process.env.SESSION_PASSWORD ??
  "barkenciaga-demo-only-password-not-for-production-use-32+chars";

const sessionOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: "barkenciaga_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    path: "/",
  },
};

export async function getRawSession() {
  const store = await cookies();
  return getIronSession<SessionData>(store, sessionOptions);
}

export async function getSession(): Promise<BarkenciagaSession> {
  const s = await getRawSession();
  return {
    userId: s.userId ?? null,
    userEmail: s.userEmail ?? null,
    userName: s.userName ?? null,
    userRole: s.userRole ?? null,
    activeDogId: s.activeDogId ?? null,
    cartId: s.cartId ?? null,
  };
}

/**
 * Read the current cart id if one exists. Safe to call during rendering.
 */
export async function readCartId(): Promise<string | null> {
  const s = await getRawSession();
  return s.cartId ?? null;
}

/**
 * Ensure a cart id exists, creating one if needed. Must be called from a
 * Server Action or Route Handler (will throw from pure rendering because it
 * writes to cookies).
 */
export async function ensureCartId(): Promise<string> {
  const s = await getRawSession();
  if (!s.cartId) {
    s.cartId = `cart_${nanoid(12)}`;
    await s.save();
  }
  return s.cartId;
}

export async function signInAs(email: string) {
  await ensureDbReady();
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error(`No demo user with email ${email}`);
  const s = await getRawSession();
  s.userId = user.id;
  s.userEmail = user.email;
  s.userName = user.name ?? undefined;
  s.userRole = user.role;
  await s.save();
  return user;
}

export async function signOut() {
  const s = await getRawSession();
  s.destroy();
}

export async function setActiveDog(dogId: string | null) {
  const s = await getRawSession();
  if (dogId) {
    s.activeDogId = dogId;
  } else {
    delete s.activeDogId;
  }
  await s.save();
}

export async function requireAdmin() {
  const s = await getSession();
  if (s.userRole !== "admin") {
    throw new Error("forbidden: admin only");
  }
  return s;
}

/**
 * Sign a time-limited share token for an order confirmation URL.
 * Token format: `{expiresUnix}.{hmacBase64url}` over payload `{orderId}.{expiresUnix}`.
 */
export function signOrderToken(orderId: string, nowMs: number = Date.now()): string {
  const expiresAt = Math.floor((nowMs + ORDER_TOKEN_TTL_MS) / 1000);
  const payload = `${orderId}.${expiresAt}`;
  const signature = createHmac("sha256", getOrderTokenSecret())
    .update(payload)
    .digest("base64url");
  return `${expiresAt}.${signature}`;
}

/**
 * Verify a guest share token for an order. Rejects tampered or expired tokens
 * using a constant-time signature compare.
 */
export function verifyOrderToken(
  orderId: string,
  token: string,
  nowMs: number = Date.now(),
): boolean {
  const [expiresAtRaw, signature, ...rest] = token.split(".");
  if (!expiresAtRaw || !signature || rest.length > 0) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || !Number.isInteger(expiresAt)) return false;
  if (expiresAt * 1000 < nowMs) return false;

  const payload = `${orderId}.${expiresAt}`;
  const expected = createHmac("sha256", getOrderTokenSecret())
    .update(payload)
    .digest("base64url");

  const providedBuf = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}
