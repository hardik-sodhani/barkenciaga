"use client";

import { createContext, useContext } from "react";
import type { BarkenciagaSession } from "@/lib/session";
import type { Dog } from "@/db/schema";

type ClientSessionContext = {
  session: BarkenciagaSession;
  activeDog: Dog | null;
};

const SessionCtx = createContext<ClientSessionContext | null>(null);

export function SessionContextProvider({
  value,
  children,
}: {
  value: ClientSessionContext;
  children: React.ReactNode;
}) {
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("useSession must be used inside SessionContextProvider");
  return ctx;
}
