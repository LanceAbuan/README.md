"use client";

import { motion } from "framer-motion";
import { useSectionReveal } from "@/components/section-reveal";
import { skillCategories } from "@/data/skills";

/**
 * Skills section — categorized grid of technology tags.
 * Categories animate in with staggered delay.
 */
export function Skills() {
  const { ref, isInView } = useSectionReveal();

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
            Skills
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            What I work with
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {skillCategories.map((cat, ci) => (
            <SkillCategoryCard
              key={cat.name}
              category={cat}
              index={ci}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Single skill category card. Receives the section-level isInView
 * flag so all cards animate together with staggered delays.
 */
function SkillCategoryCard({
  category,
  index,
  isInView,
}: {
  category: (typeof skillCategories)[number];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/30 dark:bg-neutral-900/30"
    >
      <h3 className="text-sm font-semibold mb-3 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
        {category.name}
      </h3>
      <div className="flex flex-wrap gap-2">
        {category.items.map((skill, i) => (
          <span
            key={i}
            className="inline-block px-3 py-1.5 rounded-lg text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
