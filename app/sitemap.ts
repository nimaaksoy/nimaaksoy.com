import type { MetadataRoute } from "next";
import { getAllRadarDays } from "@/lib/radar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://nimaaksoy.com";
  const lastModified = new Date();
  const days = await getAllRadarDays();

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
    {
      url: `${siteUrl}/fa/radar`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const contentRoutes: MetadataRoute.Sitemap = days.flatMap((day) => {
    const dayRoutes: MetadataRoute.Sitemap = [
      {
        url: `${siteUrl}/radar/${day.date}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${siteUrl}/fa/radar/${day.date}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    const itemRoutes: MetadataRoute.Sitemap = day.items.flatMap((item) => [
      {
        url: `${siteUrl}/radar/${day.date}/${item.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.85,
      },
      {
        url: `${siteUrl}/fa/radar/${day.date}/${item.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.85,
      },
    ]);

    return [...dayRoutes, ...itemRoutes];
  });

  return [...staticRoutes, ...contentRoutes];
}
