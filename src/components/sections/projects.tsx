"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ExternalLink, GitFork, ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { projects, githubProfileUrl } from "@/data/projects";
import { cn } from "@/lib/utils";

export function Projects() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={cn(
            isNewspaper ? "text-center mb-12" : "flex items-end justify-between mb-12",
          )}
        >
          <div>
            {isCasino ? (
              <>
                <p className="text-xs font-serif text-[#d4a843] mb-2 tracking-[0.3em] uppercase">
                  THE HAND
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#d4a843] casino-gold tracking-tight">
                  Show Me What You&apos;ve Got
                </h2>
                <p className="text-[#c4b59e] font-serif mt-3 max-w-lg">
                  Selected plays from the table.
                </p>
              </>
            ) : isTerminal ? (
              <>
                <p className="text-xs font-mono text-[#00aa30] mb-2 tracking-wider" data-terminal-prompt>
                  projects
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider">
                  Projects.List
                </h2>
              </>
            ) : isNewspaper ? (
              <>
                <p className="text-xs font-serif tracking-[0.2em] text-[#7a6b5a] uppercase" data-newspaper-section>
                  Portfolio
                </p>
                <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4 newspaper-letterpress">
                  Selected Works
                </h2>
                <p className="newspaper-deck max-w-lg mx-auto mt-3">
                  A curated collection of projects, each representing a distinct challenge and solution.
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
            <Link
              href={githubProfileUrl}
              target="_blank"
              className={cn(
                buttonVariants({ variant: "ghost", className: "hidden sm:flex items-center gap-1 text-sm" }),
                isTerminal && "rounded-none font-mono text-[#00ff41] hover:bg-[#0d1a0d]",
                isNewspaper && "rounded-none font-serif text-[#5c2e0e] hover:bg-[#ddd2be]",
                isCasino && "rounded-md font-serif text-[#d4a843] hover:bg-[#c41e1e40]",
              )}
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </motion.div>

        <div className={cn(
          "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
          isNewspaper && "lg:grid-cols-2",
        )}>
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
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-8"
          >
            <Link
              href={githubProfileUrl}
              target="_blank"
              className="newspaper-btn inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] px-6 py-2 border-2 border-[#1a1208] text-[#1a1208] hover:bg-[#1a1208] hover:text-[#f7f2ea] transition-colors font-serif"
            >
              View Complete Archive <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}

        {isNewspaper && <SectionScrollArrow targetId="skills" isInView={isInView} />}

        {isTerminal && (
          <motion.div
            className="mt-12 animate-bounce flex justify-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            onClick={() => {
              document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (isCasino) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <div className="casino-felt p-5 h-full flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-bold font-serif text-[#d4a843] casino-gold">
              {project.name}
            </h3>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link href={project.demo} className="h-7 w-7 flex items-center justify-center text-[#d4a843] hover:bg-[#c41e1e40] rounded-md">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <Link href={project.github} className="h-7 w-7 flex items-center justify-center text-[#d4a843] hover:bg-[#c41e1e40] rounded-md">
                <GitFork className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          {project.featured && (
            <span className="casino-chip h-5 w-5 flex items-center justify-center text-[10px]">
              ★
            </span>
          )}
          <p className="text-sm text-[#f0e6d3] font-serif leading-relaxed flex-1">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <span key={i} className="casino-chip text-[10px] px-2 py-0.5 rounded-full font-serif">{tag}</span>
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
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <div className="terminal-card p-4 h-full flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-[#00ff41]" />
              <h3 className="text-sm font-bold font-mono text-[#00ff41] terminal-glow">
                {project.name}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link href={project.demo} className="h-7 w-7 flex items-center justify-center text-[#00ff41] hover:bg-[#0d1a0d]">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <Link href={project.github} className="h-7 w-7 flex items-center justify-center text-[#00ff41] hover:bg-[#0d1a0d]">
                <GitFork className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          {project.featured && (
            <span className="terminal-badge text-[10px] px-1.5 py-0 block w-fit">featured</span>
          )}
          <p className="text-xs text-[#00aa30] font-mono leading-relaxed flex-1">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <span key={i} className="terminal-badge text-xs px-2 py-0.5 font-mono">{tag}</span>
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
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <article className="newspaper-card h-full flex flex-col gap-3">
          {/* Project name as article headline */}
          <h3 className="text-lg font-bold font-serif text-[#1a1208] newspaper-letterpress break-words leading-tight">
            {project.name}
          </h3>

          {/* Featured star + links */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {project.featured && (
                <span className="text-[10px] font-serif text-[#7a6b5a] italic">* Featured *</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  className="h-7 w-7 flex items-center justify-center text-[#5c2e0e] hover:bg-[#ddd2be] font-serif"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <Link
                href={project.github}
                className="h-7 w-7 flex items-center justify-center text-[#5c2e0e] hover:bg-[#ddd2be] font-serif"
              >
                <GitFork className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <hr className="newspaper-rule" />

          {/* Body copy */}
          <p className="text-sm text-[#3d2b1f] font-serif leading-relaxed flex-1 break-words overflow-hidden">
            {project.description}
          </p>

          {/* Tags as caption */}
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
    >
      <Card className="group h-full bg-white/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-800/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              {project.name}
              {project.featured && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                  Featured
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  className={buttonVariants({ variant: "ghost", size: "icon", className: "h-7 w-7" })}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="sr-only">Live demo</span>
                </Link>
              )}
              <Link
                href={project.github}
                className={buttonVariants({ variant: "ghost", size: "icon", className: "h-7 w-7" })}
              >
                <GitFork className="h-3.5 w-3.5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
