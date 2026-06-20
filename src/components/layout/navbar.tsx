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
import { Burger, Drawer, Group, Anchor, Box, Paper, Stack, Text } from "@mantine/core";

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

  const prevScrollY = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > prevScrollY.current;
        const shouldHide =
          isScrollingDown && currentScrollY > NAVBAR_SCROLL_THRESHOLD;

        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
        }

        if (shouldHide) {
          hideTimerRef.current = setTimeout(() => {
            setVisible(false);
          }, NAVBAR_HIDE_DELAY_MS);
        } else {
          setVisible(true);
        }
        setScrolled(currentScrollY > 10);
        prevScrollY.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const NavLinkContent = ({ item, onClick }: { item: { href: string; label: string; section?: string }; onClick?: () => void }) => (
    <Anchor
      component={Link}
      href={item.href}
      underline="never"
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
    </Anchor>
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
      <Paper
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
        withBorder={false}
      >
        <Anchor
          component={Link}
          href="/"
          underline="never"
          className={cn(
            "text-lg font-bold tracking-tight",
            isTerminal && "font-mono text-[#00ff41] terminal-glow",
            isNewspaper && "font-serif text-[#1a1208]",
            isCasino && "font-serif text-[#d4af37]",
          )}
        >
          Lance Abuan
        </Anchor>

        {/* Desktop nav */}
        <Group className="hidden md:flex items-center gap-6">
          {navItems}
          <ThemeSelector />
        </Group>

        {/* Mobile menu button */}
        <Burger
          opened={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label={mobileOpen ? MOBILE_MENU_CLOSE_LABEL : MOBILE_MENU_LABEL}
          color={
            isTerminal
              ? "#00ff41"
              : isCasino
                ? "#d4af37"
                : isNewspaper
                  ? "#1a1208"
                  : undefined
          }
        />
      </Paper>

      {/* Mobile menu - using Mantine Drawer */}
      <Drawer
        opened={mobileOpen}
        onClose={() => setMobileOpen(false)}
        position="top"
        size="auto"
        withCloseButton={false}
        styles={{
          inner: { top: 70, padding: 0 },
          body: { padding: 0 },
          overlay: { background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' },
        }}
        className="md:hidden"
        zIndex={40}
      >
        <Box
          className={cn(
            isTerminal
              ? "border-[#00ff4130] bg-black/90"
              : isNewspaper
                ? "border-[#c4b59e] bg-[#efe8da]/95"
                : isCasino
                  ? "border-[#d4af37]/15 bg-[#1c0c0c]/95"
                  : "bg-white/90 dark:bg-neutral-900/90 border-neutral-200/50 dark:border-neutral-700/50",
          )}
        >
          <Stack className="px-6 py-4 gap-4">
            {NAV_LINKS.map((item) => {
              const mobileLink = (
                <NavLinkContent
                  key={item.href}
                  item={item}
                  onClick={() => setMobileOpen(false)}
                />
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
            <Box className="pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
              <ThemeSelector />
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </nav>
  );
}
