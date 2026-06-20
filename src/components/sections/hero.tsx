"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  REVEAL_DURATION,
  REVEAL_Y_OFFSET,
  STAGGER_DELAY,
} from "@/config/animations";
import {
  terminalPalette,
  newspaperPalette,
  casinoPalette,
} from "@/config/theme-palette";
import { SCROLL_ARROW_LABEL } from "@/config/accessibility";

export function Hero() {
  const { theme } = useTheme();

  if (theme === "terminal") return <HeroTerminal />;
  if (theme === "newspaper") return <HeroNewspaper />;
  if (theme === "casino") return <HeroCasino />;
  return <HeroDefault />;
}

/* ============================================================
   DEFAULT HERO (light/dark/system/custom)
   Modern glassmorphism with gradient text
   ============================================================ */
function HeroDefault() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="gradient-orb w-96 h-96 bg-indigo-500 top-1/4 -left-48" />
      <div className="gradient-orb w-80 h-80 bg-purple-500 bottom-1/4 -right-40" />
      <div className="gradient-orb w-64 h-64 bg-pink-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-3xl mx-auto text-center z-10">
        <motion.p
          className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-6 tracking-widest uppercase"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY }}
        >
          Software Developer
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 2 }}
        >
          <span className="block gradient-text">Hi, I&apos;m Lance Abuan</span>
          <span className="block text-neutral-400 dark:text-neutral-500 mt-2">
            I build things that scale
          </span>
        </motion.h1>

        <motion.p
          className="mt-8 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 3 }}
        >
          Currently developing AI tools and agentic workflows at{" "}
          <span className="font-semibold text-foreground">Saltech Systems</span>.
          Building intelligent systems that automate complex workflows and push
          the boundaries of what AI agents can do.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 4 }}
        >
          <Link
            href="#projects"
            className="gradient-btn"
          >
            View Projects
          </Link>
          <Link
            href="#contact"
            className="gradient-outline-btn"
          >
            Get In Touch
          </Link>
        </motion.div>

        <ScrollArrow
          targetId="about"
          color="text-neutral-400"
          delay={STAGGER_DELAY * 6}
        />
      </div>
    </section>
  );
}

/* ============================================================
   TERMINAL HERO
   Prompt-style intro. Monospace. Blinking cursor.
   ============================================================ */
function HeroTerminal() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto">
        <motion.p
          className="text-xs font-mono tracking-wider mb-2"
          style={{ color: terminalPalette.secondary }}
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: STAGGER_DELAY }}
        >
          $ whoami
        </motion.p>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] terminal-glow font-mono"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: STAGGER_DELAY * 2 }}
        >
          <span className="block" style={{ color: terminalPalette.primary }}>lance_abuan</span>
          <span
            className="block text-lg sm:text-xl mt-2 font-mono"
            style={{ color: terminalPalette.muted }}
          >
            software_developer // ai &amp; agentic_workflows
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-sm sm:text-base max-w-xl leading-relaxed font-mono"
          style={{ color: terminalPalette.secondary }}
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: STAGGER_DELAY * 3 }}
        >
          &gt; currently at{" "}
          <span className="font-mono" style={{ color: terminalPalette.primary }}>Saltech Systems</span>
          {"\n"}&gt; building AI agents that automate complex workflows
          {"\n"}&gt; pushing the boundaries of what intelligent systems can do
          <span
            className="animate-pulse inline-block w-2 h-4 ml-1 align-text-bottom"
            style={{ color: terminalPalette.primary }}
          />
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: STAGGER_DELAY * 4 }}
        >
          <Link
            href="#projects"
            className="inline-flex items-center justify-center px-6 py-2.5 font-mono text-sm uppercase tracking-wider border transition-colors"
            style={{
              borderColor: terminalPalette.primary,
              color: terminalPalette.primary,
              fontFamily: "var(--font-terminal), monospace",
              borderRadius: 0,
            }}
          >
            ./view_projects
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-2.5 font-mono text-sm uppercase tracking-wider border transition-colors"
            style={{
              borderColor: terminalPalette.glowBorder,
              color: terminalPalette.secondary,
              fontFamily: "var(--font-terminal), monospace",
              borderRadius: 0,
            }}
          >
            ./get_in_touch
          </Link>
        </motion.div>

        <ScrollArrow
          targetId="about"
          color="text-[#00ff41]"
          delay={STAGGER_DELAY * 6}
        />
      </div>
    </section>
  );
}

/* ============================================================
   NEWSPAPER HERO
   Full masthead with volume line, headline, deck, and byline.
   ============================================================ */
