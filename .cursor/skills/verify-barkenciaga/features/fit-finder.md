# Fit finder

Fit finder lets a signed-in customer activate a dog profile so the header shows who they are shopping for and PDPs recommend a size for that dog.

## Sub-features

- `fit-sign-in` signs in as `hello@barkenciaga.test` with no password.
- `fit-dogs` lists Luna and Atlas on `/account/dogs`.
- `fit-activate-atlas` sets Atlas active via `Shop for Atlas`.
- `fit-pdp` shows `L recommended for Atlas` on a PDP such as `/p/tech-parka`.

## How to get to it (user POV)

- Choose header `Sign in`, or open `/sign-in`.
- After sign-in, open Account then dog profiles, or `/account/dogs`.
- Choose `Shop for Atlas`.
- Open a PDP (`/p/tech-parka` or `/p/monogram-quilted-coat`).

## Driving it with Cursor browser / capture-http

Preconditions:

- Doctor is green at `http://127.0.0.1:3317`.
- Signed out (header shows `Sign in`, not `Alex Rivera`).
- Seeded customer still has dogs **Luna** (French Bulldog, M) and **Atlas** (Standard Poodle, L).

- **Sign in.** Open `/sign-in`. Heading `Sign in.` Email field defaults to `hello@barkenciaga.test`. Choose button `Sign in`. Land on `/account` with `Hello, Alex Rivera.`
- **Dogs.** Open `/account/dogs`. Heading `Dog profiles`. Cards for `Luna` and `Atlas` are visible.
- **Activate Atlas.** Choose `Shop for Atlas` (or `Currently shopping for` if already active). Header shows `Shopping for Atlas` with a chartreuse dot.
- **PDP.** Open `/p/tech-parka`. A Fit finder badge is present and copy includes `L recommended for Atlas` (or `recommended for Atlas` with `L` nearby). Size `L` is the selected or outlined recommendation.
- **Proof.** Screenshot account hello state, header `Shopping for Atlas`, and the PDP recommendation. HTML GET without the session cookie cannot prove this feature.

## Gotchas

- `/account` and `/account/dogs` redirect to `/sign-in` when logged out. A 307 on those URLs from `capture-http.sh` is not a fit-finder pass.
- Studio admin (`studio@barkenciaga.test`) is the wrong user; that account has no Atlas.
- Recommendation text on the PDP body and the size-row (`L recommended for Atlas`) can both appear; either is valid if Atlas is named and L is recommended.
- `Delete` on a dog card destroys seed data for later demos. Do not click it during verification.
