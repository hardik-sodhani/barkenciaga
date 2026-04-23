export const THEME_STORAGE_KEY = "barkenciaga-theme";
export const APPEARANCE_STORAGE_KEY = "barkenciaga-appearance";

export const THEME_IDS = ["runway", "midnight", "terracotta", "studio"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const APPEARANCES = ["light", "dark"] as const;
export type Appearance = (typeof APPEARANCES)[number];

export function isThemeId(value: string | null): value is ThemeId {
  return value !== null && (THEME_IDS as readonly string[]).includes(value);
}

export function isAppearance(value: string | null): value is Appearance {
  return value === "light" || value === "dark";
}

export const THEME_LABELS: Record<ThemeId, string> = {
  runway: "Runway",
  midnight: "Midnight",
  terracotta: "Terracotta",
  studio: "Studio",
};
