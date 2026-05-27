/**
 * ============================================================
 * CASINO THEME
 * ============================================================
 * Las Vegas / James Bond aesthetic. Deep reds, blacks,
 * and gold accents. Elegant serif headings. Velvet-drape
 * background. Felt-green card surfaces.
 *
 * Gimmick: Coin-flip navigation. When a user clicks any nav
 * link, a coin-flip animation plays. Heads = they navigate.
 * Tails = they get "Better luck next time" and stay put.
 *
 * Visual effects (handled in globals.css):
 *   - .casino: Deep red/black/gold color vars
 *   - .casino-felt: Green felt texture on cards
 *   - .casino-gold: Gold shimmer text
 *   - .casino-chip: Roulette chip-style badges
 * ============================================================
 */
import { ThemeConfig } from "./types";

export const casinoTheme: ThemeConfig = {
  id: "casino",
  name: "Casino",
  icon: "🎰",
  className: "casino",

  colors: {
    primary: "#c41e1e",       // Casino red
    secondary: "#d4a843",     // Gold
    muted: "#8b7355",         // Muted gold
    accent: "#ffd700",        // Bright gold
    destructive: "#8b0000",   // Dark red
    border: "#d4a84340",      // Gold with alpha
    ring: "#d4a84380",        // Gold glow
    cardBg: "rgba(20, 60, 20, 0.6)",  // Felt green
    glow: "rgba(212, 168, 67, 0.4)",
  },

  typography: {
    bodyFont: "var(--font-sans)",
    headingFont: "'Playfair Display', Georgia, serif",
    headingWeight: "700",
    headingTransform: "none",
    letterSpacing: "0.02em",
  },

  sections: {
    about: {
      label: "THE PLAYER",
      heading: "Know Your Opponent",
      deck: "Every great hand starts with reading the table.",
      labelClass: "text-xs font-serif text-[#d4a843] mb-2 tracking-[0.3em] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#d4a843] casino-gold tracking-tight",
    },
    experience: {
      label: "TRACK RECORD",
      heading: "High Stakes History",
      deck: "A career built on calculated risks and winning plays.",
      labelClass: "text-xs font-serif text-[#d4a843] mb-2 tracking-[0.3em] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#d4a843] casino-gold tracking-tight",
    },
    projects: {
      label: "THE HAND",
      heading: "Show Me What You've Got",
      deck: "Selected plays from the table.",
      labelClass: "text-xs font-serif text-[#d4a843] mb-2 tracking-[0.3em] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#d4a843] casino-gold tracking-tight",
    },
    skills: {
      label: "ARSENAL",
      heading: "Tools of the Trade",
      deck: "The skills that keep the edge sharp.",
      labelClass: "text-xs font-serif text-[#d4a843] mb-2 tracking-[0.3em] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#d4a843] casino-gold tracking-tight",
    },
    contact: {
      label: "MAKE A DEAL",
      heading: "Place Your Bet",
      labelClass: "text-xs font-serif text-[#d4a843] mb-2 tracking-[0.3em] uppercase",
      headingClass: "text-3xl sm:text-4xl font-bold font-serif text-[#d4a843] casino-gold tracking-tight",
    },
  },

  nav: {
    containerClass:
      "backdrop-blur-xl bg-[#1a0a0a]/90 border border-[#d4a84340] rounded-xl shadow-lg shadow-[#c41e1e20]",
    logoClass: "text-sm font-serif text-[#d4a843] tracking-tight hover:opacity-70 transition-opacity",
    linkActiveClass: "text-xs font-serif h-8 px-3 rounded-lg tracking-wide bg-[#c41e1e] text-[#d4a843]",
    linkClass: "text-xs font-serif h-8 px-3 rounded-lg tracking-wide text-[#d4a843] hover:bg-[#c41e1e40]",
    dividerColor: "#d4a84330",
    sheetContentClass: "pt-6 pb-4 bg-[#1a0a0a] border border-[#d4a84340] rounded-xl text-[#d4a843]",
    mobileLinkClass:
      "px-4 py-3 rounded-lg font-serif hover:bg-[#c41e1e40] text-[#d4a843] inline-block w-full text-left",
  },

  footer: {
    borderClass: "py-12 px-6 border-t border-[#d4a84340]",
    textClass: "text-xs font-serif text-[#8b7355] text-center",
    customSeparator: false,
  },

  background: {
    particleColor: "rgba(212, 168, 67, 0.12)",
    connectionColor: "rgba(196, 30, 30, 0.06)",
    connectionAlpha: 0.06,
    shape: "star",
    driftSpeed: 0.4,
  },

  features: {
    coinFlip: true,
    typingAnimation: false,
    scrollArrows: false,
    customLayout: false,
  },
};
