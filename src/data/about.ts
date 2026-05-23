import type { AboutData } from "@/types";

export const aboutData: AboutData = {
  paragraphs: [
    {
      text: "I'm a software developer with a background in full-stack development, systems programming, and research software. My work spans from large-scale enterprise platforms to interactive educational tools.",
    },
    {
      text: 'I graduated Magna Cum Laude from Texas A&M University with a Bachelor of Science in Computer Science.',
      highlights: ["Magna Cum Laude", "Texas A&M University"],
    },
    {
      text: "Currently at Paycom, where I focus on legacy system modernization, data pipeline redesign, and building scalable architecture that serves millions.",
      highlights: ["Paycom"],
    },
  ],
  stats: [
    { icon: "briefcase", label: "Experience", value: "5+ years" },
    { icon: "graduation-cap", label: "Education", value: "B.S. CS" },
    { icon: "map-pin", label: "Location", value: "Irving, TX" },
    { icon: "mail", label: "Email", value: "Get in touch" },
  ],
};
