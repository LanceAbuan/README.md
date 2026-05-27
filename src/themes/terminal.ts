/**
 * ============================================================
 * TERMINAL THEME
 * ============================================================
 * CRT green-on-black aesthetic. Monospace fonts. Scanlines.
 * Prompt-style headers. Left-accent card borders.
 *
 * Visual effects (handled in globals.css):
 *   - SVG noise texture overlay (::before)
 *   - Scanline lines (::after)
 *   - CRT flicker animation
 *   - Vignette via .background-container::before
 *   - Text glow on .terminal-glow elements
 * ============================================================
 */
import { ThemeConfig } from "./types";

export const terminalTheme: ThemeConfig = {
  id: "terminal",
  name: "Terminal",
  icon: "💻",
  className: "terminal",

  colors: {
    primary: "#00ff41",
    secondary: "#00cc33",
    muted: "#00aa30",
    accent: "#00dd3a",
    destructive: "#ff3333",
    border: "#00ff4130",
    ring: "#00ff4160",
    cardBg: "#0a0f0a",
    glow: "rgba(0, 255, 65, 0.4)",
  },

  typography: {
    bodyFont: "var(--font-terminal), monospace",
    headingFont: "var(--font-terminal), monospace",
    headingWeight: "700",
    headingTransform: "uppercase",
    letterSpacing: "0.02em",
  },

  sections: {
    about: {
      label: "about",
      heading: "System.Info",
      labelClass: "text-xs font-mono text-[#00aa30] mb-2 tracking-wider",
      headingClass: "text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider",
    },
    experience: {
      label: "experience",
      heading: "Work.History",
      labelClass: "text-xs font-mono text-[#00aa30] mb-2 tracking-wider",
      headingClass: "text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider",
    },
    projects: {
      label: "projects",
      heading: "Projects.List",
      labelClass: "text-xs font-mono text-[#00aa30] mb-2 tracking-wider",
      headingClass: "text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider",
    },
    skills: {
      label: "skills",
      heading: "Stack.List",
      labelClass: "text-xs font-mono text-[#00aa30] mb-2 tracking-wider",
      headingClass: "text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider",
    },
    contact: {
      label: "contact",
      heading: "Establish.Link",
      labelClass: "text-xs font-mono text-[#00aa30] mb-2 tracking-wider",
      headingClass: "text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider",
    },
  },

  nav: {
    containerClass:
      "border-[#00ff4130] bg-black/90 rounded-none shadow-none",
    logoClass: "text-sm font-mono text-[#00ff41] uppercase tracking-tight hover:opacity-70 transition-opacity",
    linkActiveClass: "text-xs font-medium h-8 px-3 rounded-none font-mono uppercase tracking-wider bg-[#00ff41] text-black",
    linkClass: "text-xs font-medium h-8 px-3 rounded-none font-mono uppercase tracking-wider text-[#00ff41] hover:bg-[#0d1a0d]",
    dividerColor: "#00ff4130",
    sheetContentClass: "pt-6 pb-4 bg-black border-[#00ff4130] rounded-none text-[#00ff41]",
    mobileLinkClass:
      "px-4 py-3 rounded-none font-mono hover:bg-[#0d1a0d] text-[#00ff41] inline-block w-full text-left",
  },

  footer: {
    borderClass: "py-12 px-6 border-t border-[#00ff4130]",
    textClass: "text-xs font-mono text-[#00aa30] text-center",
    customSeparator: false,
  },

  background: {
    particleColor: "rgba(0, 255, 65, 0.15)",
    connectionColor: "rgba(0, 255, 65, 0.05)",
    connectionAlpha: 0.05,
    shape: "square",
    driftSpeed: 0.5,
  },

  features: {
    coinFlip: false,
    typingAnimation: true,
    scrollArrows: true,
    customLayout: false,
  },
};
