<!-- orchestrate handoff
task: collection-catalog-and-imagery
branch: `orch/hawaiian-ss26/collection-catalog-and-imagery` (draft PR: https://github.com/hardik-sodhani/barkenciaga/pull/23)
agentId: bc-71c8dcee-18b2-4364-8403-c90695a54bec
runId: run-04e39c49-8da7-4318-ad88-a3bbbf710e39
resultStatus: finished
finishedAt: 2026-07-24T21:01:37.491Z
-->

The diff is clean — only the intended files. Everything is verified end-to-end and the draft PR is open. Here is my handoff.

## Status
success

## Branch
`orch/hawaiian-ss26/collection-catalog-and-imagery` (draft PR: https://github.com/hardik-sodhani/barkenciaga/pull/23)

## What I did
- **Imagery** — Generated 17 distinct high-fashion editorial flat-lay product shots of dog aloha shirts with `GenerateImage`, matching the existing house art direction (top-down garment on warm bone linen, soft shadow), then converted them to web-optimized WebP via `ffmpeg` and saved under `public/products/hawaiian/` with kebab-case slugs (~4.8 MB total, 170–382 KB each).
- **`src/db/seed-data.ts`** — Added the limited-edition `col_ss26_aloha` `SeedCollection` (`slug: ss26-aloha`, `season: "SS26 · Limited Edition"`, `featured: true`) plus 17 new `SeedProduct` entries in the `couture` category, each with editorial copy, luxury pricing, a print-matched palette, `imagePath` into `public/products/hawaiian/`, and realistic size/color variants using the existing `xs–xl` union.
- **`src/app/page.tsx`** — Added a prominent dark "Aloha Atelier" limited-edition band below the hero (product tiles framed on light cards for readability on ink).
- **`src/components/layout/site-header.tsx`** — Added a burgundy `SS26 Aloha` nav link.
- **`src/app/showroom/page.tsx`** — Added a jump-off card and a canned demo flow.
- **`DEMO_SCRIPTS.md`** — Added the SS26 Aloha demo script.
- Reused only existing brand tokens; no schema or route changes needed.

## Measurements
- New Hawaiian shirt images under `public/products/hawaiian/`: 0 → 17
- New `SeedProduct` entries: 0 → 17
- New `SeedCollection` entries: 0 → 1
- Collection page product tiles at `/collections/ss26-aloha`: 0 → 17
- `pnpm lint`: 0 errors → 0 errors (2 pre-existing warnings unchanged)
- `pnpm build`: succeeds → succeeds
- Route HTTP status (`/`, `/collections/ss26-aloha`, `/p/hibiscus-atelier-shirt`, `/c/couture`): 200 == 200

## Verification
live-ui-verified

- `pnpm lint` (0 errors) and `pnpm build` both pass. Ran `pnpm dev` from a clean DB (`rm -rf .data`); all four routes return 200, raw and Next-optimized image URLs return 200, and the collection HTML renders all 17 shirt tiles. Visually walked the home band, collection page, a PDP, and the `/c/couture` PLP on a ~1440px viewport — real distinct shirt photos render everywhere, no broken images. Artifacts: walkthrough video `ss26_aloha_collection_walkthrough.mp4` + screenshots of the home band, collection page (top + scrolled), PDP, and couture PLP.

## Notes, concerns, deviations, findings, thoughts, feedback
- I shipped **17** shirts (exceeds the 15 minimum) — the two neutral/tonal prints (`pineapple-jacquard` satin-gold vs `palm-damask-resort` matte linen) are the closest pair but are distinguishable by finish/color; all others are clearly unique prints.
- Chose to reuse the existing `couture` category rather than adding a new one, since Hawaiian shirts are apparel and this avoids touching nav/home category-strip conventions. The capsule is still fully browsable via the collection page, home band, header link, and showroom.
- The PR head branch does not use the `cursor/` prefix (the orchestrator required this exact `orch/...` name), so I created the PR with `skip_branch_prefix_check`.
- A video reviewer initially thought the collection showed only 5 shirts — that was just the recorded scroll depth; the rendered HTML and the scrolled screenshot confirm all 17 tiles. `pnpm build` emits benign `ErrnoError errno 20` lines from PGlite during static generation (pre-existing; build still exits 0).
- Dev server left running in tmux session `aloha-dev`. `.orchestrate/` was not present in the tree and is not in the diff.

## Suggested follow-ups
- Mirror the new PDP/collection into the Figma file (per `figma/README.md`) for design parity.
- Consider a dedicated `DEMO-TODO` around surfacing collection-membership chips on aloha PDPs (there's an existing TODO in `/p/[slug]` for this).
- If a permanent "Shirts" category is desired later, migrate the capsule out of `couture` and add it to the nav + home category strip.