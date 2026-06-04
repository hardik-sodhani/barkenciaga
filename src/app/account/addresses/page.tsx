import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getAddressesForUser } from "@/lib/addresses";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/server/actions/addresses";
import { Badge } from "@/components/ui/badge";

export default async function AddressesPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");
  const list = await getAddressesForUser(session.userId);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="eyebrow mb-2">Account</div>
          <h1 className="display-lg">Address book</h1>
          <p className="mt-3 max-w-lg text-sm text-ink-60">
            Save shipping addresses to skip the typing at checkout. Your default
            address is selected automatically when you place an order.
          </p>
        </div>
        <Link
          href="/account/addresses/new"
          className="border border-ink px-6 py-3 text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-bone"
        >
          + Add address
        </Link>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {list.map((a) => (
          <li key={a.id} className="border border-ink-20 bg-bone-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl">{a.label ?? "Address"}</h2>
                  {a.isDefault && <Badge tone="chartreuse">Default</Badge>}
                </div>
                <div className="mt-3 text-sm text-ink-80">
                  <div>{a.line1}</div>
                  {a.line2 && <div>{a.line2}</div>}
                  <div>
                    {a.city}, {a.region} {a.postalCode}
                  </div>
                  <div className="text-ink-60">{a.country}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!a.isDefault && (
                  <form action={setDefaultAddressAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      className="text-[11px] tracking-[0.2em] uppercase hover:text-burgundy"
                    >
                      Set default
                    </button>
                  </form>
                )}
                <Link
                  href={`/account/addresses/${a.id}/edit`}
                  className="text-[11px] tracking-[0.2em] uppercase hover:text-burgundy"
                >
                  Edit
                </Link>
              </div>
              <form action={deleteAddressAction}>
                <input type="hidden" name="id" value={a.id} />
                <button
                  type="submit"
                  className="text-[11px] tracking-[0.2em] uppercase text-ink-65 hover:text-danger"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <div className="mt-12 border border-dashed border-ink-20 p-12 text-center">
          <p className="font-display text-3xl">No saved addresses yet.</p>
          <p className="mt-3 text-sm text-ink-60">
            Add one to speed through checkout next time.
          </p>
          <Link
            href="/account/addresses/new"
            className="mt-6 inline-block border border-ink px-6 py-3 text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-bone"
          >
            + Add address
          </Link>
        </div>
      )}
    </section>
  );
}
