import Script from "next/script";
import { AnimatedBackground } from "@/components/layout/background";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";


/**
 * FAQ structured data for the home page.
 * Helps search engines surface rich results for common queries
 * about the site owner.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Lance Abuan specialize in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lance specializes in AI tools and agentic workflows, building intelligent automation systems and full-stack applications that simplify complex processes.",
      },
    },
    {
      "@type": "Question",
      name: "What is Lance's educational background?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lance graduated Magna Cum Laude from Texas A&M University with a Bachelor of Science in Computer Science and a minor in Mathematics.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Lance based?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lance is based in Carrollton, Texas.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />

    </>
  );
}
