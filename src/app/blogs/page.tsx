"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/background";

interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const p of posts) {
      p.tags?.forEach((t) => tagSet.add(t));
    }
    return Array.from(tagSet).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, posts]);

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main>
        <div className="min-h-screen pt-24 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-foreground transition-colors mb-8"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 12H5M12 19l-7-7 7-7"
                />
              </svg>
              Back
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Blog
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">
              Thoughts on software, systems, and the stuff I&apos;m working on.
            </p>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-10 bg-white/50 dark:bg-neutral-900/50"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery((q) => (q === tag ? "" : tag))}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      query === tag
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {query && (
              <p className="text-xs text-neutral-400 mb-4">
                {filtered.length} of {posts.length} posts
              </p>
            )}

            <div className="space-y-4">
              {loading && <p className="text-neutral-400 text-center py-12">Loading posts...</p>}
              {!loading && filtered.length === 0 && posts.length > 0 && (
                <p className="text-neutral-400 text-center py-12">
                  No posts match &ldquo;{query}&rdquo;
                </p>
              )}
              {!loading && filtered.length === 0 && posts.length === 0 && (
                <p className="text-neutral-400 text-center py-12">No posts yet.</p>
              )}
              {filtered.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function BlogPostCard({ post }: { post: BlogMeta }) {
  return (
    <Link href={`/blogs/${post.slug}`}>
      <article className="group p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold group-hover:underline decoration-neutral-300 dark:decoration-neutral-600 underline-offset-4">
            {post.title}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {post.excerpt && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
