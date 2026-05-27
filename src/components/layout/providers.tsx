"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Available theme names.
 *
 * To add a new preset theme:
 * 1. Add the name to this array
 * 2. Add a CSS selector block in globals.css (e.g. `.ocean { --primary: ... }`)
 * 3. Add a Tailwind variant: `@custom-variant ocean (&:is(.ocean *))`
 * 4. Add an entry to the theme selector UI
 * That's it — no framework config changes needed.
 */
export const THEMES = ["light", "dark", "system", "terminal", "newspaper", "custom"] as string[];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      enableColorScheme
      themes={THEMES}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  );
}
