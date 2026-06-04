import { Input, Label } from "@/components/ui/input";

type AddressDefaults = {
  label?: string | null;
  line1?: string;
  line2?: string | null;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
};

export function AddressFormFields({
  defaults = {},
  lockDefault = false,
}: {
  defaults?: AddressDefaults;
  lockDefault?: boolean;
}) {
  return (
    <div className="grid gap-6">
      <div>
        <Label htmlFor="label">Label (optional)</Label>
        <Input
          id="label"
          name="label"
          placeholder="Home, Studio, …"
          defaultValue={defaults.label ?? ""}
          maxLength={60}
        />
      </div>

      <div>
        <Label htmlFor="line1">Street address</Label>
        <Input
          id="line1"
          name="line1"
          required
          placeholder="123 Bond Street"
          defaultValue={defaults.line1 ?? ""}
        />
      </div>

      <div>
        <Label htmlFor="line2">Apartment, suite (optional)</Label>
        <Input id="line2" name="line2" defaultValue={defaults.line2 ?? ""} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required defaultValue={defaults.city ?? ""} />
        </div>
        <div>
          <Label htmlFor="region">State / Region</Label>
          <Input
            id="region"
            name="region"
            required
            defaultValue={defaults.region ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            required
            defaultValue={defaults.postalCode ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            required
            maxLength={2}
            defaultValue={defaults.country ?? "US"}
          />
        </div>
      </div>

      {lockDefault ? (
        <input type="hidden" name="isDefault" value="true" />
      ) : (
        <label className="flex items-center gap-3 text-sm text-ink-80">
          <input
            type="checkbox"
            name="isDefault"
            defaultChecked={defaults.isDefault ?? false}
            className="h-4 w-4 border-ink-20 accent-ink"
          />
          Set as default shipping address
        </label>
      )}
    </div>
  );
}
