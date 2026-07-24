# SS26 — The Aloha Capsule (Hawaiian shirts)

Build-ready design spec for Barkenciaga's limited-edition **Spring/Sniffer '26 (SS26)**
Hawaiian-shirt capsule. This document is the source of truth for three desktop
screens — a collection lookbook, a PLP grid, and a hero PDP — plus the 15-piece
product line that populates them.

> **Why a spec and not Figma frames?** The Figma MCP tools (`use_figma`,
> `generate_figma_design`, `search_design_system`) were **not available /
> authenticated** in the environment that produced this doc, so the
> `generate_figma_design` capture pipeline described in [README.md](./README.md)
> could not run. This spec is written in enough detail that the three screens can
> be reproduced 1:1 — either by hand in Figma file `x5YmGrIcNmJdWjJ07kRrMj` or in
> code — using only the shipped tokens. When Figma MCP is reconnected, follow the
> `figma-generate-design` workflow, capture the node ids, and swap the "spec" rows
> in the README table for real node ids.

---

## 1. Design language (do not invent brand values)

Everything below uses only the tokens already shipped in
[`src/app/globals.css`](../src/app/globals.css). No new brand colors, fonts, or
type scales are introduced. The "tropical" feeling of an Aloha capsule is
expressed **through the existing restrained palette** (tonal palm jacquards,
burgundy hibiscus, chartreuse monstera on ink) — never through new saturated
hues.

### Color tokens used

| Role | Token | Hex |
| --- | --- | --- |
| Page background | `bone` / `bone-100` | `#f5f1e8` |
| Raised surfaces | `bone-50` | `#fbf8f2` |
| Hover / pressed surfaces | `bone-200` | `#ece5d3` |
| Primary text | `ink` | `#121110` |
| Body text | `ink-80` | `#26231f` |
| Secondary body text | `ink-65` | `#3f3c36` |
| Borders / dividers **only** | `ink-40` / `ink-20` | `#8d8a83` / `#c9c5bc` |
| Brand accent | `burgundy` | `#6b1e2a` |
| Brand accent (hover) | `burgundy-600` | `#8a2636` |
| Brand accent (safe as text) | `burgundy-ink` | `#4e1520` |
| Decorative highlight **only** | `chartreuse` | `#d6e84a` |

Accessibility rules carried over from the Access + Imagery v1 pass: `ink-40` and
`ink-20` are **borders/hairlines only, never text**; `chartreuse` is decorative
only (use `chartreuse-600` `#b9cc2c` or `ink` for any adjacent text); use
`burgundy-ink` when burgundy must sit as text on bone.

### Type tokens used

| Style | Token / class | Notes |
| --- | --- | --- |
| Hero display | `.display-xl` | Cormorant Garamond, `clamp(3.5rem, 9vw, 7.5rem)`, line-height 1.02 |
| Section display | `.display-lg` | Cormorant Garamond, `clamp(2.25rem, 5vw, 4rem)`, line-height 1.1 |
| Sub-headings | `h2`/`h3` + `font-display` | Cormorant Garamond 500 |
| Eyebrow / labels | `.eyebrow` | Inter, 0.78rem, 0.18em tracking, uppercase, `ink-80` |
| Body | `font-sans` (Inter) | `text-sm` for copy, `text-body-secondary` = `ink-65` |
| Prices / specs | `tabular-nums` | matches PDP + tiles |

### Layout tokens (existing conventions)

- Content max width: `max-w-[1400px]`, horizontal padding `px-6`.
- Sticky header height: `--header-h` (72px).
- Section rhythm: `py-16` / `py-20` / `py-24`, dividers via `border-ink-20`.
- Product tiles: `aspect-[4/5]` (standard), `aspect-[3/4]` (large/hero),
  `border border-ink-20 bg-bone-50`, `group-hover:scale-[1.01]`.
- Primary CTA: `border border-ink bg-ink px-6 py-3 text-[11px] tracking-[0.24em]
  uppercase text-bone hover:bg-ink-80`.
- Secondary CTA: `border border-ink-20 px-6 py-3 text-[11px] tracking-[0.24em]
  uppercase text-ink hover:border-ink`.

---

## 2. The collection object

