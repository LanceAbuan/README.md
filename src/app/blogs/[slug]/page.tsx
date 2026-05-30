import type { Metadata } from "next";
import Script from "next/script";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "@/mdx-components";
import type { MDXComponents } from "mdx/types";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnimatedBackground } from "@/components/layout/background";

/**
 * MDX component map — created at module scope to avoid
 * calling hooks inside an async Server Component.
 */
const mdxComponents: MDXComponents = useMDXComponents({});

/** Generate static params for all blog slugs. */
export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, ""),
  }));
}

/** Generate page metadata from blog frontmatter. */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getBlogPost(slug);

  return {
    title: `${meta.title} — ${siteConfig.name}`,
    description: meta.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/blogs/${slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      type: "article",
      publishedTime: meta.date,
      modifiedTime: meta.modified,
      url: `${siteConfig.url}/blogs/${slug}`,
    },
  };
}

/**
 * Individual blog post page.
 *
 * Uses getBlogPost() to fetch both metadata and MDX source in one call,
 * eliminating duplicate file I/O and matter parsing that was previously
 * scattered across the component.
 */
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, source } = getBlogPost(slug);

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main>
        <div className="min-h-screen pt-24 pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            <Link href="/blogs">
              <Button variant="ghost" size="sm" className="mb-8 -ml-3 gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
              </Button>
            </Link>

            {/* Post header: title, date, reading time, tags */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {meta.title || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </h1>
              <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <time dateTime={meta.date}>
                  {new Date(meta.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {meta.readingTime && (
                  <>
                    <span>·</span>
                    <span>{meta.readingTime} min read</span>
                  </>
                )}
                {meta.tags && meta.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex gap-1.5">
                      {meta.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* Structured data for search engines */}
            <Script
              id="json-ld-article"
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: meta.title,
                  description: meta.excerpt,
                  datePublished: meta.date,
                  dateModified: meta.modified ?? meta.date,
                  author: {
                    "@type": "Person",
                    name: siteConfig.author.name,
                  },
                  url: `${siteConfig.url}/blogs/${slug}`,
                }),
              }}
            />

            {/* Render MDX content */}
            <BlogMDX source={source} components={mdxComponents} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/**
 * Client-side blog content renderer.
 *
 * Separated from the async server page to avoid hook-in-async-server-component
 * errors. Receives pre-parsed components from module scope.
 */
function BlogMDX({ source, components }: { source: string; components: MDXComponents }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm">
      <MDXRemote
        source={source}
        options={{ mdxOptions: { remarkPlugins: [[remarkGfm]] } }}
        components={components}
      />
    </article>
  );
}
