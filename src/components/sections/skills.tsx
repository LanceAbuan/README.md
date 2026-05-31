"use client";

import { motion } from "framer-motion";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";

export function Skills() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={cn(isNewspaper ? "text-center mb-12" : "mb-12")}
        >
          {isCasino ? (
            <div className="text-center mb-12">
              <p className="casino-label mb-2">
                ARSENAL
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
                Tools & Techniques
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4" />
              <p className="text-[#c8bfb2] font-serif mt-3 max-w-lg mx-auto">
                The skills that keep the edge sharp.
              </p>
            </div>
          ) : isTerminal ? (
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
          isNewspaper && "grid-cols-1 sm:grid-cols-2",
        )}>
          {skillCategories.map((cat, ci) => (
            <SkillCategoryCard
              key={cat.name}
              category={cat}
              index={ci}
              isInView={isInView}
              isTerminal={isTerminal}
              isNewspaper={isNewspaper}
              isCasino={isCasino}
            />
          ))}
        </div>

        {isNewspaper && <SectionScrollArrow targetId="contact" isInView={isInView} />}

        {isTerminal && (
          <motion.div
            className="mt-12 animate-bounce flex justify-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
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

function SkillCategoryCard({
  category,
  index,
  isInView,
  isTerminal,
  isNewspaper,
  isCasino,
}: {
  category: (typeof skillCategories)[number];
  index: number;
  isInView: boolean;
  isTerminal: boolean;
  isNewspaper: boolean;
  isCasino?: boolean;
}) {
  if (isCasino) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <div className="casino-card p-5 space-y-3">
          <h3 className="text-xs font-serif text-[#d4af37] uppercase tracking-[0.15em] border-b border-[#d4af37]/15 pb-2">
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((skill, i) => (
              <span key={i} className="casino-chip text-[10px] px-2 py-0.5 rounded-full font-serif">
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
          {/* Skills as wrapped editorial list */}
          <div className="flex flex-wrap font-serif text-sm text-[#3d2b1f] leading-relaxed">
            {category.items.map((skill, i) => (
              <span key={i} className="whitespace-nowrap">
                {skill}
                {i < category.items.length - 1 && (
                  <span className="mx-1.5 text-[#c4b59e]">·</span>
                )}
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