Mirrors the `SeedCollection` shape in
[`src/db/seed-data.ts`](../src/db/seed-data.ts) so it can drop straight into the
seed catalog if the capsule is ever built in-app. It follows the existing
seasonal-pun convention (`Autumn/Woofer '26` → `Spring/Sniffer '26`).

```ts
{
  id: "col_aloha_capsule_26",
  slug: "aloha-capsule-26",
  name: "The Aloha Capsule",
  tagline: "Fifteen Hawaiian shirts for the discerning dog. Limited edition, SS26.",
  season: "SS26 · Spring/Sniffer '26",
  featured: true,
  limited: true, // marketing flag; surfaced as a "Limited edition" eyebrow (see screens)
  productSlugs: [
    "camp-collar-palm-shirt",
    "hibiscus-silk-camp-shirt",
    "monstera-jacquard-shirt",
    "house-check-aloha-shirt",
    "kennel-club-bowling-shirt",
    "cabana-linen-shirt",
    "surf-stripe-camp-shirt",
    "pineapple-jacquard-shirt",
    "tiki-noir-shirt",
    "resort-rayon-shirt",
    "terrycloth-lanai-shirt",
    "board-walk-coord-shirt",
    "palm-shadow-poplin-shirt",
    "sunset-ombre-shirt",
    "coconut-oxford-camp-shirt",
  ],
}
```

- **Route:** `/collections/aloha-capsule-26` (existing `collections/[slug]` route).
- **Category home for the shirts:** `Couture` (`/c/couture`). The PLP screen (§4)
  reuses the couture category page; the capsule is surfaced there via a "SS26 ·
  Aloha Capsule" filter chip in addition to the existing size/sort filters.

---

## 3. The 15 Hawaiian shirts

Each entry mirrors the `SeedProduct` shape (`slug`, `name`, `subtitle`,
`description`, `categorySlug`, `priceCents`, `palette`, `editorialCopy`,
`careCopy`, `variants`). Prices sit in the couture band ($185–$685) already used
by the catalog. Palettes reuse only tokenized/earth hexes already present in the
seed data. Imagery direction for every piece is in §6.

All 15 are `categorySlug: "couture"`.

| # | Name | slug | Subtitle | Price | Palette (a → b) |
| --- | --- | --- | --- | --- | --- |
| 1 | Camp Collar Palm Shirt | `camp-collar-palm-shirt` | Tonal palm jacquard | $345 | `#eee6cf` → `#bfb18a` |
| 2 | Hibiscus Silk Camp Shirt | `hibiscus-silk-camp-shirt` | Burgundy hibiscus, sand-washed silk | $465 | `#6b1e2a` → `#2a2825` |
| 3 | Monstera Jacquard Shirt | `monstera-jacquard-shirt` | Chartreuse monstera on ink | $385 | `#d6e84a` → `#2a2825` |
| 4 | House Check Aloha Shirt | `house-check-aloha-shirt` | Barkenciaga house check, camp cut | $395 | `#6d4a2f` → `#2a2825` |
| 5 | Kennel Club Bowling Shirt | `kennel-club-bowling-shirt` | Chain-stitch crest, bone rayon | $325 | `#f5f1e8` → `#c9c5bc` |
| 6 | Cabana Linen Shirt | `cabana-linen-shirt` | Garment-dyed Irish linen | $285 | `#eee6cf` → `#8a7f62` |
| 7 | Surf Stripe Camp Shirt | `surf-stripe-camp-shirt` | Woven navy resort stripe | $265 | `#1c3246` → `#0e1a26` |
| 8 | Pineapple Jacquard Shirt | `pineapple-jacquard-shirt` | Brass-tone pineapple weave | $355 | `#b9a06a` → `#6d5a36` |
| 9 | Tiki Noir Shirt | `tiki-noir-shirt` | Ink tiki print, chartreuse ground | $375 | `#121110` → `#4a5c3a` |
| 10 | Resort Rayon Shirt | `resort-rayon-shirt` | Rose floral, liquid rayon | $295 | `#c78692` → `#6b1e2a` |
| 11 | Terrycloth Lanai Shirt | `terrycloth-lanai-shirt` | Undyed cotton terry, short sleeve | $245 | `#eee6cf` → `#bfb18a` |
| 12 | Boardwalk Co-ord Shirt | `board-walk-coord-shirt` | Chartreuse camp shirt, matched short | $335 | `#d6e84a` → `#b9cc2c` |
| 13 | Palm Shadow Poplin Shirt | `palm-shadow-poplin-shirt` | Tonal palm shadow, cotton poplin | $275 | `#dcd0b5` → `#4a4a48` |
| 14 | Sunset Ombré Shirt | `sunset-ombre-shirt` | Burgundy-to-rose dip dye | $685 | `#6b1e2a` → `#c78692` |
| 15 | Coconut Oxford Camp Shirt | `coconut-oxford-camp-shirt` | Coconut buttons, washed oxford | $255 | `#f5f1e8` → `#ddd2b4` |

