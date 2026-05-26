"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ExternalLink, GitFork, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { projects, githubProfileUrl } from "@/data/projects";
import { useSectionReveal } from "@/components/section-reveal";

export function Projects() {
  const { ref, isInView } = useSectionReveal();

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
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
              Projects
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Things I've built
            </h2>
          </div>
          <Link
            href={githubProfileUrl}
            target="_blank"
            className={buttonVariants({ variant: "ghost", className: "hidden sm:flex items-center gap-1 text-sm" })}
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
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
