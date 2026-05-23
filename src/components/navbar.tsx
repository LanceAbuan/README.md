"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { motion } from "framer-motion";

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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
    >
      <div className="backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/" className="text-sm font-semibold tracking-tight hover:opacity-70 transition-opacity">
            lance
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm" className="text-xs font-medium h-8 px-3">
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />
            <ThemeToggle />
          </div>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            } />
            <SheetContent side="top" className="pt-6 pb-4">
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} render={
                    <Link
                      href={link.href}
                      className="px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium inline-block"
                    >
                      {link.label}
                    </Link>
                  } />
                ))}
                <div className="flex justify-end pt-2">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