### Full product records

> Variants use the shipped size buckets `xs · s · m · l · xl` and reuse existing
> color/hex names where possible. Inventory numbers are deliberately low to read
> as "limited edition" (several variants under 6 → triggers the existing
> `<6` low-stock convention noted in `DEMO_SCRIPTS.md` / showroom ticket BRK-31).

**1. Camp Collar Palm Shirt** — `camp-collar-palm-shirt`
- Subtitle: "Tonal palm jacquard"
- Price: `34500`
- Palette: `{ a: "#eee6cf", b: "#bfb18a" }`
- Description: "A boxy camp-collar shirt woven from a tonal palm jacquard — the frond only reveals itself when the light rakes across it. Coconut-look buttons, a single chest patch pocket, and a dropped back hem cut for a four-legged stance."
- Editorial: "The quiet anchor of the Aloha Capsule. Palm, but only if you look twice."
- Care: "Hand wash cold. Dry flat. Do not chew the buttons."
- Variants: `xs/Oat #eee6cf ×6`, `s/Oat ×8`, `m/Oat ×7`, `l/Oat ×4`, `s/Sand #bfb18a ×5`, `m/Sand ×5`

**2. Hibiscus Silk Camp Shirt** — `hibiscus-silk-camp-shirt`
- Subtitle: "Burgundy hibiscus, sand-washed silk"
- Price: `46500`
- Palette: `{ a: "#6b1e2a", b: "#2a2825" }`
- Description: "Sand-washed silk twill printed with an oversized hibiscus in house burgundy over near-black. Camp collar, mother-of-pearl buttons, French-seamed throughout so it drapes over the chest without bulk."
- Editorial: "Photographed on Duchess at golden hour. We used exactly one frame."
- Care: "Dry clean only. Store on a padded hanger."
- Variants: `xs/Burgundy #6b1e2a ×5`, `s/Burgundy ×6`, `m/Burgundy ×5`, `l/Burgundy ×3`, `m/Ink #121110 ×5`, `l/Ink ×3`

**3. Monstera Jacquard Shirt** — `monstera-jacquard-shirt`
- Subtitle: "Chartreuse monstera on ink"
- Price: `38500`
- Palette: `{ a: "#d6e84a", b: "#2a2825" }`
- Description: "A structured jacquard in ink with chartreuse monstera leaves woven — not printed — into the ground, so the highlight never sits as flat color against the coat. Camp collar, reinforced yoke."
- Editorial: "The chartreuse is decorative, as the house rules demand. It has never once been asked to behave as text."
- Care: "Machine wash cold, inside out. Line dry."
- Variants: `s/Ink #121110 ×7`, `m/Ink ×8`, `l/Ink ×5`, `xl/Ink ×3`, `m/Forest #4a5c3a ×4`

**4. House Check Aloha Shirt** — `house-check-aloha-shirt`
- Subtitle: "Barkenciaga house check, camp cut"
- Price: `39500`
- Palette: `{ a: "#6d4a2f", b: "#2a2825" }`
- Description: "The Barkenciaga house check, re-cut as a short-sleeve camp shirt for SS26. Cotton gabardine, matched at every seam, with a boxy resort silhouette that keeps the check square on the back."
- Editorial: "The check was approved, once, by a single whippet's long stare. It has not been re-litigated since."
- Care: "Dry clean only."
- Variants: `s/House Check #6d4a2f ×5`, `m/House Check ×6`, `l/House Check ×4`

