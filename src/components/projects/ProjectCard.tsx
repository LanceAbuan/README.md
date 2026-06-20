"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconBrandGithub, IconExternalLink, IconStar } from "@tabler/icons-react";
import { fadeUp } from "@/lib/animations";
import type { ProjectItem } from "@/types";

interface ProjectCardProps {
  project: ProjectItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div variants={fadeUp}>
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="group relative h-full p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            {project.language && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {project.language}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {project.stars > 0 && (
              <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <IconStar className="w-3.5 h-3.5" />
                {project.stars}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-auto pt-2">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <IconBrandGithub className="w-4 h-4" />
            Code
          </Link>
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <IconExternalLink className="w-4 h-4" />
              Live Demo
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
