import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAddressesForUser } from "@/lib/addresses";
import { createAddressAction } from "@/server/actions/addresses";
import { AddressFormFields } from "../address-form-fields";
import { Button } from "@/components/ui/button";

export default async function NewAddressPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");
  const existing = await getAddressesForUser(session.userId);
  const isFirst = existing.length === 0;

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="eyebrow mb-2">Address book</div>
      <h1 className="display-lg">Add an address.</h1>
      <p className="mt-3 text-sm text-ink-60">
        {isFirst
          ? "Your first address becomes your default automatically."
          : "Save it once and reuse it at checkout."}
      </p>

      <form action={createAddressAction} className="mt-10">
        <AddressFormFields lockDefault={isFirst} defaults={{ country: "US" }} />
        <div className="mt-10 flex items-center gap-4">
          <Button type="submit" size="lg">
            Save address
          </Button>
          <Link
            href="/account/addresses"
            className="text-[11px] tracking-[0.2em] uppercase text-ink-60 hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
