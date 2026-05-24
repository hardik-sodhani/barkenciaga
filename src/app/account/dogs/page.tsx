import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getDogsForUser } from "@/lib/dogs";
import { deleteDogAction } from "@/server/actions/dogs";
import { setActiveDogAction } from "@/server/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SIZE_LABEL = { xs: "XS", s: "S", m: "M", l: "L", xl: "XL" } as const;

export default async function DogsPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");
  const dogs = await getDogsForUser(session.userId);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="eyebrow mb-2">Account</div>
          <h1 className="display-lg">Dog profiles</h1>
          <p className="mt-3 max-w-lg text-sm text-ink-65">
            Dog profiles drive size recommendations on every product page. Add
            measurements for a precise fit.
          </p>
        </div>
        <Link
          href="/account/dogs/new"
          className="border border-ink px-6 py-3 text-[11px] tracking-[0.24em] uppercase hover:bg-ink hover:text-bone"
        >
          + New profile
        </Link>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {dogs.map((d) => (
          <li key={d.id} className="border border-ink-20 bg-bone-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-3xl">{d.name}</h2>
                  {session.activeDogId === d.id && (
                    <Badge tone="chartreuse">Active</Badge>
                  )}
                </div>
                <div className="mt-1 text-xs text-ink-65">
                  {d.breed} · {d.gender}
                </div>
              </div>
              <Badge>Size {SIZE_LABEL[d.sizeBucket]}</Badge>
            </div>
            <dl className="mt-6 grid grid-cols-4 gap-3 text-sm">
              {[
                ["Neck", d.neckCm, "cm"],
                ["Chest", d.chestCm, "cm"],
                ["Back", d.backCm, "cm"],
                ["Weight", d.weightKg, "kg"],
              ].map(([label, val, unit]) => (
                <div key={label as string} className="border border-ink-20 bg-bone p-3">
                  <div className="eyebrow text-[9px]">{label}</div>
                  <div className="mt-1 tabular-nums">
                    {val ? (
                      <>
                        {val} <span className="text-ink-65 text-xs">{unit}</span>
                      </>
                    ) : (
                      <span className="text-ink-65">—</span>
                    )}
                  </div>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex items-center justify-between">
              <form action={setActiveDogAction}>
                <input type="hidden" name="dogId" value={d.id} />
                <button
                  type="submit"
                  className="text-[11px] tracking-[0.2em] uppercase hover:text-burgundy"
                >
                  {session.activeDogId === d.id
                    ? "Currently shopping for"
                    : `Shop for ${d.name}`}
                </button>
              </form>
              <form action={deleteDogAction}>
                <input type="hidden" name="id" value={d.id} />
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

      {dogs.length === 0 && (
        <div className="mt-12 border border-dashed border-ink-20 p-12 text-center">
          <p className="font-display text-3xl">No profiles yet.</p>
          <p className="mt-3 text-sm text-ink-65">
            Create one to unlock size recommendations.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/account/dogs/new">+ New profile</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
