"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Terminal } from "lucide-react";
import { useSectionReveal, SectionScrollArrow } from "@/components/section-reveal";
import { useTheme } from "next-themes";
import { experiences } from "@/data/experience";
import { cn } from "@/lib/utils";

export function Experience() {
  const { ref, isInView } = useSectionReveal();
  const { theme } = useTheme();
  const isTerminal = theme === "terminal";
  const isNewspaper = theme === "newspaper";
  const isCasino = theme === "casino";

  return (
    <section id="experience" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={cn(isNewspaper ? "text-center mb-12" : "mb-12")}
        >
          {isCasino ? (
            <div className="text-center mb-12">
              <p className="text-xs font-serif text-[#d4a843] mb-2 tracking-[0.3em] uppercase">
                TRACK RECORD
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#d4a843] casino-gold tracking-tight">
                High Stakes History
              </h2>
              <p className="text-[#c4b59e] font-serif mt-3 max-w-lg mx-auto">
                A career built on calculated risks and winning plays.
              </p>
            </div>
          ) : isTerminal ? (
            <div>
              <p className="text-xs font-mono text-[#00aa30] mb-2 tracking-wider" data-terminal-prompt>
                experience
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#00ff41] terminal-glow uppercase tracking-wider">
                Work.History
              </h2>
            </div>
          ) : isNewspaper ? (
            <div>
              <p className="text-xs font-serif tracking-[0.2em] text-[#7a6b5a] uppercase" data-newspaper-section>
                Career
              </p>
              <hr className="newspaper-triple-rule mx-auto max-w-sm mt-2" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a1208] mt-4 newspaper-letterpress">
                Professional History
              </h2>
              <p className="newspaper-deck max-w-lg mx-auto mt-3">
                A chronological record of positions held and contributions made.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
                Experience
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Where I&apos;ve worked
              </h2>
            </>
          )}
        </motion.div>

        <div className={cn(
          "space-y-4",
          isTerminal && "terminal-timeline pl-4 relative",
          isNewspaper && "space-y-8",
          isCasino && "casino-timeline pl-4 relative space-y-6",
        )}>
          {experiences.map((exp, i) => (
            <ExperienceCard
              key={i}
              exp={exp}
              index={i}
              isInView={isInView}
              isTerminal={isTerminal}
              isNewspaper={isNewspaper}
              isCasino={isCasino}
            />
          ))}
        </div>

        {isNewspaper && <SectionScrollArrow targetId="projects" isInView={isInView} />}

        {isTerminal && (
          <motion.div
            className="mt-12 animate-bounce flex justify-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
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
        )}
      </div>
    </section>
  );
}

function ExperienceCard({
  exp,
  index,
  isInView,
  isTerminal,
  isNewspaper,
  isCasino,
}: {
  exp: (typeof experiences)[number];
  index: number;
  isInView: boolean;
  isTerminal: boolean;
  isNewspaper: boolean;
  isCasino?: boolean;
}) {
  if (isCasino) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <div className="casino-felt p-5 sm:p-6 space-y-3 ml-3">
          {/* Date as chip */}
          <div className="flex items-center justify-between">
            <span className="casino-chip inline-block px-3 py-1 text-[10px] font-serif uppercase tracking-wider">
              {exp.type}
            </span>
            <span className="text-xs text-[#8b7355] font-serif italic">
              {exp.period}
            </span>
          </div>

          {/* Role as gold heading */}
          <h3 className="text-lg font-bold font-serif text-[#d4a843] casino-gold">
            {exp.role}
          </h3>

          {/* Company + location */}
          <div className="flex items-center gap-2 text-sm text-[#c4b59e] font-serif">
            <Building2 className="h-3.5 w-3.5 text-[#d4a843]" />
            <span>{exp.company}</span>
            <span>&middot;</span>
            <span className="text-[#8b7355]">{exp.location}</span>
          </div>

          <hr className="border-[#d4a84320]" />

          <p className="text-sm text-[#f0e6d3] font-serif leading-relaxed">
            {exp.description}
          </p>

          {/* Skills as chip badges */}
          <div className="flex flex-wrap gap-1.5">
            {exp.skills.map((skill, j) => (
              <span
                key={j}
                className="casino-chip inline-block px-2.5 py-1 text-[10px] font-serif uppercase tracking-wider"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (isTerminal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <div className="terminal-card p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4 text-[#00ff41]" />
            <span className="text-xs text-[#00aa30] font-mono">
              [{exp.period}]
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#00ff41] font-mono terminal-glow">
              {exp.role}
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#00aa30] font-mono mt-1">
              <Building2 className="h-3.5 w-3.5" />
              <span>{exp.company}</span>
              <span>&bull;</span>
              <span>{exp.location}</span>
              <span>&bull;</span>
              <span className="text-[#008822]">{exp.type}</span>
            </div>
          </div>
          <p className="text-sm text-[#00aa30] font-mono leading-relaxed">
            {exp.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {exp.skills.map((skill, j) => (
              <span
                key={j}
                className="terminal-badge text-xs px-2 py-0.5 font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (isNewspaper) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      >
        <article className="newspaper-card space-y-4">
          {/* Date in dateline style */}
          <div className="flex items-baseline justify-between">
            <span className="newspaper-kicker">
              {exp.company}
            </span>
            <span className="text-xs text-[#7a6b5a] font-serif italic">
              {exp.period}
            </span>
          </div>

          {/* Role as headline */}
          <h3 className="text-xl font-bold font-serif text-[#1a1208] newspaper-letterpress break-words leading-tight">
            {exp.role}
          </h3>

          {/* Location / type as byline */}
          <div className="newspaper-byline text-left">
            {exp.location} &middot; {exp.type}
          </div>

          <hr className="newspaper-rule" />

          {/* Body text */}
          <p className="text-[0.9rem] text-[#3d2b1f] font-serif leading-relaxed break-words overflow-hidden">
            {exp.description}
          </p>

          {/* Skills as editorial tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {exp.skills.map((skill, j) => (
              <span key={j} className="newspaper-badge px-2 py-0.5">
                {skill}
              </span>
            ))}
          </div>
        </article>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
    >
      <Card className="group bg-white/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{exp.role}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                  {exp.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <Building2 className="h-3.5 w-3.5" />
                <span>{exp.company}</span>
                <span>&#8226;</span>
                <span>{exp.location}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
              {exp.period}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {exp.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {exp.skills.map((skill, j) => (
              <Badge key={j} variant="secondary" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
