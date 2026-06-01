"use client";

import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, Palette, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { themes } from "@/config/theme-palette";
import {
  THEME_SELECTOR_LABEL,
  THEME_OPTION_LABEL,
} from "@/config/accessibility";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "relative h-8 w-8 inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
        )}
        aria-label={THEME_SELECTOR_LABEL}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup heading={THEME_SELECTOR_LABEL}>
              {themes.map((t) => (
                <CommandItem
                  key={t.value}
                  onSelect={() => setTheme(t.value)}
                  className="flex items-center justify-between"
                  aria-label={THEME_OPTION_LABEL(t.label)}
                >
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span>{t.label}</span>
                  </div>
                  {theme === t.value && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
