"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconCalendar, IconClock } from "@tabler/icons-react";
import { fadeUp } from "@/lib/animations";
import type { BlogPost } from "@/types";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  const readTime = Math.max(
    1,
    Math.ceil(post.description.length / 200)
  );

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/blog/${post.slug}`}>
        <motion.article
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="group block p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 h-full"
        >
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            <span className="flex items-center gap-1">
              <IconCalendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <IconClock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
          </div>

          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
