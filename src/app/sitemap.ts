import { MetadataRoute } from "next";
import { getAllBlogMetas } from "@/lib/blog";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const posts = getAllBlogMetas();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.modified ? new Date(post.modified) : new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...routes, ...blogUrls];
}

export const revalidate = 3600;