**5. Kennel Club Bowling Shirt** — `kennel-club-bowling-shirt`
- Subtitle: "Chain-stitch crest, bone rayon"
- Price: `32500`
- Palette: `{ a: "#f5f1e8", b: "#c9c5bc" }`
- Description: "A liquid bone-rayon bowling shirt with a burgundy chain-stitched 'Barkenciaga Kennel Club' crest over the chest and contrast piping down the placket. Boxy, retro, and cut long over the back."
- Editorial: "Members only. Membership is one dog wide."
- Care: "Hand wash cold. Cool iron on reverse."
- Variants: `xs/Bone #f5f1e8 ×6`, `s/Bone ×9`, `m/Bone ×8`, `l/Bone ×5`, `s/Ink #121110 ×5`, `m/Ink ×5`

**6. Cabana Linen Shirt** — `cabana-linen-shirt`
- Subtitle: "Garment-dyed Irish linen"
- Price: `28500`
- Palette: `{ a: "#eee6cf", b: "#8a7f62" }`
- Description: "Heavyweight Irish linen, garment-dyed to a soft oat and cut as an open cabana shirt with a notch camp collar. Wrinkles on purpose; reads better after the first walk."
- Editorial: "A quiet piece. A correct piece. Wear it creased."
- Care: "Machine wash cold. Tumble low. Embrace the crush."
- Variants: `xs/Oat #eee6cf ×8`, `s/Oat ×10`, `m/Oat ×8`, `l/Oat ×5`, `m/Olive #4a5c3a ×5`, `l/Olive ×4`

**7. Surf Stripe Camp Shirt** — `surf-stripe-camp-shirt`
- Subtitle: "Woven navy resort stripe"
- Price: `26500`
- Palette: `{ a: "#1c3246", b: "#0e1a26" }`
- Description: "A yarn-dyed navy resort stripe on a lightweight cotton-modal blend. Camp collar, breast pocket aligned to the stripe, and a relaxed drop for movement."
- Editorial: "For the commuter dog on holiday. Same dog, better light."
- Care: "Machine wash cold. Line dry."
- Variants: `xs/Navy #1c3246 ×9`, `s/Navy ×12`, `m/Navy ×9`, `l/Navy ×5`, `xl/Navy ×3`

**8. Pineapple Jacquard Shirt** — `pineapple-jacquard-shirt`
- Subtitle: "Brass-tone pineapple weave"
- Price: `35500`
- Palette: `{ a: "#b9a06a", b: "#6d5a36" }`
- Description: "A brass-tone jacquard with a repeating pineapple motif woven at two depths, so it shifts between matte and sheen as the dog moves. Camp collar, horn-look buttons."
- Editorial: "Hospitality, worn. The pineapple means the studio door is open."
- Care: "Dry clean recommended."
- Variants: `s/Brass #b9a06a ×6`, `m/Brass ×7`, `l/Brass ×4`, `m/Onyx #1c1a17 ×5`

**9. Tiki Noir Shirt** — `tiki-noir-shirt`
- Subtitle: "Ink tiki print, chartreuse ground"
- Price: `37500`
- Palette: `{ a: "#121110", b: "#4a5c3a" }`
- Description: "An ink-on-ink tiki print with a single chartreuse ground panel at the yoke — decorative only, never behind text. Sand-washed cotton, camp collar, matte buttons."
- Editorial: "The house's most nocturnal Aloha shirt. Debuted after dark."
- Care: "Machine wash cold, inside out. Do not iron the print."
- Variants: `s/Ink #121110 ×6`, `m/Ink ×7`, `l/Ink ×5`, `xl/Ink ×3`, `m/Forest #4a5c3a ×4`

**10. Resort Rayon Shirt** — `resort-rayon-shirt`
- Subtitle: "Rose floral, liquid rayon"
- Price: `29500`
- Palette: `{ a: "#c78692", b: "#6b1e2a" }`
- Description: "A liquid rayon in a rose-and-burgundy floral drawn from the 2024 silk-scarf archive. Drapes off the shoulder blades; camp collar; tonal buttons."
- Editorial: "The scarf print, finally given sleeves. For dogs who favor drama."
- Care: "Hand wash cold with silk detergent. Dry flat."
- Variants: `xs/Rose #c78692 ×6`, `s/Rose ×8`, `m/Rose ×7`, `l/Rose ×4`, `m/Ink #121110 ×5`

