"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signInAs, signOut, setActiveDog } from "@/lib/session";
import { ensureDbReady } from "@/db/bootstrap";

export async function signInAction(formData: FormData) {
  await ensureDbReady();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) throw new Error("Email required");
  await signInAs(email);
  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signOutAction() {
  await signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function setActiveDogAction(formData: FormData) {
  const dogId = String(formData.get("dogId") ?? "");
  await setActiveDog(dogId || null);
  revalidatePath("/", "layout");
}
