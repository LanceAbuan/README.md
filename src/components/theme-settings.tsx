"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const STORAGE_KEY = "portfolio-theme-hues";

interface ThemeHues {
  primary: number;
  secondary: number;
}

/**
 * Floating theme settings button + panel.
 *
 * Lets users pick a custom primary and secondary hue (0–360).
 * Changes are applied instantly via CSS custom properties on :root
 * and persisted to localStorage.
 */
export function ThemeSettings() {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hues, setHues] = useState<ThemeHues>({ primary: 250, secondary: 160 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Load saved hues from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ThemeHues;
        if (typeof parsed.primary === "number" && typeof parsed.secondary === "number") {
          setHues(parsed);
          applyHues(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Close panel on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const applyHues = useCallback((newHues: ThemeHues) => {
    document.documentElement.style.setProperty("--theme-hue-primary", String(newHues.primary));
    document.documentElement.style.setProperty("--theme-hue-secondary", String(newHues.secondary));
  }, []);

  const updateHue = useCallback(
    (key: keyof ThemeHues, value: number) => {
      const newHues = { ...hues, [key]: value };
      setHues(newHues);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHues));
      applyHues(newHues);
    },
    [hues, applyHues],
  );

  const resetDefaults = useCallback(() => {
    const defaults = { primary: 250, secondary: 160 };
    setHues(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    applyHues(defaults);
    document.documentElement.style.removeProperty("--theme-hue-primary");
    document.documentElement.style.removeProperty("--theme-hue-secondary");
  }, [applyHues]);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={open ? "Close theme settings" : "Open theme settings"}
        aria-expanded={open}
        aria-controls="theme-settings-panel"
      >
        {open ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
      </button>

      {/* Settings panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="theme-settings-panel"
            ref={panelRef}
            role="dialog"
            aria-label="Theme settings"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-72 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Custom Colors</h3>
            </div>

            {/* Primary hue */}
            <div className="mb-4">
              <label
                htmlFor="theme-primary"
                className="block text-xs text-muted-foreground mb-1.5"
              >
                Primary Hue ({hues.primary}°)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="theme-primary"
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={hues.primary}
                  onChange={(e) => updateHue("primary", Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-primary"
                  style={{
                    background:
                      "linear-gradient(to right, hsl(0,80%,55%), hsl(60,80%,55%), hsl(120,80%,55%), hsl(180,80%,55%), hsl(240,80%,55%), hsl(300,80%,55%), hsl(360,80%,55%))",
                  }}
                  aria-label="Primary hue"
                />
                <div
                  className="h-6 w-6 rounded-md border border-border flex-shrink-0"
                  style={{
                    background: `oklch(0.45 0.22 ${hues.primary})`,
                  }}
                />
              </div>
            </div>

            {/* Secondary hue */}
            <div className="mb-4">
              <label
                htmlFor="theme-secondary"
                className="block text-xs text-muted-foreground mb-1.5"
              >
                Secondary Hue ({hues.secondary}°)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="theme-secondary"
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={hues.secondary}
                  onChange={(e) => updateHue("secondary", Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-secondary"
                  style={{
                    background:
                      "linear-gradient(to right, hsl(0,80%,55%), hsl(60,80%,55%), hsl(120,80%,55%), hsl(180,80%,55%), hsl(240,80%,55%), hsl(300,80%,55%), hsl(360,80%,55%))",
                  }}
                  aria-label="Secondary hue"
                />
                <div
                  className="h-6 w-6 rounded-md border border-border flex-shrink-0"
                  style={{
                    background: `oklch(0.35 0.18 ${hues.secondary})`,
                  }}
                />
              </div>
            </div>

            {/* Quick presets */}
            <div className="mb-3">
              <span className="block text-xs text-muted-foreground mb-2">Presets</span>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: "Indigo", primary: 250, secondary: 160 },
                  { label: "Rose", primary: 340, secondary: 30 },
                  { label: "Emerald", primary: 150, secondary: 200 },
                  { label: "Amber", primary: 35, secondary: 220 },
                  { label: "Violet", primary: 280, secondary: 180 },
                  { label: "Sky", primary: 200, secondary: 140 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const newHues = { primary: preset.primary, secondary: preset.secondary };
                      setHues(newHues);
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHues));
                      applyHues(newHues);
                    }}
                    className="h-7 w-7 rounded-full border-2 border-transparent hover:border-foreground/30 transition-colors flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.45 0.22 ${preset.primary}), oklch(0.35 0.18 ${preset.secondary}))`,
                    }}
                    aria-label={`${preset.label} theme preset`}
                    title={preset.label}
                  />
                ))}
              </div>
            </div>

            {/* Reset button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDefaults}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Reset to defaults
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
