#!/usr/bin/env node
/**
 * Minimal smoke test for Barkenciaga.
 * Walks every public route and reports HTTP status + a basic content check.
 * Also runs a crude accessibility check: the text-ink-40 class has been
 * demoted to borders-only, so any occurrence in rendered HTML is a regression.
 * Run with: pnpm smoke
 */

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const routes = [
  { path: "/", contains: "Barkenciaga", expectsImage: true },
  { path: "/c/couture", contains: "Couture", expectsImage: true },
  { path: "/c/accessories", contains: "Accessories", expectsImage: true },
  { path: "/c/eyewear", contains: "Eyewear", expectsImage: true },
  { path: "/c/footwear", contains: "Footwear", expectsImage: true },
  { path: "/p/monogram-quilted-coat", contains: "Monogram Quilted Coat", expectsImage: true },
  { path: "/collections/autumn-woofer-26", contains: "Autumn", expectsImage: true },
  { path: "/cart", contains: "Bag" },
  { path: "/sign-in", contains: "Sign in" },
  { path: "/showroom", contains: "Showroom" },
  { path: "/search?q=quilted", contains: "Quilted" },
];

let failures = 0;
for (const r of routes) {
  try {
    const res = await fetch(`${BASE}${r.path}`, { redirect: "manual" });
    const redirectOk = res.status === 307 && ["/account", "/admin"].some((p) => r.path.startsWith(p));
    if (!res.ok && !redirectOk) {
      console.error(`  FAIL  ${res.status}  ${r.path}`);
      failures++;
      continue;
    }
    const body = await res.text();
    if (r.contains && !body.includes(r.contains)) {
      console.error(`  FAIL  content missing "${r.contains}"  ${r.path}`);
      failures++;
      continue;
    }
    if (body.includes("text-ink-40")) {
      console.error(`  FAIL  a11y regression: text-ink-40 found in rendered HTML  ${r.path}`);
      failures++;
      continue;
    }
    if (r.expectsImage && !/\/_next\/image\?[^"]*\/products\//.test(body) && !body.includes("/products/")) {
      console.error(`  FAIL  expected product image reference in HTML  ${r.path}`);
      failures++;
      continue;
    }
    console.log(`    OK  ${res.status}  ${r.path}`);
  } catch (err) {
    console.error(`  FAIL  ${err.message}  ${r.path}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n${failures} smoke test failure(s).`);
  process.exit(1);
}
console.log("\nAll smoke tests passed.");
