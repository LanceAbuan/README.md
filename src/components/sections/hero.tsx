"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { SectionScrollArrow } from "@/components/section-reveal";

export function Hero() {
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  if (isTerminal) {
    return <HeroTerminal />;
  }

  if (isNewspaper) {
    return <HeroNewspaper />;
  }

  if (isCasino) {
    return <HeroCasino />;
  }

  return <HeroDefault />;
}

/* ============================================================
   DEFAULT HERO (light/dark/system/custom)
   ============================================================ */
function HeroDefault() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4 tracking-wide uppercase">
            Software Developer
          </p>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="block">Hi, I&apos;m Lance Abuan</span>
          <span className="block text-neutral-400 dark:text-neutral-500 mt-2">
            I build things that scale
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Currently developing AI tools and agentic workflows at{" "}
          <span className="font-medium text-foreground">Saltech Systems</span>.
          Building intelligent systems that automate complex workflows and push
          the boundaries of what AI agents can do.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="#projects" className={buttonVariants({ className: "rounded-full px-6" })}>
            View Projects
          </Link>
          <Link href="#contact" className={buttonVariants({ variant: "outline", className: "rounded-full px-6" })}>
            Get In Touch
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 animate-bounce cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={() => {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg
            className="w-5 h-5 mx-auto text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-xs text-[#00aa30] mb-2 font-mono tracking-wider">
            $ whoami
          </p>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] terminal-glow font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span className="block text-[#00ff41]">lance_abuan</span>
          <span className="block text-[#00cc33] text-lg sm:text-xl mt-2">
            software_developer // ai &amp; agentic_workflows
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-sm sm:text-base text-[#00aa30] max-w-xl leading-relaxed font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          &gt; currently at <span className="text-[#00ff41]">Saltech Systems</span>
          {"\n"}&gt; building AI agents that automate complex workflows
          {"\n"}&gt; pushing the boundaries of what intelligent systems can do
          <span className="animate-pulse text-[#00ff41] inline-block w-2 h-4 ml-1 align-text-bottom" />
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Link
            href="#projects"
            className={cn(
              buttonVariants({ className: "rounded-none px-6 font-mono uppercase tracking-wider border border-[#00ff41] bg-transparent text-[#00ff41] hover:bg-[#00ff41] hover:text-black" }),
            )}
          >
            ./view_projects
          </Link>
          <Link
            href="#contact"
            className={cn(
              buttonVariants({
                variant: "outline",
                className:
                  "rounded-none px-6 font-mono uppercase tracking-wider border border-[#00ff4140] text-[#00aa30] hover:border-[#00ff41] hover:text-[#00ff41] bg-transparent",
              }),
            )}
          >
            ./get_in_touch
          </Link>
        </motion.div>

        {/* Terminal scroll arrow */}
        <motion.div
          className="mt-16 animate-bounce flex justify-center cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          onClick={() => {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg
            className="w-5 h-5 text-[#00ff41]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   NEWSPAPER HERO
   Full masthead with volume line, headline, deck, and byline.
   ============================================================ */
/* ============================================================
   CASINO HERO
   High-roller aesthetic. Gold-accented headline on felt,
   chip-style badge, velvet-drape vibe.
   ============================================================ */
function HeroCasino() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto text-center">
        {/* Decorative suit symbols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-6 text-2xl text-[#d4a84360] mb-6"
        >
          <span>♠</span>
          <span className="text-[#d4a84330] text-lg">◆</span>
          <span>♥</span>
          <span className="text-[#d4a84330] text-lg">◆</span>
          <span>♦</span>
        </motion.div>

        {/* Title chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4a84340] bg-[#1a0a0a]/80 mb-6"
        >
          <span className="text-xs font-serif text-[#d4a843] tracking-[0.2em] uppercase">
            Software Developer
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif tracking-tight leading-[1.1] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="block text-[#f0e6d3]">Hi, I&apos;m Lance Abuan</span>
          <span className="block text-[#d4a843] casino-gold text-2xl sm:text-3xl md:text-4xl mt-2 font-serif">
            I build things that scale
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-base sm:text-lg text-[#c4b59e] max-w-xl mx-auto leading-relaxed font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Currently developing AI tools and agentic workflows at{" "}
          <span className="text-[#d4a843] font-medium">Saltech Systems</span>.
          Building intelligent systems that automate complex workflows and push
          the boundaries of what AI agents can do.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link
            href="#projects"
            className={cn(
              buttonVariants({
                className:
                  "casino-btn px-8 text-sm tracking-wider",
              }),
            )}
          >
            View Projects
          </Link>
          <Link
            href="#contact"
            className={cn(
              buttonVariants({
                variant: "outline",
                className:
                  "rounded-md px-8 text-sm font-serif tracking-wider border border-[#d4a84340] text-[#d4a843] hover:bg-[#d4a843] hover:text-[#1a0a0a] bg-transparent transition-colors",
              }),
            )}
          >
            Get In Touch
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 animate-bounce cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          onClick={() => {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg
            className="w-5 h-5 mx-auto text-[#d4a843]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

function HeroNewspaper() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto">
        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="newspaper-masthead newspaper-letterpress">
            The Lance Portfolio
          </p>
          <div className="newspaper-masthead-sub">
            Vol. I &nbsp;•&nbsp; Est. 2026 &nbsp;•&nbsp; Carrollton, TX
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-[#1a1208] text-center leading-[1.1] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Lance Abuan
        </motion.h1>

        {/* Subheadline / kicker */}
        <motion.p
          className="text-center text-base sm:text-lg font-serif italic text-[#5c2e0e] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Software Developer — AI &amp; Agentic Workflows
        </motion.p>

        {/* Triple rule separator */}
        <motion.hr
          className="newspaper-triple-rule mx-auto max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />

        {/* Deck / lead paragraph */}
        <motion.p
          className="newspaper-deck text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          By Lance Abuan
        </motion.p>

        {/* Ornamental divider */}
        <motion.div
          className="newspaper-ornament my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span>❧</span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link
            href="#projects"
            className={cn(
              buttonVariants({
                className:
                  "rounded-none px-8 font-serif text-xs uppercase tracking-[0.15em] border-2 border-[#1a1208] bg-transparent text-[#1a1208] hover:bg-[#1a1208] hover:text-[#f7f2ea] transition-colors",
              }),
            )}
          >
            View Projects
          </Link>
          <Link
            href="#contact"
            className={cn(
              buttonVariants({
                variant: "outline",
                className:
                  "rounded-none px-8 font-serif text-xs uppercase tracking-[0.15em] border border-[#c4b59e] text-[#5c2e0e] hover:border-[#1a1208] hover:text-[#1a1208] bg-transparent transition-colors",
              }),
            )}
          >
            Get In Touch
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 animate-bounce flex justify-center cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          onClick={() => {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg
            className="w-5 h-5 text-[#7a6b5a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
