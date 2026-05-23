"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

const experiences = [
  {
    company: "Paycom",
    role: "Software Developer IV",
    period: "Dec 2022 — Feb 2026",
    type: "Full-time",
    location: "Irving, TX",
    description:
      "Engineered and maintained large-scale enterprise applications, specializing in legacy system modernization, data pipeline redesign, and scalable architecture. Delivered improvements in performance, reliability, and user workflows.",
    skills: ["PHP", "Laravel", "React", "TypeScript", "MySQL", "Redis", "Docker", "AWS"],
  },
  {
    company: "Texas A&M — Dept. of Entomology",
    role: "Lead Research Software Developer",
    period: "Sep 2021 — Dec 2022",
    type: "Part-time",
    location: "College Station, TX",
    description:
      "Built an interactive microbiology simulator in Godot with a hex-grid environment, procedurally generated infinite world, NPC systems, and dynamic resource creation. Incorporated into classroom curriculum for hands-on learning.",
    skills: ["Godot", "GDScript", "C#", "Procedural Generation", "Game Design"],
  },
  {
    company: "Paycom",
    role: "Intern",
    period: "May 2022 — Aug 2022",
    type: "Internship",
    location: "Oklahoma",
    description:
      "Developed a full-stack data visualization application presented to the CIO. Automated a previously manual process, saving employees hundreds of hours annually. Designed an extensible database schema supporting user-level customization.",
    skills: ["Full-Stack", "Data Visualization", "Database Design", "Stakeholder Collaboration"],
  },
  {
    company: "Comstock Computing",
    role: "Intern",
    period: "Sep 2021 — May 2022",
    type: "Part-time",
    location: "College Station, TX",
    description:
      "Administered client-side databases across 15+ states. Designed and implemented a custom encryption algorithm for sensitive data. Built production features adopted company-wide, including an employee time-clock service.",
    skills: ["Database Administration", "Encryption", "Feature Development"],
  },
  {
    company: "Dr. Sekula Gibbs, M.D.",
    role: "Personal Assistant",
    period: "May 2019 — Aug 2019",
    type: "Part-time",
    location: "The Woodlands, TX",
    description:
      "Supported a former member of the U.S. Congress with administrative and operational initiatives. Managed a database of 100,000+ data points and coordinated with Texas state senators and representatives.",
    skills: ["Data Management", "Administration", "Communication"],
  },
];

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
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
                        <span>·</span>
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
                      <Badge
                        key={j}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
