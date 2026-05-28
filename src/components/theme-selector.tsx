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
  X,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  { value: "synthwave", label: "Synthwave", icon: <Sparkles className="h-4 w-4" /> },
  { value: "casino", label: "Casino", icon: <Trophy className="h-4 w-4" /> },
  { value: "custom", label: "Custom", icon: <Palette className="h-4 w-4" /> },
];

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

const STORAGE_KEY = "custom…lors";

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

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const saved = loadCustomColors();
    if (Object.keys(saved).length > 0) {
      setColors(saved);
      saveAndApplyCustomColors(saved);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

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

  const handleSelect = useCallback(
    (value: string) => {
      if (value === "custom") {
        setTheme("custom");
        setShowPicker(true);
      } else {
        setTheme(value);
        setOpen(false);
        setShowPicker(false);
      }
    },
    [setTheme],
  );

  if (!mounted)
    return (
      <button
        disabled
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
      />
    );

  // Popup z-index must beat sheet overlay (z-50)
  const popupClass =
    "absolute right-0 top-11 z-[60] rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10";

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => {
          setOpen(!open);
          setShowPicker(false);
        }}
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-medium",
          "transition-colors outline-none select-none",
          "hover:bg-muted dark:hover:bg-muted/50",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        )}
        aria-label="Select theme"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && !showPicker && (
        <div className={`${popupClass} w-44`} role="menu">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Theme
          </div>
          <div className="my-1 h-px bg-border" />

          {THEME_OPTIONS.map((opt) => {
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                role="menuitem"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 pr-7 text-sm outline-none",
                  "focus:bg-accent focus:text-accent-foreground",
                  isActive && "bg-accent",
                )}
              >
                {opt.icon}
                <span className="flex-1 text-left">{opt.label}</span>
                {isActive && (
                  <Check className="h-3.5 w-3.5 absolute right-2 top-1/2 -translate-y-1/2" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {open && showPicker && (
        <div
          className={`${popupClass} w-64 p-0 overflow-hidden`}
          role="dialog"
          aria-label="Custom color picker"
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Custom Colors
            </span>
            <button
              onClick={() => setShowPicker(false)}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted"
              aria-label="Close picker"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 max-h-72 overflow-y-auto">
            {CUSTOM_COLORS.map((c) => (
              <label key={c.key} className="flex items-center gap-2 text-sm">
                <input
                  type="color"
                  value={colors[c.varName] ?? "#000000"}
                  onChange={(e) =>
                    handleColorChange(c.varName, e.target.value)
                  }
                  className="w-7 h-7 rounded cursor-pointer border border-border bg-transparent"
                />
                <span className="text-muted-foreground">{c.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 border-t border-border px-3 py-2">
            <button
              onClick={handleReset}
              className="flex-1 inline-flex h-7 items-center justify-center rounded-md border border-border bg-background px-2 text-sm hover:bg-muted"
            >
              Reset
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setShowPicker(false);
              }}
              className="flex-1 inline-flex h-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-2 text-sm hover:bg-secondary/80"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