function HeroNewspaper() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto text-center">
        {/* Masthead */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-black font-serif tracking-tight leading-none mb-2"
          style={{ color: newspaperPalette.primary }}
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY }}
        >
          Lance Abuan
        </motion.h1>

        {/* Subheadline / kicker */}
        <motion.p
          className="text-center text-base sm:text-lg font-serif italic mb-6"
          style={{ color: newspaperPalette.secondary }}
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 2 }}
        >
          Software Developer — AI &amp; Agentic Workflows
        </motion.p>

        {/* Triple rule separator */}
        <motion.hr
          className="newspaper-triple-rule mx-auto max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 2.5 }}
        />

        {/* Deck / lead paragraph */}
        <motion.p
          className="newspaper-deck text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 3 }}
        >
          A software developer focused on AI tools and agentic workflows.
          Currently at Saltech Systems, building intelligent systems that
          automate complex workflows and push the boundaries of what AI agents
          can do.
        </motion.p>

        {/* Byline */}
        <motion.p
          className="newspaper-byline mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 3.5 }}
        >
          By Lance Abuan
        </motion.p>

        {/* Ornamental divider */}
        <motion.div
          className="newspaper-ornament my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 4 }}
        >
          <span>❧</span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 4.5 }}
        >
          <Link
            href="#projects"
            className="inline-flex items-center justify-center px-8 py-2.5 text-xs uppercase tracking-[0.15em] border-2 transition-colors font-serif"
            style={{
              borderColor: newspaperPalette.primary,
              color: newspaperPalette.primary,
              borderRadius: 0,
            }}
          >
            View Projects
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-2.5 text-xs uppercase tracking-[0.15em] border-2 transition-colors font-serif"
            style={{
              borderColor: newspaperPalette.accent,
              color: newspaperPalette.secondary,
              borderRadius: 0,
            }}
          >
            Get In Touch
          </Link>
        </motion.div>

        <ScrollArrow
          targetId="about"
          color="text-[#7a6b5a]"
          delay={STAGGER_DELAY * 6.5}
        />
      </div>
    </section>
  );
}

/* ============================================================
   CASINO HERO — Premium VIP Room
   ============================================================ */
function HeroCasino() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="casino-hero-display">
            <div className="h-px bg-gradient-to-r from-transparent via-[#dc2626] to-transparent mb-8" />

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: STAGGER_DELAY }}
              className="casino-table-label mb-8"
            >
              <span className="text-[10px] font-serif tracking-[0.35em] uppercase" style={{ color: casinoPalette.gold }}>
                ♠ Software Developer ♥
              </span>
            </motion.div>

            <motion.h1
              className="casino-jackpot mb-4"
              initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 1.5 }}
            >
              Lance Abuan
            </motion.h1>

            <motion.p
              className="casino-neon text-lg sm:text-xl font-serif tracking-wide mb-8"
              initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 2 }}
            >
              Building Systems That Scale
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 2.5 }}
              className="casino-divider mb-6"
            >
              <span>♦</span>
            </motion.div>

            <motion.p
              className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-serif mb-10"
              style={{ color: casinoPalette.goldLight }}
              initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 2.75 }}
            >
              Developing AI tools and agentic workflows at{" "}
              <span className="font-semibold" style={{ color: casinoPalette.gold }}>Saltech Systems</span>
              . Building intelligent systems that automate complex workflows
              and push the boundaries of what AI agents can do.
            </motion.p>

            <div className="h-px bg-gradient-to-r from-transparent via-[#dc2626] to-transparent mt-8" />
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 3.5 }}
        >
          <Link
            href="#projects"
            className="casino-btn inline-flex items-center justify-center px-8 py-2.5 text-sm font-serif uppercase tracking-wider"
          >
            ♠ View Projects
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-2.5 text-sm font-serif uppercase tracking-wider border transition-colors"
            style={{
              borderColor: "rgba(212, 175, 55, 0.3)",
              color: casinoPalette.gold,
              borderRadius: "0.375rem",
            }}
          >
            ♦ Get In Touch
          </Link>
        </motion.div>

        <ScrollArrow
          targetId="about"
          color="text-[#d4af37]"
          delay={STAGGER_DELAY * 5.5}
        />
      </div>
    </section>
  );
}

/**
 * Reusable scroll-down arrow component with keyboard accessibility.
 */
function ScrollArrow({
  targetId,
  color,
  delay,
}: {
  targetId: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="mt-16 animate-bounce flex justify-center cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: REVEAL_DURATION, delay }}
      role="button"
      tabIndex={0}
      aria-label={SCROLL_ARROW_LABEL}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        }
      }}
      onClick={() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <svg
        className={`w-5 h-5 mx-auto ${color}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </motion.div>
  );
}
