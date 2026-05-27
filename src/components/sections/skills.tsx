"use client";

import { motion } from "framer-motion";
import { useSectionReveal } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";

export function Skills() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={cn(isNewspaper ? "text-center mb-12" : "mb-12")}
        >
          {isTerminal ? (
            <div>
              <p className="text-xs font-mono text-[#00aa30] mb-2 tracking-wider" data-terminal-prompt>
                skills
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider">
                Stack.List
              </h2>
            </div>
          ) : isNewspaper ? (
            <div>
              <p className="text-xs font-serif tracking-[0.2em] text-[#7a6b5a] uppercase" data-newspaper-section>
                Expertise
              </p>
              <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4 newspaper-letterpress">
                Technical Proficiency
              </h2>
              <p className="newspaper-deck max-w-lg mx-auto mt-3">
                The tools, languages, and frameworks that form the foundation of my craft.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
                Skills
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                What I work with
              </h2>
            </>
          )}
        </motion.div>

        <div className={cn(
          "grid sm:grid-cols-2 gap-6",
          isNewspaper && "newspaper-columns-2 sm:grid-cols-1",
        )}>
          {skillCategories.map((cat, ci) => (
            <SkillCategoryCard
              key={cat.name}
              category={cat}
              index={ci}
              isInView={isInView}
              isTerminal={isTerminal}
              isNewspaper={isNewspaper}
            />
          ))}
        </div>
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
}: {
  category: (typeof skillCategories)[number];
  index: number;
  isInView: boolean;
  isTerminal: boolean;
  isNewspaper: boolean;
}) {
  if (isTerminal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <div className="terminal-card p-4 space-y-3">
          <h3 className="text-xs font-mono text-[#00aa30] uppercase tracking-wider border-b border-[#00ff4130] pb-2">
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((skill, i) => (
              <span key={i} className="terminal-badge text-xs px-2 py-0.5 font-mono">
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
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <div className="newspaper-card space-y-3">
          {/* Category as section kicker */}
          <h3 className="text-xs font-bold font-serif text-[#5c2e0e] uppercase tracking-[0.15em]">
            {category.name}
          </h3>
          <hr className="newspaper-rule" />
          {/* Skills as comma-separated editorial list */}
          <div className="font-serif text-sm text-[#3d2b1f] leading-relaxed">
            {category.items.map((skill, i) => (
              <span key={i}>
                {skill}
                {i < category.items.length - 1 ? " &middot; " : ""}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
