"use client";

import { useActionState } from "react";
import {
  applyPromoAction,
  removePromoAction,
  type PromoActionState,
} from "@/server/actions/promo";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type AppliedPromo = {
  code: string;
  discountCents: number;
};

const initialState: PromoActionState = { ok: false, message: "" };

export function PromoCodeForm({
  appliedPromo,
}: {
  appliedPromo: AppliedPromo | null;
}) {
  const [state, formAction, pending] = useActionState(applyPromoAction, initialState);

  if (appliedPromo) {
    return (
      <div className="mt-6 border-t border-ink-20 pt-4">
        <div className="eyebrow mb-2">Promo</div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <div>
            <span className="font-medium tracking-wide">{appliedPromo.code}</span>
            <span className="ml-2 text-ink-60">
              −{formatPrice(appliedPromo.discountCents)}
            </span>
          </div>
          <form action={removePromoAction}>
            <button
              type="submit"
              className="text-[11px] tracking-[0.2em] uppercase text-ink-65 hover:text-burgundy"
            >
              Remove
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-ink-20 pt-4">
      <form action={formAction} className="space-y-3">
        <Label htmlFor="promo-code">Apply promo code</Label>
        <div className="flex gap-2">
          <Input
            id="promo-code"
            name="code"
            placeholder="WOOFER20"
            autoComplete="off"
            className="uppercase"
            required
          />
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "…" : "Apply"}
          </Button>
        </div>
        {state.message ? (
          <p
            className={`text-xs ${state.ok ? "text-ink-80" : "text-burgundy"}`}
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
