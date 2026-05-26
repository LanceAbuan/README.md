import type { Metadata } from "next";
import { getAllBlogMetas } from "@/lib/blog";
import { siteConfig } from "@/data/site";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnimatedBackground } from "@/components/layout/background";

const posts = getAllBlogMetas();
const latestDate = posts.length > 0
  ? new Date(Math.max(...posts.map((p) => new Date(p.modified ?? p.date).getTime())))
  : new Date();

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
      <Navbar />
      <main>
        <div className="min-h-screen pt-24 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-8 -ml-3 gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
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
              <Card className="group bg-white/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
                <CardHeader className="pb-2">
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
                </CardHeader>
                <CardContent>
                  {post.excerpt && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
