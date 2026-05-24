"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";
import { useHeaderState } from "@/components/session-context";

const CATEGORIES = [
  { slug: "couture", name: "Couture" },
  { slug: "accessories", name: "Accessories" },
  { slug: "eyewear", name: "Eyewear" },
  { slug: "footwear", name: "Footwear" },
];

const NAV_LINK = "text-[13px] tracking-[0.2em] uppercase text-ink-65 hover:text-ink";
const UTILITY_LINK = "text-[11px] tracking-[0.24em] uppercase text-ink-65 hover:text-ink";

export function SiteHeader() {
  const { session, activeDog, cartCount } = useHeaderState();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-20 bg-bone/95 backdrop-blur">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1400px] items-center gap-6 px-6">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Barkenciaga
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 flex-1"
        >
          {CATEGORIES.map((c) => {
            const href = `/c/${c.slug}`;
            const active = isActive(href);
            return (
              <Link
                key={c.slug}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(NAV_LINK, active && "text-ink")}
              >
                {c.name}
              </Link>
            );
          })}
          <Link
            href="/collections/autumn-woofer-26"
            aria-current={isActive("/collections/autumn-woofer-26") ? "page" : undefined}
            className={cn(NAV_LINK, isActive("/collections/autumn-woofer-26") && "text-ink")}
          >
            AW26
          </Link>
          <Link
            href="/showroom"
            aria-current={isActive("/showroom") ? "page" : undefined}
            className={cn(NAV_LINK, isActive("/showroom") && "text-ink")}
          >
            Showroom
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link href="/search" className={UTILITY_LINK}>
            Search
          </Link>
          {activeDog && (
            <Link
              href="/account/dogs"
              className="hidden lg:inline-flex items-center gap-2 border border-ink-20 px-3 py-2 text-[11px] tracking-[0.18em] uppercase text-ink-80 hover:border-ink"
            >
              <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-chartreuse" />
              Shopping for {activeDog.name}
            </Link>
          )}
          {session.userId ? (
            <>
              <Link href="/account" className={UTILITY_LINK}>
                {session.userName ?? "Account"}
              </Link>
              {session.userRole === "admin" && (
                <Link
                  href="/admin"
                  className="text-[11px] tracking-[0.24em] uppercase text-burgundy hover:text-burgundy-600"
                >
                  Admin
                </Link>
              )}
              <form action={signOutAction}>
                <button type="submit" className={UTILITY_LINK}>
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/sign-in" className={UTILITY_LINK}>
              Sign in
            </Link>
          )}
          <Link
            href="/cart"
            aria-label={`Bag, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="inline-flex items-center gap-1 text-[11px] tracking-[0.24em] uppercase text-ink hover:text-burgundy"
          >
            Bag <span className="text-ink-65 tabular-nums">({cartCount})</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
