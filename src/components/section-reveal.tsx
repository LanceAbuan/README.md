"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

const defaultTransition = { duration: 0.6 };
const defaultInitial = { opacity: 0, y: 30 };
const defaultAnimate = { opacity: 1, y: 0 };

export interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  variants?: Variants;
  className?: string;
  once?: boolean;
  /** @default "-100px" */
  margin?: string;
}

/**
 * Reusable reveal-on-scroll wrapper.
 * Handles the useRef + useInView boilerplate so each section
 * component doesn't need to repeat it.
 */
export function SectionReveal({
  children,
  delay = 0,
  variants,
  className,
  once = true,
  margin = "-100px",
}: SectionRevealProps) {
  const ref = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isInView = useInView(ref, { once, margin: margin as any });

  const animVariants: Variants = variants ?? {
    initial: defaultInitial,
    animate: { ...defaultAnimate, transition: { ...defaultTransition, delay } },
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={animVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hook-only version for sections that need the ref attached to
 * their own <section> element rather than a motion wrapper.
 * Returns { ref, isInView } so the caller controls the DOM structure.
 */
export function useSectionReveal(options?: {
  once?: boolean;
  /** @default "-100px" */
  margin?: string;
}) {
  const ref = useRef(null);
  const { once = true, margin = "-100px" } = options ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isInView = useInView(ref, { once, margin: margin as any });
  return { ref, isInView };
}
