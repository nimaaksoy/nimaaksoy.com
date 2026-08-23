import type { MetadataRoute } from "next";

import { getAllPrompts, getAllTags, getPaginationPages } from "@/lib/prompts";
import { getAllRadarProjects } from "@/lib/radar";
import { skillHref, skills } from "@/lib/skills";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://nimaaksoy.com";
  const lastModified = new Date();
  const projects = await getAllRadarProjects();
  const prompts = getAllPrompts();
  const promptPages = getPaginationPages(prompts.length);
  const tags = getAllTags();

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
      url: `${siteUrl}/metadata`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${siteUrl}/today`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/today/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/today/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
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
      url: `${siteUrl}/prompts`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/skills`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/stats`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.6,
    },
    ...promptPages
      .filter((page) => page > 1)
      .map((page) => ({
        url: `${siteUrl}/prompts/page/${page}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      })),
    ...tags.map((tag) => ({
      url: `${siteUrl}/prompts/tag/${tag.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...prompts.map((prompt) => ({
      url: `${siteUrl}/prompts/${prompt.slug}`,
      lastModified: prompt.date ? new Date(`${prompt.date}T00:00:00Z`) : lastModified,
      changeFrequency: "monthly" as const,
      priority: prompt.featured ? 0.8 : 0.7,
    })),
    ...skills.map((skill) => ({
      url: `${siteUrl}${skillHref(skill)}`,
      lastModified: skill.updated ? new Date(`${skill.updated}T00:00:00Z`) : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/radar/${project.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...projectRoutes];
}
