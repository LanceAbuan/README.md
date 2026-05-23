import { MetadataRoute } from "next";
import { getBlogSlugs } from "@/lib/blog";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blogs`, lastModified: new Date() },
  ];

  const blogUrls: MetadataRoute.Sitemap = getBlogSlugs().map((slug) => ({
    url: `${baseUrl}/blogs/${slug.replace(/\.mdx?$/, "")}`,
    lastModified: new Date(),
  }));

  return [...routes, ...blogUrls];
}

export const revalidate = 3600;
