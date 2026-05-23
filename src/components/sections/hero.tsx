"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4 tracking-wide uppercase">
            Software Developer
          </p>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="block">Hi, I'm Lance Abuan</span>
          <span className="block text-neutral-400 dark:text-neutral-500 mt-2">
            I build things that scale
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Currently a Software Developer at{" "}
          <span className="font-medium text-foreground">Paycom</span>, working on
          large-scale enterprise systems, legacy modernization, and data pipeline
          architecture.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="#projects" className={buttonVariants({ className: "rounded-full px-6" })}>
            View Projects
          </Link>
          <Link href="#contact" className={buttonVariants({ variant: "outline", className: "rounded-full px-6" })}>
            Get In Touch
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <svg
            className="w-5 h-5 mx-auto text-neutral-400"
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
      </div>
    </section>
  );
}
