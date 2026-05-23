"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    name: "Languages",
    items: ["TypeScript", "Rust", "PHP", "GDScript", "C#", "JavaScript", "SQL", "Python"],
  },
  {
    name: "Frameworks & Libraries",
    items: ["React", "Next.js", "Laravel", "Godot", "Tailwind CSS", "Apache Arrow"],
  },
  {
    name: "Infrastructure & Tools",
    items: ["Docker", "AWS", "Redis", "MySQL", "Git", "Linux", "CI/CD", "Nginx"],
  },
  {
    name: "Practices",
    items: ["System Design", "Performance Optimization", "Legacy Modernization", "Data Pipelines", "TDD", "Agile"],
  },
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + ci * 0.08 }}
              className="p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/30 dark:bg-neutral-900/30"
            >
              <h3 className="text-sm font-semibold mb-3 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1.5 rounded-lg text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
