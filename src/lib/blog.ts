import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogsDir = path.join(process.cwd(), "blogs");

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  modified?: string;
  excerpt?: string;
  tags?: string[];
  readingTime?: number;
}

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(blogsDir)) return [];
  return fs.readdirSync(blogsDir).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

export function getBlogMeta(slug: string): BlogMeta {
  // Try .mdx first, fall back to .md
  const filePathMdx = path.join(blogsDir, `${slug}.mdx`);
  const filePathMd = path.join(blogsDir, `${slug}.md`);
  const filePath = fs.existsSync(filePathMdx) ? filePathMdx : filePathMd;
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  const words = fileContents.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 225));

  // Use frontmatter `modified` if present, otherwise fall back to file mtime
  const modified = (data.modified as string | undefined) ??
    new Date(fs.statSync(filePath).mtime).toISOString();

  return {
    slug,
    title: (data.title as string) || slug,
    date: (data.date as string) || new Date().toISOString(),
    modified,
    excerpt: (data.excerpt as string) || "",
    tags: (data.tags as string[]) || [],
    readingTime,
  };
}

export function getAllBlogMetas(): BlogMeta[] {
  const slugs = getBlogSlugs();
  return slugs
    .map((slug) => getBlogMeta(slug.replace(/\.mdx?$/, "")))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
