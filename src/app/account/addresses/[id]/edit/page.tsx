import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAddressForUser } from "@/lib/addresses";
import { updateAddressAction } from "@/server/actions/addresses";
import { AddressFormFields } from "../../address-form-fields";
import { Button } from "@/components/ui/button";

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");
  const { id } = await params;
  const address = await getAddressForUser(session.userId, id);
  if (!address) notFound();

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="eyebrow mb-2">Address book</div>
      <h1 className="display-lg">Edit address.</h1>
      <p className="mt-3 text-sm text-ink-60">
        Updating an address never changes past orders — those keep the address
        captured at the time they were placed.
      </p>

      <form action={updateAddressAction} className="mt-10">
        <input type="hidden" name="id" value={address.id} />
        <AddressFormFields
          lockDefault={address.isDefault}
          defaults={{
            label: address.label,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            region: address.region,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault,
          }}
        />
        <div className="mt-10 flex items-center gap-4">
          <Button type="submit" size="lg">
            Save changes
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
