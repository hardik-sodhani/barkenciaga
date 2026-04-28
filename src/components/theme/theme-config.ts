export const MODE_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export type ThemeMode = (typeof MODE_OPTIONS)[number]["value"];

export const THEME_OPTIONS = [
  { value: "barkenciaga", label: "Barkenciaga" },
  { value: "noir", label: "Noir" },
  { value: "biscuit", label: "Biscuit" },
  { value: "rose", label: "Rose" },
  { value: "riviera", label: "Riviera" },
] as const;

export type ThemeName = (typeof THEME_OPTIONS)[number]["value"];

export const DEFAULT_MODE: ThemeMode = "light";
export const DEFAULT_THEME: ThemeName = "barkenciaga";

export const MODE_STORAGE_KEY = "barkenciaga-mode";
export const THEME_STORAGE_KEY = "barkenciaga-theme";

const VALID_MODES = new Set<ThemeMode>(MODE_OPTIONS.map((mode) => mode.value));
const VALID_THEMES = new Set<ThemeName>(THEME_OPTIONS.map((theme) => theme.value));

export function isThemeMode(value: string): value is ThemeMode {
  return VALID_MODES.has(value as ThemeMode);
}

export function isThemeName(value: string): value is ThemeName {
  return VALID_THEMES.has(value as ThemeName);
}

export const themeInitScript = `
(() => {
  const root = document.documentElement;
  const defaultMode = "${DEFAULT_MODE}";
  const defaultTheme = "${DEFAULT_THEME}";
  const modeKey = "${MODE_STORAGE_KEY}";
  const themeKey = "${THEME_STORAGE_KEY}";
  const validModes = new Set(["light", "dark"]);
  const validThemes = new Set(["barkenciaga", "noir", "biscuit", "rose", "riviera"]);

  const getStoredMode = localStorage.getItem(modeKey);
  const getStoredTheme = localStorage.getItem(themeKey);

  const mode = validModes.has(getStoredMode ?? "") ? getStoredMode : defaultMode;
  const theme = validThemes.has(getStoredTheme ?? "") ? getStoredTheme : defaultTheme;

  root.dataset.mode = mode;
  root.dataset.theme = theme;
})();
`;
