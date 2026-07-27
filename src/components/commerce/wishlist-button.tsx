"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlistAction } from "@/server/actions/wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  initialSaved,
  signedIn,
}: {
  productId: string;
  initialSaved: boolean;
  signedIn: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 border border-ink-20 px-4 py-3 text-[11px] tracking-[0.2em] uppercase text-ink-80 transition-colors hover:border-ink hover:text-burgundy"
      >
        <Heart className="h-4 w-4" />
        Save for later
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const optimistic = !saved;
          setSaved(optimistic);
          const formData = new FormData();
          formData.set("productId", productId);
          try {
            const result = await toggleWishlistAction(formData);
            setSaved(result.saved);
          } catch {
            setSaved(!optimistic);
          }
        })
      }
      className={cn(
        "inline-flex items-center gap-2 border px-4 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors",
        saved
          ? "border-burgundy text-burgundy hover:border-burgundy-600 hover:text-burgundy-600"
          : "border-ink-20 text-ink-80 hover:border-ink hover:text-burgundy",
        pending && "opacity-70",
      )}
      aria-pressed={saved}
    >
      <Heart
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        aria-hidden
      />
      {pending ? "Saving..." : saved ? "Saved" : "Save for later"}
    </button>
  );
}
