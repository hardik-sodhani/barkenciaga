# Sign-in and dog profiles

Sign-in uses seeded emails with no passwords. A customer account stores dog profiles; choosing a dog personalizes the header and PDP fit finder.

## Sub-features

- `sign-in-page` shows both demo emails and an email form.
- `sign-in-customer` authenticates `hello@barkenciaga.test` and lands on account.
- `dogs-list` shows Luna and Atlas with `Shop for <name>`.
- `active-dog` sets header `Shopping for Atlas` (or Luna).
- `fit-finder` on a PDP shows `Fit finder` and a recommended size for that dog.
- `sign-in-admin` with `studio@barkenciaga.test` reveals header `Admin`.
- `sign-out` returns to a signed-out header `Sign in`.

## How to get to it (user POV)

- Header `Sign in` → `/sign-in`.
- Submit email + `Sign in`.
- Account `Hello, <name>.` and dogs at `/account` and `/account/dogs`.
- `Shop for Atlas` / `Shop for Luna` on those pages.
- Header `Sign out` (button).
- `/account` and `/admin` redirect to `/sign-in` when unauthenticated / non-admin.

## Driving it with fetch.sh / browser

Preconditions:

- Doctor passes.
- Mutations need a browser (or cookie) session. GET `/sign-in` is enough to prove the form exists.

- **Sign-in GET.** Run `scripts/fetch.sh "/sign-in" artifacts/auth/sign-in`. HTML contains `Sign in.`, `hello@barkenciaga.test`, `studio@barkenciaga.test`, input `id="email"` defaulting to the customer email, and button `Sign in`.
- **Customer session (browser).** Submit the form with `hello@barkenciaga.test`. Land on `/account`. Heading `Hello,` plus the seeded customer name; email visible. Dogs include `Luna` and `Atlas`.
- **Shop for Atlas (browser).** On `/account/dogs` or `/account`, choose `Shop for Atlas`. Header shows `Shopping for Atlas`. Open `/p/tech-parka` or `/p/monogram-quilted-coat`. Badge `Fit finder` and copy `recommended for Atlas` (size depends on `recommendSizeForDog` and available sizes).
- **Admin session (browser).** Sign out, sign in as `studio@barkenciaga.test`. Header includes `Admin`. GET `/admin` in that session contains `Ops` and `Studio · admin`. Unauthenticated GET `/admin` redirects to `/sign-in`.
- **Proof.** Keep `artifacts/auth/sign-in.html` for the public form. For session proof, capture `/account` HTML or a screenshot showing `Hello,` and a dog name, plus a PDP screenshot/HTML with `Fit finder` after `Shop for Atlas`.

## Gotchas

- There is no password field. `fetch.sh` cannot complete sign-in (Server Action POST).
- Unauthenticated `/account` redirects to `/sign-in` — a 307 without the account heading is expected.
- Fit finder is absent for guests. Size highlight uses `recommendedSize` on the variant selector (`M recommended for Atlas` style copy when a dog is active).
- Do not delete seeded dogs on an adopted instance.
