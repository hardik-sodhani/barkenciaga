import { redirect } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { getSession } from "@/lib/session";
import { BREEDS } from "@/lib/dogs";
import { createDogAction } from "@/server/actions/dogs";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

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
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(commonStyles.eyebrow, styles.eyebrow)}>Onboarding</div>
      <h1 {...stylex.props(commonStyles.displayLg)}>Tell us about the dog.</h1>
      <p {...stylex.props(styles.copy)}>
        Measurements are optional but unlock fit-finder recommendations on every
        product. We recommend measuring with a soft tape in centimeters.
      </p>

      <form action={createDogAction} {...stylex.props(styles.form)}>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Luna" />
        </div>

        <div {...stylex.props(styles.twoColGrid)}>
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

        <fieldset {...stylex.props(styles.measurementsFieldset)}>
          <legend {...stylex.props(commonStyles.eyebrow, styles.legend)}>
            Measurements (optional)
          </legend>
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

const styles = stylex.create({
  container: {
    marginInline: "auto",
    maxWidth: "42rem",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
  },
  eyebrow: { marginBottom: "0.5rem" },
  copy: {
    marginTop: "0.75rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  form: {
    marginTop: "2.5rem",
    display: "grid",
    gap: "1.5rem",
  },
  twoColGrid: {
    display: "grid",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  measurementsFieldset: {
    display: "grid",
    gap: "1.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    padding: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  legend: {
    paddingInline: "0.5rem",
  },
});
