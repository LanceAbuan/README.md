"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/theme-selector";
import { CoinFlipNav } from "@/components/casino/coin-flip";
import {
  NAVBAR_SCROLL_THRESHOLD,
  NAVBAR_HIDE_DELAY_MS,
  MOBILE_MENU_MAX_HEIGHT,
  MOBILE_MENU_BACKDROP_DELAY,
} from "@/config/animations";
import {
  MOBILE_MENU_LABEL,
  MOBILE_MENU_CLOSE_LABEL,
} from "@/config/accessibility";

const NAV_LINKS = [
  { href: "#about", label: "About", section: "about" },
  { href: "#experience", label: "Experience", section: "experience" },
  { href: "#projects", label: "Projects", section: "projects" },
  { href: "#skills", label: "Skills", section: "skills" },
  { href: "/blogs", label: "Blog", section: undefined },
  { href: "#contact", label: "Contact", section: "contact" },
];

export function Navbar() {
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevScrollY = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > prevScrollY.current;
      const shouldHide =
        isScrollingDown && currentScrollY > NAVBAR_SCROLL_THRESHOLD;

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      if (scrollRef.current) {
        clearTimeout(scrollRef.current);
      }

      scrollRef.current = setTimeout(() => {
        if (shouldHide) {
          hideTimerRef.current = setTimeout(() => {
            setVisible(false);
          }, NAVBAR_HIDE_DELAY_MS);
        } else {
          setVisible(true);
        }
        setScrolled(currentScrollY > 10);
        prevScrollY.current = currentScrollY;
      }, 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRef.current) clearTimeout(scrollRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const NavLinkContent = ({ item, onClick }: { item: { href: string; label: string; section?: string }; onClick?: () => void }) => (
    <Link
      href={item.href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-foreground",
        isTerminal && "font-mono text-[#00aa30] hover:text-[#00ff41]",
        isNewspaper && "font-serif text-[#5c2e0e] hover:text-[#1a1208]",
        isCasino && "font-serif text-[#d4af37] hover:text-white",
        !isTerminal && !isNewspaper && !isCasino && "text-neutral-600 dark:text-neutral-400",
      )}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );

  const navItems = NAV_LINKS.map((item) => {
    const linkContent = <NavLinkContent key={item.href} item={item} />;
    if (isCasino && item.section) {
      return (
        <CoinFlipNav key={item.href} sectionId={item.section}>
          {linkContent}
        </CoinFlipNav>
      );
    }
    return linkContent;
  });

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "rounded-full px-6 py-3 flex items-center justify-between backdrop-blur-xl border transition-all",
          isTerminal
            ? "border-[#00ff4130] bg-black/80"
            : isNewspaper
              ? "border-[#c4b59e] bg-[#efe8da]/90 rounded-none"
              : isCasino
                ? "border-[#d4af37]/15 bg-[#1c0c0c]/90 rounded-lg"
                : scrolled
                  ? "bg-white/80 dark:bg-neutral-900/80 border-neutral-200/50 dark:border-neutral-700/50 shadow-lg shadow-neutral-200/20 dark:shadow-neutral-800/20"
                  : "bg-white/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-700/50",
        )}
      >
        <Link
          href="/"
          className={cn(
            "text-lg font-bold tracking-tight",
            isTerminal && "font-mono text-[#00ff41] terminal-glow",
            isNewspaper && "font-serif text-[#1a1208]",
            isCasino && "font-serif text-[#d4af37]",
          )}
        >
          Lance Abuan
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems}
          <ThemeSelector />
        </div>

        {/* Mobile menu button */}
        <button
          className={cn(
            "md:hidden p-2 rounded-full transition-colors",
            isTerminal
              ? "text-[#00ff41] hover:bg-[#0d1a0d]"
              : isCasino
                ? "text-[#d4af37] hover:bg-[#2a1a10]"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800",
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? MOBILE_MENU_CLOSE_LABEL : MOBILE_MENU_LABEL}
          aria-expanded={mobileOpen}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={cn(
            "mt-2 rounded-2xl backdrop-blur-xl border overflow-hidden",
            isTerminal
              ? "border-[#00ff4130] bg-black/90 rounded-none"
              : isNewspaper
                ? "border-[#c4b59e] bg-[#efe8da]/95 rounded-none"
                : isCasino
                  ? "border-[#d4af37]/15 bg-[#1c0c0c]/95 rounded-lg"
                  : "bg-white/90 dark:bg-neutral-900/90 border-neutral-200/50 dark:border-neutral-700/50",
          )}
          style={{ maxHeight: `${MOBILE_MENU_MAX_HEIGHT}px` }}
        >
          <div className="px-6 py-4 space-y-4">
            {NAV_LINKS.map((item) => {
              const mobileLink = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block text-sm font-medium transition-colors",
                    isTerminal && "font-mono text-[#00aa30] hover:text-[#00ff41]",
                    isNewspaper && "font-serif text-[#5c2e0e] hover:text-[#1a1208]",
                    isCasino && "font-serif text-[#d4af37] hover:text-white",
                    !isTerminal && !isNewspaper && !isCasino && "text-neutral-600 dark:text-neutral-400 hover:text-foreground",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
              if (isCasino && item.section) {
                return (
                  <CoinFlipNav key={item.href} sectionId={item.section}>
                    {mobileLink}
                  </CoinFlipNav>
                );
              }
              return mobileLink;
            })}
            <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
              <ThemeSelector />
            </div>
          </div>
        </div>
      )}

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          style={{ transition: `opacity ${MOBILE_MENU_BACKDROP_DELAY}s` }}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
