import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  MODE_OPTIONS,
  THEME_OPTIONS,
} from "@/components/theme/theme-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const expectedThemeIds = ["barkenciaga", "noir", "biscuit", "rose", "riviera"];

assert.equal(DEFAULT_MODE, "light", "default mode must remain light");
assert.equal(DEFAULT_THEME, "barkenciaga", "default theme must remain barkenciaga");
assert.deepEqual(
  MODE_OPTIONS.map((mode) => mode.value),
  ["light", "dark"],
  "mode options should expose light and dark",
);
assert.deepEqual(
  THEME_OPTIONS.map((theme) => theme.value),
  expectedThemeIds,
  "theme options should include barkenciaga + 4 named themes",
);

const headerSource = readFileSync(
  join(projectRoot, "src/components/layout/site-header.tsx"),
  "utf8",
);
assert.match(
  headerSource,
  /<ThemeToggle/,
  "site header should render ThemeToggle",
);

console.log("Theme tests passed.");
