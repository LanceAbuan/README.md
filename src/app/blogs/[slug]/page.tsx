import type { Metadata } from "next";
import NextDynamic from "next/dynamic";
import Script from "next/script";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";
import { siteConfig } from "@/data/site";
import { Badge, Title, Container } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getMDXComponents } from "@/mdx-components";
import type { MDXComponents } from "mdx/types";

// Defer animated background — renders after initial paint
const AnimatedBackground = NextDynamic(
  () => import("@/components/layout/background").then(m => ({ default: m.AnimatedBackground })),
);

const mdxComponents: MDXComponents = getMDXComponents({});

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, ""),
  }));
}

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

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, source } = getBlogPost(slug);

  return (
    <>
      <AnimatedBackground />
      <div className="pt-24 pb-16 px-6">
        <Container size="2xl">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-foreground mb-8 -ml-3 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          <header className="mb-8">
            <Title order={1} className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {meta.title || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </Title>
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
                      <Badge key={i} variant="light" size="xs" radius="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

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

          <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm">
            <MDXRemote
              source={source}
              options={{ mdxOptions: { remarkPlugins: [[remarkGfm]] } }}
              components={mdxComponents}
            />
          </article>
        </Container>
      </div>
    </>
  );
}
