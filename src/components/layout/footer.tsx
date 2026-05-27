"use client";

import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";

  return (
    <footer
      className={cn(
        "py-12 px-6 border-t border-neutral-200/50 dark:border-neutral-800/50",
        isTerminal && "border-[#00ff4130]",
        isNewspaper && "border-[#c4b59e]",
      )}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        {isNewspaper ? (
          <>
            <hr className="newspaper-rule w-full" />
            <p className="text-xs font-serif text-[#7a6b5a] tracking-wider text-center">
              &copy; {year} Lance Abuan &middot; Built with Next.js &amp; shadcn/ui
            </p>
          </>
        ) : isTerminal ? (
          <>
            <div className="w-full border-t border-[#00ff4130]" />
            <p className="text-xs font-mono text-[#00aa30] text-center">
              {/* eslint-disable-next-line @next/next/no-svg */}
              &lt;/&gt; {year} Lance Abuan &bull; Next.js &bull; shadcn/ui
            </p>
          </>
        ) : (
          <>
            <Separator className="w-full" />
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              © {year} Lance Abuan. Built with Next.js & shadcn/ui.
            </p>
          </>
        )}
      </div>
    </footer>
  );
}
