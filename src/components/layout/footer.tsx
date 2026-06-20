"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import { terminalPalette, newspaperPalette } from "@/config/theme-palette";

export function Footer() {
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";
  const isSynthwave = theme === "synthwave";

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative py-8 px-6",
        isNewspaper && "border-t border-[#c4b59e]",
        isTerminal && "border-t border-[#00ff4120]",
        isCasino && "border-t border-[#d4af37]/15",
        isSynthwave && "border-t border-[#ff00ff] shadow-[0_-1px_20px_rgba(255,0,255,0.1)]",
        !isTerminal && !isNewspaper && !isCasino && !isSynthwave && "border-t border-transparent gradient-divider",
      )}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left",
            !isTerminal && !isNewspaper && !isCasino && !isSynthwave && "glass-card px-6 py-4",
          )}
        >
          <p
            className={cn(
              "text-sm",
              isTerminal && "font-mono",
              isNewspaper && "font-serif text-[#7a6b5a]",
              isCasino && "font-serif",
              isSynthwave && "text-[#ff00ff]",
              !isTerminal && !isNewspaper && !isCasino && !isSynthwave && "text-neutral-500 dark:text-neutral-400",
            )}
            style={
              isTerminal
                ? { color: terminalPalette.secondary }
                : isCasino
                  ? { color: "#8a7e72" }
                  : undefined
            }
          >
            {isTerminal ? (
              <span className="font-mono">
                <span style={{ color: terminalPalette.primary }}>
                  {"<<"}
                </span>{" "}
                &copy; {currentYear} {siteConfig.name}{" "}
                <span style={{ color: terminalPalette.primary }}>
                  {">>"}
                </span>
              </span>
            ) : isNewspaper ? (
              <span className="font-serif text-xs">
                <span className="font-bold newspaper-letterpress" style={{ color: newspaperPalette.primary }}>
                  &copy; {currentYear} {siteConfig.name}
                </span>
              </span>
            ) : isCasino ? (
              <span className="font-serif" style={{ color: "#8a7e72" }}>
                &copy; {currentYear} {siteConfig.name}
              </span>
            ) : (
              <span>
                &copy; {currentYear} {siteConfig.name}
              </span>
            )}
            <span className="sr-only">. All rights reserved.</span>
          </p>

          {isTerminal ? (
            <p
              className="text-xs font-mono"
              style={{ color: "#00ff4140" }}
            >
              [session closed]
            </p>
          ) : isNewspaper ? (
            <p
              className="text-xs font-serif italic"
              style={{ color: newspaperPalette.muted }}
            >
              — End of Edition —
            </p>
          ) : isCasino ? (
            <p
              className="text-xs font-serif"
              style={{ color: "#8a7e72" }}
            >
              The house always wins — but only after you&apos;ve impressed them.
            </p>
          ) : (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              All rights reserved.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
