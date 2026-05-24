"use client";

import {
  createContext,
  useCallback,
  useContext,
  useOptimistic,
} from "react";
import type { BarkenciagaSession } from "@/lib/session";
import type { Dog } from "@/db/schema";

type HeaderState = {
  session: BarkenciagaSession;
  activeDog: Dog | null;
  cartCount: number;
  /**
   * Optimistically bump the header bag count by `n` items. Must be invoked
   * inside an active React transition (a Server Action triggered through a
   * `<form action>`, `useActionState`, or `startTransition`); the optimistic
   * value reverts automatically once the transition's revalidated server
   * payload lands.
   */
  bumpCart: (n: number) => void;
};

const Ctx = createContext<HeaderState | null>(null);

type ProviderProps = {
  session: BarkenciagaSession;
  activeDog: Dog | null;
  cartCount: number;
  children: React.ReactNode;
};

export function HeaderStateProvider({
  session,
  activeDog,
  cartCount,
  children,
}: ProviderProps) {
  const [optimisticCount, addOptimistic] = useOptimistic(
    cartCount,
    (current, delta: number) => Math.max(0, current + delta),
  );
  const bumpCart = useCallback(
    (n: number) => addOptimistic(n),
    [addOptimistic],
  );

  return (
    <Ctx.Provider
      value={{
        session,
        activeDog,
        cartCount: optimisticCount,
        bumpCart,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useHeaderState() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useHeaderState must be used inside <HeaderStateProvider>",
    );
  }
  return ctx;
}
