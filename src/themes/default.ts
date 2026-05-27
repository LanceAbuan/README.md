/**
 * ============================================================
 * DEFAULT THEME
 * ============================================================
 * The clean, minimal, neutral portfolio aesthetic.
 * Light/dark mode aware — relies on CSS variables for colors.
 * ============================================================
 */
import { ThemeConfig } from "./types";

export const defaultTheme: ThemeConfig = {
  id: "default",
  name: "Default",
  icon: "✨",
  className: "", // no class — uses :root / .dark CSS variables

  colors: {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    muted: "hsl(var(--muted-foreground))",
    accent: "hsl(var(--accent))",
    destructive: "hsl(var(--destructive))",
    border: "hsl(var(--border))",
    ring: "hsl(var(--ring))",
    cardBg: "rgba(255,255,255,0.5)",
  },

  typography: {
    bodyFont: "var(--font-sans)",
    headingFont: "var(--font-sans)",
    headingWeight: "700",
  },

  sections: {
    about: {
      label: "About",
      heading: "A little about me",
      labelClass: "text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3",
      headingClass: "text-3xl sm:text-4xl font-bold tracking-tight mb-8",
    },
    experience: {
      label: "Experience",
      heading: "Where I've worked",
      labelClass: "text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3",
      headingClass: "text-3xl sm:text-4xl font-bold tracking-tight",
    },
    projects: {
      label: "Projects",
      heading: "Things I've built",
      labelClass: "text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3",
      headingClass: "text-3xl sm:text-4xl font-bold tracking-tight",
    },
    skills: {
      label: "Skills",
      heading: "What I work with",
      labelClass: "text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3",
      headingClass: "text-3xl sm:text-4xl font-bold tracking-tight",
    },
    contact: {
      label: "Contact",
      heading: "Let's connect",
      labelClass: "text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3",
      headingClass: "text-3xl sm:text-4xl font-bold tracking-tight mb-4",
    },
  },

  nav: {
    containerClass:
      "backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl shadow-sm",
    logoClass: "text-sm font-semibold tracking-tight hover:opacity-70 transition-opacity",
    linkActiveClass: "text-xs font-medium h-8 px-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
    linkClass: "text-xs font-medium h-8 px-3",
    dividerColor: "",
    sheetContentClass: "pt-6 pb-4",
    mobileLinkClass:
      "px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium inline-block w-full text-left",
  },

  footer: {
    borderClass: "py-12 px-6 border-t border-neutral-200/50 dark:border-neutral-800/50",
    textClass: "text-xs text-neutral-400 dark:text-neutral-500",
    customSeparator: false,
  },

  background: {
    particleColor: "rgba(120,120,120,0.4)",
    connectionColor: "rgba(120,120,120,0.15)",
    connectionAlpha: 0.15,
    shape: "circle",
    driftSpeed: 1,
  },

  features: {
    coinFlip: false,
    typingAnimation: false,
    scrollArrows: false,
    customLayout: false,
  },
};
