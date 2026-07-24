# Barkenciaga Figma

The Figma file mirrors the live site screen-for-screen and is generated via Figma&rsquo;s `generate_figma_design` capture pipeline.

## File

<https://www.figma.com/design/x5YmGrIcNmJdWjJ07kRrMj>

## Pages / frames

Each screen is a separate page in the file. Navigate via the left sidebar.

| Screen | Route | Figma node |
| --- | --- | --- |
| Home (editorial) | `/` | page 1 |
| Category (PLP) | `/c/couture` | `2-2` |
| Product (PDP) | `/p/monogram-quilted-coat` | `6-2` |
| Collection | `/collections/autumn-woofer-26` | `3-2` |
| Cart | `/cart` | `4-2` |
| Showroom | `/showroom` | `5-2` |
| Access + Imagery v1 | &mdash; | `8-2` (design-system audit) |
| SS26 &mdash; Aloha Lookbook | `/collections/aloha-capsule-26` | spec &mdash; [ss26-aloha.md &sect;4](./ss26-aloha.md#4-screen-a--collection-landing--lookbook) |
| SS26 &mdash; Aloha PLP (Couture) | `/c/couture` (capsule filter) | spec &mdash; [ss26-aloha.md &sect;5](./ss26-aloha.md#5-screen-b--category--plp-grid) |
| SS26 &mdash; Aloha PDP (Sunset Ombr&eacute;) | `/p/sunset-ombre-shirt` | spec &mdash; [ss26-aloha.md &sect;6](./ss26-aloha.md#6-screen-c--hero-pdp) |

### SS26 &mdash; The Aloha Capsule (Hawaiian shirts)

A limited-edition summer capsule of 15 high-fashion Hawaiian shirts for dogs.
The three desktop screens above (collection lookbook, category/PLP grid, hero
PDP) are fully specified in [ss26-aloha.md](./ss26-aloha.md), reusing only the
shipped Barkenciaga tokens (no invented brand values). Figma node ids are
**pending**: the Figma MCP tools (`use_figma` / `generate_figma_design` /
`search_design_system`) were not available/authenticated when this was authored,
so the capture pipeline could not run. When MCP is reconnected, build the three
frames per that spec, capture their node ids, and replace the `spec` pointers in
the table above.

### Access + Imagery v1

A dedicated page with the revised token set, the WCAG-audited contrast ratios
for every text-on-bone pairing, and the flat-lay art direction reference that
drives the product imagery under `public/products/`. This is the source of
truth for the accessibility pass documented in [TECH_DEBT.md](../TECH_DEBT.md).

## Regenerating

The capture script is injected via the `NEXT_PUBLIC_FIGMA_CAPTURE` env flag so it doesn&rsquo;t ship in production by accident:

```bash
echo "NEXT_PUBLIC_FIGMA_CAPTURE=1" > .env.local
pnpm dev
```

Then, via the Figma MCP in Cursor:

1. Call `generate_figma_design` with `outputMode: existingFile` and this file&rsquo;s key (`x5YmGrIcNmJdWjJ07kRrMj`).
2. Open the returned URL-with-hash in a browser. The capture script submits automatically.
3. Poll the capture ID until `completed`.

## Design system tokens

The shipped CSS variables in [`src/app/globals.css`](../src/app/globals.css) are the source of truth. Key tokens to port into a proper Figma library if you grow this beyond captures:

- Neutrals: `bone`, `bone-50...300`, `ink`, `ink-20/40/65/80` (`ink-40` is borders-only; use `ink-65` for body-secondary text)
- Brand: `burgundy`, `burgundy-600`, `burgundy-300`, `burgundy-ink` (safe-for-text), `chartreuse` (decorative-only), `chartreuse-600`
- Focus: 2px `burgundy` outline with 2px offset on `:focus-visible`
- Type: `--font-display` (Cormorant Garamond), `--font-sans` (Inter), `--font-mono` (JetBrains Mono)
- Scale: `display-xl` (line-height 1.02), `display-lg` (line-height 1.1), `eyebrow` (0.78rem / 0.18em tracking / `ink-80`)

## Notes

The initial captures are raw frame layouts. To move them to a true component-driven library, use the Figma MCP&rsquo;s `use_figma` + `search_design_system` workflow to rebuild each screen from design system components and variables.
