"use client";

import { motion } from "framer-motion";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";
import {
  REVEAL_DURATION,
  REVEAL_Y_OFFSET,
  STAGGER_DELAY,
  STAGGER_STEP,
  SCROLL_ARROW_DURATION,
  SCROLL_ARROW_DELAY,
} from "@/config/animations";
import { terminalPalette, newspaperPalette, casinoPalette } from "@/config/theme-palette";
import { SCROLL_BEHAVIOR } from "@/config/accessibility";

export function Skills() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="skills" className="py-20 sm:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION }}
          className={cn(isNewspaper ? "text-center mb-10 sm:mb-12" : "mb-10 sm:mb-12")}
        >
          {isCasino ? (
            <div className="text-center mb-10 sm:mb-12">
              <p className="casino-label mb-2">ARSENAL</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white tracking-tight">
                Tools & Techniques
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4" />
              <p className="text-[#c8bfb2] font-serif mt-3 max-w-lg mx-auto text-sm sm:text-base">
                The skills that keep the edge sharp.
              </p>
            </div>
          ) : isTerminal ? (
            <div>
              <p
                className="text-xs font-mono mb-2 tracking-wider"
                data-terminal-prompt
                style={{ color: terminalPalette.secondary }}
              >
                skills
              </p>
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
                style={{ color: terminalPalette.primary }}
              >
                Stack.List
              </h2>
            </div>
          ) : isNewspaper ? (
            <div>
              <p
                className="text-xs font-serif tracking-[0.2em] uppercase"
                data-newspaper-section
                style={{ color: newspaperPalette.muted }}
              >
                Expertise
              </p>
              <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif mt-4 newspaper-letterpress"
                style={{ color: newspaperPalette.primary }}
              >
                Technical Proficiency
              </h2>
              <p className="newspaper-deck max-w-lg mx-auto mt-3">
                The tools, languages, and frameworks that form the foundation of my craft.
              </p>
            </div>
          ) : (
            <div>
              <p className="section-label mb-3 font-mono">Skills</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono">
                What I work with
              </h2>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {skillCategories.map((cat, ci) => (
            <SkillCategoryCard
              key={cat.name}
              category={cat}
              index={ci}
              isInView={isInView}
              isTerminal={isTerminal}
              isNewspaper={isNewspaper}
              isCasino={isCasino}
            />
          ))}
        </div>

        {isNewspaper && <SectionScrollArrow targetId="contact" isInView={isInView} />}

        {isTerminal && (
          <motion.div
            className="mt-10 sm:mt-12 animate-bounce flex justify-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: SCROLL_ARROW_DURATION, delay: SCROLL_ARROW_DELAY }}
            role="button"
            tabIndex={0}
            aria-label="Scroll to contact section"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: SCROLL_BEHAVIOR });
              }
            }}
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: SCROLL_BEHAVIOR });
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ color: terminalPalette.primary }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function SkillCategoryCard({
  category,
  index,
  isInView,
  isTerminal,
  isNewspaper,
  isCasino,
}: {
  category: (typeof skillCategories)[number];
  index: number;
  isInView: boolean;
  isTerminal: boolean;
  isNewspaper: boolean;
  isCasino?: boolean;
}) {
  const transitionDelay = STAGGER_DELAY + index * STAGGER_STEP;

  if (isCasino) {
    return (
      <motion.div
        initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: REVEAL_Y_OFFSET }}
        transition={{ duration: 0.5, delay: transitionDelay }}
      >
        <div className="casino-card p-4 sm:p-5 space-y-2 sm:space-y-3">
          <h3 className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.15em] border-b pb-2" style={{ color: casinoPalette.gold, borderColor: `${casinoPalette.gold}15` }}>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((skill, i) => (
              <span key={i} className="casino-chip text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-serif">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (isTerminal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: REVEAL_Y_OFFSET }}
        transition={{ duration: 0.5, delay: transitionDelay }}
      >
        <div className="terminal-card p-3 sm:p-4 space-y-2 sm:space-y-3">
          <h3
            className="text-[10px] sm:text-xs font-mono uppercase tracking-wider border-b pb-2"
            style={{ color: terminalPalette.secondary, borderColor: terminalPalette.glowBorder }}
          >
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((skill, i) => (
              <span key={i} className="terminal-badge text-[10px] sm:text-xs px-2 py-0.5 font-mono">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (isNewspaper) {
    return (
      <motion.div
        initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: REVEAL_Y_OFFSET }}
        transition={{ duration: 0.5, delay: transitionDelay }}
      >
        <div className="newspaper-card space-y-2 sm:space-y-3">
          <h3
            className="text-[10px] sm:text-xs font-bold font-serif uppercase tracking-[0.15em]"
            style={{ color: newspaperPalette.secondary }}
          >
            {category.name}
          </h3>
          <hr className="newspaper-rule" />
          <div className="flex flex-wrap font-serif text-xs sm:text-sm leading-relaxed" style={{ color: newspaperPalette.body }}>
            {category.items.map((skill, i) => (
              <span key={i} className="whitespace-nowrap">
                {skill}
                {i < category.items.length - 1 && (
                  <span className="mx-1 sm:mx-1.5" style={{ color: newspaperPalette.accent }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: REVEAL_Y_OFFSET }}
      transition={{ duration: 0.5, delay: transitionDelay }}
    >
      <div className="earth-card earth-card-hover p-4 sm:p-5 h-full">
        <div className="earth-accent-top w-full rounded-full mb-3 sm:mb-4" />
        <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider terracotta-text mb-3 sm:mb-4 font-mono">
          {category.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {category.items.map((skill, i) => (
            <span key={i} className="earth-badge text-[10px] sm:text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
