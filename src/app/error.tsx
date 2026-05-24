"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[barkenciaga] route error", error);
  }, [error]);

  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="eyebrow mb-3 text-burgundy">Something tore a seam</div>
      <h1 className="display-lg">A studio error.</h1>
      <p className="mt-4 text-sm text-ink-65">
        We logged it. You can try again, or head back to the editorial floor.
      </p>
      {error.digest && (
        <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-ink-65">
          Ref {error.digest}
        </p>
      )}
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button type="button" onClick={() => unstable_retry()}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
