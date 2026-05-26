"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { experiences } from "@/data/experience";
import { useSectionReveal } from "@/components/section-reveal";

export function Experience() {
  const { ref, isInView } = useSectionReveal();

  return (
    <section id="experience" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
            Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Where I've worked
          </h2>
        </motion.div>

        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  exp,
  index,
  isInView,
}: {
  exp: (typeof experiences)[number];
  index: number;
  isInView: boolean;
}) {
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
