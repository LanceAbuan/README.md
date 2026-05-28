/**
 * ============================================================
 * SYNTHWAVE '90S THEME
 * ============================================================
 * Retro-futuristic neon aesthetic. Deep purples, hot pinks,
 * electric cyans. Chrome-style headings. Perspective grid
 * background. Glowing accents.
 *
 * Custom layout: uses a "holographic card" layout where each
 * section card floats with a neon border and subtle pulse.
 * The page background features a retro perspective grid and
 * a gradient sky from deep purple to magenta.
 *
 * Visual effects (handled in globals.css):
 *   - .synthwave: Deep purple/magenta background, neon color vars
 *   - .synthwave-grid: Perspective grid overlay (::before)
 *   - .synthwave-holo-card: Floating neon-bordered cards
 *   - .synthwave-neon-text: Neon text glow
 *   - .synthwave-chrome: Chrome/metallic gradient text
 * ============================================================
 */
import { ThemeConfig } from "./types";

export const synthwaveTheme: ThemeConfig = {
  id: "synthwave",
  name: "Synthwave",
  icon: "🌆",
  className: "synthwave",

  colors: {
    primary: "#ff00ff",       // Hot pink
    secondary: "#00ffff",     // Electric cyan
    muted: "#8b5cf6",         // Soft purple
    accent: "#ff6ec7",        // Neon pink
    destructive: "#ff0055",   // Hot red-pink
    border: "#ff00ff30",      // Pink with alpha
    ring: "#ff00ff80",        // Pink glow
    cardBg: "rgba(15, 5, 30, 0.85)",
    glow: "rgba(255, 0, 255, 0.6)",
  },

  typography: {
    bodyFont: "var(--font-sans)",
    headingFont: "var(--font-synthwave), var(--font-sans)",
    headingWeight: "700",
    headingTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  sections: {
    about: {
      label: "// ABOUT",
      heading: "WHO AM I",
      labelClass: "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em]",
      headingClass: "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text uppercase tracking-wider",
    },
    experience: {
      label: "// EXPERIENCE",
      heading: "CAREER LOG",
      labelClass: "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em]",
      headingClass: "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text uppercase tracking-wider",
    },
    projects: {
      label: "// PROJECTS",
      heading: "CONSTRUCTIONS",
      labelClass: "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em]",
      headingClass: "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text uppercase tracking-wider",
    },
    skills: {
      label: "// SKILLS",
      heading: "POWER LEVELS",
      labelClass: "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em]",
      headingClass: "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text uppercase tracking-wider",
    },
    contact: {
      label: "// CONTACT",
      heading: "TRANSMIT SIGNAL",
      labelClass: "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em]",
      headingClass: "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text uppercase tracking-wider",
    },
  },

  nav: {
    containerClass:
      "backdrop-blur-xl bg-[#0a0520]/80 border border-[#ff00ff30] rounded-xl shadow-lg shadow-[#ff00ff10]",
    logoClass: "text-sm font-bold text-[#00ffff] tracking-widest hover:opacity-70 transition-opacity synthwave-neon-text",
    linkActiveClass: "text-xs font-bold h-8 px-3 rounded-lg font-mono uppercase tracking-wider bg-[#ff00ff] text-white shadow-[0_0_10px_rgba(255,0,255,0.4)]",
    linkClass: "text-xs font-medium h-8 px-3 rounded-lg font-mono uppercase tracking-wider text-[#00ffff] hover:bg-[#ff00ff20]",
    dividerColor: "#ff00ff30",
    sheetContentClass: "pt-6 pb-4 bg-[#0a0520] border border-[#ff00ff30] rounded-xl text-[#00ffff]",
    mobileLinkClass:
      "px-4 py-3 rounded-lg font-mono hover:bg-[#ff00ff20] text-[#00ffff] inline-block w-full text-left uppercase tracking-wider",
  },

  footer: {
    borderClass: "py-12 px-6 border-t border-[#ff00ff30]",
    textClass: "text-xs font-mono text-[#8b5cf6] text-center",
    customSeparator: false,
  },

  background: {
    particleColor: "rgba(255, 0, 255, 0.2)",
    connectionColor: "rgba(0, 255, 255, 0.08)",
    connectionAlpha: 0.08,
    shape: "diamond",
    driftSpeed: 0.6,
  },

  features: {
    coinFlip: false,
    typingAnimation: false,
    scrollArrows: false,
    customLayout: true,
  },
};
