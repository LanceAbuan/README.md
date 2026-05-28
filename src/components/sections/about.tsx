"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { aboutData } from "@/data/about";
import { cn } from "@/lib/utils";

export function About() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {isCasino ? (
            <div className="text-center mb-12">
              <p className="text-xs font-serif text-[#d4a843] mb-2 tracking-[0.3em] uppercase">
                THE PLAYER
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#d4a843] casino-gold tracking-tight">
                Know Your Opponent
              </h2>
              <p className="text-[#c4b59e] font-serif mt-3 max-w-lg mx-auto">
                Every great hand starts with reading the table.
              </p>
            </div>
          ) : isTerminal ? (
            <div>
              <p className="text-xs font-mono text-[#00aa30] mb-2 tracking-wider" data-terminal-prompt>
                about
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider">
                System.Info
              </h2>
            </div>
          ) : isNewspaper ? (
            <div className="text-center mb-12">
              <p className="text-xs font-serif tracking-[0.2em] text-[#7a6b5a] uppercase" data-newspaper-section>
                Profile
              </p>
              <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4 newspaper-letterpress">
                A Little About Me
              </h2>
              <p className="newspaper-deck max-w-lg mx-auto mt-3">
                The story behind the code — experience, background, and what drives the work.
              </p>
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

        {isCasino ? (
          /* Casino layout — felt cards, gold accents */
          <div className="space-y-8">
            {/* Bio paragraphs in a felt card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="casino-felt p-6 sm:p-8 space-y-4"
            >
              {aboutData.paragraphs.map((paragraph, i) => (
                <HighlightedParagraph
                  key={i}
                  {...paragraph}
                  isTerminal={false}
                  isNewspaper={false}
                  isCasino={true}
                />
              ))}
            </motion.div>

            {/* Stat cards — chip-style */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {aboutData.stats.map((stat, i) => {
                const Icon = getIcon(stat.icon);
                return (
                  <AboutStatCard
                    key={i}
                    stat={stat}
                    Icon={Icon}
                    isTerminal={false}
                    isNewspaper={false}
                    isCasino={true}
                  />
                );
              })}
            </motion.div>
          </div>
        ) : isNewspaper ? (
          /* Newspaper editorial layout */
          <div className="space-y-8">
            {/* Two-column body text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="newspaper-body-columns"
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

            {/* Pull quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="newspaper-pull-quote"
            >
              Building things that matter — that&apos;s the thread running through everything I do.
            </motion.div>

            {/* Stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
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

            <SectionScrollArrow targetId="experience" isInView={isInView} />
          </div>
        ) : isTerminal ? (
          /* Terminal layout */
          <div className="gap-8 mt-8 space-y-6">
            {/* Bio paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-4 leading-relaxed text-[#00aa30] font-mono text-sm"
            >
              {aboutData.paragraphs.map((paragraph, i) => (
                <HighlightedParagraph
                  key={i}
                  {...paragraph}
                  isTerminal={true}
                  isNewspaper={false}
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
                    isTerminal={true}
                    isNewspaper={false}
                  />
                );
              })}
            </motion.div>

            {/* Terminal scroll arrow */}
            <motion.div
              className="mt-12 animate-bounce flex justify-center cursor-pointer"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              onClick={() => {
                document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <svg
                className="w-5 h-5 text-[#00ff41]"
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
        ) : (
          /* Default layout */
          <div className="gap-8 mt-8 grid md:grid-cols-2">
            {/* Bio paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-4 leading-relaxed text-neutral-600 dark:text-neutral-400"
            >
              {aboutData.paragraphs.map((paragraph, i) => (
                <HighlightedParagraph
                  key={i}
                  {...paragraph}
                  isTerminal={false}
                  isNewspaper={false}
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
                    isTerminal={false}
                    isNewspaper={false}
                  />
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function HighlightedParagraph({
  text,
  highlights,
  isTerminal,
  isNewspaper,
  isCasino,
}: {
  text: string;
  highlights?: string[];
  isTerminal: boolean;
  isNewspaper: boolean;
  isCasino?: boolean;
}) {
  if (!highlights || highlights.length === 0) {
    return <p className={isCasino ? "text-[#f0e6d3] font-serif leading-relaxed" : ""}>{text}</p>;
  }

  const parts = splitTextByHighlights(text, highlights);

  return (
    <p className={isCasino ? "text-[#f0e6d3] font-serif leading-relaxed" : ""}>
      {parts.map((part, i) => (
        <span key={i}>
          {part.highlighted ? (
            <strong
              className={cn(
                isTerminal && "text-[#00ff41] terminal-glow",
                isNewspaper && "text-[#5c2e0e] font-bold",
                isCasino && "text-[#d4a843]",
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
  isCasino,
}: {
  stat: { icon: string; label: string; value: string };
  Icon: React.ComponentType<{ className?: string }>;
  isTerminal: boolean;
  isNewspaper: boolean;
  isCasino?: boolean;
}) {
  if (isCasino) {
    return (
      <div className="casino-felt text-center flex flex-col items-center justify-center p-4 gap-2">
        <Icon className="h-5 w-5 text-[#d4a843] mx-auto flex-shrink-0" />
        <span className="text-[10px] text-[#8b7355] uppercase tracking-wider font-serif block">
          {stat.label}
        </span>
        <span className="text-sm font-bold font-serif text-[#d4a843] casino-gold leading-tight">
          {stat.value}
        </span>
      </div>
    );
  }
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
      <div className="newspaper-card text-center flex flex-col items-center justify-center">
        <Icon className="h-4 w-4 text-[#5c2e0e] mx-auto mb-1 flex-shrink-0" />
        <span className="text-[10px] text-[#7a6b5a] uppercase tracking-wider font-serif block">
          {stat.label}
        </span>
        <span className="text-sm font-bold font-serif text-[#1a1208] newspaper-letterpress leading-tight break-words">
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