**11. Terrycloth Lanai Shirt** — `terrycloth-lanai-shirt`
- Subtitle: "Undyed cotton terry, short sleeve"
- Price: `24500`
- Palette: `{ a: "#eee6cf", b: "#bfb18a" }`
- Description: "A short-sleeve camp shirt in undyed cotton terry — poolside softness with a house cut. Absorbs the post-swim shake; reads plush without looking casual."
- Editorial: "For the second half of the afternoon, by the water."
- Care: "Machine wash warm. Tumble dry low."
- Variants: `xs/Undyed #eee6cf ×8`, `s/Undyed ×10`, `m/Undyed ×8`, `l/Undyed ×5`

**12. Boardwalk Co-ord Shirt** — `board-walk-coord-shirt`
- Subtitle: "Chartreuse camp shirt, matched short"
- Price: `33500`
- Palette: `{ a: "#d6e84a", b: "#b9cc2c" }`
- Description: "A chartreuse camp shirt sold as a co-ord with a matched board short. The highlight stays decorative — buttons and stitching drop to ink so nothing bright ever functions as text."
- Editorial: "The loudest thing the house will let a dog wear. Once per season."
- Care: "Machine wash cold. Line dry away from direct sun."
- Variants: `s/Chartreuse #d6e84a ×5`, `m/Chartreuse ×6`, `l/Chartreuse ×4`, `m/Ink #121110 ×5`

**13. Palm Shadow Poplin Shirt** — `palm-shadow-poplin-shirt`
- Subtitle: "Tonal palm shadow, cotton poplin"
- Price: `27500`
- Palette: `{ a: "#dcd0b5", b: "#4a4a48" }`
- Description: "Crisp cotton poplin with a tonal palm-shadow print — as if a frond fell across the fabric at noon. Camp collar, clean placket, a shirt that behaves in a boardroom and a garden."
- Editorial: "The most wearable frond in the capsule."
- Care: "Machine wash cold. Warm iron."
- Variants: `xs/Oat #dcd0b5 ×7`, `s/Oat ×9`, `m/Oat ×8`, `l/Oat ×5`, `m/Slate #4a4a48 ×5`

**14. Sunset Ombré Shirt** — `sunset-ombre-shirt`
- Subtitle: "Burgundy-to-rose dip dye"
- Price: `68500`
- Palette: `{ a: "#6b1e2a", b: "#c78692" }`
- Description: "The capsule's grail piece: a hand-dip-dyed silk that graduates from house burgundy at the hem to rose at the collar. Each shirt dyed individually, so no two sunsets match. Numbered at the inner placket."
- Editorial: "Fifteen made. Each one a different evening. Photographed. Extensively."
- Care: "Dry clean by a specialist only. Never fold; hang to store."
- Variants: `s/Sunset #6b1e2a ×3`, `m/Sunset ×4`, `l/Sunset ×2`

**15. Coconut Oxford Camp Shirt** — `coconut-oxford-camp-shirt`
- Subtitle: "Coconut buttons, washed oxford"
- Price: `25500`
- Palette: `{ a: "#f5f1e8", b: "#ddd2b4" }`
- Description: "A washed bone oxford re-cut as a camp shirt with real coconut buttons and a soft-roll collar. The Aloha entry point — plain ground, so the buttons and the cut do the talking."
- Editorial: "The entry point to the capsule. Start here, end up with all fifteen."
- Care: "Machine wash cold. Tumble low. Buttons are food-shaped; supervise accordingly."
- Variants: `xs/Bone #f5f1e8 ×9`, `s/Bone ×12`, `m/Bone ×9`, `l/Bone ×5`, `xl/Bone ×3`, `m/Ecru #ddd2b4 ×5`

**Hero piece for the PDP (§5):** #14 **Sunset Ombré Shirt** — highest price,
one-of-fifteen story, and the only piece that stretches the palette across a
burgundy→rose gradient (still using `burgundy` `#6b1e2a` and `burgundy-300`
`#c78692` only).

---

## 4. Screen A — Collection landing / lookbook

**Purpose:** the editorial front door to the capsule; sells the story, then the
grid.
**Figma frame name:** `SS26 — Aloha Lookbook`
**Route it mirrors:** `/collections/aloha-capsule-26`
**Frame width:** 1440 (desktop), content column `max-w-[1400px]`, `px-6`.

Layout is a superset of the shipped `collections/[slug]` page plus the editorial
treatments from the homepage, so it stays visually native to the site.

