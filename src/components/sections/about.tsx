"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { aboutData } from "@/data/about";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6" ref={ref} aria-label="About me">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
            About
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
            A little about me
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            {aboutData.paragraphs.map((paragraph, i) => (
              <HighlightedParagraph key={i} {...paragraph} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            {aboutData.stats.map((stat, i) => {
              const Icon = getIcon(stat.icon);
              return (
                <Card
                  key={i}
                  className="bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200/50 dark:border-neutral-700/50"
                >
                  <CardContent className="flex flex-col items-center justify-center text-center p-4 gap-2">
                    <Icon className="h-5 w-5 text-neutral-400" />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {stat.label}
                    </span>
                    <span className="text-sm font-semibold">{stat.value}</span>
                  </CardContent>
                </Card>
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
}: {
  text: string;
  highlights?: string[];
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
            <strong className="text-foreground">{part.content}</strong>
          ) : (
            part.content
          )}
        </span>
      ))}
    </p>
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
