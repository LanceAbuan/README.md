"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Hero() {
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";

  if (isTerminal) {
    return <HeroTerminal />;
  }

  if (isNewspaper) {
    return <HeroNewspaper />;
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
          className="mt-16 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
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
      </div>
    </section>
  );
}

/* ============================================================
   NEWSPAPER HERO
   Editorial masthead. Serif headline. Drop cap bio.
   ============================================================ */
function HeroNewspaper() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7a6b5a] mb-2 font-serif">
            Portfolio &amp; Works
          </p>
          <hr className="newspaper-rule mx-auto w-32" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="block text-[#1a1208]">Lance Abuan</span>
          <span className="block text-[#7a6b5a] text-lg sm:text-xl mt-2 italic font-serif">
            Software Developer — AI &amp; Agentic Workflows
          </span>
        </motion.h1>

        <motion.p
          className="mt-8 text-base sm:text-lg text-[#3d2b1f] max-w-xl mx-auto leading-relaxed font-serif newspaper-dropcap text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          A software developer focused on AI tools and agentic workflows.
          Currently at Saltech Systems, building intelligent systems that
          automate complex workflows and push the boundaries of what AI agents
          can do.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="#projects"
            className={cn(
              buttonVariants({
                className:
                  "rounded-none px-6 font-serif uppercase tracking-wider border-2 border-[#1a1208] bg-transparent text-[#1a1208] hover:bg-[#1a1208] hover:text-[#f7f2ea]",
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
                  "rounded-none px-6 font-serif uppercase tracking-wider border border-[#c4b59e] text-[#5c2e0e] hover:border-[#1a1208] hover:text-[#1a1208] bg-transparent",
              }),
            )}
          >
            Get In Touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
