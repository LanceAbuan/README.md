"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { useSectionReveal } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { aboutData } from "@/data/about";
import { cn } from "@/lib/utils";

export function About() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className={cn("mx-auto", isNewspaper ? "max-w-4xl" : "max-w-4xl")}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {isTerminal ? (
            <div>
              <p className="text-xs font-mono text-[#00aa30] mb-2 tracking-wider" data-terminal-prompt>
                about
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider">
                System.Info
              </h2>
            </div>
          ) : isNewspaper ? (
            <div>
              <p className="text-xs font-serif tracking-[0.2em] text-[#7a6b5a] mb-1 uppercase" data-newspaper-section>
                About
              </p>
              <hr className="newspaper-rule" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4">
                A Little About Me
              </h2>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
                About
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
                A little about me
              </h2>
            </>
          )}
        </motion.div>

        <div className={cn(
          "gap-8 mt-8",
          isNewspaper ? "newspaper-columns-2" : "grid md:grid-cols-2",
        )}>
          {/* Bio paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={cn(
              "space-y-4 leading-relaxed",
              isTerminal
                ? "text-[#00aa30] font-mono text-sm"
                : isNewspaper
                  ? "text-[#3d2b1f] font-serif"
                  : "text-neutral-600 dark:text-neutral-400",
            )}
          >
            {aboutData.paragraphs.map((paragraph, i) => (
              <HighlightedParagraph
                key={i}
                {...paragraph}
                isTerminal={isTerminal}
                isNewspaper={isNewspaper}
              />
            ))}
          </motion.div>

          {/* Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            {aboutData.stats.map((stat, i) => {
              const Icon = getIcon(stat.icon);
              return (
                <AboutStatCard
                  key={i}
                  stat={stat}
                  Icon={Icon}
                  isTerminal={isTerminal}
                  isNewspaper={isNewspaper}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HighlightedParagraph({
  text,
  highlights,
  isTerminal,
  isNewspaper,
}: {
  text: string;
  highlights?: string[];
  isTerminal: boolean;
  isNewspaper: boolean;
}) {
  if (!highlights || highlights.length === 0) {
    return <p>{text}</p>;
  }

  const parts = splitTextByHighlights(text, highlights);

  return (
    <p>
      {parts.map((part, i) => (
        <span key={i}>
          {part.highlighted ? (
            <strong
              className={cn(
                isTerminal && "text-[#00ff41] terminal-glow",
                isNewspaper && "text-[#5c2e0e] font-bold",
              )}
            >
              {part.content}
            </strong>
          ) : (
            part.content
          )}
        </span>
      ))}
    </p>
  );
}

function AboutStatCard({
  stat,
  Icon,
  isTerminal,
  isNewspaper,
}: {
  stat: { icon: string; label: string; value: string };
  Icon: React.ComponentType<{ className?: string }>;
  isTerminal: boolean;
  isNewspaper: boolean;
}) {
  if (isTerminal) {
    return (
      <div className="terminal-card p-3">
        <Icon className="h-4 w-4 text-[#00ff41] mb-1" />
        <span className="text-[10px] text-[#00aa30] uppercase tracking-wider font-mono block">
          {stat.label}
        </span>
        <span className="text-sm font-bold text-[#00ff41] font-mono terminal-glow">
          {stat.value}
        </span>
      </div>
    );
  }

  if (isNewspaper) {
    return (
      <div className="newspaper-card text-center">
        <Icon className="h-4 w-4 text-[#5c2e0e] mx-auto mb-1" />
        <span className="text-[10px] text-[#7a6b5a] uppercase tracking-wider font-serif block">
          {stat.label}
        </span>
        <span className="text-sm font-bold text-[#1a1208] font-serif">
          {stat.value}
        </span>
      </div>
    );
  }

  return (
    <Card className="bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200/50 dark:border-neutral-700/50">
      <CardContent className="flex flex-col items-center justify-center text-center p-4 gap-2">
        <Icon className="h-5 w-5 text-neutral-400" />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {stat.label}
        </span>
        <span className="text-sm font-semibold">{stat.value}</span>
      </CardContent>
    </Card>
  );
}

function splitTextByHighlights(
  text: string,
  highlights: string[],
): Array<{ content: string; highlighted: boolean }> {
  const sorted = [...highlights].sort((a, b) => b.length - a.length);
  let remaining = text;
  const parts: Array<{ content: string; highlighted: boolean }> = [];

  while (remaining.length > 0) {
    let matched = false;
    for (const h of sorted) {
      const idx = remaining.indexOf(h);
      if (idx !== -1) {
        if (idx > 0) {
          parts.push({ content: remaining.slice(0, idx), highlighted: false });
        }
        parts.push({ content: h, highlighted: true });
        remaining = remaining.slice(idx + h.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      parts.push({ content: remaining, highlighted: false });
      remaining = "";
    }
  }

  return parts;
}
