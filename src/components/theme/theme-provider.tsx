"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  isThemeMode,
  isThemeName,
  MODE_STORAGE_KEY,
  type ThemeMode,
  THEME_STORAGE_KEY,
  type ThemeName,
} from "@/components/theme/theme-config";

type ThemeContextValue = {
  mode: ThemeMode;
  theme: ThemeName;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: ThemeName) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof document === "undefined") {
      return DEFAULT_MODE;
    }

    const rootMode = document.documentElement.dataset.mode;
    const storedMode = localStorage.getItem(MODE_STORAGE_KEY);
    const nextMode = [rootMode, storedMode].find(
      (value): value is ThemeMode => typeof value === "string" && isThemeMode(value),
    );
    return nextMode ?? DEFAULT_MODE;
  });

  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof document === "undefined") {
      return DEFAULT_THEME;
    }

    const rootTheme = document.documentElement.dataset.theme;
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = [rootTheme, storedTheme].find(
      (value): value is ThemeName => typeof value === "string" && isThemeName(value),
    );
    return nextTheme ?? DEFAULT_THEME;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.mode = mode;
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme,
      setMode,
      setTheme,
      toggleMode: () => setMode((currentMode) => (currentMode === "light" ? "dark" : "light")),
    }),
    [mode, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
