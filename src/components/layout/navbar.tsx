"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { Menu, Download } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useActiveSection } from "@/hooks/use-active-section";
import { useTheme } from "next-themes";
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

  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";

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

  // Nav container classes based on theme
  const navContainerClass = cn(
    "backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl shadow-sm",
    isTerminal && "border-[#00ff4130] bg-black/90 rounded-none shadow-none",
    isNewspaper && "backdrop-blur-none bg-[#f7f2ea]/90 border-none border-b-2 border-b-[#1a1208] rounded-none shadow-none",
  );

  // Nav link button class
  const linkButtonClass = useCallback(
    (href: string) => {
      const active = isActive(href);
      if (isTerminal) {
        return cn(
          "text-xs font-medium h-8 px-3 rounded-none font-mono uppercase tracking-wider transition-colors",
          active
            ? "bg-[#00ff41] text-black"
            : "text-[#00ff41] hover:bg-[#0d1a0d]",
        );
      }
      if (isNewspaper) {
        return cn(
          "text-xs h-8 px-3 rounded-none font-serif tracking-wide transition-colors",
          active
            ? "bg-[#1a1208] text-[#f7f2ea]"
            : "text-[#5c2e0e] hover:bg-[#ddd2be]",
        );
      }
      return cn(
        "text-xs font-medium h-8 px-3",
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "",
      );
    },
    [isActive, isTerminal, isNewspaper],
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
    >
      <div className={navContainerClass}>
        <div className="flex items-center justify-between px-4 py-2">
          <Link
            href="/"
            className={cn(
              "text-sm font-semibold tracking-tight hover:opacity-70 transition-opacity",
              isTerminal && "font-mono text-[#00ff41] uppercase",
              isNewspaper && "font-serif text-[#1a1208]",
            )}
          >
            lance
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const href = resolveHref(link.href);
              return (
                <Link key={link.href} href={href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={linkButtonClass(link.href)}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
            <div
              className="w-px h-4 mx-1"
              style={{
                backgroundColor: isTerminal
                  ? "#00ff4130"
                  : isNewspaper
                    ? "#c4b59e"
                    : "undefined",
              }}
            >
              {!isTerminal && !isNewspaper && (
                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700" />
              )}
            </div>
            <a
              href="/resume.pdf"
              download
              className={cn(
                "inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                isTerminal && "rounded-none text-[#00ff41] hover:bg-[#0d1a0d]",
                isNewspaper && "rounded-none text-[#5c2e0e] hover:bg-[#ddd2be]",
              )}
              aria-label="Download resume"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
            <ThemeSelector />
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
                    isTerminal && "text-[#00ff41]",
                    isNewspaper && "text-[#5c2e0e]",
                  )}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              }
            />
            <SheetContent
              side="top"
              className={cn(
                "pt-6 pb-4",
                isTerminal && "bg-black border-[#00ff4130] rounded-none text-[#00ff41]",
                isNewspaper && "bg-[#f7f2ea] border-none border-b-2 border-b-[#1a1208] rounded-none text-[#1a1208]",
              )}
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
                          className={cn(
                            "px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium inline-block w-full text-left",
                            isTerminal && "rounded-none font-mono hover:bg-[#0d1a0d] text-[#00ff41]",
                            isNewspaper && "rounded-none font-serif hover:bg-[#ddd2be] text-[#1a1208]",
                          )}
                        >
                          {link.label}
                        </Link>
                      }
                    />
                  );
                })}
                <div className="flex items-center justify-between pt-2">
                  <ThemeSelector />
                  <a
                    href="/resume.pdf"
                    download
                    className={cn(
                      "inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                      isTerminal && "rounded-none text-[#00ff41] hover:bg-[#0d1a0d]",
                      isNewspaper && "rounded-none text-[#5c2e0e] hover:bg-[#ddd2be]",
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
  );
}
