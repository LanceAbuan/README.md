"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PostCard } from "@/components/blog/PostCard";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal variants={fadeUp}>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 tracking-wide uppercase">
            Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Writing
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl">
            Thoughts on development, game design, and the tools I use to build
            things.
          </p>
        </ScrollReveal>

        {loading ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          </motion.div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-2">
              No posts yet.
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">
              Check back soon — I&apos;m working on some content.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
