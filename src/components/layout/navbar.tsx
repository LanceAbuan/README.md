"use client";

import { useState, useCallback } from "react";
import { CasinoGames } from "@/components/sections/casino-games";
import { Gamepad2 } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { Menu, Download } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useActiveSection } from "@/hooks/use-active-section";
import { useTheme } from "next-themes";
import { useThemeConfig } from "@/hooks/use-theme-config";
import { CoinFlipNav } from "@/components/casino/coin-flip";
import { CasinoMusic } from "@/components/casino/casino-music";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "/blogs", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const { theme } = useTheme();
  const config = useThemeConfig();

  const isCoinFlip = config.features.coinFlip;
  const [gamesOpen, setGamesOpen] = useState(false);

  const resolveHref = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : `/${href}`;
    }
    return href;
  };

  const isActive = (href: string) => {
    const id = href.replace("#", "");
    return id && activeSection === id;
  };

  // Nav link button class from theme config
  const linkButtonClass = useCallback(
    (href: string) => {
      const active = isActive(href);
      return cn(
        active ? config.nav.linkActiveClass : config.nav.linkClass,
      );
    },
    [isActive, config],
  );

  // Divider color from theme
  const dividerStyle = config.nav.dividerColor
    ? { backgroundColor: config.nav.dividerColor }
    : undefined;

  const NavLinkWrapper = isCoinFlip ? CoinFlipNav : "div";

  const navLinkProps = isCoinFlip
    ? {
        sectionId: (href: string) => ({ sectionId: href.replace("#", "") }),
      }
    : {};

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
    >
      <div className={config.nav.containerClass}>
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/" className={config.nav.logoClass}>
            lance
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const href = resolveHref(link.href);
              const sectionId = link.href.replace("#", "");

              return (
                <NavLinkWrapper
                  key={link.href}
                  {...(isCoinFlip ? { sectionId } : {})}
                >
                  <Link href={href} className="block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={linkButtonClass(link.href)}
                    >
                      {link.label}
                    </Button>
                  </Link>
                </NavLinkWrapper>
              );
            })}
            <div className="w-px h-4 mx-1" style={dividerStyle}>
              {!config.nav.dividerColor && (
                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700" />
              )}
            </div>
            <a
              href="/resume.pdf"
              download
              className={cn(
                "inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                theme === "terminal" && "rounded-none text-[#00ff41] hover:bg-[#0d1a0d]",
                theme === "newspaper" && "rounded-none text-[#5c2e0e] hover:bg-[#ddd2be]",
                theme === "synthwave" && "rounded-lg text-[#00ffff] hover:bg-[#ff00ff20]",
                theme === "casino" && "rounded-lg text-[#d4af37] hover:bg-[#2a0a0a] border border-[#d4af3715]",
              )}
              aria-label="Download resume"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
            {theme === "casino" && <CasinoMusic />}
            <ThemeSelector />
            {theme === "casino" && (
              <button
                onClick={() => setGamesOpen(true)}
                className={cn(
                  "inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-[#2a0a0a]",
                  "text-[#d4af37] border border-[#d4af3715]",
                )}
                aria-label="Open games"
              >
                <Gamepad2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 md:hidden",
                    theme === "terminal" && "text-[#00ff41]",
                    theme === "newspaper" && "text-[#5c2e0e]",
                    theme === "synthwave" && "text-[#00ffff]",
                    theme === "casino" && "text-[#d4a843]",
                  )}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              }
            />
            <SheetContent
              side="top"
              className={config.nav.sheetContentClass}
            >
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => {
                  const href = resolveHref(link.href);
                  return (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={href}
                          className={config.nav.mobileLinkClass}
                        >
                          {link.label}
                        </Link>
                      }
                    />
                  );
                })}
                <div className="flex items-center justify-between pt-2">
                  <ThemeSelector />
                  {theme === "casino" && (
                    <>
                      <CasinoMusic />
                      <button
                        onClick={() => setGamesOpen(true)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-[#d4af37] hover:bg-[#2a0a0a] border border-[#d4af3715] transition-colors"
                        aria-label="Open games"
                      >
                        <Gamepad2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <a
                    href="/resume.pdf"
                    download
                    className={cn(
                      "inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                      config.nav.mobileLinkClass,
                    )}
                    aria-label="Download resume"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
    {theme === "casino" && gamesOpen && <CasinoGames onClose={() => setGamesOpen(false)} />}
    </>
  );
}
