import type { MetadataRoute } from "next";
import { getAllRadarProjects } from "@/lib/radar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://nimaaksoy.com";
  const lastModified = new Date();
  const projects = await getAllRadarProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/life-in-dots`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/life-in-dots/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/radar`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/radar/${project.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...projectRoutes];
}
