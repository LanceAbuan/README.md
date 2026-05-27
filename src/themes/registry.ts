/**
 * ============================================================
 * THEME REGISTRY
 * ============================================================
 *
 * Central lookup for all registered themes.
 *
 * To add a new theme:
 *   1. Create `src/themes/<name>.ts` with a `ThemeConfig` export
 *   2. Import it here and add to the `THEME_REGISTRY` map
 *   3. Add the `id` to `THEMES` in `providers.tsx`
 *   4. Add CSS variables in `globals.css` under `.<className>`
 *   5. Add `@custom-variant` in `globals.css`
 *
 * Components should use `getThemeConfig(id)` or the `useThemeConfig`
 * hook to look up theme data at runtime.
 * ============================================================
 */
import type { ThemeConfig } from "./types";
import { defaultTheme } from "./default";
import { terminalTheme } from "./terminal";
import { newspaperTheme } from "./newspaper";
import { synthwaveTheme } from "./synthwave";
import { casinoTheme } from "./casino";

/**
 * Map of theme ID → config.
 *
 * The key must match the `id` field and the value passed to
 * `next-themes` in `providers.tsx`.
 */
export const THEME_REGISTRY: Record<string, ThemeConfig> = {
  light: defaultTheme,
  dark: defaultTheme,
  system: defaultTheme,
  terminal: terminalTheme,
  newspaper: newspaperTheme,
  synthwave: synthwaveTheme,
  casino: casinoTheme,
};

/**
 * Look up a theme config by ID.
 * Falls back to default if not found (shouldn't happen in practice).
 */
export function getThemeConfig(id: string): ThemeConfig {
  return THEME_REGISTRY[id] ?? defaultTheme;
}

/**
 * Get all custom (non-default) themes for the selector UI.
 * Excludes "light", "dark", "system" since those share the default config.
 */
export function getCustomThemes(): ThemeConfig[] {
  return Object.values(THEME_REGISTRY).filter(
    (t) => t.id !== "default",
  );
}
