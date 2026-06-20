"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@mantine/core";
import { useSyncExternalStore } from "react";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useHydrated();

  if (!mounted) return <Button variant="subtle" size="compact-sm" disabled />;

  return (
    <Button
      variant="subtle"
      size="compact-sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="size-9 transition-opacity hover:opacity-70"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}
