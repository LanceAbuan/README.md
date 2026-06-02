"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

/** Framer-motion uses this type for the `margin` option but does not export it. */
type MarginType = `${number}${"px" | "%"}` | `${number}${"px" | "%"} ${number}${"px" | "%"}` | `${number}${"px" | "%"} ${number}${"px" | "%"} ${number}${"px" | "%"}` | `${number}${"px" | "%"} ${number}${"px" | "%"} ${number}${"px" | "%"} ${number}${"px" | "%"}`;
import {
  REVEAL_DURATION,
  REVEAL_Y_OFFSET,
  SCROLL_ARROW_DURATION,
  SCROLL_ARROW_DELAY,
} from "@/config/animations";
import { SCROLL_ARROW_LABEL } from "@/config/accessibility";

/** Default animation transition config shared across all reveal animations. */
const DEFAULT_TRANSITION = { duration: REVEAL_DURATION };
/** Default initial state (invisible, pushed down). */
const DEFAULT_INITIAL: Record<string, number> = { opacity: 0, y: REVEAL_Y_OFFSET };
/** Default animate state (visible, at rest). */
const DEFAULT_ANIMATE: Record<string, number> = { opacity: 1, y: 0 };

/**
 * Props for the SectionReveal wrapper component.
 */
export interface SectionRevealProps {
  /** Content to wrap in the reveal animation. */
  children: ReactNode;
  /** Delay before animation starts (seconds). @default 0 */
  delay?: number;
  /** Custom framer-motion variants override. Falls back to defaults. */
  variants?: Variants;
  /** Additional CSS classes. */
  className?: string;
  /** Only animate once (don't replay on re-scroll). @default true */
  once?: boolean;
  /** Intersection observer margin offset. @default "-100px" */
  margin?: MarginType;
}

/** Default intersection observer margin. */
const DEFAULT_MARGIN = "-100px" as MarginType;

/**
 * Reusable reveal-on-scroll wrapper component.
 *
 * Handles the `useRef` + `useInView` boilerplate so each section
 * component doesn't need to repeat it. Wraps children in a
 * `motion.div` with fade-up animation.
 *
 * @example
 * ```tsx
 * <SectionReveal delay={0.2}>
 *   <h2>Title</h2>
 * </SectionReveal>
 * ```
 */
export function SectionReveal({
  children,
  delay = 0,
  variants,
  className,
  once = true,
  margin,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin ?? DEFAULT_MARGIN });

  const animVariants: Variants = variants ?? {
    initial: DEFAULT_INITIAL,
    animate: {
      ...DEFAULT_ANIMATE,
      transition: { ...DEFAULT_TRANSITION, delay },
    },
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
 * Hook-only version of section reveal for cases where the caller needs
 * the ref attached to their own element (e.g., a `<section>` tag) rather
 * than a `motion.div` wrapper.
 *
 * Returns `{ ref, isInView }` so the caller controls the DOM structure
 * and applies their own animation logic.
 *
 * @example
 * ```tsx
 * const { ref, isInView } = useSectionReveal();
 * return <section ref={ref}>...</section>;
 * ```
 */
export function useSectionReveal(options?: {
  /** Only animate once. @default true */
  once?: boolean;
  /** Intersection observer margin offset. @default "-100px" */
  margin?: MarginType;
}) {
  const ref = useRef<HTMLElement>(null);
  const { once = true, margin } = options ?? {};
  const isInView = useInView(ref, { once, margin: margin ?? DEFAULT_MARGIN });
  return { ref, isInView };
}

/**
 * Scroll-down arrow that smooth-scrolls to a target section.
 * Placed at the bottom of each newspaper section to guide navigation.
 */
export function SectionScrollArrow({
  targetId,
  isInView,
}: {
  targetId: string;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="flex justify-center mt-12 cursor-pointer animate-bounce"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: SCROLL_ARROW_DURATION, delay: SCROLL_ARROW_DELAY }}
      role="button"
      tabIndex={0}
      aria-label={SCROLL_ARROW_LABEL}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        }
      }}
      onClick={() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <svg
        className="w-5 h-5 text-[#7a6b5a]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </motion.div>
  );
}
