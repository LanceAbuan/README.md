import NextDynamic from "next/dynamic";
import Script from "next/script";
import { Hero } from "@/components/sections/hero";

// Defer animated canvas background — renders after initial paint
// to improve LCP and avoid jank during first meaningful paint.
const AnimatedBackground = NextDynamic(
  () => import("@/components/layout/background").then(m => ({ default: m.AnimatedBackground })),
);

const About = NextDynamic(
  () => import("@/components/sections/about").then(m => ({ default: m.About })),
);
const Experience = NextDynamic(
  () => import("@/components/sections/experience").then(m => ({ default: m.Experience })),
);
const Projects = NextDynamic(
  () => import("@/components/sections/projects").then(m => ({ default: m.Projects })),
);
const Skills = NextDynamic(
  () => import("@/components/sections/skills").then(m => ({ default: m.Skills })),
);
const Contact = NextDynamic(
  () => import("@/components/sections/contact").then(m => ({ default: m.Contact })),
);

// Force static generation — this page has no dynamic data
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate daily

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
