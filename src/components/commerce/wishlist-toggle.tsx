"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleWishlistAction } from "@/server/actions/wishlist";
import { Button } from "@/components/ui/button";

export function WishlistToggle({
  variantId,
  initialSaved,
  isSignedIn,
  signInHref,
}: {
  variantId: string | null;
  initialSaved: boolean;
  isSignedIn: boolean;
  signInHref: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  if (!isSignedIn) {
    return (
      <Button asChild variant="outline" size="lg" className="px-4" aria-label="Sign in to save for later">
        <Link href={signInHref}>
          <Heart className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
    );
  }

  if (!variantId) {
    return (
      <Button variant="outline" size="lg" className="px-4" disabled aria-label="Save for later">
        <Heart className="h-4 w-4" aria-hidden />
      </Button>
    );
  }

  async function onToggle() {
    setPending(true);
    const nextSaved = !saved;
    setSaved(nextSaved);
    try {
      const fd = new FormData();
      fd.set("variantId", variantId!);
      fd.set("saved", saved ? "true" : "false");
      await toggleWishlistAction(fd);
    } catch {
      setSaved(!nextSaved);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="px-4"
      disabled={pending}
      onClick={onToggle}
      aria-label={saved ? "Remove from wishlist" : "Save for later"}
      aria-pressed={saved}
    >
      <Heart
        className={cn("h-4 w-4", saved && "fill-burgundy text-burgundy")}
        aria-hidden
      />
    </Button>
  );
}
