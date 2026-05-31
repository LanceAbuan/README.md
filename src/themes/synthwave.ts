/**
 * ============================================================
 * SYNTHWAVE '90S THEME — FULL OVERHAUL
 * ============================================================
 * Retro-futuristic neon aesthetic. Deep purples, hot pinks,
 * electric cyans. CRT monitor scanlines, animated perspective
 * grid road, retro sunset with horizontal stripes, twinkling
 * stars, distant cityscape silhouette.
 *
 * Background layers (all CSS-only, no canvas):
 *   - .synthwave-sun: Retro setting sun with stripe cutout
 *   - .synthwave-grid: Animated perspective road grid
 *   - .synthwave-horizon: Sunset glow gradient
 *   - .synthwave-city: Distant cityscape silhouette
 *   - .synthwave-stars: Twinkling star field
 *   - ::before: CRT scanlines
 *   - ::after: CRT vignette + screen curvature
 *
 * Text effects:
 *   - .synthwave-chromatic: RGB chromatic aberration on headings
 *   - .synthwave-neon-text: Pink neon glow
 *   - .synthwave-neon-cyan: Cyan neon glow
 *   - .synthwave-terminal: Retro terminal-style body text
 *
 * Components:
 *   - .synthwave-card: Pink neon-bordered section card
 *   - .synthwave-card-cyan: Cyan neon-bordered variant
 *   - .synthwave-btn / .synthwave-btn-cyan: Neon buttons
 *   - .synthwave-badge: Terminal-style skill chips
 *   - .synthwave-nav: Retro HUD navigation bar
 *   - .synthwave-timeline: Gradient neon timeline
 * ============================================================
 */
import { ThemeConfig } from "./types";

export const synthwaveTheme: ThemeConfig = {
  id: "synthwave",
  name: "Synthwave",
  icon: "🌆",
  className: "synthwave",

  colors: {
    primary: "#ff00ff",
    secondary: "#00ffff",
    muted: "#8b5cf6",
    accent: "#ff6ec7",
    destructive: "#ff0055",
    border: "#ff00ff30",
    ring: "#ff00ff80",
    cardBg: "rgba(10, 5, 30, 0.9)",
    glow: "rgba(255, 0, 255, 0.6)",
  },

  typography: {
    bodyFont: "var(--font-mono), monospace",
    headingFont: "'Orbitron', var(--font-sans)",
    headingWeight: "700",
    headingTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  sections: {
    about: {
      label: "// ABOUT",
      heading: "WHO AM I",
      labelClass:
        "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em] synthwave-neon-cyan",
      headingClass:
        "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text synthwave-chromatic uppercase tracking-wider",
    },
    experience: {
      label: "// CAREER LOG",
      heading: "EXPERIENCE",
      labelClass:
        "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em] synthwave-neon-cyan",
      headingClass:
        "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text synthwave-chromatic uppercase tracking-wider",
    },
    projects: {
      label: "// PROJECTS",
      heading: "CONSTRUCTIONS",
      labelClass:
        "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em] synthwave-neon-cyan",
      headingClass:
        "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text synthwave-chromatic uppercase tracking-wider",
    },
    skills: {
      label: "// SKILLS",
      heading: "POWER LEVELS",
      labelClass:
        "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em] synthwave-neon-cyan",
      headingClass:
        "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text synthwave-chromatic uppercase tracking-wider",
    },
    contact: {
      label: "// CONTACT",
      heading: "TRANSMIT SIGNAL",
      labelClass:
        "text-xs font-mono text-[#00ffff] mb-2 tracking-[0.3em] synthwave-neon-cyan",
      headingClass:
        "text-3xl sm:text-4xl font-bold text-[#ff00ff] synthwave-neon-text synthwave-chromatic uppercase tracking-wider",
    },
  },

  nav: {
    containerClass:
      "backdrop-blur-xl bg-[#0a0520]/85 border border-[#ff00ff28] rounded-sm shadow-[0_0_1px_rgba(255,0,255,0.4)]",
    logoClass:
      "text-sm font-bold text-[#00ffff] tracking-[0.2em] hover:opacity-70 transition-opacity font-mono synthwave-neon-cyan",
    linkActiveClass:
      "text-xs font-bold h-8 px-3 rounded-sm font-mono uppercase tracking-wider bg-[#ff00ff] text-white shadow-[0_0_10px_rgba(255,0,255,0.5)]",
    linkClass:
      "text-xs font-medium h-8 px-3 rounded-sm font-mono uppercase tracking-wider text-[#00ffff] hover:bg-[#ff00ff20]",
    dividerColor: "#ff00ff30",
    sheetContentClass:
      "pt-6 pb-4 bg-[#0a0520] border border-[#ff00ff30] rounded-sm text-[#00ffff]",
    mobileLinkClass:
      "px-4 py-3 rounded-sm font-mono hover:bg-[#ff00ff20] text-[#00ffff] inline-block w-full text-left uppercase tracking-wider",
  },

  footer: {
    borderClass: "py-12 px-6 border-t border-[#ff00ff30]",
    textClass:
      "text-xs font-mono text-[#8b5cf6] text-center synthwave-terminal",
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
