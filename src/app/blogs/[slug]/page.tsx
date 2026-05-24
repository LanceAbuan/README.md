import type { Metadata } from "next";
import Script from "next/script";
import { getBlogMeta, getBlogSlugs } from "@/lib/blog";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "@/mdx-components";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/background";
import { ThemeSettings } from "@/components/theme-settings";

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = getBlogMeta(slug);
  const slugClean = slug.replace(/\.mdx?$/, "");
  return {
    title: `${meta.title} — ${siteConfig.name}`,
    description: meta.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/blogs/${slugClean}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      type: "article",
      publishedTime: meta.date,
      url: `${siteConfig.url}/blogs/${slugClean}`,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.excerpt,
    },
  };
}

/** Build BlogPosting JSON-LD for structured data. */
function getBlogJsonLd(meta: ReturnType<typeof getBlogMeta>, slugClean: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blogs/${slugClean}`,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getBlogMeta(slug);
  const slugClean = slug.replace(/\.mdx?$/, "");

  const filePathMdx = path.join(process.cwd(), "blogs", `${slug}.mdx`);
  const filePathMd = path.join(process.cwd(), "blogs", `${slug}.md`);
  const filePath = fs.existsSync(filePathMdx) ? filePathMdx : filePathMd;
  const fileContents = fs.readFileSync(filePath, "utf8");
  // Strip frontmatter before passing to MDXRemote
  const { content: source } = matter(fileContents);

  const jsonLd = getBlogJsonLd(meta, slugClean);

  return (
    <>
      <AnimatedBackground />
      <Navbar />

      {/* Skip navigation link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neutral-900 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
      >
        Skip to main content
      </a>

      <main id="main-content">
        <div className="min-h-screen pt-24 pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            <Link href="/blogs">
              <Button variant="ghost" size="sm" className="mb-8 -ml-3 gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
              </Button>
            </Link>

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
                {meta.tags && meta.tags.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
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

            <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm">
              <MDXRemote
                source={source}
                options={{ mdxOptions: { remarkPlugins: [[remarkGfm]] } }}
                components={useMDXComponents({})}
              />
            </article>
          </div>
        </div>
      </main>
      <ThemeSettings />
      <Footer />

      <Script
        id="blog-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
