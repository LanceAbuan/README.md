"use client";

import { motion } from "framer-motion";
import { Building2, Terminal } from "lucide-react";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { experiences } from "@/data/experience";
import { cn } from "@/lib/utils";
import {
  REVEAL_DURATION,
  REVEAL_Y_OFFSET,
  STAGGER_DELAY,
  STAGGER_STEP,
  SCROLL_ARROW_DURATION,
  SCROLL_ARROW_DELAY,
} from "@/config/animations";
import { terminalPalette, newspaperPalette } from "@/config/theme-palette";
import { SCROLL_BEHAVIOR } from "@/config/accessibility";

export function Experience() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="experience" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION }}
          className={cn(isNewspaper ? "text-center mb-12" : "mb-12")}
        >
          {isCasino ? (
            <div className="mb-12">
              <p className="casino-label mb-2">
                TRACK RECORD
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
                Career History
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-[#d4af37] to-transparent mt-4" />
              <p className="text-[#c8bfb2] font-serif mt-3 max-w-lg">
                A career built on calculated risks and winning plays.
              </p>
            </div>
          ) : isTerminal ? (
            <div>
              <p
                className="text-xs font-mono mb-2 tracking-wider"
                data-terminal-prompt
                style={{ color: terminalPalette.secondary }}
              >
                experience
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
                style={{ color: terminalPalette.primary }}
              >
                Work.History
              </h2>
            </div>
          ) : isNewspaper ? (
            <div>
              <p
                className="text-xs font-serif tracking-[0.2em] uppercase"
                data-newspaper-section
                style={{ color: newspaperPalette.muted }}
              >
                Career
              </p>
              <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
              <h2
                className="text-3xl sm:text-4xl font-bold font-serif mt-4 newspaper-letterpress"
                style={{ color: newspaperPalette.primary }}
              >
                Professional History
              </h2>
              <p className="newspaper-deck max-w-lg mx-auto mt-3">
                A chronological record of positions held and contributions made.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
                Experience
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Where I&apos;ve worked
              </h2>
            </div>
          )}
        </motion.div>

        <div
          className={cn(
            "space-y-4",
            isTerminal && "terminal-timeline pl-4 relative",
            isNewspaper && "space-y-8",
            isCasino && "casino-timeline relative space-y-6",
          )}
          role="list"
          aria-label="Work experience"
        >
          {experiences.map((exp, i) => (
            <ExperienceCard
              key={i}
              exp={exp}
              index={i}
              isInView={isInView}
              isTerminal={isTerminal}
              isNewspaper={isNewspaper}
              isCasino={isCasino}
            />
          ))}
        </div>

        {isNewspaper && <SectionScrollArrow targetId="projects" isInView={isInView} />}

        {isTerminal && (
          <motion.div
            className="mt-12 animate-bounce flex justify-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: SCROLL_ARROW_DURATION, delay: SCROLL_ARROW_DELAY }}
            role="button"
            tabIndex={0}
            aria-label="Scroll to projects section"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: SCROLL_BEHAVIOR });
              }
            }}
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: SCROLL_BEHAVIOR });
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

function ExperienceCard({
  exp,
  index,
  isInView,
  isTerminal,
  isNewspaper,
  isCasino,
}: {
  exp: (typeof experiences)[number];
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
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: REVEAL_DURATION, delay: transitionDelay }}
        className="flex gap-4 items-center"
        role="listitem"
      >
        <div className="flex flex-col items-center pt-1">
          <div className="casino-timeline-dot" />
        </div>

        <div className="casino-card flex-1 p-5 space-y-3">
          <h3 className="text-lg font-bold font-serif text-white text-center">
            {exp.role}
            <span className="text-xs font-serif whitespace-nowrap ml-2 pt-0.5 align-text-top" style={{ color: "#8a7e72" }}>
              {exp.period}
            </span>
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm font-serif flex-wrap" style={{ color: "#c8bfb2" }}>
            <Building2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#8b1a1a" }} />
            <span>{exp.company}</span>
            <span>&#8226;</span>
            <span>{exp.location}</span>
          </div>
          <p className="text-sm font-serif leading-relaxed max-w-xl mx-auto text-center" style={{ color: "#c8bfb2" }}>
            {exp.description}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {exp.skills.map((skill, j) => (
              <span key={j} className="casino-chip text-[10px] px-2 py-0.5 rounded-full font-serif">
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
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: REVEAL_DURATION, delay: transitionDelay }}
        role="listitem"
      >
        <div className="terminal-card p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4" style={{ color: terminalPalette.primary }} />
            <span className="text-xs font-mono" style={{ color: terminalPalette.secondary }}>
              [{exp.period}]
            </span>
          </div>
          <div>
            <h3
              className="text-base font-bold font-mono terminal-glow"
              style={{ color: terminalPalette.primary }}
            >
              {exp.role}
            </h3>
            <div className="flex items-center gap-2 text-sm font-mono mt-1" style={{ color: terminalPalette.secondary }}>
              <Building2 className="h-3.5 w-3.5" />
              <span>{exp.company}</span>
              <span>&bull;</span>
              <span>{exp.location}</span>
              <span>&bull;</span>
              <span style={{ color: "#008822" }}>{exp.type}</span>
            </div>
          </div>
          <p className="text-sm font-mono leading-relaxed" style={{ color: terminalPalette.secondary }}>
            {exp.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {exp.skills.map((skill, j) => (
              <span
                key={j}
                className="terminal-badge text-xs px-2 py-0.5 font-mono"
              >
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
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: REVEAL_DURATION, delay: transitionDelay }}
        role="listitem"
      >
        <article className="newspaper-card space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="newspaper-kicker">{exp.company}</span>
            <span className="text-xs font-serif italic" style={{ color: newspaperPalette.muted }}>
              {exp.period}
            </span>
          </div>

          <h3
            className="text-xl font-bold font-serif newspaper-letterpress break-words leading-tight"
            style={{ color: newspaperPalette.primary }}
          >
            {exp.role}
          </h3>

          <div className="newspaper-byline text-left">
            {exp.location} &middot; {exp.type}
          </div>

          <hr className="newspaper-rule" />

          <p
            className="text-[0.9rem] font-serif leading-relaxed break-words overflow-hidden"
            style={{ color: newspaperPalette.body }}
          >
            {exp.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {exp.skills.map((skill, j) => (
              <span key={j} className="newspaper-badge px-2 py-0.5">
                {skill}
              </span>
            ))}
          </div>
        </article>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: REVEAL_DURATION, delay: transitionDelay }}
      role="listitem"
    >
      <div className="group glass-card glass-card-hover p-6 border-l-2 border-l-indigo-500 dark:border-l-indigo-400">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
              <span className="gradient-badge">{exp.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <Building2 className="h-3.5 w-3.5" />
              <span>{exp.company}</span>
              <span>&#8226;</span>
              <span>{exp.location}</span>
            </div>
          </div>
          <time className="text-xs font-medium text-neutral-400 dark:text-neutral-500 whitespace-nowrap bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
            {exp.period}
          </time>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
          {exp.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {exp.skills.map((skill, j) => (
            <span key={j} className="gradient-badge">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
