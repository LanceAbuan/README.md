"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { staggerContainer, fadeUp } from "@/lib/animations";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-3xl text-center"
      >
        <ScrollReveal>
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400 mb-4 tracking-wide uppercase"
          >
            Software Developer
          </motion.p>
        </ScrollReveal>

        <ScrollReveal>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]"
          >
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              Lance Abuan
            </span>
          </motion.h1>
        </ScrollReveal>

        <ScrollReveal>
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Full-stack developer and AI enthusiast. I build enterprise-scale
            systems, chess engines that teach themselves, and everything in
            between.
          </motion.p>
        </ScrollReveal>

        <ScrollReveal>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 hover:shadow-lg hover:shadow-zinc-900/20 dark:hover:shadow-white/20 hover:scale-105"
            >
              View My Work
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-full font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 hover:scale-105"
            >
              Get in Touch
            </Link>
          </motion.div>
        </ScrollReveal>
      </motion.div>
    </section>
  );
}
