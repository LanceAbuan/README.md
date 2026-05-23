import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    items: ["TypeScript", "Rust", "PHP", "GDScript", "C#", "JavaScript", "SQL", "Python"],
  },
  {
    name: "Frameworks & Libraries",
    items: ["React", "Next.js", "Laravel", "Godot", "Tailwind CSS", "Apache Arrow"],
  },
  {
    name: "Infrastructure & Tools",
    items: ["Docker", "AWS", "Redis", "MySQL", "Git", "Linux", "CI/CD", "Nginx"],
  },
  {
    name: "Practices",
    items: ["System Design", "Performance Optimization", "Legacy Modernization", "Data Pipelines", "TDD", "Agile"],
  },
];
