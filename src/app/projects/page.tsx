"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { staggerContainer, fadeUp } from "@/lib/animations";
import type { ProjectItem } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags))
  ).sort();

  const filtered = projects.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal variants={fadeUp}>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 tracking-wide uppercase">
            Projects
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            All Projects
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl">
            A collection of my work, automatically pulled from GitHub. From
            full-stack web apps to game engines.
          </p>
        </ScrollReveal>

        <ScrollReveal variants={fadeUp} delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variants={fadeUp} delay={0.15}>
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <IconFilter className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                !selectedTag
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTag(selectedTag === tag ? null : tag)
                }
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                  selectedTag === tag
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {loading ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          </motion.div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              No projects found matching your search.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
