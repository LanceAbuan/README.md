"use client";

import { Separator } from "@/components/ui/separator";
import { useThemeConfig } from "@/hooks/use-theme-config";
import { cn } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();
  const config = useThemeConfig();

  // For newspaper, render triple rule + editorial footer
  if (config.id === "newspaper") {
    return (
      <footer className={config.footer.borderClass}>
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <hr className="newspaper-rule w-full" />
          <p className={config.footer.textClass}>
            &copy; {year} Lance Abuan &middot; Built with Next.js &amp; shadcn/ui
          </p>
        </div>
      </footer>
    );
  }

  // For terminal, render prompt-style footer
  if (config.id === "terminal") {
    return (
      <footer className={config.footer.borderClass}>
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="w-full border-t border-[#00ff4130]" />
          <p className={config.footer.textClass}>
            {'</>'} {year} Lance Abuan &bull; Next.js &bull; shadcn/ui
          </p>
        </div>
      </footer>
    );
  }

  // For synthwave, render neon footer
  if (config.id === "synthwave") {
    return (
      <footer className={config.footer.borderClass}>
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="w-full border-t border-[#ff00ff30]" />
          <p className={cn(config.footer.textClass, "synthwave-neon-text")}>
            // {year} Lance Abuan // Next.js // shadcn/ui
          </p>
        </div>
      </footer>
    );
  }

  // For casino, render gold footer
  if (config.id === "casino") {
    return (
      <footer className={config.footer.borderClass}>
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="w-full border-t border-[#d4a84340]" />
          <p className={cn(config.footer.textClass, "casino-gold")}>
            © {year} Lance Abuan &middot; Built with Next.js &amp; shadcn/ui
          </p>
        </div>
      </footer>
    );
  }

  // Default theme
  return (
    <footer className={config.footer.borderClass}>
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <Separator className="w-full" />
        <p className={config.footer.textClass}>
          © {year} Lance Abuan. Built with Next.js & shadcn/ui.
        </p>
      </div>
    </footer>
  );
}
