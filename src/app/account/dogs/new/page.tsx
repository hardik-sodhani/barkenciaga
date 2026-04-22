import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { BREEDS } from "@/lib/dogs";
import { createDogAction } from "@/server/actions/dogs";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SIZES = [
  { id: "xs", label: "XS — under 5kg" },
  { id: "s", label: "S — 5 to 10kg" },
  { id: "m", label: "M — 10 to 20kg" },
  { id: "l", label: "L — 20 to 35kg" },
  { id: "xl", label: "XL — 35kg+" },
] as const;

export default async function NewDogPage() {
  const session = await getSession();
  if (!session.userId) redirect("/sign-in");

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="eyebrow mb-2">Onboarding</div>
      <h1 className="display-lg">Tell us about the dog.</h1>
      <p className="mt-3 text-sm text-ink-60">
        Measurements are optional but unlock fit-finder recommendations on every
        product. We recommend measuring with a soft tape in centimeters.
      </p>

      <form action={createDogAction} className="mt-10 grid gap-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Luna" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="breed">Breed</Label>
            <Select id="breed" name="breed" defaultValue="French Bulldog">
              {BREEDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="Mixed">Mixed / Other</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select id="gender" name="gender" defaultValue="female">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="sizeBucket">Size bucket</Label>
          <Select id="sizeBucket" name="sizeBucket" defaultValue="m">
            {SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>

        <fieldset className="grid gap-6 border border-ink-20 p-6 md:grid-cols-4">
          <legend className="eyebrow px-2">Measurements (optional)</legend>
          <div>
            <Label htmlFor="neckCm">Neck (cm)</Label>
            <Input id="neckCm" name="neckCm" type="number" placeholder="34" />
          </div>
          <div>
            <Label htmlFor="chestCm">Chest (cm)</Label>
            <Input id="chestCm" name="chestCm" type="number" placeholder="54" />
          </div>
          <div>
            <Label htmlFor="backCm">Back (cm)</Label>
            <Input id="backCm" name="backCm" type="number" placeholder="32" />
          </div>
          <div>
            <Label htmlFor="weightKg">Weight (kg)</Label>
            <Input id="weightKg" name="weightKg" type="number" placeholder="11" />
          </div>
        </fieldset>

        <Button type="submit" size="lg">
          Save profile
        </Button>
      </form>
    </section>
  );
}
