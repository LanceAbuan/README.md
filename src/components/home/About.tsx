"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { fadeUp, slideInLeft, slideInRight } from "@/lib/animations";
import { motion } from "framer-motion";
import {
  IconBuilding,
  IconCode,
  IconBrain,
  IconSchool,
} from "@tabler/icons-react";

const highlights = [
  {
    icon: IconBuilding,
    title: "Enterprise Software",
    description:
      "3 years at Paycom building enterprise HR platforms — designing custom fields engines, leading front-end migrations across 200+ stakeholders, and engineering data migrations for $1M+ ARR clients.",
  },
  {
    icon: IconCode,
    title: "Full-Stack Development",
    description:
      "5+ years with PHP, TypeScript, React, Python, Java, and C#. I work across the stack from scalable backends to polished frontends, with Docker, Kubernetes, and MySQL in between.",
  },
  {
    icon: IconBrain,
    title: "AI & Machine Learning",
    description:
      "Building AlphaZero-style chess engines, reinforcement learning environments, and intelligent systems. I love teaching machines to learn from scratch through self-play.",
  },
  {
    icon: IconSchool,
    title: "Texas A&M '22",
    description:
      "B.S. Computer Science with a minor in Mathematics, graduated magna cum laude. Previously a Lead Research Software Developer at the TAMU Department of Entomology.",
  },
];

export function About() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal variants={fadeUp}>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 tracking-wide uppercase text-center">
            About Me
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-12 text-center">
            What I Do
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {highlights.map((item, i) => (
            <ScrollReveal
              key={item.title}
              variants={i % 2 === 0 ? slideInLeft : slideInRight}
              delay={i * 0.1}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
