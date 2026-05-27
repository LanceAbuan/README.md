"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Monitor,
  Terminal,
  Palette,
  Check,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Label and icon for each theme.
 *
 * To add a new preset theme, add an entry here.
 * The key must match the theme name in providers.tsx THEMES array.
 */
const THEME_OPTIONS: Array<{
  value: string;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  { value: "terminal", label: "Terminal", icon: <Terminal className="h-4 w-4" /> },
  { value: "newspaper", label: "Newspaper", icon: <Newspaper className="h-4 w-4" /> },
  { value: "custom", label: "Custom", icon: <Palette className="h-4 w-4" /> },
];

/** Color roles exposed to the custom color picker. */
const CUSTOM_COLORS: Array<{
  key: string;
  label: string;
  varName: string;
}> = [
  { key: "background", label: "Background", varName: "--background" },
  { key: "foreground", label: "Foreground", varName: "--foreground" },
  { key: "primary", label: "Primary", varName: "--primary" },
  { key: "primaryFg", label: "Primary text", varName: "--primary-foreground" },
  { key: "secondary", label: "Secondary", varName: "--secondary" },
  { key: "accent", label: "Accent", varName: "--accent" },
  { key: "muted", label: "Muted", varName: "--muted" },
  { key: "mutedFg", label: "Muted text", varName: "--muted-foreground" },
  { key: "border", label: "Border", varName: "--border" },
];

const STORAGE_KEY = "custom-theme-colors";

function loadCustomColors(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAndApplyCustomColors(colors: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch {
    // quota exceeded
  }
  const root = document.documentElement;
  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(key, value);
  }
}

/**
 * Theme selector — inline dropdown + modal color picker.
 *
 * All UI stays within the page. Uses shadcn DropdownMenu for
 * theme selection and Dialog for the custom color picker.
 * The Dialog trigger is a hidden button that fires programmatically.
 */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const saved = loadCustomColors();
    if (Object.keys(saved).length > 0) {
      setColors(saved);
      saveAndApplyCustomColors(saved);
    }
  }, []);

  const handleColorChange = useCallback(
    (varName: string, value: string) => {
      setColors((prev) => {
        const updated = { ...prev, [varName]: value };
        saveAndApplyCustomColors(updated);
        return updated;
      });
    },
    [],
  );

  const handleReset = useCallback(() => {
    setColors({});
    localStorage.removeItem(STORAGE_KEY);
    const root = document.documentElement;
    CUSTOM_COLORS.forEach((c) => root.style.removeProperty(c.varName));
  }, []);

  const openCustomPicker = useCallback(() => {
    setTheme("custom");
    // Click the hidden trigger to open the Dialog
    triggerRef.current?.click();
  }, [setTheme]);

  if (!mounted) return <Button variant="ghost" size="icon" disabled />;

  const presets = THEME_OPTIONS.filter((t) => t.value !== "custom");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 transition-opacity hover:opacity-70"
            aria-label="Select theme"
          >
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {presets.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setTheme(opt.value)}
              >
                {opt.icon}
                <span className="flex-1">{opt.label}</span>
                {theme === opt.value && <Check className="h-3.5 w-3.5 ml-auto" />}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={openCustomPicker}>
              <Palette className="h-4 w-4" />
              <span className="flex-1">Custom</span>
              {theme === "custom" && <Check className="h-3.5 w-3.5 ml-auto" />}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden button + Dialog for custom color picker.
          The dropdown menu item clicks this button to open the modal. */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <button
          ref={triggerRef}
          onClick={() => setPickerOpen(true)}
          className="sr-only"
          aria-label="Open custom color picker"
        >
          Open color picker
        </button>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Custom Colors
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-2">
            {CUSTOM_COLORS.map((c) => (
              <label
                key={c.key}
                className="flex items-center gap-3 text-sm"
              >
                <input
                  type="color"
                  value={colors[c.varName] ?? "#000000"}
                  onChange={(e) =>
                    handleColorChange(c.varName, e.target.value)
                  }
                  className="w-8 h-8 rounded cursor-pointer border border-neutral-300 dark:border-neutral-600 bg-transparent"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
