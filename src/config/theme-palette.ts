/**
 * Centralized color palettes for each theme variant.
 * Keeps magic hex values out of components.
 */

/** Terminal (green-on-black) palette. */
export const terminalPalette = {
  primary: "#00ff41",
  secondary: "#00aa30",
  muted: "#00cc33",
  accent: "#0d1a0d",
  error: "#ff3333",
  glowBorder: "#00ff4130",
} as const;

/** Newspaper (sepia/cream) palette. */
export const newspaperPalette = {
  primary: "#1a1208",
  secondary: "#5c2e0e",
  muted: "#7a6b5a",
  body: "#3d2b1f",
  accent: "#c4b59e",
  highlight: "#f7f2ea",
  background: "#efe8da",
  highlightBg: "#ddd2be",
} as const;

/** Casino (gold/red/dark) palette. */
export const casinoPalette = {
  gold: "#d4af37",
  goldMuted: "#c8bfb2",
  goldLight: "#fef3c7",
  neon: "#dc2626",
  redAccent: "#8b1a1a",
  background: "#f5f0e8",
  text: "#f5f0e8",
  textDark: "#1c0c0c",
  muted: "#8a7e72",
  chipBg: "#2a1a10",
} as const;

/** Default (light/dark mode via Tailwind) palette — uses Tailwind semantic tokens. */
export const defaultPalette = {
  // These are Tailwind class tokens, not hex values.
  // e.g. "text-neutral-400 dark:text-neutral-500"
} as const;

/** Theme selector options — maps to next-themes values. */
export const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
  { value: "terminal", label: "Terminal" },
  { value: "newspaper", label: "Newspaper" },
  { value: "synthwave", label: "Synthwave" },
  { value: "casino", label: "Casino" },
] as const;
