import categoriesData from "@/public/skills-data/categories.json";
import skillsData from "@/public/skills-data/skills.json";

export type SkillFileEntry = {
  path: string;
  size: number;
};

export type Skill = {
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  author: { name: string; url?: string; github?: string };
  version: string;
  created: string;
  updated: string;
  license?: string;
  dependencies: string[];
  path: string;
  files: SkillFileEntry[];
  readmeExcerpt: string;
  body: string;
  zipPath: string;
};

export type SkillSubcategory = {
  id: string;
  name: string;
  count: number;
};

export type SkillCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  subcategories: SkillSubcategory[];
};

export type SkillSearchParams = {
  q?: string;
  category?: string;
  tag?: string;
};

export const skills = skillsData as Skill[];
export const skillCategories = (categoriesData as { categories: SkillCategory[] }).categories;

export function skillHref(skill: Skill) {
  return `/skills/${skill.category}/${skill.subcategory}/${skill.slug}`;
}

export function findSkill(category: string, subcategory: string, slug: string) {
  return skills.find(
    (skill) =>
      skill.category === category &&
      skill.subcategory === subcategory &&
      skill.slug === slug,
  );
}

export function findSkillCategory(id: string) {
  return skillCategories.find((category) => category.id === id);
}

export function findSkillSubcategory(categoryId: string, subcategoryId: string) {
  return findSkillCategory(categoryId)?.subcategories.find(
    (subcategory) => subcategory.id === subcategoryId,
  );
}

export function getAllSkillTags() {
  return Array.from(new Set(skills.flatMap((skill) => skill.tags))).sort();
}

export function getFilteredSkills({ q = "", category, tag }: SkillSearchParams) {
  const query = q.trim().toLowerCase();

  return skills.filter((skill) => {
    const matchesQuery =
      !query ||
      [
        skill.name,
        skill.description,
        skill.category,
        skill.subcategory,
        skill.readmeExcerpt,
        ...skill.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    const matchesCategory = !category || skill.category === category;
    const matchesTag = !tag || skill.tags.includes(tag);

    return matchesQuery && matchesCategory && matchesTag;
  });
}

export function relatedSkills(skill: Skill, max = 4) {
  const sameSubcategory = skills.filter(
    (item) =>
      item !== skill &&
      item.category === skill.category &&
      item.subcategory === skill.subcategory,
  );
  const sameCategory = skills.filter(
    (item) =>
      item !== skill &&
      item.category === skill.category &&
      item.subcategory !== skill.subcategory,
  );

  return [...sameSubcategory, ...sameCategory].slice(0, max);
}

export function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}
