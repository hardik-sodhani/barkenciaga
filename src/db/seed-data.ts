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

  // -------------------- SS26 ALOHA (LIMITED EDITION) --------------------
  {
    slug: "palm-noir-camp-shirt",
    name: "Palm Noir Camp Shirt",
    subtitle: "Tonal palm on midnight silk",
    description:
      "A dog-cut camp shirt in midnight silk with a tonal black-on-charcoal palm-frond print. Open camp collar, mother-of-pearl buttons, and a curved shirttail hem. The quietest way to wear the tropics.",
    categorySlug: "couture",
    priceCents: 32500,
    palette: { a: "#1a1c1a", b: "#3a3f38" },
    imagePath: "/products/hawaiian/palm-noir-camp-shirt.webp",
    editorialCopy:
      "The opening look of SS26. Photographed once, at dusk, on the studio's black whippet.",
    careCopy: "Dry clean only. Store on a padded hanger away from light.",
    variants: [
      { size: "xs", color: "Midnight", colorHex: "#1a1c1a", inventory: 8 },
      { size: "s", color: "Midnight", colorHex: "#1a1c1a", inventory: 10 },
      { size: "m", color: "Midnight", colorHex: "#1a1c1a", inventory: 9 },
      { size: "l", color: "Midnight", colorHex: "#1a1c1a", inventory: 6 },
      { size: "xl", color: "Midnight", colorHex: "#1a1c1a", inventory: 4 },
      { size: "s", color: "Storm", colorHex: "#3a3f38", inventory: 5 },
      { size: "m", color: "Storm", colorHex: "#3a3f38", inventory: 5 },
    ],
  },
  {
    slug: "hibiscus-atelier-shirt",
    name: "Hibiscus Atelier Shirt",
    subtitle: "Hand-painted hibiscus, silk twill",
    description:
      "An ivory silk-twill camp shirt printed from an original atelier watercolor of crimson and blush hibiscus. Placement-matched across the front placket so no two flowers are cut the same way.",
    categorySlug: "couture",
    priceCents: 36500,
    palette: { a: "#b3283a", b: "#f0e6d8" },
    imagePath: "/products/hawaiian/hibiscus-atelier-shirt.webp",
    editorialCopy:
      "The original gouache hangs in the studio's Milan hallway. This is its only translation to cloth.",
    careCopy: "Dry clean only. Cool iron on reverse under a pressing cloth.",
    variants: [
      { size: "xs", color: "Ivory Bloom", colorHex: "#f0e6d8", inventory: 7 },
      { size: "s", color: "Ivory Bloom", colorHex: "#f0e6d8", inventory: 9 },
      { size: "m", color: "Ivory Bloom", colorHex: "#f0e6d8", inventory: 8 },
      { size: "l", color: "Ivory Bloom", colorHex: "#f0e6d8", inventory: 5 },
      { size: "xl", color: "Ivory Bloom", colorHex: "#f0e6d8", inventory: 3 },
      { size: "s", color: "Noir Bloom", colorHex: "#2a2825", inventory: 6 },
      { size: "m", color: "Noir Bloom", colorHex: "#2a2825", inventory: 6 },
      { size: "l", color: "Noir Bloom", colorHex: "#2a2825", inventory: 4 },
    ],
  },
  {
    slug: "monstera-house-shirt",
    name: "Monstera House Shirt",
    subtitle: "Tonal monstera, forest cotton",
    description:
      "A forest-green cotton-poplin camp shirt with a tonal green-on-green monstera and philodendron print. Matte finish, self-fabric collar stand, and a relaxed dog-cut body.",
    categorySlug: "couture",
    priceCents: 31500,
    palette: { a: "#22402c", b: "#3d6b45" },
    imagePath: "/products/hawaiian/monstera-house-shirt.webp",
    editorialCopy: "Green on green. The most-photographed piece from the SS26 lookbook.",
    careCopy: "Machine wash cold, gentle. Line dry. Warm iron.",
    variants: [
      { size: "xs", color: "Forest", colorHex: "#22402c", inventory: 10 },
      { size: "s", color: "Forest", colorHex: "#22402c", inventory: 12 },
      { size: "m", color: "Forest", colorHex: "#22402c", inventory: 11 },
      { size: "l", color: "Forest", colorHex: "#22402c", inventory: 7 },
      { size: "xl", color: "Forest", colorHex: "#22402c", inventory: 4 },
    ],
  },
  {
    slug: "tropical-toile-shirt",
    name: "Tropical Toile Camp Shirt",
    subtitle: "House toile, single-tone poplin",
    description:
      "A bone poplin camp shirt printed with a burgundy tropical toile-de-jouy: parrots, palms, and pavilions rendered in a single engraving tone. The house check's summer cousin.",
    categorySlug: "couture",
    priceCents: 34500,
    palette: { a: "#6b1e2a", b: "#f0e8da" },
    imagePath: "/products/hawaiian/tropical-toile-shirt.webp",
    editorialCopy:
      "Drawn by the same hand that engraved the house check. A scene you can read for hours.",
    careCopy: "Machine wash cold on delicate. Warm iron.",
    variants: [
      { size: "xs", color: "Burgundy Toile", colorHex: "#6b1e2a", inventory: 8 },
      { size: "s", color: "Burgundy Toile", colorHex: "#6b1e2a", inventory: 10 },
      { size: "m", color: "Burgundy Toile", colorHex: "#6b1e2a", inventory: 9 },
      { size: "l", color: "Burgundy Toile", colorHex: "#6b1e2a", inventory: 6 },
      { size: "xl", color: "Burgundy Toile", colorHex: "#6b1e2a", inventory: 3 },
      { size: "s", color: "Ink Toile", colorHex: "#121110", inventory: 5 },
      { size: "m", color: "Ink Toile", colorHex: "#121110", inventory: 5 },
    ],
  },
  {
    slug: "surf-club-shirt",
    name: "Surf Club Shirt",
    subtitle: "Vintage wave stripe, washed cotton",
    description:
      "A soft washed-cotton camp shirt in a vintage teal-and-cream breaking-wave stripe. Garment-dyed for a lived-in hand; cut for movement at the beach club.",
    categorySlug: "couture",
    priceCents: 28500,
    palette: { a: "#1f6f7a", b: "#e6ddc8" },
    imagePath: "/products/hawaiian/surf-club-shirt.webp",
    editorialCopy: "Modeled on a 1962 archive shirt found in a Waikiki estate sale.",
    careCopy: "Machine wash cold. Tumble dry low. The fade is intentional.",
    variants: [
      { size: "xs", color: "Teal Wave", colorHex: "#1f6f7a", inventory: 12 },
      { size: "s", color: "Teal Wave", colorHex: "#1f6f7a", inventory: 14 },
      { size: "m", color: "Teal Wave", colorHex: "#1f6f7a", inventory: 12 },
      { size: "l", color: "Teal Wave", colorHex: "#1f6f7a", inventory: 8 },
      { size: "xl", color: "Teal Wave", colorHex: "#1f6f7a", inventory: 5 },
    ],
  },
  {
    slug: "tiki-lounge-shirt",
    name: "Tiki Lounge Shirt",
    subtitle: "Mid-century tiki, rayon",
    description:
      "A drapey tan-rayon camp shirt with an amber and terracotta mid-century tiki totem and torch motif. Liquid drape, 1950s lounge energy, and a boxy dog-cut fit.",
    categorySlug: "couture",
    priceCents: 29500,
    palette: { a: "#9c5a2c", b: "#d8a566" },
    imagePath: "/products/hawaiian/tiki-lounge-shirt.webp",
    editorialCopy: "For the second cocktail. Photographed beside a real 1955 tiki mug.",
    careCopy: "Dry clean recommended. Cool iron on reverse.",
    variants: [
      { size: "s", color: "Terracotta", colorHex: "#9c5a2c", inventory: 10 },
      { size: "m", color: "Terracotta", colorHex: "#9c5a2c", inventory: 11 },
      { size: "l", color: "Terracotta", colorHex: "#9c5a2c", inventory: 7 },
      { size: "xl", color: "Terracotta", colorHex: "#9c5a2c", inventory: 4 },
    ],
  },
  {
    slug: "bird-of-paradise-shirt",
    name: "Bird of Paradise Shirt",
    subtitle: "Botanical bloom, ink silk",
    description:
      "An ink-navy silk camp shirt exploding with vivid orange and violet bird-of-paradise flowers over deep green foliage. The loudest piece in the capsule, cut with the quietest tailoring.",
    categorySlug: "couture",
    priceCents: 38500,
    palette: { a: "#16203a", b: "#e8721f" },
    imagePath: "/products/hawaiian/bird-of-paradise-shirt.webp",
    editorialCopy: "The SS26 finale look. It closed the show and it will close your evening.",
    careCopy: "Dry clean only. Store flat or on a padded hanger.",
    variants: [
      { size: "xs", color: "Ink Navy", colorHex: "#16203a", inventory: 6 },
      { size: "s", color: "Ink Navy", colorHex: "#16203a", inventory: 8 },
      { size: "m", color: "Ink Navy", colorHex: "#16203a", inventory: 7 },
      { size: "l", color: "Ink Navy", colorHex: "#16203a", inventory: 5 },
      { size: "xl", color: "Ink Navy", colorHex: "#16203a", inventory: 3 },
    ],
  },
  {
    slug: "pineapple-jacquard-shirt",
    name: "Pineapple Jacquard Shirt",
    subtitle: "Tone-on-tone jacquard, satin",
    description:
      "A champagne-satin camp shirt woven with a tone-on-tone pineapple jacquard. The motif appears only as light catches the weave - a tropical shirt for a black-tie garden party.",
    categorySlug: "couture",
    priceCents: 42500,
    palette: { a: "#b8912f", b: "#efe3c0" },
    imagePath: "/products/hawaiian/pineapple-jacquard-shirt.webp",
    editorialCopy: "Woven, never printed. The pineapple is a structure, not a picture.",
    careCopy: "Dry clean only. Cool iron on reverse under a cloth.",
    variants: [
      { size: "s", color: "Champagne", colorHex: "#cbb47a", inventory: 7 },
      { size: "m", color: "Champagne", colorHex: "#cbb47a", inventory: 8 },
      { size: "l", color: "Champagne", colorHex: "#cbb47a", inventory: 5 },
      { size: "xl", color: "Champagne", colorHex: "#cbb47a", inventory: 3 },
    ],
  },
  {
    slug: "koi-pond-silk-shirt",
    name: "Koi Pond Silk Shirt",
    subtitle: "Illustrated koi, indigo silk",
    description:
      "A deep-indigo silk camp shirt hand-illustrated with orange-and-white koi swimming among lily pads and stylized waves. A single continuous scene wraps front to back.",
    categorySlug: "couture",
    priceCents: 44500,
    palette: { a: "#16294d", b: "#e8823a" },
    imagePath: "/products/hawaiian/koi-pond-silk-shirt.webp",
    editorialCopy: "Nine koi, counted. In some cultures that is the luckiest number of all.",
    careCopy: "Dry clean only. Keep away from prolonged sun to preserve the indigo.",
    variants: [
      { size: "xs", color: "Indigo", colorHex: "#16294d", inventory: 6 },
      { size: "s", color: "Indigo", colorHex: "#16294d", inventory: 8 },
      { size: "m", color: "Indigo", colorHex: "#16294d", inventory: 7 },
      { size: "l", color: "Indigo", colorHex: "#16294d", inventory: 5 },
      { size: "xl", color: "Indigo", colorHex: "#16294d", inventory: 3 },
    ],
  },
  {
    slug: "sunset-promenade-shirt",
    name: "Sunset Promenade Shirt",
    subtitle: "Airbrushed ombré, resort",
    description:
      "A resort camp shirt airbrushed from coral through peach to lavender, with a dark palm horizon rising from the hem. An engineered gradient, printed panel by panel.",
    categorySlug: "couture",
    priceCents: 30500,
    palette: { a: "#e0724a", b: "#d9a7c4" },
    imagePath: "/products/hawaiian/sunset-promenade-shirt.webp",
    editorialCopy: "The gradient is matched to a real 7:42pm sky over the Pacific.",
    careCopy: "Machine wash cold, inside out. Line dry. Cool iron.",
    variants: [
      { size: "xs", color: "Sunset", colorHex: "#e0724a", inventory: 10 },
      { size: "s", color: "Sunset", colorHex: "#e0724a", inventory: 12 },
      { size: "m", color: "Sunset", colorHex: "#e0724a", inventory: 10 },
      { size: "l", color: "Sunset", colorHex: "#e0724a", inventory: 7 },
      { size: "xl", color: "Sunset", colorHex: "#e0724a", inventory: 4 },
    ],
  },
  {
    slug: "banana-leaf-shirt",
    name: "Banana Leaf Shirt",
    subtitle: "Martinique leaf, poplin",
    description:
      "A crisp white cotton-poplin camp shirt with an oversized jade banana-leaf print - the iconic martinique palm layout, scaled up for maximum drama on a small dog.",
    categorySlug: "couture",
    priceCents: 31500,
    palette: { a: "#2f5d3a", b: "#f4f1e8" },
    imagePath: "/products/hawaiian/banana-leaf-shirt.webp",
    editorialCopy: "A nod to the most famous wallpaper in Beverly Hills. Now for the dog.",
    careCopy: "Machine wash cold. Warm iron. Bleach will ruin the jade.",
    variants: [
      { size: "xs", color: "Jade", colorHex: "#2f5d3a", inventory: 9 },
      { size: "s", color: "Jade", colorHex: "#2f5d3a", inventory: 11 },
      { size: "m", color: "Jade", colorHex: "#2f5d3a", inventory: 10 },
      { size: "l", color: "Jade", colorHex: "#2f5d3a", inventory: 6 },
      { size: "xl", color: "Jade", colorHex: "#2f5d3a", inventory: 4 },
    ],
  },
  {
    slug: "orchid-noir-shirt",
    name: "Orchid Noir Shirt",
    subtitle: "Nocturnal orchid, black silk",
    description:
      "A near-black silk camp shirt with moody magenta and plum orchids surfacing from the dark. The evening entry in the aloha capsule; pairs with the Opera Cape for after-hours.",
    categorySlug: "couture",
    priceCents: 39500,
    palette: { a: "#1a1518", b: "#9c2f6b" },
    imagePath: "/products/hawaiian/orchid-noir-shirt.webp",
    editorialCopy: "Tropical, but for midnight. The orchids only reveal themselves up close.",
    careCopy: "Dry clean only. Store on a padded hanger.",
    variants: [
      { size: "s", color: "Black Orchid", colorHex: "#1a1518", inventory: 7 },
      { size: "m", color: "Black Orchid", colorHex: "#1a1518", inventory: 8 },
      { size: "l", color: "Black Orchid", colorHex: "#1a1518", inventory: 5 },
      { size: "xl", color: "Black Orchid", colorHex: "#1a1518", inventory: 3 },
    ],
  },
  {
    slug: "parrot-riviera-shirt",
    name: "Parrot Riviera Shirt",
    subtitle: "Macaw print, linen",
    description:
      "A sky-blue linen camp shirt scattered with colorful macaws among hibiscus. Breathable, breezy, and cut for a long lunch on the terrace.",
    categorySlug: "couture",
    priceCents: 33500,
    palette: { a: "#3a7ba3", b: "#dfe8ee" },
    imagePath: "/products/hawaiian/parrot-riviera-shirt.webp",
    editorialCopy: "Riviera-coded. The linen creases on purpose - that is the point.",
    careCopy: "Machine wash cold on delicate. Line dry. Embrace the crease.",
    variants: [
      { size: "xs", color: "Sky", colorHex: "#3a7ba3", inventory: 9 },
      { size: "s", color: "Sky", colorHex: "#3a7ba3", inventory: 11 },
      { size: "m", color: "Sky", colorHex: "#3a7ba3", inventory: 10 },
      { size: "l", color: "Sky", colorHex: "#3a7ba3", inventory: 6 },
      { size: "xl", color: "Sky", colorHex: "#3a7ba3", inventory: 4 },
    ],
  },
  {
    slug: "seashell-border-shirt",
    name: "Seashell Border Shirt",
    subtitle: "Engineered shell hem, silk",
    description:
      "A sand-toned silk camp shirt with a cream-and-gold seashell, coral, and starfish border engineered along the hem and sleeve cuffs. Restraint at the shoulder, drama at the edges.",
    categorySlug: "couture",
    priceCents: 37500,
    palette: { a: "#cdb98a", b: "#efe6d2" },
    imagePath: "/products/hawaiian/seashell-border-shirt.webp",
    editorialCopy: "An engineered print - each shell placed by hand in the repeat.",
    careCopy: "Dry clean only. Cool iron on reverse.",
    variants: [
      { size: "s", color: "Sand", colorHex: "#cdb98a", inventory: 8 },
      { size: "m", color: "Sand", colorHex: "#cdb98a", inventory: 9 },
      { size: "l", color: "Sand", colorHex: "#cdb98a", inventory: 6 },
      { size: "xl", color: "Sand", colorHex: "#cdb98a", inventory: 3 },
    ],
  },
  {
    slug: "flamingo-deco-shirt",
    name: "Flamingo Deco Shirt",
    subtitle: "Deco flamingo, blush cotton",
    description:
      "A blush cotton camp shirt with coral-pink flamingos among pampas and palm in an art-deco layout. Soft color, hard geometry - the capsule's most photogenic contradiction.",
    categorySlug: "couture",
    priceCents: 32500,
    palette: { a: "#d98a9a", b: "#f2dfe0" },
    imagePath: "/products/hawaiian/flamingo-deco-shirt.webp",
    editorialCopy: "Deco lines, tropical heart. It looks best against a green lawn.",
    careCopy: "Machine wash cold. Line dry. Warm iron.",
    variants: [
      { size: "xs", color: "Blush", colorHex: "#d98a9a", inventory: 9 },
      { size: "s", color: "Blush", colorHex: "#d98a9a", inventory: 11 },
      { size: "m", color: "Blush", colorHex: "#d98a9a", inventory: 10 },
      { size: "l", color: "Blush", colorHex: "#d98a9a", inventory: 6 },
      { size: "xl", color: "Blush", colorHex: "#d98a9a", inventory: 4 },
    ],
  },
  {
    slug: "lei-garland-shirt",
    name: "Lei Garland Shirt",
    subtitle: "Plumeria lei, turquoise silk",
    description:
      "A turquoise silk camp shirt scattered with white plumeria and frangipani lei garlands. An authentic Hawaiian lei motif, drawn with couture restraint.",
    categorySlug: "couture",
    priceCents: 34500,
    palette: { a: "#1f8a8a", b: "#d9efe8" },
    imagePath: "/products/hawaiian/lei-garland-shirt.webp",
    editorialCopy: "The aloha in aloha shirt. A welcome, worn.",
    careCopy: "Dry clean only. Store away from direct light.",
    variants: [
      { size: "xs", color: "Turquoise", colorHex: "#1f8a8a", inventory: 8 },
      { size: "s", color: "Turquoise", colorHex: "#1f8a8a", inventory: 10 },
      { size: "m", color: "Turquoise", colorHex: "#1f8a8a", inventory: 9 },
      { size: "l", color: "Turquoise", colorHex: "#1f8a8a", inventory: 6 },
      { size: "xl", color: "Turquoise", colorHex: "#1f8a8a", inventory: 4 },
    ],
  },
  {
    slug: "palm-damask-resort-shirt",
    name: "Palm Damask Resort Shirt",
    subtitle: "Tonal linen damask, quiet luxury",
    description:
      "A natural-linen camp shirt with an ivory-on-champagne pineapple-and-palm damask. The quiet-luxury take on the aloha shirt - all texture, no volume.",
    categorySlug: "couture",
    priceCents: 35500,
    palette: { a: "#cabfa0", b: "#efe8d6" },
    imagePath: "/products/hawaiian/palm-damask-resort-shirt.webp",
    editorialCopy: "For those who want the tropics to whisper. Reads as solid from across a room.",
    careCopy: "Dry clean recommended. Warm iron on reverse.",
    variants: [
      { size: "s", color: "Natural Linen", colorHex: "#cabfa0", inventory: 9 },
      { size: "m", color: "Natural Linen", colorHex: "#cabfa0", inventory: 10 },
      { size: "l", color: "Natural Linen", colorHex: "#cabfa0", inventory: 6 },
      { size: "xl", color: "Natural Linen", colorHex: "#cabfa0", inventory: 4 },
    ],
  },
];

export const collections: SeedCollection[] = [
  {
    id: "col_ss26_aloha",
    slug: "ss26-aloha",
    name: "Aloha Atelier",
    tagline:
      "Limited edition. A 17-piece SS26 capsule of couture aloha shirts - numbered, seasonal, and gone when summer ends.",
    season: "SS26 · Limited Edition",
    featured: true,
    productSlugs: [
      "hibiscus-atelier-shirt",
      "palm-noir-camp-shirt",
      "koi-pond-silk-shirt",
      "bird-of-paradise-shirt",
      "tropical-toile-shirt",
      "sunset-promenade-shirt",
      "monstera-house-shirt",
      "pineapple-jacquard-shirt",
      "banana-leaf-shirt",
      "tiki-lounge-shirt",
      "surf-club-shirt",
      "orchid-noir-shirt",
      "parrot-riviera-shirt",
      "seashell-border-shirt",
      "flamingo-deco-shirt",
      "lei-garland-shirt",
      "palm-damask-resort-shirt",
    ],
  },
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
