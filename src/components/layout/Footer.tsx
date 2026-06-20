"use client";

import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react";

const socialLinks = [
  {
    icon: IconBrandGithub,
    href: "https://github.com/LanceAbuan",
    label: "GitHub",
  },
  {
    icon: IconBrandLinkedin,
    href: "https://linkedin.com/in/lanceabuan",
    label: "LinkedIn",
  },
  {
    icon: IconMail,
    href: "mailto:lance@lanceabuan.tech",
    label: "Email",
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Lance Abuan. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 hover:scale-110"
              aria-label={link.label}
            >
              <link.icon className="w-5 h-5" />
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Get in touch
        </Link>
      </div>
    </footer>
  );
}
