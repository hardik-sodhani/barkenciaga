import { redirect } from "next/navigation";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSession } from "@/lib/session";
import { getDogsForUser } from "@/lib/dogs";
import { setActiveDogAction } from "@/server/actions/auth";
import { ensureDbReady } from "@/db/bootstrap";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AccountPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");
  await ensureDbReady();

  // DEMO-TODO: this selects every order the user has ever placed. Add
  // pagination (?page= / cursor) once a demo account crosses ~20 orders.
  // See TECH_DEBT.md item 8.
  const [dogs, orderRows] = await Promise.all([
    getDogsForUser(session.userId),
    db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.userId))
      .orderBy(desc(orders.createdAt)),
  ]);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="eyebrow mb-2">Account</div>
          <h1 className="display-lg">Hello, {session.userName}.</h1>
        </div>
        <div className="text-xs text-ink-60">{session.userEmail}</div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <section className="md:col-span-2 border border-ink-20 bg-bone-50 p-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="eyebrow mb-1">Your dogs</div>
              <h2 className="font-display text-2xl">Profiles on file</h2>
            </div>
            <Link
              href="/account/dogs/new"
              className="text-[11px] tracking-[0.24em] uppercase hover:text-burgundy"
            >
              + Add a dog
            </Link>
          </div>

          {dogs.length === 0 ? (
            <div className="border border-dashed border-ink-20 p-8 text-center text-sm text-ink-60">
              No dog profiles yet.{" "}
              <Link href="/account/dogs/new" className="underline">
                Add one
              </Link>
              .
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {dogs.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between border border-ink-20 bg-bone p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xl">{d.name}</span>
                      {session.activeDogId === d.id && (
                        <Badge tone="chartreuse">Active</Badge>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-ink-60">
                      {d.breed} · {d.gender} · Size {d.sizeBucket.toUpperCase()}
                    </div>
                  </div>
                  <form action={setActiveDogAction}>
                    <input type="hidden" name="dogId" value={d.id} />
                    <button
                      type="submit"
                      className="text-[11px] tracking-[0.2em] uppercase hover:text-burgundy"
                    >
                      {session.activeDogId === d.id ? "Active" : "Shop for"}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Link
              href="/account/dogs"
              className="text-[11px] tracking-[0.24em] uppercase text-ink-60 hover:text-ink"
            >
              Manage all dogs →
            </Link>
          </div>
        </section>

        <aside className="border border-ink-20 bg-bone-50 p-6 text-sm">
          <div className="eyebrow mb-3">Quick links</div>
          <ul className="space-y-2">
            <li>
              <Link href="/account/dogs" className="hover:text-burgundy">
                Dog profiles
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-burgundy">
                Current bag
              </Link>
            </li>
            <li>
              <Link href="/showroom" className="hover:text-burgundy">
                Showroom (demo hub)
              </Link>
            </li>
          </ul>
        </aside>
      </div>

      <section className="mt-12 border border-ink-20 bg-bone-50 p-6">
        <div className="eyebrow mb-6">Order history</div>
        {orderRows.length === 0 ? (
          <div className="border border-dashed border-ink-20 p-8 text-center text-sm text-ink-60">
            No past orders.
          </div>
        ) : (
          <ul className="divide-y divide-ink-20">
            {orderRows.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-4 text-sm">
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-xs text-ink-60">
                    {new Date(o.createdAt).toLocaleDateString()} · {o.status}
                    {o.dogName && ` · for ${o.dogName}`}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="tabular-nums">{formatPrice(o.totalCents)}</div>
                  <Link
                    href={`/orders/${o.id}`}
                    className="text-[11px] tracking-[0.2em] uppercase text-ink-60 hover:text-ink"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
