/**
 * ============================================================
 * NEWSPAPER THEME
 * ============================================================
 * Editorial aesthetic. Serif fonts. Column layouts.
 * Warm cream background, deep brown text, ruled separators.
 * Drop caps, triple rules, pull quotes, editorial badges.
 * ============================================================
 */
import { ThemeConfig } from "./types";

export const newspaperTheme: ThemeConfig = {
  id: "newspaper",
  name: "Newspaper",
  icon: "📰",
  className: "newspaper",

  colors: {
    primary: "#5c2e0e",
    secondary: "#8b5e3c",
    muted: "#7a6b5a",
    accent: "#8b5e3c",
    destructive: "#8b1a1a",
    border: "#c4b59e",
    ring: "#5c2e0e",
    cardBg: "#efe8da",
  },

  typography: {
    bodyFont: "var(--font-newspaper-body), Georgia, serif",
    headingFont: "var(--font-newspaper-heading), 'Playfair Display', Georgia, serif",
    headingWeight: "700",
    letterSpacing: "normal",
  },

  sections: {
    about: {
      label: "Profile",
      heading: "A Little About Me",
      deck: "The story behind the code — experience, background, and what drives the work.",
      labelClass: "text-xs font-serif tracking-[0.2em] text-[#7a6b5a] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4 newspaper-letterpress",
      centered: true,
      showRule: true,
      ruleClass: "newspaper-triple-rule mx-auto max-w-sm mt-2",
    },
    experience: {
      label: "Career",
      heading: "Professional History",
      deck: "A chronological record of positions held and contributions made.",
      labelClass: "text-xs font-serif tracking-[0.2em] text-[#7a6b5a] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4 newspaper-letterpress",
      centered: true,
      showRule: true,
      ruleClass: "newspaper-triple-rule mx-auto max-w-sm mt-2",
    },
    projects: {
      label: "Portfolio",
      heading: "Selected Works",
      deck: "A curated collection of projects, each representing a distinct challenge and solution.",
      labelClass: "text-xs font-serif tracking-[0.2em] text-[#7a6b5a] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4 newspaper-letterpress",
      centered: true,
      showRule: true,
      ruleClass: "newspaper-triple-rule mx-auto max-w-sm mt-2",
    },
    skills: {
      label: "Expertise",
      heading: "Technical Proficiency",
      deck: "The tools, languages, and frameworks that form the foundation of my craft.",
      labelClass: "text-xs font-serif tracking-[0.2em] text-[#7a6b5a] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4 newspaper-letterpress",
      centered: true,
      showRule: true,
      ruleClass: "newspaper-triple-rule mx-auto max-w-sm mt-2",
    },
    contact: {
      label: "Contact",
      heading: "Let's Connect",
      labelClass: "text-xs font-serif tracking-[0.2em] text-[#7a6b5a] mb-1 uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4",
    },
  },

  nav: {
    containerClass:
      "backdrop-blur-none bg-[#f7f2ea]/90 border-none border-b-2 border-b-[#1a1208] rounded-none shadow-none",
    logoClass: "text-sm font-serif text-[#1a1208] tracking-tight hover:opacity-70 transition-opacity",
    linkActiveClass: "text-xs h-8 px-3 rounded-none font-serif tracking-wide bg-[#1a1208] text-[#f7f2ea]",
    linkClass: "text-xs h-8 px-3 rounded-none font-serif tracking-wide text-[#5c2e0e] hover:bg-[#ddd2be]",
    dividerColor: "#c4b59e",
    sheetContentClass: "pt-6 pb-4 bg-[#f7f2ea] border-none border-b-2 border-b-[#1a1208] rounded-none text-[#1a1208]",
    mobileLinkClass:
      "px-4 py-3 rounded-none font-serif hover:bg-[#ddd2be] text-[#1a1208] inline-block w-full text-left",
  },

  footer: {
    borderClass: "py-12 px-6 border-t border-[#c4b59e]",
    textClass: "text-xs font-serif text-[#7a6b5a] tracking-wider text-center",
    customSeparator: true,
    separatorClass: "newspaper-rule w-full",
  },

  background: {
    particleColor: "rgba(122, 107, 90, 0.2)",
    connectionColor: "rgba(122, 107, 90, 0.03)",
    connectionAlpha: 0.03,
    shape: "hex",
    driftSpeed: 0.3,
  },

  features: {
    coinFlip: false,
    typingAnimation: false,
    scrollArrows: true,
    customLayout: false,
  },
};
