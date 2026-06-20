"use client";

import { motion } from "framer-motion";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { aboutData } from "@/data/about";
import {
  REVEAL_DURATION,
  REVEAL_Y_OFFSET,
  STAGGER_DELAY,
} from "@/config/animations";
import { terminalPalette, newspaperPalette } from "@/config/theme-palette";
import { Brain, GraduationCap, MapPin, Mail } from "lucide-react";

const statIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  brain: Brain,
  "graduation-cap": GraduationCap,
  "map-pin": MapPin,
  mail: Mail,
};

export function About() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION }}
          className="mb-12"
        >
          {isCasino ? (
            <div className="text-center mb-12">
              <p className="casino-label mb-2">ABOUT</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
                The Player
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4" />
              <p className="text-[#c8bfb2] font-serif mt-3 max-w-lg mx-auto">
                A brief introduction to the developer behind the code.
              </p>
            </div>
          ) : isTerminal ? (
            <div>
              <p
                className="text-xs font-mono mb-2 tracking-wider"
                data-terminal-prompt
                style={{ color: terminalPalette.secondary }}
              >
                about
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
                style={{ color: terminalPalette.primary }}
              >
                Who.Am.I
              </h2>
            </div>
          ) : isNewspaper ? (
            <div>
              <p
                className="text-xs font-serif tracking-[0.2em] uppercase"
                data-newspaper-section
                style={{ color: newspaperPalette.muted }}
              >
                Biography
              </p>
              <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
              <h2
                className="text-3xl sm:text-4xl font-bold font-serif mt-4 newspaper-letterpress"
                style={{ color: newspaperPalette.primary }}
              >
                About the Developer
              </h2>
              <p className="newspaper-deck max-w-lg mx-auto mt-3">
                A journey through code, curiosity, and continuous learning.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
                About
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                About Me
              </h2>
            </div>
          )}
        </motion.div>

        {/* Content card */}
        <motion.div
          className={cn(
            "mb-12",
            !isTerminal && !isNewspaper && !isCasino && "glass-card p-8",
            isNewspaper && "max-w-2xl mx-auto",
          )}
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY }}
        >
          <div className="space-y-4">
            {aboutData.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={cn(
                  "text-base sm:text-lg leading-relaxed last:mb-0",
                  isCasino && "text-[#c8bfb2] font-serif",
                  isTerminal && "text-sm font-mono",
                  isNewspaper && "font-serif leading-relaxed",
                  !isTerminal && !isNewspaper && !isCasino && "text-neutral-600 dark:text-neutral-400",
                )}
                style={
                  isTerminal
                    ? { color: terminalPalette.secondary }
                    : isNewspaper
                    ? { color: newspaperPalette.body }
                    : undefined
                }
              >
                {paragraph.text}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className={cn(isNewspaper && "max-w-2xl mx-auto")}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {aboutData.stats.map((stat, i) => {
              const Icon = statIcons[stat.icon];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 2 + i * STAGGER_DELAY }}
                  className={cn(
                    "text-center p-5 rounded-xl transition-all duration-300",
                    isCasino && "bg-[#1c0c0c]/60 border border-[#d4af37]/10",
                    isTerminal && "bg-[#0a0f0a] border border-[#00ff4120]",
                    isNewspaper && "bg-[#efe8da]/50 border border-[#c4b59e]/30",
                    !isTerminal && !isNewspaper && !isCasino && "glass-card glass-card-hover",
                  )}
                >
                  {Icon && (
                    <div
                      className={cn(
                        "w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center",
                        isCasino && "bg-[#d4af37]/10",
                        isTerminal && "bg-[#00ff41]/10",
                        isNewspaper && "bg-[#5c2e0e]/10",
                        !isTerminal && !isNewspaper && !isCasino && "gradient-icon-circle",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isCasino && "text-[#d4af37]",
                          isTerminal && "text-[#00ff41]",
                          isNewspaper && "text-[#5c2e0e]",
                          !isTerminal && !isNewspaper && !isCasino && "text-indigo-500 dark:text-indigo-400",
                        )}
                      />
                    </div>
                  )}
                  <p
                    className={cn(
                      "text-xs uppercase tracking-wider mb-1",
                      isCasino && "font-serif text-[#8a7e72]",
                      isTerminal && "font-mono",
                      isNewspaper && "font-serif text-[#7a6b5a]",
                      !isTerminal && !isNewspaper && !isCasino && "text-neutral-400 dark:text-neutral-500 font-medium",
                    )}
                    style={
                      isTerminal
                        ? { color: terminalPalette.secondary }
                        : undefined
                    }
                  >
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isCasino && "font-serif text-white",
                      isTerminal && "font-mono",
                      isNewspaper && "font-serif newspaper-letterpress",
                      !isTerminal && !isNewspaper && !isCasino && "text-neutral-700 dark:text-neutral-300",
                    )}
                    style={
                      isTerminal
                        ? { color: terminalPalette.primary }
                        : isNewspaper
                        ? { color: newspaperPalette.primary }
                        : undefined
                    }
                  >
                    {stat.value}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {isNewspaper && <SectionScrollArrow targetId="experience" isInView={isInView} />}
      </div>
    </section>
  );
}
