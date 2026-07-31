import { redirect } from "next/navigation";
import * as stylex from "@stylexjs/stylex";
import { getSession } from "@/lib/session";
import { signInAction } from "@/server/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { commonStyles } from "@/styles/common.stylex";
import { tokens } from "@/styles/tokens.stylex";

export default async function SignInPage() {
  const session = await getSession();
  if (session.userId) redirect("/account");

  return (
    <section {...stylex.props(styles.container)}>
      <div>
        <div {...stylex.props(commonStyles.eyebrow, styles.eyebrow)}>
          Client portal
        </div>
        <h1 {...stylex.props(commonStyles.displayLg)}>Sign in.</h1>
        <p {...stylex.props(styles.copy)}>
          Barkenciaga accounts store dog profiles, past orders, and
          measurement-based size recommendations. No passwords for the demo -
          use one of the two seeded accounts.
        </p>
        <div {...stylex.props(styles.accountList)}>
          <div {...stylex.props(styles.accountCard)}>
            <div {...stylex.props(commonStyles.eyebrow, styles.accountEyebrow)}>
              Customer
            </div>
            <code {...stylex.props(styles.accountCode)}>hello@barkenciaga.test</code>
            <div {...stylex.props(styles.accountMeta)}>Has 2 dogs: Luna, Atlas</div>
          </div>
          <div {...stylex.props(styles.accountCard)}>
            <div {...stylex.props(commonStyles.eyebrow, styles.accountEyebrow)}>
              Studio / admin
            </div>
            <code {...stylex.props(styles.accountCode)}>studio@barkenciaga.test</code>
            <div {...stylex.props(styles.accountMeta)}>Access to /admin</div>
          </div>
        </div>
      </div>

      <form action={signInAction} {...stylex.props(styles.form)}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            defaultValue="hello@barkenciaga.test"
          />
        </div>
        <Button type="submit" size="lg">
          Sign in
        </Button>
        <p {...stylex.props(styles.note)}>
          Demo only · No password required
        </p>
      </form>
    </section>
  );
}

const styles = stylex.create({
  container: {
    marginInline: "auto",
    maxWidth: "1200px",
    display: "grid",
    gap: "3rem",
    paddingInline: "1.5rem",
    paddingBlock: "6rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  eyebrow: { marginBottom: "0.75rem" },
  copy: {
    marginTop: "1rem",
    maxWidth: "28rem",
    fontSize: "0.875rem",
    color: tokens.ink60,
  },
  accountList: {
    marginTop: "2rem",
    display: "grid",
    gap: "0.5rem",
    fontSize: "0.875rem",
  },
  accountCard: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "1rem",
  },
  accountEyebrow: { marginBottom: "0.25rem" },
  accountCode: {
    fontFamily: tokens.fontMono,
    fontSize: "0.75rem",
  },
  accountMeta: {
    marginTop: "0.25rem",
    fontSize: "0.75rem",
    color: tokens.ink60,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: tokens.ink20,
    backgroundColor: tokens.bone50,
    padding: "2rem",
  },
  note: {
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: tokens.ink65,
  },
});
