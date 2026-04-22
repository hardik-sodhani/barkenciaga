import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-ink-20 bg-bone-100">
      <div className="mx-auto max-w-[1400px] grid gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-5xl leading-none">Barkenciaga</div>
          <p className="mt-4 max-w-sm text-sm text-ink-60">
            High fashion. For dogs. Designed in Milan, engineered for the daily
            walk, and judged by a rotating panel of studio canines.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">Shop</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/c/couture" className="hover:text-burgundy">
                Couture
              </Link>
            </li>
            <li>
              <Link href="/c/accessories" className="hover:text-burgundy">
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/c/eyewear" className="hover:text-burgundy">
                Eyewear
              </Link>
            </li>
            <li>
              <Link href="/c/footwear" className="hover:text-burgundy">
                Footwear
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Studio</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/showroom" className="hover:text-burgundy">
                Showroom
              </Link>
            </li>
            <li>
              <Link href="/collections/autumn-woofer-26" className="hover:text-burgundy">
                Autumn/Woofer &apos;26
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-burgundy">
                Account
              </Link>
            </li>
            <li>
              <span className="text-ink-65">Careers</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-20">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 text-xs text-ink-65">
          <span>(c) {new Date().getFullYear()} Barkenciaga Studio. A Cursor demo surface.</span>
          <span>AW/26 - Milan / New York / Kennel</span>
        </div>
      </div>
    </footer>
  );
}