### A1 — Global header (reused component)
The sticky `SiteHeader` (`h-[var(--header-h)]`, `border-b border-ink-20`,
`bg-bone/95 backdrop-blur`). Wordmark left; nav
`Couture · Accessories · Eyewear · Footwear · AW26 · Showroom`. **Add a nav item
`SS26`** linking to `/collections/aloha-capsule-26`, styled identically to the
existing `AW26` item (`text-[13px] tracking-[0.2em] uppercase text-ink-60
hover:text-ink`). Right cluster: Search · account · Bag (n).

### A2 — Editorial hero (full-bleed split)
- Container: `border-b border-ink-20`, inner `grid max-w-[1400px] grid-cols-1
  gap-8 px-6 py-24 md:grid-cols-12`.
- **Left (`md:col-span-7`, bottom-aligned):**
  - Eyebrow: `.eyebrow` — `SS26 · LIMITED EDITION` (this is the "limited" flag).
  - `h1.display-xl`:
    > Aloha,
    > *Barkenciaga.*  ← second line in `italic` (matches homepage "For dogs.")
  - Body `mt-6 max-w-xl text-sm text-ink-60`:
    > "Fifteen Hawaiian shirts, cut on the canine-first last and photographed
    > flat in raking light. Palm, hibiscus, and monstera — rendered entirely in
    > the house palette. Spring/Sniffer '26. Made in a run of fifteen per style."
  - CTA row `mt-8 flex flex-wrap gap-3`:
    - Primary (ink) → `Shop the capsule` → jumps to the grid (A5).
    - Secondary (outline) → `Build a dog profile` → `/account/dogs/new` (reuses
      the homepage fit-finder hook).
- **Right (`md:col-span-5`):** `grid grid-cols-2 gap-4` of **four** hero
  `ProductTile`s (`priority`), pieces #14, #2, #3, #1. Standard tile spec
  (`aspect-[4/5]`, `border-ink-20`, `bg-bone-50`). Until photography exists these
  render the `product-tile-gradient` with each piece's `--tile-a/--tile-b`
  palette and a bone caption chip (`brandLine — Couture`).

### A3 — "Limited edition" marquee strip
- `border-b border-ink-20 bg-ink text-bone` band, inner `max-w-[1400px] px-6 py-4`.
- Single centered line, `.eyebrow` scale but `text-bone-300`:
  `FIFTEEN STYLES · FIFTEEN OF EACH · NO RESTOCK · SS26`.
- Uses ink-on-bone inversion already used by the homepage "studio" footer band —
  no new tokens.

