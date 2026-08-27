"use client";

import { useActionState } from "react";
import {
  updateVariantInventoryAction,
  type InventoryUpdateState,
} from "@/server/actions/products";

const initialState: InventoryUpdateState = {};

export function InventoryForm({
  variantId,
  inventory,
  inventoryVersion,
}: {
  variantId: string;
  inventory: number;
  inventoryVersion: number;
}) {
  const [state, formAction, pending] = useActionState(
    updateVariantInventoryAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={variantId} />
      <input
        type="hidden"
        name="expectedVersion"
        value={inventoryVersion}
      />
      <input
        type="number"
        name="inventory"
        min={0}
        max={9999}
        defaultValue={inventory}
        aria-label="Inventory"
        className="w-20 border border-ink-20 bg-transparent px-2 py-1 text-right text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-[10px] tracking-[0.2em] uppercase text-ink-60 hover:text-ink disabled:opacity-60"
      >
        {pending ? "Saving" : "Save"}
      </button>
      {state.message && (
        <span
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "error"
              ? "max-w-48 text-xs text-burgundy"
              : "text-xs text-ink-65"
          }
        >
          {state.message}
          {state.status === "saved" && state.inventoryVersion
            ? ` Revision ${state.inventoryVersion}.`
            : ""}
        </span>
      )}
    </form>
  );
}
