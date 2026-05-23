import { getBlogMeta, getBlogSlugs } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "@/mdx-components";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/background";

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, ""),
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getBlogMeta(slug);

  const filePath = path.join(process.cwd(), "blogs", `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");

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

            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {meta.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <time>
                  {new Date(meta.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
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

            <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm">
              <MDXRemote source={source} options={{ mdxOptions: { remarkPlugins: [[remarkGfm]] } }} components={useMDXComponents({})} />
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
