/**
 * Barkenciaga seed data - the editorial catalog.
 * ~35 products across 4 categories, styled with editorial names and gradient
 * palettes in place of photography. Demo-first: every product should be
 * mentionable and memorable.
 */

export type SeedCategory = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  heroCopy: string;
  sortOrder: number;
};

export type SeedCollection = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  season: string;
  featured: boolean;
  productSlugs: string[];
};

export type SeedProduct = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  categorySlug: string;
  priceCents: number;
  palette: { a: string; b: string };
  /** Optional explicit image path. When omitted, the seeder defaults to `/products/<slug>.webp`. */
  imagePath?: string | null;
  editorialCopy: string;
  careCopy: string;
  variants: Array<{
    size: "xs" | "s" | "m" | "l" | "xl";
    color: string;
    colorHex: string;
    inventory: number;
  }>;
};

export const categories: SeedCategory[] = [
  {
    id: "cat_couture",
    slug: "couture",
    name: "Couture",
    tagline: "Outerwear, knitwear, tailored.",
    heroCopy:
      "From the quilted coat to the destructed cashmere, Couture is Barkenciaga at its most editorial.",
    sortOrder: 1,
  },
  {
    id: "cat_accessories",
    slug: "accessories",
    name: "Accessories",
    tagline: "Collars, bandanas, harnesses.",
    heroCopy:
      "Finish every walk. Hand-finished hardware, archival silks, and leads you will actually want to hold.",
    sortOrder: 2,
  },
  {
    id: "cat_eyewear",
    slug: "eyewear",
    name: "Eyewear",
    tagline: "Shield, squint, stroll.",
    heroCopy:
      "Polarized lenses, ergonomic snout bridges, and frames sculpted for every muzzle geometry.",
    sortOrder: 3,
  },
  {
    id: "cat_footwear",
    slug: "footwear",
    name: "Footwear",
    tagline: "Booties that mean business.",
    heroCopy:
      "Engineered rubber soles, technical uppers, and a silhouette that reads entirely dog.",
    sortOrder: 4,
  },
];

