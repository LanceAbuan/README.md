import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    items: ["Python", "TypeScript", "Rust", "PHP", "C#", "JavaScript", "SQL", "GDScript"],
  },
  {
    name: "AI & Agentic Systems",
    items: ["LLM Integration", "RAG Pipelines", "Agentic Workflows", "Prompt Engineering", "Vector Databases", "Fine-tuning"],
  },
  {
    name: "Frameworks & Libraries",
    items: ["React", "Next.js", "LangChain", "LlamaIndex", "Laravel", "Godot", "Tailwind CSS"],
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
