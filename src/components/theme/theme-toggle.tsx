"use client";

import { isThemeName, THEME_OPTIONS } from "@/components/theme/theme-config";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { mode, theme, setTheme, toggleMode } = useTheme();

  return (
    <div data-theme-toggle className="hidden md:flex items-center gap-2">
      <button
        type="button"
        onClick={toggleMode}
        className="inline-flex h-9 items-center border border-ink-20 px-3 text-[10px] tracking-[0.2em] uppercase text-ink-65 hover:border-ink hover:text-ink"
        aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {mode === "light" ? "Dark" : "Light"}
      </button>

      <label className="sr-only" htmlFor="theme-select">
        Theme
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(event) => {
          if (isThemeName(event.target.value)) {
            setTheme(event.target.value);
          }
        }}
        className="h-9 border border-ink-20 bg-bone-50 px-2 text-[10px] tracking-[0.14em] uppercase text-ink-65 hover:text-ink"
      >
        {THEME_OPTIONS.map((themeOption) => (
          <option key={themeOption.value} value={themeOption.value}>
            {themeOption.label}
          </option>
        ))}
      </select>
    </div>
  );
}
