"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge, Button, Text, Group } from "@mantine/core";
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
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION }}
          className={cn(
            isNewspaper ? "text-center mb-12" : "flex items-end justify-between mb-12",
          )}
        >
          <div>
            {isCasino ? (
              <>
                <p className="casino-label mb-2">THE HAND</p>
                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
                  Selected Plays
                </h2>
                <div className="w-16 h-px bg-gradient-to-r from-[#d4af37] to-transparent mt-3" />
                <p className="text-[#c8bfb2] font-serif mt-3 max-w-lg">
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
                  className="text-2xl sm:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
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
                  className="text-3xl sm:text-4xl font-bold font-serif mt-4 newspaper-letterpress"
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
              <>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
                  Projects
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Things I&apos;ve built
                </h2>
              </>
            )}
          </div>
          {!isNewspaper && (
            <Button
              component={Link}
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              size="sm"
              className={cn(
                "hidden sm:flex items-center gap-1",
                isTerminal && "rounded-none font-mono",
                isNewspaper && "rounded-none font-serif",
                isCasino && "rounded-md font-serif border border-[#d4af37]/20",
              )}
              style={
                isTerminal
                  ? { color: terminalPalette.primary }
                  : isNewspaper
                    ? { color: "#5c2e0e" }
                    : isCasino
                      ? { color: "#d4af37" }
                      : undefined
              }
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </motion.div>

        <div
          className={cn(
            "grid sm:grid-cols-2 gap-4",
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
            className="text-center mt-8"
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
            className="mt-12 animate-bounce flex justify-center cursor-pointer"
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
        <div className="casino-card h-full flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-bold font-serif text-white">
              {project.name}
            </h3>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  className="h-7 w-7 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: "#d4af37" }}
                  aria-label={LIVE_DEMO_LABEL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <Link
                href={project.github}
                className="h-7 w-7 flex items-center justify-center rounded-md transition-colors"
                style={{ color: "#d4af37" }}
                aria-label={GITHUB_REPO_LABEL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          {project.featured && (
            <span className="casino-chip-gold h-5 w-5 flex items-center justify-center text-[10px]">
              ★
            </span>
          )}
          <p
            className="text-sm font-serif leading-relaxed flex-1"
            style={{ color: "#c8bfb2" }}
          >
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="casino-chip text-[10px] px-2 py-0.5 rounded-full font-serif"
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
        <div className="terminal-card p-4 h-full flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Terminal
                className="h-3.5 w-3.5"
                style={{ color: terminalPalette.primary }}
              />
              <h3
                className="text-sm font-bold font-mono terminal-glow"
                style={{ color: terminalPalette.primary }}
              >
                {project.name}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  className="h-7 w-7 flex items-center justify-center hover:bg-[#0d1a0d]"
                  style={{ color: terminalPalette.primary }}
                  aria-label={LIVE_DEMO_LABEL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <Link
                href={project.github}
                className="h-7 w-7 flex items-center justify-center hover:bg-[#0d1a0d]"
                style={{ color: terminalPalette.primary }}
                aria-label={GITHUB_REPO_LABEL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          {project.featured && (
            <span className="terminal-badge text-[10px] px-1.5 py-0 block w-fit">
              featured
            </span>
          )}
          <p
            className="text-xs font-mono leading-relaxed flex-1"
            style={{ color: terminalPalette.secondary }}
          >
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="terminal-badge text-xs px-2 py-0.5 font-mono"
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
        <article className="newspaper-card h-full flex flex-col gap-3">
          <h3
            className="text-lg font-bold font-serif newspaper-letterpress break-words leading-tight"
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
                  className="h-7 w-7 flex items-center justify-center font-serif"
                  style={{ color: "#5c2e0e" }}
                  aria-label={LIVE_DEMO_LABEL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <Link
                href={project.github}
                className="h-7 w-7 flex items-center justify-center font-serif"
                style={{ color: "#5c2e0e" }}
                aria-label={GITHUB_REPO_LABEL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <hr className="newspaper-rule" />

          <p
            className="text-sm font-serif leading-relaxed flex-1 break-words overflow-hidden"
            style={{ color: newspaperPalette.body }}
          >
            {project.description}
          </p>

          <div className="newspaper-caption flex flex-wrap gap-2">
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
      <div className="group h-full flex flex-col rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-900/30 p-6 transition-all duration-300 hover:shadow-md hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:border-neutral-300/60 dark:hover:border-neutral-700/60">
        <div className="flex items-start justify-between mb-2">
          <Text fw={600} size="sm" className="flex items-center gap-2">
            {project.name}
            {project.featured && (
              <Badge
                variant="light"
                size="xs"
                radius="sm"
              >
                Featured
              </Badge>
            )}
          </Text>
          <div className="flex items-center gap-1">
            {project.demo && (
              <Button
                component={Link}
                href={project.demo}
                variant="subtle"
                size="compact-xs"
                aria-label={LIVE_DEMO_LABEL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              component={Link}
              href={project.github}
              variant="subtle"
              size="compact-xs"
              aria-label={GITHUB_REPO_LABEL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitFork className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <Text size="sm" c="dimmed" className="leading-relaxed flex-1 mb-3">
          {project.description}
        </Text>
        <Group gap="xs">
          {project.tags.map((tag, i) => (
            <Badge key={i} variant="light" size="xs" radius="sm">
              {tag}
            </Badge>
          ))}
        </Group>
      </div>
    </motion.div>
  );
}