### A4 — Lookbook editorial rows (2 alternating rows)
Two full-width story rows, alternating image side, each `mx-auto max-w-[1400px]
px-6 py-20`, split `md:grid-cols-2 gap-10`, divided by `border-ink-20`.
- **Row 1 — "The frond, if you look twice":** left = large `aspect-[3/4]` image
  panel (piece #1 Camp Collar Palm), right = copy block: `.eyebrow` "The weave",
  `h2.display-lg` "Palm, but only if you look twice.", body paragraph on tonal
  jacquards, and an inline text link `Shop palms →`
  (`text-[11px] tracking-[0.24em] uppercase hover:text-burgundy`).
- **Row 2 — "Fifteen sunsets" (image right):** copy left (`.eyebrow` "The grail",
  `h2.display-lg` "No two sunsets match.", body on the dip-dye process, link
  `See the Sunset Ombré →` to the PDP), image right = piece #14.

### A5 — The capsule grid (anchor `#capsule`)
- Section header: `flex items-end justify-between mb-10` — left: `.eyebrow`
  "The capsule", `h2.display-lg` "Fifteen Hawaiian shirts.", subline
  `text-sm text-ink-60`; right: `15 pieces · limited edition`.
- Grid: `grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4` of all 15
  `ProductTile`s. First tile is `large` with `col-span-2 row-span-2` and eyebrow
  `Editor's pick` (matches the shipped collection page's hero-tile pattern);
  assign the large tile to piece #14 (Sunset Ombré).
- Low-stock pieces (any variant `<6`, e.g. #14, #4, #8, #12) show a
  `Limited quantities` eyebrow chip on the tile per showroom ticket BRK-31.

### A6 — Studio band + footer (reused)
- Reuse the homepage "studio" band: `border-t border-ink-20 bg-ink text-bone`,
  `grid md:grid-cols-2`, headline `Designed around the dog, not the human.` with
  a capsule-specific paragraph about flat-lay art direction.
- Global `SiteFooter` (`bg-bone-100`, four columns). Add an
  `Aloha Capsule (SS26)` link under the **Studio** column, mirroring the existing
  `Autumn/Woofer '26` link.

---

## 5. Screen B — Category / PLP grid

**Purpose:** the shoppable grid with filters; where the shirts live inside the
catalog.
**Figma frame name:** `SS26 — Aloha PLP (Couture)`
**Route it mirrors:** `/c/couture` scoped to the capsule (adds a capsule filter
chip to the shipped category page). Frame width 1440.

Reuses the shipped `c/[category]` layout exactly — do not redesign the shell.

### B1 — Header
Same `SiteHeader` as A1, with `Couture` active (`text-ink`).

### B2 — Category masthead
- `border-b border-ink-20`, inner `flex max-w-[1400px] flex-col gap-6 px-6 py-16
  md:flex-row md:items-end md:justify-between`.
- Left: `.eyebrow` "Category", `h1.display-lg` "Couture", subline
  `mt-3 max-w-xl text-sm text-ink-60` = the existing couture `heroCopy`.
- Right: `text-xs text-ink-60` piece count, e.g. `15 pieces available` when the
  capsule filter is active (otherwise the full couture count).

### B3 — Filter rail + grid (two-column)
- Section: `mx-auto flex max-w-[1400px] gap-10 px-6 py-10`.
- **Left `aside` (`hidden w-48 md:block`):**
  - **New: Capsule filter** at the top of the rail — `.eyebrow` "Capsule", then
    two links styled like the existing size links:
    `All couture` and `SS26 · Aloha Capsule` (active = `font-medium`, inactive =
    `text-ink-60 hover:text-ink`). Wired as `?capsule=aloha-ss26` on the existing
    `qs()` querystring merger — no new layout, just one more filter group above
    "Size".
  - Existing **Size** group: `All sizes · XS · S · M · L · XL`.
  - Existing **Sort** group: `Featured · Newest · Price ↑ · Price ↓`.
- **Right (`flex-1`):** `grid grid-cols-2 gap-6 md:grid-cols-3` of the 15
  `ProductTile`s (standard `aspect-[4/5]`). Empty state (if a size filter clears
  the grid) reuses the shipped dashed-border "Nothing in this size." panel.

### B4 — Footer
Global `SiteFooter` (reused, with the new SS26 link from A6).

**Filter behavior (for a code build):** `capsule=aloha-ss26` intersects the
category product set with `collection_products` for `aloha-capsule-26`. Combines
with `size` and `sort` via the existing `qs()` merge in
`src/app/c/[category]/page.tsx`. No schema change is required beyond the
`collection_products` join that already exists.

---

## 6. Screen C — Hero PDP

**Purpose:** the conversion page for the grail piece.
**Figma frame name:** `SS26 — Aloha PDP (Sunset Ombré)`
**Route it mirrors:** `/p/sunset-ombre-shirt`. Frame width 1440.

Reuses the shipped `p/[slug]` layout (12-col split, `max-w-[1400px]`).

### C1 — Header + breadcrumb
- `SiteHeader` (A1).
- Breadcrumb `mx-auto max-w-[1400px] px-6 py-6 text-xs text-ink-60`:
  `Home / Couture / Sunset Ombré Shirt` (last crumb `text-ink`).
- **Capsule chip (fixes TECH_DEBT item 4 for this page):** directly under the
  breadcrumb, a small `Badge`-style link
  `SS26 · Aloha Capsule` → `/collections/aloha-capsule-26`. Use the `Badge`
  component with `tone="chartreuse"` for the decorative dot only, text in `ink`.

### C2 — Gallery (left, `md:col-span-7`)
- Primary image: `relative aspect-[4/5] overflow-hidden border border-ink-20
  bg-bone-50`. With photography → `next/image` object-cover; until then →
  `product-tile-gradient` with `--tile-a #6b1e2a` / `--tile-b #c78692` (the
  sunset gradient) and a bone caption chip `Barkenciaga — Couture`.
- Thumb row `mt-6 grid grid-cols-4 gap-3`: four swatch squares
  (`aspect-square border border-ink-20`) using each variant `colorHex`, exactly
  as the shipped PDP renders variant swatches.

### C3 — Buy column (right, `md:col-span-5`, `flex flex-col gap-8`)
- Title block: `.eyebrow` brandLine "Barkenciaga Couture", `h1.display-lg`
  "Sunset Ombré Shirt", subtitle `Burgundy-to-rose dip dye`, price
  `mt-6 text-2xl font-display tabular-nums` = `$685`.
- Description paragraph `text-sm leading-relaxed text-ink-80`.
- **Limited-edition callout:** a `border-t border-ink-20 pt-6` block with
  `.eyebrow` "Limited edition" and copy "Numbered 1–15 at the inner placket. No
  restock." (uses the `danger`/low-stock convention only as an eyebrow, not a new
  color).
- **Fit finder (reused):** when an active dog exists, `Badge tone="chartreuse"`
  "Fit finder" + the recommended-size sentence, identical to the shipped PDP.
- `VariantSelector` (reused component) — size buttons from `xs·s·m·l·xl` present
  in the variants, color options, add-to-bag.
- "From the studio" block (`border-t border-ink-20 pt-6`, `.eyebrow` +
  italic `editorialCopy`).
- "Care" block (`border-t border-ink-20 pt-6`, `.eyebrow` + `careCopy`).

### C4 — You may also like (new, optional row)
- `mx-auto max-w-[1400px] px-6 py-16` with `.eyebrow` "More from the capsule" and
  a `grid grid-cols-2 gap-6 md:grid-cols-4` of four sibling `ProductTile`s
  (#2, #3, #10, #1). Matches the homepage featured-grid density.

### C5 — Footer
Global `SiteFooter` (reused).

---

## 7. Imagery / art direction

Follows the flat-lay reference established on the Figma "Access + Imagery v1" page
(`8-2`) that drives `public/products/*.webp`.

- **Format & path:** one `webp` per shirt at `public/products/<slug>.webp`
  (e.g. `public/products/sunset-ombre-shirt.webp`), sized for the `aspect-[4/5]`
  tile / gallery. Filenames match the slugs in §3.
- **Composition:** flat-lay, shirt buttoned and squared to the frame, camp collar
  open, sleeves laid symmetrically, shot top-down on a `bone` (`#f5f1e8`) sweep.
- **Light:** single soft key from upper-left at ~35° to rake the jacquards
  (tonal palm / monstera / pineapple only reveal under raking light).
- **Palette discipline:** props and background stay within bone/ink neutrals.
  The only saturated element permitted in frame is the garment itself, and only
  in house burgundy / chartreuse / earth tones. **No new brand hues** enter
  through styling, gels, or props.
- **Placeholder until shot:** the `product-tile-gradient` with each piece's
  `palette.a/palette.b` (already specified per product in §3) stands in for
  photography, exactly as the current catalog does for unshot SKUs.
- **Hero (Sunset Ombré):** additionally shoot a single hanging shot on a padded
  bone hanger to show the burgundy→rose graduation vertically; use it as the PDP
  primary once available.

---

## 8. Build checklist (when reproducing)

In Figma (once MCP is reconnected — follow `figma-generate-design`):
1. Create three pages/frames named `SS26 — Aloha Lookbook`, `SS26 — Aloha PLP
   (Couture)`, `SS26 — Aloha PDP (Sunset Ombré)` in file `x5YmGrIcNmJdWjJ07kRrMj`.
2. Bind fills/strokes/spacing to the existing Barkenciaga variables (bone/ink/
   burgundy/chartreuse ramps); apply the display/eyebrow text styles — never
   hardcode hexes that a token already covers.
3. Reuse the existing `ProductTile`, `SiteHeader`, `SiteFooter`, `Badge`,
   `VariantSelector` component instances rather than redrawing them.
4. Run `generate_figma_design` against a locally-served build of the three routes
   for pixel-accurate spacing, transfer image hashes, then delete the capture.
5. Capture the resulting node ids and record them in
   [README.md](./README.md).

In code (if the capsule is ever shipped in-app):
1. Add the collection + 15 products from §2–§3 to `src/db/seed-data.ts`.
2. Add the `SS26` nav item (header) and the `Aloha Capsule (SS26)` footer link.
3. Add the `?capsule=` filter group to `src/app/c/[category]/page.tsx`.
4. Surface capsule membership on the PDP (closes TECH_DEBT item 4).
