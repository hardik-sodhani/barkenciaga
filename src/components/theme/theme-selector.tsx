"use client";

import { useCallback, useState } from "react";
import { Moon, Palette, Sun } from "lucide-react";
import {
  APPEARANCE_STORAGE_KEY,
  APPEARANCES,
  THEME_IDS,
  THEME_LABELS,
  THEME_STORAGE_KEY,
  type Appearance,
  type ThemeId,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

function parseThemeAttr(value: string | null): ThemeId {
  if (value === "runway" || value === "midnight" || value === "terracotta" || value === "studio") {
    return value;
  }
  return "runway";
}

function parseAppearanceAttr(value: string | null): Appearance {
  if (value === "light" || value === "dark") return value;
  return "light";
}

function readFromDocument(): { theme: ThemeId; appearance: Appearance } {
  const root = document.documentElement;
  return {
    theme: parseThemeAttr(root.getAttribute("data-theme")),
    appearance: parseAppearanceAttr(root.getAttribute("data-appearance")),
  };
}

function persistToDom(theme: ThemeId, appearance: Appearance) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-appearance", appearance);
  root.style.colorScheme = appearance === "dark" ? "dark" : "light";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
  } catch {
    /* ignore */
  }
}

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("runway");
  const [appearance, setAppearance] = useState<Appearance>("light");

  const openMenu = useCallback(() => {
    const { theme: t, appearance: a } = readFromDocument();
    setTheme(t);
    setAppearance(a);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);

  const persist = useCallback((nextTheme: ThemeId, nextAppearance: Appearance) => {
    persistToDom(nextTheme, nextAppearance);
    setTheme(nextTheme);
    setAppearance(nextAppearance);
  }, []);

  const toggleAppearance = useCallback(() => {
    const next = appearance === "light" ? "dark" : "light";
    persist(theme, next);
  }, [appearance, persist, theme]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (open ? closeMenu() : openMenu())}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center border border-ink-20 bg-bone/80 text-ink hover:border-ink",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-bone",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Theme and appearance"
      >
        <Palette className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            aria-label="Close theme menu"
            onClick={closeMenu}
          />
          <div
            role="dialog"
            aria-label="Choose theme"
            className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,280px)] border border-ink-20 bg-bone-50 p-4 shadow-lg"
          >
            <div className="eyebrow mb-3 text-[10px]">Appearance</div>
            <div className="flex gap-2">
              {APPEARANCES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    persist(theme, a);
                  }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 border px-3 py-2 text-[11px] tracking-[0.14em] uppercase",
                    appearance === a
                      ? "border-ink bg-ink text-bone"
                      : "border-ink-20 text-ink-80 hover:border-ink",
                  )}
                >
                  {a === "light" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                  {a}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleAppearance}
              className="mt-2 w-full border border-ink-20 py-2 text-[10px] tracking-[0.18em] uppercase text-ink-65 hover:border-ink hover:text-ink"
            >
              Quick toggle
            </button>

            <div className="mt-5 eyebrow mb-3 text-[10px]">Palette</div>
            <ul className="space-y-1">
              {THEME_IDS.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      persist(id, appearance);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between border px-3 py-2.5 text-left text-sm",
                      theme === id
                        ? "border-ink bg-bone-200"
                        : "border-transparent hover:border-ink-20 hover:bg-bone-100",
                    )}
                  >
                    <span className="font-medium">{THEME_LABELS[id]}</span>
                    {theme === id && (
                      <span className="text-[10px] tracking-widest uppercase text-ink-65">Active</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