export const products: SeedProduct[] = [
  // -------------------- COUTURE --------------------
  {
    slug: "monogram-quilted-coat",
    name: "Monogram Quilted Coat",
    subtitle: "Signature B-logo jacquard",
    description:
      "A heavyweight quilted coat cut from water-repellent nylon with a velveted B-monogram lining. Adjustable chest strap, magnetic front closure, reflective piping on the hem for evening walks.",
    categorySlug: "couture",
    priceCents: 49500,
    palette: { a: "#2a2825", b: "#6b1e2a" },
    editorialCopy:
      "Cut from the same pattern worn by Duchess, the studio's resident standard poodle, the Monogram Quilted Coat anchors Autumn/Woofer '26.",
    careCopy: "Spot clean. Air dry. Do not tumble, do not chew.",
    variants: [
      { size: "xs", color: "Ink", colorHex: "#121110", inventory: 12 },
      { size: "s", color: "Ink", colorHex: "#121110", inventory: 14 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 18 },
      { size: "l", color: "Ink", colorHex: "#121110", inventory: 10 },
      { size: "xl", color: "Ink", colorHex: "#121110", inventory: 6 },
      { size: "s", color: "Bone", colorHex: "#f5f1e8", inventory: 9 },
      { size: "m", color: "Bone", colorHex: "#f5f1e8", inventory: 7 },
    ],
  },
  {
    slug: "destructed-cashmere-sweater",
    name: "Destructed Cashmere Sweater",
    subtitle: "Grade-A inner Mongolian cashmere",
    description:
      "Intentionally distressed, loosely knit cashmere with shawl collar and ribbed back panel. Runs relaxed; we recommend sizing down for the tailored silhouette.",
    categorySlug: "couture",
    priceCents: 38500,
    palette: { a: "#dcd0b5", b: "#8a7f62" },
    editorialCopy:
      "Hand-finished in Italy. Each piece distressed by a single craftsman for a maximum of four minutes.",
    careCopy: "Hand wash cold. Dry flat. Embrace the pilling.",
    variants: [
      { size: "xs", color: "Oat", colorHex: "#d8cdb0", inventory: 8 },
      { size: "s", color: "Oat", colorHex: "#d8cdb0", inventory: 11 },
      { size: "m", color: "Oat", colorHex: "#d8cdb0", inventory: 9 },
      { size: "l", color: "Oat", colorHex: "#d8cdb0", inventory: 5 },
      { size: "s", color: "Slate", colorHex: "#4a4a48", inventory: 6 },
      { size: "m", color: "Slate", colorHex: "#4a4a48", inventory: 8 },
    ],
  },
  {
    slug: "logo-hoodie",
    name: "Paw-Print Logo Hoodie",
    subtitle: "Archival fleece, boxy cut",
    description:
      "Heavyweight 480gsm fleece hoodie with the oversized Barkenciaga wordmark across the back. Kangaroo pocket, snap placket, branded drawcord terminators.",
    categorySlug: "couture",
    priceCents: 22500,
    palette: { a: "#6b1e2a", b: "#2a2825" },
    editorialCopy:
      "The hoodie that defined the SS25 runway - now in the full Autumn/Woofer palette.",
    careCopy: "Machine wash cold, inside out. Do not iron the wordmark.",
    variants: [
      { size: "xs", color: "Burgundy", colorHex: "#6b1e2a", inventory: 22 },
      { size: "s", color: "Burgundy", colorHex: "#6b1e2a", inventory: 28 },
      { size: "m", color: "Burgundy", colorHex: "#6b1e2a", inventory: 20 },
      { size: "l", color: "Burgundy", colorHex: "#6b1e2a", inventory: 12 },
      { size: "xl", color: "Burgundy", colorHex: "#6b1e2a", inventory: 6 },
      { size: "s", color: "Ink", colorHex: "#121110", inventory: 18 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 15 },
      { size: "l", color: "Ink", colorHex: "#121110", inventory: 8 },
    ],
  },
  {
    slug: "tartan-trench",
    name: "Tartan House Trench",
    subtitle: "Barkenciaga house check",
    description:
      "A double-breasted trench in the Barkenciaga house tartan, cut from 100% cotton gabardine. Six-bone button front, storm flap, and a belted waist that (almost) every dog will tolerate.",
    categorySlug: "couture",
    priceCents: 58500,
    palette: { a: "#6d4a2f", b: "#2a2825" },
    editorialCopy:
      "The house check was originally commissioned for a single whippet. She approved the final swatch with one long stare.",
    careCopy: "Dry clean only.",
    variants: [
      { size: "s", color: "House Check", colorHex: "#6d4a2f", inventory: 6 },
      { size: "m", color: "House Check", colorHex: "#6d4a2f", inventory: 9 },
      { size: "l", color: "House Check", colorHex: "#6d4a2f", inventory: 5 },
    ],
  },
  {
    slug: "tech-parka",
    name: "Tech Parka 03",
    subtitle: "Ripstop shell, thermo-sealed seams",
    description:
      "Built for all-terrain walks. A ripstop shell with PFC-free DWR coating, thermally-sealed seams, and a detachable chest pack for treats or very small toys.",
    categorySlug: "couture",
    priceCents: 44500,
    palette: { a: "#d6e84a", b: "#2a2825" },
    editorialCopy:
      "Developed with the studio's golden retriever-led field testing program.",
    careCopy: "Machine wash cold. Reproof with DWR after five washes.",
    variants: [
      { size: "s", color: "Chartreuse", colorHex: "#d6e84a", inventory: 14 },
      { size: "m", color: "Chartreuse", colorHex: "#d6e84a", inventory: 12 },
      { size: "l", color: "Chartreuse", colorHex: "#d6e84a", inventory: 9 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 20 },
      { size: "l", color: "Ink", colorHex: "#121110", inventory: 15 },
      { size: "xl", color: "Ink", colorHex: "#121110", inventory: 8 },
    ],
  },
  {
    slug: "cable-knit-turtleneck",
    name: "Cable Knit Turtleneck",
    subtitle: "Merino wool, fisherman gauge",
    description:
      "A heavyweight fisherman cable knit in undyed merino. Folds at the neck to your preferred tightness - or your dog's, whichever is louder.",
    categorySlug: "couture",
    priceCents: 27500,
    palette: { a: "#eee6cf", b: "#bfb18a" },
    editorialCopy: "A quiet piece. A correct piece.",
    careCopy: "Hand wash cold. Dry flat away from direct sun.",
    variants: [
      { size: "xs", color: "Undyed", colorHex: "#eee6cf", inventory: 10 },
      { size: "s", color: "Undyed", colorHex: "#eee6cf", inventory: 12 },
      { size: "m", color: "Undyed", colorHex: "#eee6cf", inventory: 9 },
      { size: "l", color: "Undyed", colorHex: "#eee6cf", inventory: 5 },
    ],
  },
  {
    slug: "city-raincoat",
    name: "City Raincoat",
    subtitle: "Recycled PU shell",
    description:
      "A featherweight raincoat in recycled polyurethane with taped seams and a snap-adjusted hood. Packs into its own internal pouch.",
    categorySlug: "couture",
    priceCents: 18500,
    palette: { a: "#1c3246", b: "#0e1a26" },
    editorialCopy: "For the commuter dog.",
    careCopy: "Wipe clean. Do not iron.",
    variants: [
      { size: "xs", color: "Navy", colorHex: "#1c3246", inventory: 24 },
      { size: "s", color: "Navy", colorHex: "#1c3246", inventory: 28 },
      { size: "m", color: "Navy", colorHex: "#1c3246", inventory: 22 },
      { size: "l", color: "Navy", colorHex: "#1c3246", inventory: 14 },
      { size: "xl", color: "Navy", colorHex: "#1c3246", inventory: 7 },
    ],
  },
  {
    slug: "opera-cape",
    name: "Opera Cape",
    subtitle: "For black-tie occasions",
    description:
      "A silk-lined velvet cape with a satin tie and hand-finished hem. The cape accommodates a bow tie layered underneath.",
    categorySlug: "couture",
    priceCents: 68500,
    palette: { a: "#2a2825", b: "#6b1e2a" },
    editorialCopy:
      "Worn to the studio's own 10-year anniversary gala. Photographed. Extensively.",
    careCopy: "Dry clean with care. Never fold; hang to store.",
    variants: [
      { size: "s", color: "Midnight Velvet", colorHex: "#2a2825", inventory: 4 },
      { size: "m", color: "Midnight Velvet", colorHex: "#2a2825", inventory: 5 },
      { size: "l", color: "Midnight Velvet", colorHex: "#2a2825", inventory: 3 },
    ],
  },

  // -------------------- ACCESSORIES --------------------
  {
    slug: "heritage-leather-collar",
    name: "Heritage Leather Collar",
    subtitle: "Full-grain bridle leather",
    description:
      "Hand-stitched in Florence from a single piece of full-grain leather. Solid brass hardware; engravable nameplate included at checkout.",
    categorySlug: "accessories",
    priceCents: 19500,
    palette: { a: "#6d4a2f", b: "#3a2619" },
    editorialCopy: "Will outlive every collar it replaces.",
    careCopy: "Condition with leather balm quarterly.",
    variants: [
      { size: "xs", color: "Cognac", colorHex: "#8f5a34", inventory: 18 },
      { size: "s", color: "Cognac", colorHex: "#8f5a34", inventory: 22 },
      { size: "m", color: "Cognac", colorHex: "#8f5a34", inventory: 20 },
      { size: "l", color: "Cognac", colorHex: "#8f5a34", inventory: 15 },
      { size: "xl", color: "Cognac", colorHex: "#8f5a34", inventory: 8 },
      { size: "s", color: "Onyx", colorHex: "#1c1a17", inventory: 16 },
      { size: "m", color: "Onyx", colorHex: "#1c1a17", inventory: 19 },
      { size: "l", color: "Onyx", colorHex: "#1c1a17", inventory: 12 },
    ],
  },
  {
    slug: "silk-scarf-monogram",
    name: "Monogram Silk Scarf",
    subtitle: "Archival twill, 90cm",
    description:
      "A featherweight silk twill scarf in the Barkenciaga monogram. Rolled and hand-stitched hems. Pairs over the Heritage Leather Collar.",
    categorySlug: "accessories",
    priceCents: 14500,
    palette: { a: "#c78692", b: "#6b1e2a" },
    editorialCopy:
      "Originally produced for the 2024 runway presentation; now part of the permanent archive.",
    careCopy: "Hand wash with silk detergent.",
    variants: [
      { size: "s", color: "Rose", colorHex: "#c78692", inventory: 20 },
      { size: "m", color: "Rose", colorHex: "#c78692", inventory: 20 },
      { size: "s", color: "Ink", colorHex: "#121110", inventory: 15 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 15 },
    ],
  },
  {
    slug: "sport-harness",
    name: "Sport Harness X",
    subtitle: "Ergonomic aluminum hardware",
    description:
      "A four-point adjustable harness in weatherproof nylon with brushed aluminum D-rings. No-rub chest pad, quick-release buckles.",
    categorySlug: "accessories",
    priceCents: 16500,
    palette: { a: "#2a2825", b: "#121110" },
    editorialCopy:
      "Chosen by search-and-rescue teams across three continents.",
    careCopy: "Rinse after swims. Air dry.",
    variants: [
      { size: "xs", color: "Ink", colorHex: "#121110", inventory: 18 },
      { size: "s", color: "Ink", colorHex: "#121110", inventory: 22 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 25 },
      { size: "l", color: "Ink", colorHex: "#121110", inventory: 14 },
      { size: "xl", color: "Ink", colorHex: "#121110", inventory: 9 },
      { size: "m", color: "Chartreuse", colorHex: "#d6e84a", inventory: 10 },
      { size: "l", color: "Chartreuse", colorHex: "#d6e84a", inventory: 8 },
    ],
  },
  {
    slug: "braided-lead",
    name: "Braided Leather Lead",
    subtitle: "Hand-plaited, 1.2m",
    description:
      "A tightly-plaited leather lead with a solid brass trigger snap. Softens over years; never frays.",
    categorySlug: "accessories",
    priceCents: 12500,
    palette: { a: "#6d4a2f", b: "#3a2619" },
    editorialCopy: "A lead is a handshake. Choose carefully.",
    careCopy: "Condition with leather balm quarterly.",
    variants: [
      { size: "m", color: "Cognac", colorHex: "#8f5a34", inventory: 28 },
      { size: "m", color: "Onyx", colorHex: "#1c1a17", inventory: 24 },
      { size: "m", color: "Olive", colorHex: "#4a5c3a", inventory: 14 },
    ],
  },
  {
    slug: "couture-bow-tie",
    name: "Couture Bow Tie",
    subtitle: "Silk jacquard, pre-tied",
    description:
      "A pre-tied bow tie in silk jacquard, designed to attach cleanly to the Heritage Leather Collar or the Opera Cape.",
    categorySlug: "accessories",
    priceCents: 7500,
    palette: { a: "#6b1e2a", b: "#2a2825" },
    editorialCopy: "The only accessory required for black tie.",
    careCopy: "Spot clean.",
    variants: [
      { size: "s", color: "Burgundy", colorHex: "#6b1e2a", inventory: 22 },
      { size: "m", color: "Burgundy", colorHex: "#6b1e2a", inventory: 22 },
      { size: "s", color: "Midnight", colorHex: "#1a1d28", inventory: 18 },
      { size: "m", color: "Midnight", colorHex: "#1a1d28", inventory: 18 },
    ],
  },
  {
    slug: "bandana-house-check",
    name: "House Check Bandana",
    subtitle: "Brushed cotton twill",
    description:
      "A brushed cotton bandana cut from the same bolt as the Tartan House Trench. Triangular; ties over the collar.",
    categorySlug: "accessories",
    priceCents: 4500,
    palette: { a: "#6d4a2f", b: "#2a2825" },
    editorialCopy: "The entry point to the house check.",
    careCopy: "Machine wash cold. Tumble dry low.",
    variants: [
      { size: "s", color: "House Check", colorHex: "#6d4a2f", inventory: 60 },
      { size: "m", color: "House Check", colorHex: "#6d4a2f", inventory: 60 },
      { size: "l", color: "House Check", colorHex: "#6d4a2f", inventory: 40 },
    ],
  },
  {
    slug: "hardware-id-tag",
    name: "Hardware ID Tag",
    subtitle: "Machined brass, engravable",
    description:
      "A heavy machined brass ID tag with a rounded bevel. Front engraving included. Pairs with any Barkenciaga collar.",
    categorySlug: "accessories",
    priceCents: 6500,
    palette: { a: "#b9a06a", b: "#6d5a36" },
    editorialCopy:
      "Weight is a feature. Dogs like knowing exactly where they are.",
    careCopy: "Polish with a dry cloth.",
    variants: [
      { size: "s", color: "Brass", colorHex: "#b9a06a", inventory: 40 },
      { size: "m", color: "Brass", colorHex: "#b9a06a", inventory: 40 },
      { size: "m", color: "Silver", colorHex: "#b6b6b2", inventory: 30 },
    ],
  },
  {
    slug: "travel-carrier",
    name: "Tote Carrier 01",
    subtitle: "Structured canvas, leather trim",
    description:
      "An airline-compliant carrier in heavyweight canvas with full-grain leather trim and ventilated side panels. For small dogs only.",
    categorySlug: "accessories",
    priceCents: 78500,
    palette: { a: "#bfb18a", b: "#6d4a2f" },
    editorialCopy: "The only carrier the studio permits on set.",
    careCopy: "Spot clean. Re-wax canvas annually.",
    variants: [
      { size: "m", color: "Natural", colorHex: "#bfb18a", inventory: 6 },
    ],
  },

  // -------------------- EYEWEAR --------------------
  {
    slug: "aviator-shades",
    name: "Aviator Shades",
    subtitle: "Gradient polarized",
    description:
      "A teardrop aviator shape with gradient polarized lenses and a silicone snout bridge. UV400.",
    categorySlug: "eyewear",
    priceCents: 24500,
    palette: { a: "#2a2825", b: "#b9a06a" },
    editorialCopy: "Every dog looks good. These make them look correct.",
    careCopy: "Clean with microfiber. Do not chew.",
    variants: [
      { size: "s", color: "Gold/Smoke", colorHex: "#b9a06a", inventory: 16 },
      { size: "m", color: "Gold/Smoke", colorHex: "#b9a06a", inventory: 16 },
      { size: "m", color: "Matte Black", colorHex: "#1c1a17", inventory: 14 },
      { size: "l", color: "Matte Black", colorHex: "#1c1a17", inventory: 10 },
    ],
  },
  {
    slug: "racer-shades",
    name: "Racer Shades",
    subtitle: "Wraparound sport",
    description:
      "Wraparound polycarbonate lenses with a shock-absorbing bridge. Retains fit at a full sprint.",
    categorySlug: "eyewear",
    priceCents: 18500,
    palette: { a: "#d6e84a", b: "#2a2825" },
    editorialCopy: "Built for the chase.",
    careCopy: "Rinse after outdoor use.",
    variants: [
      { size: "s", color: "Chartreuse", colorHex: "#d6e84a", inventory: 18 },
      { size: "m", color: "Chartreuse", colorHex: "#d6e84a", inventory: 18 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 22 },
      { size: "l", color: "Ink", colorHex: "#121110", inventory: 14 },
    ],
  },
  {
    slug: "oversized-shield",
    name: "Oversized Shield",
    subtitle: "Single-lens wrap",
    description:
      "A single-lens shield frame with anti-glare coating. Runway-first, street-ready.",
    categorySlug: "eyewear",
    priceCents: 32500,
    palette: { a: "#6b1e2a", b: "#121110" },
    editorialCopy:
      "The shield that debuted on the SS26 runway, now back for Autumn/Woofer.",
    careCopy: "Store flat in provided case.",
    variants: [
      { size: "m", color: "Burgundy", colorHex: "#6b1e2a", inventory: 8 },
      { size: "l", color: "Burgundy", colorHex: "#6b1e2a", inventory: 8 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 10 },
      { size: "l", color: "Ink", colorHex: "#121110", inventory: 10 },
    ],
  },
  {
    slug: "round-studio-frame",
    name: "Studio Round Frame",
    subtitle: "Acetate, demi-tortoise",
    description:
      "A classic round acetate frame in hand-polished demi-tortoise. For photo sessions, gallery openings, and long Sunday walks.",
    categorySlug: "eyewear",
    priceCents: 28500,
    palette: { a: "#8f5a34", b: "#3a2619" },
    editorialCopy: "Referenced heavily in the studio's 2023 archive book.",
    careCopy: "Clean with microfiber.",
    variants: [
      { size: "s", color: "Demi", colorHex: "#8f5a34", inventory: 12 },
      { size: "m", color: "Demi", colorHex: "#8f5a34", inventory: 14 },
      { size: "m", color: "Crystal", colorHex: "#e2dcc6", inventory: 8 },
    ],
  },
  {
    slug: "retro-cat-eye",
    name: "Retro Cat Eye",
    subtitle: "Acetate, lifted outer",
    description:
      "A lifted-outer cat-eye that flatters long muzzles. Gradient lens, stainless temple cores.",
    categorySlug: "eyewear",
    priceCents: 26500,
    palette: { a: "#c78692", b: "#6b1e2a" },
    editorialCopy: "For dogs who favor drama.",
    careCopy: "Store flat in provided case.",
    variants: [
      { size: "s", color: "Rose", colorHex: "#c78692", inventory: 14 },
      { size: "m", color: "Rose", colorHex: "#c78692", inventory: 14 },
      { size: "m", color: "Onyx", colorHex: "#1c1a17", inventory: 12 },
    ],
  },

  // -------------------- FOOTWEAR --------------------
  {
    slug: "runner-01-bootie",
    name: "Runner 01 Bootie",
    subtitle: "Technical mesh, rubber sole",
    description:
      "A four-piece set of running booties with engineered mesh uppers and compounded rubber outsoles. Reflective heel pull.",
    categorySlug: "footwear",
    priceCents: 22500,
    palette: { a: "#2a2825", b: "#d6e84a" },
    editorialCopy:
      "The bootie that started the entire category. Now in its third generation.",
    careCopy: "Machine wash cold in included laundry bag. Air dry.",
    variants: [
      { size: "xs", color: "Ink/Chartreuse", colorHex: "#121110", inventory: 16 },
      { size: "s", color: "Ink/Chartreuse", colorHex: "#121110", inventory: 20 },
      { size: "m", color: "Ink/Chartreuse", colorHex: "#121110", inventory: 20 },
      { size: "l", color: "Ink/Chartreuse", colorHex: "#121110", inventory: 14 },
      { size: "xl", color: "Ink/Chartreuse", colorHex: "#121110", inventory: 8 },
      { size: "m", color: "Bone", colorHex: "#f5f1e8", inventory: 12 },
      { size: "l", color: "Bone", colorHex: "#f5f1e8", inventory: 9 },
    ],
  },
  {
    slug: "trail-boot-03",
    name: "Trail Boot 03",
    subtitle: "Weatherproof, lug sole",
    description:
      "A heavy-duty trail boot with a DWR-treated upper and a deep-lug rubber outsole. Fleece interior; double hook-and-loop closure.",
    categorySlug: "footwear",
    priceCents: 28500,
    palette: { a: "#4a5c3a", b: "#2a2825" },
    editorialCopy:
      "Engineered for the studio's annual Vermont retreat.",
    careCopy: "Brush dry dirt. Re-proof uppers annually.",
    variants: [
      { size: "s", color: "Forest", colorHex: "#4a5c3a", inventory: 10 },
      { size: "m", color: "Forest", colorHex: "#4a5c3a", inventory: 12 },
      { size: "l", color: "Forest", colorHex: "#4a5c3a", inventory: 9 },
      { size: "xl", color: "Forest", colorHex: "#4a5c3a", inventory: 4 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 14 },
      { size: "l", color: "Ink", colorHex: "#121110", inventory: 10 },
    ],
  },
  {
    slug: "loafer-leisure",
    name: "Leisure Loafer",
    subtitle: "Soft suede, silent sole",
    description:
      "A slipper-style loafer in soft suede with a silent rubber sole. For indoor use and short, quiet errands.",
    categorySlug: "footwear",
    priceCents: 16500,
    palette: { a: "#bfb18a", b: "#6d4a2f" },
    editorialCopy: "The loafer the studio dogs refuse to take off.",
    careCopy: "Brush suede after use.",
    variants: [
      { size: "xs", color: "Sand", colorHex: "#bfb18a", inventory: 16 },
      { size: "s", color: "Sand", colorHex: "#bfb18a", inventory: 18 },
      { size: "m", color: "Sand", colorHex: "#bfb18a", inventory: 14 },
      { size: "l", color: "Sand", colorHex: "#bfb18a", inventory: 10 },
    ],
  },
  {
    slug: "rainboot-city",
    name: "City Rain Bootie",
    subtitle: "Sealed rubber, fleece-lined",
    description:
      "A fully-sealed rubber rain bootie with a fleece lining and a reflective welt. Pulls on; stays on.",
    categorySlug: "footwear",
    priceCents: 14500,
    palette: { a: "#1c3246", b: "#0e1a26" },
    editorialCopy: "The commuter set's quiet essential.",
    careCopy: "Wipe clean.",
    variants: [
      { size: "xs", color: "Navy", colorHex: "#1c3246", inventory: 20 },
      { size: "s", color: "Navy", colorHex: "#1c3246", inventory: 22 },
      { size: "m", color: "Navy", colorHex: "#1c3246", inventory: 20 },
      { size: "l", color: "Navy", colorHex: "#1c3246", inventory: 14 },
      { size: "s", color: "Burgundy", colorHex: "#6b1e2a", inventory: 10 },
      { size: "m", color: "Burgundy", colorHex: "#6b1e2a", inventory: 10 },
    ],
  },
  {
    slug: "evening-slipper",
    name: "Evening Slipper",
    subtitle: "Velvet, grosgrain trim",
    description:
      "A crushed-velvet slipper with grosgrain trim and an embroidered B on the toe. Pair with the Opera Cape.",
    categorySlug: "footwear",
    priceCents: 21500,
    palette: { a: "#2a2825", b: "#b9a06a" },
    editorialCopy: "For the second half of the evening.",
    careCopy: "Brush velvet.",
    variants: [
      { size: "s", color: "Ink", colorHex: "#121110", inventory: 10 },
      { size: "m", color: "Ink", colorHex: "#121110", inventory: 10 },
      { size: "s", color: "Burgundy", colorHex: "#6b1e2a", inventory: 6 },
      { size: "m", color: "Burgundy", colorHex: "#6b1e2a", inventory: 6 },
    ],
  },
];

