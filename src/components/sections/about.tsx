"use client";

import { motion } from "framer-motion";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { aboutData } from "@/data/about";
import {
  REVEAL_DURATION,
  REVEAL_Y_OFFSET,
  STAGGER_DELAY,
} from "@/config/animations";
import { terminalPalette, newspaperPalette, casinoPalette } from "@/config/theme-palette";

export function About() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION }}
          className="mb-12"
        >
          {isCasino ? (
            <div className="text-center mb-12">
              <p className="casino-label mb-2">ABOUT</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
                The Player
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4" />
              <p className="text-[#c8bfb2] font-serif mt-3 max-w-lg mx-auto">
                A brief introduction to the developer behind the code.
              </p>
            </div>
          ) : isTerminal ? (
            <div>
              <p
                className="text-xs font-mono mb-2 tracking-wider"
                data-terminal-prompt
                style={{ color: terminalPalette.secondary }}
              >
                about
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
                style={{ color: terminalPalette.primary }}
              >
                Who.Am.I
              </h2>
            </div>
          ) : isNewspaper ? (
            <div>
              <p
                className="text-xs font-serif tracking-[0.2em] uppercase"
                data-newspaper-section
                style={{ color: newspaperPalette.muted }}
              >
                Biography
              </p>
              <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif mt-4 newspaper-letterpress" style={{ color: newspaperPalette.primary }}>
                About the Developer
              </h2>
              <p className="newspaper-deck max-w-lg mx-auto mt-3">
                A journey through code, curiosity, and continuous learning.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
                About
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                About Me
              </h2>
            </>
          )}
        </motion.div>

        <div className={cn(isNewspaper && "max-w-2xl mx-auto")}>
          {aboutData.paragraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              className={cn(
                "text-base sm:text-lg leading-relaxed mb-4 last:mb-0",
                isCasino && "text-[#c8bfb2] font-serif",
                isTerminal && "text-sm font-mono",
                isNewspaper && "font-serif leading-relaxed",
                !isTerminal && !isNewspaper && !isCasino && "text-neutral-600 dark:text-neutral-400",
              )}
              style={
                isTerminal
                  ? { color: terminalPalette.secondary }
                  : isNewspaper
                  ? { color: newspaperPalette.body }
                  : undefined
              }
              initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY + i * STAGGER_DELAY }}
            >
              {paragraph.text}
            </motion.p>
          ))}
        </div>

        {isNewspaper && <SectionScrollArrow targetId="experience" isInView={isInView} />}
      </div>
    </section>
  );
}
