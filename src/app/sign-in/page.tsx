import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { signInAction } from "@/server/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SignInPage() {
  const session = await getSession();
  if (session.userId) redirect("/account");

  return (
    <section className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 md:grid-cols-2">
      <div>
        <div className="eyebrow mb-3">Client portal</div>
        <h1 className="display-lg">Sign in.</h1>
        <p className="mt-4 max-w-md text-sm text-ink-60">
          Barkenciaga accounts store dog profiles, past orders, and
          measurement-based size recommendations. No passwords for the demo -
          use one of the two seeded accounts.
        </p>
        <div className="mt-8 space-y-2 text-sm">
          <div className="border border-ink-20 bg-bone-50 p-4">
            <div className="eyebrow mb-1">Customer</div>
            <code className="font-mono text-xs">hello@barkenciaga.test</code>
            <div className="mt-1 text-xs text-ink-60">Has 2 dogs: Luna, Atlas</div>
          </div>
          <div className="border border-ink-20 bg-bone-50 p-4">
            <div className="eyebrow mb-1">Studio / admin</div>
            <code className="font-mono text-xs">studio@barkenciaga.test</code>
            <div className="mt-1 text-xs text-ink-60">Access to /admin</div>
          </div>
        </div>
      </div>

      <form action={signInAction} className="flex flex-col justify-center gap-6 border border-ink-20 bg-bone-50 p-8">
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
        <p className="text-[11px] tracking-[0.18em] uppercase text-ink-65">
          Demo only · No password required
        </p>
      </form>
    </section>
  );
}
