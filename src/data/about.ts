import type { AboutData } from "@/types";

export const aboutData: AboutData = {
  paragraphs: [
    {
      text: "I'm a software developer focused on AI tools and agentic workflows. My work spans from intelligent automation systems to full-stack applications that make complex processes simpler.",
    },
    {
      text: 'I graduated Magna Cum Laude from Texas A&M University with a Bachelor of Science in Computer Science.',
      highlights: ["Magna Cum Laude", "Texas A&M University"],
    },
    {
      text: "Currently at Saltech Systems, where I'm building AI-powered tools and agentic workflows that automate complex business processes and push the boundaries of what intelligent systems can do.",
      highlights: ["Saltech Systems"],
    },
  ],
  stats: [
    { icon: "brain", label: "Focus", value: "AI / Agentic" },
    { icon: "graduation-cap", label: "Education", value: "B.S. CS" },
    { icon: "map-pin", label: "Location", value: "Irving, TX" },
    { icon: "mail", label: "Email", value: "Get in touch" },
  ],
};