export const collections: SeedCollection[] = [
  {
    id: "col_autumn_woofer_26",
    slug: "autumn-woofer-26",
    name: "Autumn/Woofer '26",
    tagline: "The season's essentials.",
    season: "AW26",
    featured: true,
    productSlugs: [
      "monogram-quilted-coat",
      "tartan-trench",
      "destructed-cashmere-sweater",
      "tech-parka",
      "oversized-shield",
      "trail-boot-03",
      "heritage-leather-collar",
      "opera-cape",
    ],
  },
  {
    id: "col_black_tie",
    slug: "black-tie",
    name: "The Black Tie Edit",
    tagline: "Eight pieces for an evening out.",
    season: "Year-round",
    featured: true,
    productSlugs: [
      "opera-cape",
      "couture-bow-tie",
      "evening-slipper",
      "silk-scarf-monogram",
    ],
  },
  {
    id: "col_city_commuter",
    slug: "city-commuter",
    name: "City Commuter",
    tagline: "For the weekday walk.",
    season: "Year-round",
    featured: true,
    productSlugs: [
      "city-raincoat",
      "rainboot-city",
      "sport-harness",
      "braided-lead",
      "racer-shades",
    ],
  },
];

export const demoUsers = [
  {
    id: "usr_demo_customer",
    email: "hello@barkenciaga.test",
    name: "Alex Rivera",
    role: "customer" as const,
  },
  {
    id: "usr_demo_admin",
    email: "studio@barkenciaga.test",
    name: "The Studio",
    role: "admin" as const,
  },
];

export const demoDogs: Array<{
  id: string;
  userId: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  sizeBucket: "xs" | "s" | "m" | "l" | "xl";
  neckCm: number;
  chestCm: number;
  backCm: number;
  weightKg: number;
}> = [
  {
    id: "dog_luna",
    userId: "usr_demo_customer",
    name: "Luna",
    breed: "French Bulldog",
    gender: "female",
    sizeBucket: "m",
    neckCm: 34,
    chestCm: 54,
    backCm: 32,
    weightKg: 11,
  },
  {
    id: "dog_atlas",
    userId: "usr_demo_customer",
    name: "Atlas",
    breed: "Standard Poodle",
    gender: "male",
    sizeBucket: "l",
    neckCm: 46,
    chestCm: 74,
    backCm: 58,
    weightKg: 26,
  },
];
