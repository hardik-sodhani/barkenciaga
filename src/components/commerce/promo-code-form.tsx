"use client";

import { useActionState } from "react";
import {
  applyPromoAction,
  removePromoAction,
  type ApplyPromoState,
} from "@/server/actions/promo";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: ApplyPromoState = { ok: false };

export function PromoCodeForm({
  appliedCode,
}: {
  appliedCode: string | null;
}) {
  const [state, formAction, pending] = useActionState(applyPromoAction, initialState);

  if (appliedCode) {
    return (
      <div className="mb-6 space-y-2">
        <div className="eyebrow">Promo</div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span>
            <span className="font-medium tracking-wide">{appliedCode}</span> applied
          </span>
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
    <div className="mb-6">
      <form action={formAction} className="space-y-3">
        <Label htmlFor="promo-code">Apply promo code</Label>
        <div className="flex items-end gap-3">
          <Input
            id="promo-code"
            name="code"
            autoComplete="off"
            placeholder="WOOFER20"
            className="uppercase"
            disabled={pending}
          />
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Applying…" : "Apply"}
          </Button>
        </div>
      </form>
      {state.message && (
        <p className={`mt-2 text-xs ${state.ok ? "text-ink-60" : "text-danger"}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}
