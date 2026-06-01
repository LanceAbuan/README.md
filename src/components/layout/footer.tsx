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
        "border-t py-8 px-6",
        isNewspaper &&
          "border-[#c4b59e]",
        isTerminal &&
          "border-[#00ff4120]",
        isCasino &&
          "border-[#d4af37]/15",
        isSynthwave &&
          "border-[#ff00ff] shadow-[0_-1px_20px_rgba(255,0,255,0.1)]",
        !isTerminal &&
          !isNewspaper &&
          !isCasino &&
          !isSynthwave &&
          "border-neutral-200/50 dark:border-neutral-700/50",
      )}
      role="contentinfo"
    >
      <div
        className={cn(
          "max-w-6xl mx-auto flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left",
        )}
      >
        <div
          className={cn(
            "text-sm text-neutral-500 dark:text-neutral-400",
            isTerminal &&
              "font-mono",
            isNewspaper &&
              "font-serif text-[#7a6b5a]",
            isCasino &&
              "font-serif",
            isSynthwave &&
              "text-[#ff00ff]",
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
              © {currentYear} {siteConfig.name}{" "}
              <span style={{ color: terminalPalette.primary }}>
                {">>"}
              </span>
            </span>
          ) : isNewspaper ? (
            <p className="font-serif text-xs">
              <span className="font-bold newspaper-letterpress" style={{ color: newspaperPalette.primary }}>
                © {currentYear} {siteConfig.name}
              </span>
            </p>
          ) : isCasino ? (
            <p className="font-serif" style={{ color: "#8a7e72" }}>
              © {currentYear} {siteConfig.name}
            </p>
          ) : (
            <>© {currentYear} {siteConfig.name}</>
          )}
          <span className="sr-only">. All rights reserved.</span>
        </div>

        {isTerminal ? (
          <p
            className="text-xs font-mono"
            style={{ color: "#00ff4140" }}
          >
            [session closed]
          </p>
        ) : isNewspaper ? (
          <p className="text-xs font-serif italic" style={{ color: newspaperPalette.muted }}>
            — End of Edition —
          </p>
        ) : isCasino ? (
          <p className="text-xs font-serif" style={{ color: "#8a7e72" }}>
            The house always wins — but only after you&apos;ve impressed them.
          </p>
        ) : (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            All rights reserved.
          </p>
        )}
      </div>
    </footer>
  );
}
