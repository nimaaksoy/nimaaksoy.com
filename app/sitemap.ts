import type { MetadataRoute } from "next";
import { getAllRadarDates } from "@/lib/radar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://nimaaksoy.com";
  const lastModified = new Date();
  const dates = await getAllRadarDates();

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
      url: `${siteUrl}/radar`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/fa/radar`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const dayRoutes: MetadataRoute.Sitemap = dates.flatMap((date) => [
    {
      url: `${siteUrl}/radar/${date}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/fa/radar/${date}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  return [...staticRoutes, ...dayRoutes];
}
