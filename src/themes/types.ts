/**
 * ============================================================
 * THEME TYPES
 * ============================================================
 *
 * This file defines the shape of a theme configuration.
 * Each theme exports a single object conforming to ThemeConfig.
 *
 * WHY: Instead of scattering `isTerminal ? ... : isNewspaper ? ... : ...`
 * ternary chains across every component, we centralize all theme
 * decisions in one place. Adding a new theme = adding one config object.
 *
 * ANATOMY OF A THEME:
 *
 *   1. "identity"    — Display name, icon, CSS class name
 *   2. "colors"      — Palette tokens used throughout components
 *   3. "typography"  — Font families, default weights, sizes
 *   4. "sections"    — Per-section rendering overrides (headers, cards, etc.)
 *   5. "nav"         — Navbar styling (container, links, mobile menu)
 *   6. "footer"      — Footer styling
 *   7. "background"  — Canvas/particle config for AnimatedBackground
 *   8. "features"    — Optional gimmicks (coin-flip, typing animation, etc.)
 *
 * TO ADD A NEW THEME:
 *
 *   1. Create `src/themes/<name>.ts` exporting a ThemeConfig
 *   2. Register it in `src/themes/registry.ts`
 *   3. Add CSS variables in `src/app/globals.css` under `.<className>`
 *   4. Add `@custom-variant <name> (&:is(.<name> *))` in globals.css
 *   5. Add the name to `THEMES` in `providers.tsx`
 *   6. If the theme has a custom layout, provide `sections.customLayout = true`
 *      and implement the layout renderer in the section components
 *
 * ============================================================
 */

/** Core color tokens that every theme must define. */
export interface ThemeColors {
  /** Primary action / highlight color */
  primary: string;
  /** Secondary / supporting color */
  secondary: string;
  /** Muted text, labels, secondary info */
  muted: string;
  /** Accent for hover states, badges, highlights */
  accent: string;
  /** Destructive / error color */
  destructive: string;
  /** Border color (may include alpha) */
  border: string;
  /** Input / ring focus color */
  ring: string;
  /** Background fill for cards */
  cardBg: string;
  /** Glow color for text-shadow effects (optional) */
  glow?: string;
}

/** Typography configuration for a theme. */
export interface ThemeTypography {
  /** Default body font family CSS value */
  bodyFont: string;
  /** Heading font family CSS value */
  headingFont: string;
  /** Default font weight for headings */
  headingWeight: string;
  /** CSS text-transform for headings (e.g. "uppercase") */
  headingTransform?: string;
  /** CSS letter-spacing for body text */
  letterSpacing?: string;
}

/** Section header configuration. */
export interface SectionHeader {
  /** Label shown above the heading (e.g. "ABOUT", "System.Info") */
  label?: string;
  /** Heading text (e.g. "A little about me", "System.Info") */
  heading: string;
  /** Optional subheading / deck copy */
  deck?: string;
  /** Extra CSS classes for the label */
  labelClass?: string;
  /** Extra CSS classes for the heading */
  headingClass?: string;
  /** Whether to center-align the header block */
  centered?: boolean;
  /** Whether to render a decorative rule/separator after the label */
  showRule?: boolean;
  /** Rule separator class */
  ruleClass?: string;
}

/** Per-section overrides. Keys match section IDs: "about", "experience", etc. */
export interface SectionOverrides {
  about?: SectionHeader;
  experience?: SectionHeader;
  projects?: SectionHeader;
  skills?: SectionHeader;
  contact?: SectionHeader;
}

/** Navbar styling configuration. */
export interface ThemeNavConfig {
  /** Container class (applied to the outer nav wrapper) */
  containerClass: string;
  /** Logo class */
  logoClass: string;
  /** Active link class */
  linkActiveClass: string;
  /** Inactive link class */
  linkClass: string;
  /** Divider color between nav items */
  dividerColor: string;
  /** Mobile sheet content class */
  sheetContentClass: string;
  /** Mobile link class */
  mobileLinkClass: string;
}

/** Footer styling configuration. */
export interface ThemeFooterConfig {
  /** Border class */
  borderClass: string;
  /** Text class */
  textClass: string;
  /** Whether to render a custom separator (e.g. newspaper rule) instead of default */
  customSeparator?: boolean;
  /** Separator class if customSeparator is true */
  separatorClass?: string;
}

/** Canvas background configuration for AnimatedBackground. */
export interface ThemeBackgroundConfig {
  /** Particle fill color (rgba string) */
  particleColor: string;
  /** Connection line color (rgba string) */
  connectionColor: string;
  /** Connection line alpha (0-1) */
  connectionAlpha: number;
  /** Shape type: "circle" | "diamond" | "hex" | "square" | "star" */
  shape: "circle" | "diamond" | "hex" | "square" | "star" | "chip";
  /** Drift speed multiplier (higher = faster) */
  driftSpeed: number;
}

/** Fun theme features / gimmicks. */
export interface ThemeFeatures {
  /** Coin-flip animation on navigation (Casino theme) */
  coinFlip?: boolean;
  /** Typing animation for hero text (Terminal theme) */
  typingAnimation?: boolean;
  /** Bouncing scroll arrows between sections */
  scrollArrows?: boolean;
  /** Custom full-page layout (Synthwave theme) */
  customLayout?: boolean;
}

/**
 * Complete theme configuration.
 *
 * This is the single source of truth for everything a theme needs.
 * Components should read from here instead of hardcoding ternaries.
 */
export interface ThemeConfig {
  /** Unique identifier (must match `class` used by next-themes) */
  id: string;
  /** Display name shown in the theme selector */
  name: string;
  /** Emoji or short icon for the selector UI */
  icon: string;
  /** CSS class applied to `<html>` when active */
  className: string;
  /** Color palette */
  colors: ThemeColors;
  /** Typography settings */
  typography: ThemeTypography;
  /** Per-section header overrides */
  sections: SectionOverrides;
  /** Navbar configuration */
  nav: ThemeNavConfig;
  /** Footer configuration */
  footer: ThemeFooterConfig;
  /** Canvas background configuration */
  background: ThemeBackgroundConfig;
  /** Optional features/gimmicks */
  features: ThemeFeatures;
}
