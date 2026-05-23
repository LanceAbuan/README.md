"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, GraduationCap, Briefcase } from "lucide-react";

const stats = [
  { icon: Briefcase, label: "Experience", value: "5+ years" },
  { icon: GraduationCap, label: "Education", value: "B.S. CS" },
  { icon: MapPin, label: "Location", value: "Irving, TX" },
  { icon: Mail, label: "Email", value: "Get in touch" },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
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
            <p>
              I'm a software developer with a background in full-stack development,
              systems programming, and research software. My work spans from
              large-scale enterprise platforms to interactive educational tools.
            </p>
            <p>
              I graduated <strong className="text-foreground">Magna Cum Laude</strong> from{" "}
              <strong className="text-foreground">Texas A&M University</strong> with a
              Bachelor of Science in Computer Science.
            </p>
            <p>
              Currently at{" "}
              <strong className="text-foreground">Paycom</strong>, where I focus on
              legacy system modernization, data pipeline redesign, and building
              scalable architecture that serves millions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            {stats.map((stat, i) => (
              <Card key={i} className="bg-neutral-50/50 dark:bg-neutral-800/50 border-neutral-200/50 dark:border-neutral-700/50">
                <CardContent className="flex flex-col items-center justify-center text-center p-4 gap-2">
                  <stat.icon className="h-5 w-5 text-neutral-400" />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</span>
                  <span className="text-sm font-semibold">{stat.value}</span>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
