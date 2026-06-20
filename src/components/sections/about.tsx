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
import { Title, Text } from "@mantine/core";
import { Brain, GraduationCap, MapPin, Mail } from "lucide-react";

const statIcons: Record<string, React.ComponentType<{ className?: string }>> = {
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
              <Title
                order={2}
                className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight"
              >
                The Player
              </Title>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4" />
              <Text className="text-[#c8bfb2] font-serif mt-3 max-w-lg mx-auto">
                A brief introduction to the developer behind the code.
              </Text>
            </div>
          ) : isTerminal ? (
            <div>
              <Text
                size="xs"
                className="font-mono mb-2 tracking-wider"
                data-terminal-prompt
                style={{ color: terminalPalette.secondary }}
              >
                about
              </Text>
              <Title
                order={2}
                className="text-2xl sm:text-3xl font-bold font-mono terminal-glow uppercase tracking-wider"
                style={{ color: terminalPalette.primary }}
              >
                Who.Am.I
              </Title>
            </div>
          ) : isNewspaper ? (
            <div>
              <Text
                size="xs"
                className="font-serif tracking-[0.2em] uppercase"
                data-newspaper-section
                style={{ color: newspaperPalette.muted }}
              >
                Biography
              </Text>
              <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
              <Title
                order={2}
                className="text-3xl sm:text-4xl font-bold font-serif mt-4 newspaper-letterpress"
                style={{ color: newspaperPalette.primary }}
              >
                About the Developer
              </Title>
              <Text className="newspaper-deck max-w-lg mx-auto mt-3">
                A journey through code, curiosity, and continuous learning.
              </Text>
            </div>
          ) : (
            <>
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                className="tracking-widest text-neutral-400 dark:text-neutral-500 mb-3"
              >
                About
              </Text>
              <Title order={2} className="text-3xl sm:text-4xl font-bold tracking-tight">
                About Me
              </Title>
            </>
          )}
        </motion.div>

        <div className={cn(isNewspaper && "max-w-2xl mx-auto")}>
          <div className="space-y-4">
            {aboutData.paragraphs.map((paragraph, i) => (
              <motion.p
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
                initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY + i * STAGGER_DELAY }}
              >
                {paragraph.text}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <motion.div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12",
            isNewspaper && "max-w-2xl mx-auto",
          )}
          initial={{ opacity: 0, y: REVEAL_Y_OFFSET }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: REVEAL_DURATION, delay: STAGGER_DELAY * 4 }}
        >
          {aboutData.stats.map((stat, i) => {
            const Icon = statIcons[stat.icon];
            return (
              <div
                key={i}
                className={cn(
                  "text-center p-4 rounded-xl",
                  isCasino && "bg-[#1c0c0c]/60 border border-[#d4af37]/10",
                  isTerminal && "bg-[#0a0f0a] border border-[#00ff4120]",
                  isNewspaper && "bg-[#efe8da]/50 border border-[#c4b59e]/30",
                  !isTerminal && !isNewspaper && !isCasino && "bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-800/60",
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "h-5 w-5 mx-auto mb-2",
                      isCasino && "text-[#d4af37]",
                      isTerminal && "text-[#00ff41]",
                      isNewspaper && "text-[#5c2e0e]",
                      !isTerminal && !isNewspaper && !isCasino && "text-neutral-400 dark:text-neutral-500",
                    )}
                  />
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
              </div>
            );
          })}
        </motion.div>

        {isNewspaper && <SectionScrollArrow targetId="experience" isInView={isInView} />}
      </div>
    </section>
  );
}
