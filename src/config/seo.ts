/**
 * SEO metadata defaults and structured data schema.
 */

/** Default meta description for pages without overrides. */
export const DEFAULT_DESCRIPTION =
  "Portfolio of Lance Abuan — software developer specializing in AI tools and agentic workflows.";

/** Keywords for meta tag (kept concise for relevance). */
export const DEFAULT_KEYWORDS = [
  "software developer",
  "AI",
  "agentic workflows",
  "machine learning",
  "web development",
  "portfolio",
];

/** Author name for meta tags. */
export const AUTHOR = "Lance Abuan";

/** Twitter/X handle for social cards. */
export const TWITTER_HANDLE = "@lanceabuan";

/** Default Open Graph / Twitter card type. */
export const CARD_TYPE = "summary_large_image";

/** JSON-LD structured data for the Person entity. */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lance Abuan",
  jobTitle: "Software Developer",
  description: "Software developer specializing in AI tools and agentic workflows.",
  url: "https://lanceabuan.com",
  sameAs: [
    "https://github.com/LanceAbuan",
    "https://linkedin.com/in/lanceabuan",
  ],
};

/** JSON-LD structured data for the WebSite entity (enables Google sitelinks search). */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lance Abuan",
  url: "https://lanceabuan.com",
  author: {
    "@type": "Person",
    name: "Lance Abuan",
  },
};
