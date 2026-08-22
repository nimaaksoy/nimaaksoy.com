import { readFileSync, statSync, readdirSync, type Dirent } from "node:fs";
import { join, relative, sep, basename } from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";

export const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
export const SKILLS_DIR = join(ROOT, "skills");
export const CATEGORIES_FILE = join(ROOT, "categories.yml");

export interface SubcategoryDef {
  id: string;
  name: string;
}
export interface CategoryDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: SubcategoryDef[];
}
export interface CategoriesFile {
  categories: CategoryDef[];
}

export function loadCategories(): CategoriesFile {
  const raw = readFileSync(CATEGORIES_FILE, "utf8");
  const data = yaml.load(raw) as CategoriesFile;
  if (!data || !Array.isArray(data.categories)) {
    throw new Error("categories.yml: missing top-level `categories` array");
  }
  return data;
}

export function findSkillFiles(): string[] {
  const out: string[] = [];
  walk(SKILLS_DIR, out);
  return out.filter((p) => p.endsWith("/SKILL.md") && !p.includes("/_TEMPLATE/"));
}

function walk(dir: string, acc: string[]): void {
  let entries: Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
    } else if (entry.isFile()) {
      acc.push(full);
    }
  }
}

export interface ParsedSkill {
  filePath: string;
  relPath: string;
  folder: string;
  data: Record<string, unknown>;
  body: string;
}

export function parseSkill(filePath: string): ParsedSkill {
  const raw = readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  return {
    filePath,
    relPath: relative(ROOT, filePath).split(sep).join("/"),
    folder: relative(ROOT, filePath.replace(/\/SKILL\.md$/, "")).split(sep).join("/"),
    data: parsed.data as Record<string, unknown>,
    body: parsed.content,
  };
}

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function isKebab(s: string): boolean {
  return typeof s === "string" && KEBAB.test(s);
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateSkill(
  skill: ParsedSkill,
  categories: CategoriesFile,
): ValidationResult {
  const errors: string[] = [];
  const d = skill.data;

  function err(msg: string) {
    errors.push(`${skill.relPath}: ${msg}`);
  }

  // name
  const name = d.name;
  if (typeof name !== "string" || name.trim().length === 0) {
    err("missing required field `name`");
  } else if (name.length > 64) {
    err(`\`name\` is ${name.length} chars, max 64`);
  }

  // description
  const desc = d.description;
  if (typeof desc !== "string" || desc.trim().length === 0) {
    err("missing required field `description`");
  } else if (desc.length > 200) {
    err(`\`description\` is ${desc.length} chars, max 200`);
  }

  // category
  const category = d.category;
  const subcategory = d.subcategory;
  let catDef: CategoryDef | undefined;
  if (typeof category !== "string") {
    err("missing required field `category`");
  } else {
    catDef = categories.categories.find((c) => c.id === category);
    if (!catDef) {
      err(`unknown category \`${category}\``);
    }
  }
  if (typeof subcategory !== "string") {
    err("missing required field `subcategory`");
  } else if (catDef) {
    const sub = catDef.subcategories.find((s) => s.id === subcategory);
    if (!sub) {
      err(`unknown subcategory \`${subcategory}\` under category \`${category}\``);
    }
  }

  // tags
  const tags = d.tags;
  if (!Array.isArray(tags) || tags.length < 1 || tags.length > 8) {
    err("`tags` must be an array of 1 to 8 kebab-case strings");
  } else {
    for (const t of tags) {
      if (typeof t !== "string" || !isKebab(t)) {
        err(`tag \`${String(t)}\` is not kebab-case`);
      }
    }
  }

  // author.name
  const author = d.author as Record<string, unknown> | undefined;
  if (!author || typeof author !== "object" || typeof author.name !== "string") {
    err("missing required field `author.name`");
  }

  // dependencies (optional)
  if (d.dependencies !== undefined) {
    if (!Array.isArray(d.dependencies)) {
      err("`dependencies` must be an array of strings");
    } else {
      for (const dep of d.dependencies) {
        if (typeof dep !== "string") {
          err(`dependency \`${String(dep)}\` is not a string`);
        }
      }
    }
  }

  // folder layout: skills/<category>/<subcategory>/<slug>/SKILL.md
  const parts = skill.folder.split("/");
  if (parts.length !== 4 || parts[0] !== "skills") {
    err(`folder must be skills/<category>/<subcategory>/<slug>/, got ${skill.folder}`);
  } else {
    const [, fCat, fSub, fSlug] = parts;
    if (typeof category === "string" && fCat !== category) {
      err(`folder category \`${fCat}\` does not match frontmatter \`${category}\``);
    }
    if (typeof subcategory === "string" && fSub !== subcategory) {
      err(`folder subcategory \`${fSub}\` does not match frontmatter \`${subcategory}\``);
    }
    if (!isKebab(fSlug)) {
      err(`slug \`${fSlug}\` is not kebab-case`);
    }
  }

  // body has at least one ## heading
  if (!/^##\s+\S/m.test(skill.body)) {
    err("body must contain at least one `## ` section heading");
  }

  // file sizes & nested SKILL.md
  const skillDir = skill.filePath.replace(/\/SKILL\.md$/, "");
  const allFiles = listFiles(skillDir);
  for (const f of allFiles) {
    const size = statSync(f).size;
    if (size > 5 * 1024 * 1024) {
      err(`file ${relative(ROOT, f)} is ${(size / 1024 / 1024).toFixed(2)} MB, max 5 MB`);
    }
    if (f !== skill.filePath && basename(f) === "SKILL.md") {
      err(`nested SKILL.md not allowed: ${relative(ROOT, f)}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

export function listFiles(dir: string): string[] {
  const out: string[] = [];
  walk(dir, out);
  return out;
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*>\s+/gm, "")
    .replace(/[*_~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
