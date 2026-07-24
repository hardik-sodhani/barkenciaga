<!-- orchestrate handoff
task: figma-presentation-screens
branch: orch/hawaiian-ss26/figma-presentation-screens
agentId: bc-95a6bffa-05b8-4d1d-a130-af6c56f340a7
runId: run-c9fdf30a-a026-4883-8162-4f95cdc8ca0a
resultStatus: finished
finishedAt: 2026-07-24T20:38:24.329Z
-->

All changes are in place and the draft PR is open. Here is my handoff.

## Status
success

## Branch
`orch/hawaiian-ss26/figma-presentation-screens`

## What I did
- Explored the codebase to extract the real design system: `src/app/globals.css` (bone/ink/burgundy/chartreuse tokens, Cormorant Garamond + Inter, display/eyebrow scales), the shipped screen layouts (`page.tsx`, `c/[category]`, `p/[slug]`, `collections/[slug]`), the `ProductTile`/`SiteHeader`/`SiteFooter`/`Badge`/`VariantSelector` components, and `seed-data.ts` conventions.
- Confirmed Figma MCP (`use_figma` / `generate_figma_design` / `search_design_system`) is **not available/authenticated** here — only Vercel's importer is present, and no Figma MCP namespace exists. Took the documented fallback path.
- Authored **`figma/ss26-aloha.md`** (new, ~470 lines): the `aloha-capsule-26` collection object, **15 fully-specified Hawaiian shirts** (names/slugs/subtitles/prices/palettes/copy/variants matching `SeedProduct`), and three build-ready desktop screens — **(A)** SS26 Aloha lookbook, **(B)** category/PLP grid with a capsule filter, **(C)** hero PDP for the Sunset Ombré grail piece — plus token tables, imagery/art direction, and a reproduction checklist. Uses only shipped tokens; no invented brand values.
- Updated **`figma/README.md`**: added the three screens to the Pages/frames table (linking to spec sections, node ids marked pending) and a capsule note stating the MCP-auth limitation.
- Committed, pushed, and opened draft PR **#22** against `main` (overrode the `cursor/` prefix check since the task mandated this exact branch name). Kept `.orchestrate/` out of the diff (nothing from it was staged).

## Measurements
- Desktop screens designed (lookbook + PLP + PDP): 0 → 3
- Hawaiian shirts specified: 0 → 15 (>= 15 required)
- Figma node ids captured: 0 == 0 (MCP unavailable)
- `figma/README.md` screen rows: 7 → 10

## Verification
not-verified

Deliverable is a design/documentation spec under `figma/` — no runnable code path or UI to exercise. I sanity-checked that the README table's GitHub anchor links resolve to the spec's section headers, but there is no automated or live test for a spec doc.

## Notes, concerns, deviations, findings, thoughts, feedback
- **Figma MCP auth was unavailable** in this environment, so acceptance criterion #2 was met via the spec-doc fallback (explicitly permitted by the task), not via real Figma frames/node ids. A follow-up run with Figma MCP connected should build the three frames per `figma/ss26-aloha.md` and capture node ids.
- I mapped the capsule into the existing catalog rather than inventing structure: shirts sit in the **Couture** category, the collection follows the seasonal-pun convention (`Autumn/Woofer '26` → `Spring/Sniffer '26`), and the PLP reuses `/c/couture` with a new `?capsule=aloha-ss26` filter group. This keeps the screens native to the shipped UI.
- Palette discipline: "Hawaiian" is rendered entirely through existing tokens (tonal palm jacquards, burgundy hibiscus, chartreuse-as-decoration-only), respecting the Access + Imagery v1 accessibility rules (chartreuse never text, `ink-40/20` borders-only, `burgundy-ink` for burgundy text).
- No UI/interactive bug was involved, so no screen recording applies.

## Suggested follow-ups
- Re-run this task with Figma MCP authenticated to create the three frames in `x5YmGrIcNmJdWjJ07kRrMj` and backfill node ids in `figma/README.md`.
- If shipping in-app: seed the collection + 15 products (`src/db/seed-data.ts`), add the `SS26` header nav + footer link, add the `?capsule=` filter to `src/app/c/[category]/page.tsx`, and surface capsule membership on the PDP (closes TECH_DEBT item 4).
- Produce the 15 `public/products/<slug>.webp` flat-lays per the §7 art direction to replace the gradient placeholders.