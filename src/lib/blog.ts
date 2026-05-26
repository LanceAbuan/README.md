import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogsDir = path.join(process.cwd(), "blogs");

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
}

/**
 * Read all blog slugs from the `blogs/` directory.
 * Returns filenames with extensions (`.mdx` / `.md`).
 */
export function getBlogSlugs(): string[] {
  if (!fs.existsSync(blogsDir)) return [];
  return fs.readdirSync(blogsDir).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

/**
 * Parse frontmatter for a single blog post and return its metadata.
 * Tries `.mdx` first, falls back to `.md`.
 */
export function getBlogMeta(slug: string): BlogMeta {
  // Try .mdx first, fall back to .md
  const filePathMdx = path.join(blogsDir, `${slug}.mdx`);
  const filePathMd = path.join(blogsDir, `${slug}.md`);
  const filePath = fs.existsSync(filePathMdx) ? filePathMdx : filePathMd;
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug,
    title: (data.title as string) || slug,
    date: (data.date as string) || new Date().toISOString(),
    excerpt: (data.excerpt as string) || "",
    tags: (data.tags as string[]) || [],
  };
}

/**
 * Fetch metadata for all blog posts, sorted newest-first.
 */
export function getAllBlogMetas(): BlogMeta[] {
  const slugs = getBlogSlugs();
  return slugs
    .map((slug) => getBlogMeta(slug.replace(/\.mdx?$/, "")))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
