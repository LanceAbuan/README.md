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
    <section id="about" className="py-20 sm:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION }}
          className="mb-10 sm:mb-12"
        >
          {isCasino ? (
            <div className="text-center mb-10 sm:mb-12">
              <p className="casino-label mb-2">ABOUT</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white tracking-tight">
                The Player
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4" />
              <p className="text-[#c8bfb2] font-serif mt-3 max-w-lg mx-auto text-sm sm:text-base">
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
                className="text-xl sm:text-2xl md:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
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
                className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif mt-4 newspaper-letterpress"
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
              <p className="section-label mb-3 font-mono">About</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-mono">
                About Me
              </h2>
            </div>
          )}
        </motion.div>

        {/* Content card */}
        <motion.div
          className={cn(
            "mb-10 sm:mb-12",
            !isTerminal && !isNewspaper && !isCasino && "earth-card p-5 sm:p-8",
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
                  "text-sm sm:text-base md:text-lg leading-relaxed last:mb-0",
                  isCasino && "text-[#c8bfb2] font-serif",
                  isTerminal && "text-xs sm:text-sm font-mono",
                  isNewspaper && "font-serif leading-relaxed",
                  !isTerminal && !isNewspaper && !isCasino && "text-neutral-600 dark:text-[#A89888]",
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

        {/* Stats grid — 2 cols on mobile, 4 on desktop */}
        <div className={cn(isNewspaper && "max-w-2xl mx-auto")}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {aboutData.stats.map((stat, i) => {
              const Icon = statIcons[stat.icon];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 2 + i * STAGGER_DELAY }}
                  className={cn(
                    "text-center p-4 sm:p-5 rounded-xl transition-all duration-300",
                    isCasino && "bg-[#1c0c0c]/60 border border-[#d4af37]/10",
                    isTerminal && "bg-[#0a0f0a] border border-[#00ff4120]",
                    isNewspaper && "bg-[#efe8da]/50 border border-[#c4b59e]/30",
                    !isTerminal && !isNewspaper && !isCasino && "earth-card earth-card-hover",
                  )}
                >
                  {Icon && (
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-full flex items-center justify-center",
                        isCasino && "bg-[#d4af37]/10",
                        isTerminal && "bg-[#00ff41]/10",
                        isNewspaper && "bg-[#5c2e0e]/10",
                        !isTerminal && !isNewspaper && !isCasino && "earth-icon-circle",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 sm:h-5 sm:w-5",
                          isCasino && "text-[#d4af37]",
                          isTerminal && "text-[#00ff41]",
                          isNewspaper && "text-[#5c2e0e]",
                          !isTerminal && !isNewspaper && !isCasino && "terracotta-text",
                        )}
                      />
                    </div>
                  )}
                  <p
                    className={cn(
                      "text-[10px] sm:text-xs uppercase tracking-wider mb-1",
                      isCasino && "font-serif text-[#8a7e72]",
                      isTerminal && "font-mono",
                      isNewspaper && "font-serif text-[#7a6b5a]",
                      !isTerminal && !isNewspaper && !isCasino && "section-label",
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
                      "text-xs sm:text-sm font-semibold",
                      isCasino && "font-serif text-white",
                      isTerminal && "font-mono",
                      isNewspaper && "font-serif newspaper-letterpress",
                      !isTerminal && !isNewspaper && !isCasino && "text-neutral-700 dark:text-foreground",
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
