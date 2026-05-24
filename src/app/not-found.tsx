import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="eyebrow mb-3">404 · Off the rail</div>
      <h1 className="display-xl">Nothing on this hanger.</h1>
      <p className="mt-6 text-sm text-ink-65">
        That piece may have been pulled from the line, or the link is from a
        previous season. Try one of these instead.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/collections/autumn-woofer-26">Autumn/Woofer &apos;26</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/search">Search</Link>
        </Button>
      </div>
    </section>
  );
}
