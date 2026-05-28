/**
 * ============================================================
 * useThemeConfig Hook
 * ============================================================
 *
 * Bridges `next-themes` with the theme registry.
 * Returns the current theme's full config object.
 *
 * Usage:
 *   const themeConfig = useThemeConfig();
 *   const { colors, typography, sections, features } = themeConfig;
 *
 * This replaces the pattern of:
 *   const { theme } = useTheme();
 *   const isTerminal = theme === "terminal";
 *   const isNewspaper = theme === "newspaper";
 *   // ... then massive ternary chains everywhere
 * ============================================================
 */
"use client";

import { useTheme } from "next-themes";
import { getThemeConfig } from "@/themes/registry";

/**
 * Returns the ThemeConfig for the currently active theme.
 *
 * For "light", "dark", "system" → returns the default theme config.
 * For custom themes (terminal, newspaper, synthwave, casino) → returns their config.
 */
export function useThemeConfig() {
  const { theme } = useTheme();
  const resolved = theme ?? "light";

  // For system theme, we still return default — the CSS handles light/dark
  return getThemeConfig(resolved);
}
