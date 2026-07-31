import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDbReady } from "@/db/bootstrap";

export type SessionData = {
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: "customer" | "admin";
  activeDogId?: string;
  cartId?: string;
  promoCodeId?: string;
};

export type BarkenciagaSession = {
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: "customer" | "admin" | null;
  activeDogId: string | null;
  cartId: string | null;
  promoCodeId: string | null;
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
    promoCodeId: s.promoCodeId ?? null,
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

export async function setPromoCodeId(promoCodeId: string | null) {
  const s = await getRawSession();
  if (promoCodeId) {
    s.promoCodeId = promoCodeId;
  } else {
    delete s.promoCodeId;
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
