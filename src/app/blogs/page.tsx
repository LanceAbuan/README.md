import type { Metadata } from "next";
import NextDynamic from "next/dynamic";
import { getAllBlogMetas } from "@/lib/blog";
import { siteConfig } from "@/data/site";
import Link from "next/link";
import { Badge } from "@mantine/core";
import { ArrowLeft } from "lucide-react";

// Defer animated background — renders after initial paint
const AnimatedBackground = NextDynamic(
  () => import("@/components/layout/background").then(m => ({ default: m.AnimatedBackground })),
);

const posts = getAllBlogMetas();

export const metadata: Metadata = {
  title: "Blog — Lance Abuan",
  description:
    "Read Lance Abuan&apos;s blog posts about software engineering, AI tools, agentic workflows, and systems programming.",
  alternates: {
    canonical: `${siteConfig.url}/blogs`,
  },
  openGraph: {
    title: "Blog",
    description: "Thoughts on software, systems, and the stuff I&apos;m working on.",
    url: `${siteConfig.url}/blogs`,
    type: "website",
  },
};

export default function BlogIndex() {
  return (
    <>
      <AnimatedBackground />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-foreground mb-8 -ml-3 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Blog</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-12">
            Thoughts on software, systems, and the stuff I&apos;m working on.
          </p>

          <div className="space-y-4">
            {posts.length === 0 && (
              <p className="text-neutral-400 dark:text-neutral-500">No posts yet. Coming soon.</p>
            )}
            {posts.map((post) => (
              <Link key={post.slug} href={`/blogs/${post.slug}`}>
                <div className="group bg-white/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors rounded-lg p-6">
                  <div className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h2 className="text-lg font-semibold group-hover:underline decoration-neutral-300 dark:decoration-neutral-600 underline-offset-4">
                          {post.title}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          {post.readingTime && (
                            <>
                              <span> · </span>
                              <span>{post.readingTime} min read</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {post.excerpt && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.map((tag, i) => (
                          <Badge key={i} variant="light" size="xs" radius="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
