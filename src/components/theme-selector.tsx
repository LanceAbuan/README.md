"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Monitor,
  Terminal,
  Palette,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

/**
 * Load custom colors from localStorage.
 */
function loadCustomColors(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save custom colors to localStorage and apply to document root.
 */
function saveAndApplyCustomColors(colors: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch {
    // quota exceeded — silently skip
  }
  const root = document.documentElement;
  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(key, value);
  }
}

/**
 * Theme selector with dropdown and custom color picker.
 *
 * Replaces the binary sun/moon toggle with a full theme picker.
 * Supports preset themes (light, dark, system, terminal) and
 * a custom mode with live color inputs persisted to localStorage.
 */
export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Load saved custom colors once on mount
  useEffect(() => {
    const saved = loadCustomColors();
    if (Object.keys(saved).length > 0) {
      setColors(saved);
      saveAndApplyCustomColors(saved);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Switch to custom theme when picker opens
  const handleCustomClick = () => {
    setTheme("custom");
    setShowPicker(true);
  };

  const handleColorChange = (varName: string, value: string) => {
    const updated = { ...colors, [varName]: value };
    setColors(updated);
    saveAndApplyCustomColors(updated);
  };

  if (!mounted) return <Button variant="ghost" size="icon" disabled />;

  const currentLabel =
    THEME_OPTIONS.find((t) => t.value === theme)?.label ?? "Theme";

  return (
    <div className="relative" ref={popupRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setOpen(!open);
          setShowPicker(false);
        }}
        className="size-9 transition-opacity hover:opacity-70"
        aria-label="Select theme"
      >
        <Palette className="h-4 w-4" />
      </Button>

      {open && !showPicker && (
        <div className="absolute right-0 top-12 w-44 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-lg overflow-hidden z-50">
          <div className="px-3 py-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Theme
          </div>
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                if (opt.value === "custom") {
                  handleCustomClick();
                } else {
                  setTheme(opt.value);
                  setOpen(false);
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                theme === opt.value
                  ? "text-foreground"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <span className="flex-shrink-0">{opt.icon}</span>
              <span className="flex-1 text-left">{opt.label}</span>
              {theme === opt.value && (
                <Check className="h-3.5 w-3.5 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {open && showPicker && (
        <div className="absolute right-0 top-12 w-64 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200/50 dark:border-neutral-700/50">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Custom Colors
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowPicker(false);
              }}
              className="h-6 w-6"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 max-h-72 overflow-y-auto">
            {CUSTOM_COLORS.map((c) => (
              <label
                key={c.key}
                className="flex items-center gap-2 text-xs"
              >
                <input
                  type="color"
                  value={colors[c.varName] ?? "#000000"}
                  onChange={(e) => handleColorChange(c.varName, e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-neutral-300 dark:border-neutral-600 bg-transparent"
                />
                <span className="text-neutral-600 dark:text-neutral-400">
                  {c.label}
                </span>
              </label>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-neutral-200/50 dark:border-neutral-700/50 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs flex-1"
              onClick={() => {
                setColors({});
                localStorage.removeItem(STORAGE_KEY);
                // Reset by removing inline overrides — the CSS .custom block takes over
                const root = document.documentElement;
                CUSTOM_COLORS.forEach((c) =>
                  root.style.removeProperty(c.varName)
                );
              }}
            >
              Reset
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs flex-1"
              onClick={() => {
                setShowPicker(false);
                setOpen(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
