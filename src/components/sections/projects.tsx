"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ExternalLink, GitFork, ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";
import { useSectionReveal } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { projects, githubProfileUrl } from "@/data/projects";
import { cn } from "@/lib/utils";

export function Projects() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            {isTerminal ? (
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
                <p className="text-xs font-serif tracking-[0.2em] text-[#7a6b5a] mb-1 uppercase" data-newspaper-section>
                  Projects
                </p>
                <hr className="newspaper-rule" />
                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4">
                  Things I&apos;ve Built
                </h2>
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
          <Link
            href={githubProfileUrl}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "ghost", className: "hidden sm:flex items-center gap-1 text-sm" }),
              isTerminal && "rounded-none font-mono text-[#00ff41] hover:bg-[#0d1a0d]",
              isNewspaper && "rounded-none font-serif text-[#5c2e0e] hover:bg-[#ddd2be]",
            )}
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  isTerminal,
  isNewspaper,
}: {
  project: (typeof projects)[number];
  index: number;
  isTerminal: boolean;
  isNewspaper: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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
        <div className="newspaper-card h-full flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold font-serif text-[#1a1208]">
              {project.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              {project.demo && (
                <Link href={project.demo} className="h-7 w-7 flex items-center justify-center text-[#5c2e0e] hover:bg-[#ddd2be]">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <Link href={project.github} className="h-7 w-7 flex items-center justify-center text-[#5c2e0e] hover:bg-[#ddd2be]">
                <GitFork className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          {project.featured && (
            <span className="text-[10px] font-serif italic text-[#7a6b5a]">* Featured *</span>
          )}
          <hr className="newspaper-rule-thin" />
          <p className="text-sm text-[#3d2b1f] font-serif leading-relaxed flex-1">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span key={i} className="newspaper-skill">{tag}</span>
            ))}
          </div>
        </div>
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
