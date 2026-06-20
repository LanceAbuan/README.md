"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, GitFork, ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { projects, githubProfileUrl } from "@/data/projects";
import { cn } from "@/lib/utils";
import {
  REVEAL_DURATION,
  REVEAL_Y_OFFSET,
  STAGGER_DELAY,
  STAGGER_STEP,
  SCROLL_ARROW_DURATION,
  SCROLL_ARROW_DELAY,
  PROJECT_REVEAL_MARGIN,
} from "@/config/animations";
import { terminalPalette, newspaperPalette } from "@/config/theme-palette";
import { SCROLL_BEHAVIOR, LIVE_DEMO_LABEL, GITHUB_REPO_LABEL } from "@/config/accessibility";

export function Projects() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="projects" className="py-20 sm:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION }}
          className={cn(
            isNewspaper ? "text-center mb-10 sm:mb-12" : "flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12",
          )}
        >
          <div>
            {isCasino ? (
              <>
                <p className="casino-label mb-2">THE HAND</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white tracking-tight">
                  Selected Plays
                </h2>
                <div className="w-16 h-px bg-gradient-to-r from-[#d4af37] to-transparent mt-3" />
                <p className="text-[#c8bfb2] font-serif mt-3 max-w-lg text-sm sm:text-base">
                  Selected plays from the table.
                </p>
              </>
            ) : isTerminal ? (
              <>
                <p
                  className="text-xs font-mono mb-2 tracking-wider"
                  data-terminal-prompt
                  style={{ color: terminalPalette.secondary }}
                >
                  projects
                </p>
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
                  style={{ color: terminalPalette.primary }}
                >
                  Projects.List
                </h2>
              </>
            ) : isNewspaper ? (
              <>
                <p
                  className="text-xs font-serif tracking-[0.2em] uppercase"
                  data-newspaper-section
                  style={{ color: newspaperPalette.muted }}
                >
                  Portfolio
                </p>
                <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif mt-4 newspaper-letterpress"
                  style={{ color: newspaperPalette.primary }}
                >
                  Selected Works
                </h2>
                <p className="newspaper-deck max-w-lg mx-auto mt-3">
                  A curated collection of projects, each representing a distinct
                  challenge and solution.
                </p>
              </>
            ) : (
              <div>
                <p className="section-label mb-3 font-mono">Projects</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono">
                  Things I&apos;ve built
                </h2>
              </div>
            )}
          </div>
          {!isNewspaper && (
            <Link
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors self-end",
                isTerminal && "font-mono",
                isNewspaper && "font-serif",
                isCasino && "font-serif",
                !isTerminal && !isNewspaper && !isCasino && "text-neutral-500 dark:text-[#A89888] hover:text-terracotta dark:hover:text-[#C45D3E]",
              )}
              style={
                isTerminal
                  ? { color: terminalPalette.primary }
                  : isCasino
                    ? { color: "#d4af37" }
                    : undefined
              }
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>

        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4",
            isNewspaper && "lg:grid-cols-2",
          )}
          role="list"
          aria-label="Projects"
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              index={i}
              isTerminal={isTerminal}
              isNewspaper={isNewspaper}
              isCasino={isCasino}
            />
          ))}
        </div>

        {isNewspaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 6 }}
            className="text-center mt-6 sm:mt-8"
          >
            <Link
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="newspaper-btn inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] px-6 py-2 border-2 transition-colors font-serif"
              style={{
                borderColor: newspaperPalette.primary,
                color: newspaperPalette.primary,
              }}
            >
              View Complete Archive{" "}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}

        {isNewspaper && <SectionScrollArrow targetId="skills" isInView={isInView} />}

        {isTerminal && (
          <motion.div
            className="mt-10 sm:mt-12 animate-bounce flex justify-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: SCROLL_ARROW_DURATION, delay: SCROLL_ARROW_DELAY }}
            role="button"
            tabIndex={0}
            aria-label="Scroll to skills section"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.getElementById("skills")?.scrollIntoView({
                  behavior: SCROLL_BEHAVIOR,
                });
              }
            }}
            onClick={() => {
              document
                .getElementById("skills")
                ?.scrollIntoView({ behavior: SCROLL_BEHAVIOR });
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

function ProjectCard({
  project,
  index,
  isTerminal,
  isNewspaper,
  isCasino,
}: {
  project: (typeof projects)[number];
  index: number;
  isTerminal: boolean;
  isNewspaper: boolean;
  isCasino?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: PROJECT_REVEAL_MARGIN,
  });
  const transitionDelay = STAGGER_DELAY + index * STAGGER_STEP;

  if (isCasino) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: REVEAL_Y_OFFSET }
        }
        transition={{ duration: REVEAL_DURATION, delay: transitionDelay }}
        role="listitem"
      >
        <div className="casino-card h-full flex flex-col gap-2 sm:gap-3 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <h3 className="text-sm sm:text-base font-bold font-serif text-white">
              {project.name}
            </h3>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: "#d4af37" }}
                  aria-label={LIVE_DEMO_LABEL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Link>
              )}
              <Link
                href={project.github}
                className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-md transition-colors"
                style={{ color: "#d4af37" }}
                aria-label={GITHUB_REPO_LABEL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
            </div>
          </div>
          {project.featured && (
            <span className="casino-chip-gold h-5 w-5 flex items-center justify-center text-[10px]">
              ★
            </span>
          )}
          <p
            className="text-xs sm:text-sm font-serif leading-relaxed flex-1"
            style={{ color: "#c8bfb2" }}
          >
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="casino-chip text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-serif"
              >
                {tag}
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
        ref={ref}
        initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: REVEAL_Y_OFFSET }
        }
        transition={{ duration: REVEAL_DURATION, delay: transitionDelay }}
        role="listitem"
      >
        <div className="terminal-card p-3 sm:p-4 h-full flex flex-col gap-2 sm:gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Terminal
                className="h-3.5 w-3.5"
                style={{ color: terminalPalette.primary }}
              />
              <h3
                className="text-xs sm:text-sm font-bold font-mono terminal-glow"
                style={{ color: terminalPalette.primary }}
              >
                {project.name}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center hover:bg-[#0d1a0d]"
                  style={{ color: terminalPalette.primary }}
                  aria-label={LIVE_DEMO_LABEL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Link>
              )}
              <Link
                href={project.github}
                className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center hover:bg-[#0d1a0d]"
                style={{ color: terminalPalette.primary }}
                aria-label={GITHUB_REPO_LABEL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
            </div>
          </div>
          {project.featured && (
            <span className="terminal-badge text-[10px] px-1.5 py-0 block w-fit">
              featured
            </span>
          )}
          <p
            className="text-[11px] sm:text-xs font-mono leading-relaxed flex-1"
            style={{ color: terminalPalette.secondary }}
          >
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="terminal-badge text-[10px] sm:text-xs px-2 py-0.5 font-mono"
              >
                {tag}
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
        ref={ref}
        initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: REVEAL_Y_OFFSET }
        }
        transition={{ duration: REVEAL_DURATION, delay: transitionDelay }}
        role="listitem"
      >
        <article className="newspaper-card h-full flex flex-col gap-2 sm:gap-3">
          <h3
            className="text-base sm:text-lg font-bold font-serif newspaper-letterpress break-words leading-tight"
            style={{ color: newspaperPalette.primary }}
          >
            {project.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {project.featured && (
                <span className="text-[10px] font-serif italic" style={{ color: newspaperPalette.muted }}>
                  * Featured *
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center font-serif"
                  style={{ color: "#5c2e0e" }}
                  aria-label={LIVE_DEMO_LABEL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Link>
              )}
              <Link
                href={project.github}
                className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center font-serif"
                style={{ color: "#5c2e0e" }}
                aria-label={GITHUB_REPO_LABEL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
            </div>
          </div>

          <hr className="newspaper-rule" />

          <p
            className="text-xs sm:text-sm font-serif leading-relaxed flex-1 break-words overflow-hidden"
            style={{ color: newspaperPalette.body }}
          >
            {project.description}
          </p>

          <div className="newspaper-caption flex flex-wrap gap-1.5 sm:gap-2">
            {project.tags.map((tag, i) => (
              <span key={i} className="newspaper-badge px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </article>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: REVEAL_Y_OFFSET }
      }
      transition={{ duration: REVEAL_DURATION, delay: transitionDelay }}
      role="listitem"
    >
      <div className={cn(
        "group h-full flex flex-col earth-card earth-card-hover overflow-hidden",
        project.featured && "shadow-lg shadow-[#C45D3E]/10",
      )}>
        {/* Terracotta accent strip */}
        <div className="earth-accent-top w-full" />

        <div className="p-4 sm:p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-semibold text-foreground font-mono">
                {project.name}
              </h3>
              {project.featured && (
                <span className="earth-badge text-[9px] sm:text-[10px]">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-[#242019] text-neutral-500 dark:text-[#A89888] hover:bg-neutral-200 dark:hover:bg-[#2A231C] hover:text-terracotta dark:hover:text-[#C45D3E] transition-all"
                  aria-label={LIVE_DEMO_LABEL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              )}
              <Link
                href={project.github}
                className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-[#242019] text-neutral-500 dark:text-[#A89888] hover:bg-neutral-200 dark:hover:bg-[#2A231C] hover:text-terracotta dark:hover:text-[#C45D3E] transition-all"
                aria-label={GITHUB_REPO_LABEL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A89888] leading-relaxed flex-1 mb-3 sm:mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <span key={i} className="earth-badge text-[10px] sm:text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
