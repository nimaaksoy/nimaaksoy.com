#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, copyFileSync } from "node:fs";
import { join, relative } from "node:path";
import prompts from "prompts";
import { ROOT, loadCategories } from "./skills-lib.js";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function copyDir(src: string, dst: string) {
  mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      copyFileSync(s, d);
    }
  }
}

async function main() {
  const categories = loadCategories();
  const today = new Date().toISOString().slice(0, 10);

  const initial = await prompts([
    {
      type: "text",
      name: "name",
      message: "Skill name (human-readable)",
      validate: (v: string) => v.trim().length > 0 && v.length <= 64 || "1–64 chars",
    },
    {
      type: "text",
      name: "description",
      message: "Description (≤200 chars, used by the model)",
      validate: (v: string) => v.trim().length > 0 && v.length <= 200 || "1–200 chars",
    },
    {
      type: "select",
      name: "category",
      message: "Category",
      choices: categories.categories.map((c) => ({ title: c.name, value: c.id })),
    },
  ]);
  if (!initial.category) {
    console.error("Aborted.");
    process.exit(1);
  }

  const cat = categories.categories.find((c) => c.id === initial.category)!;

  const rest = await prompts([
    {
      type: "select",
      name: "subcategory",
      message: "Subcategory",
      choices: cat.subcategories.map((s) => ({ title: s.name, value: s.id })),
    },
    {
      type: "text",
      name: "tags",
      message: "Tags (comma-separated, kebab-case)",
      initial: "",
    },
    {
      type: "text",
      name: "authorName",
      message: "Author name",
      initial: "Nima Aksoy",
    },
    {
      type: "text",
      name: "github",
      message: "GitHub handle",
      initial: "nimaaksoy",
    },
    {
      type: "text",
      name: "slug",
      message: "Slug (folder name)",
      initial: slugify(initial.name),
      validate: (v: string) =>
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || "must be kebab-case",
    },
  ]);

  if (!rest.subcategory || !rest.slug) {
    console.error("Aborted.");
    process.exit(1);
  }

  const targetDir = join(ROOT, "skills", initial.category, rest.subcategory, rest.slug);
  if (existsSync(targetDir)) {
    console.error(`Folder already exists: ${relative(ROOT, targetDir)}`);
    process.exit(1);
  }

  const templateDir = join(ROOT, "skills", "_TEMPLATE");
  copyDir(templateDir, targetDir);

  const tags = String(rest.tags || "")
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);

  const skillFile = join(targetDir, "SKILL.md");
  const raw = readFileSync(skillFile, "utf8");
  const tagList = tags.length > 0 ? `[${tags.join(", ")}]` : "[]";

  const replaced = raw
    .replace(/^name:.*/m, `name: ${initial.name}`)
    .replace(/^description:.*/m, `description: ${initial.description}`)
    .replace(/^category:.*/m, `category: ${initial.category}`)
    .replace(/^subcategory:.*/m, `subcategory: ${rest.subcategory}`)
    .replace(/^tags:.*/m, `tags: ${tagList}`)
    .replace(/^  name:.*/m, `  name: ${rest.authorName}`)
    .replace(/^  github:.*/m, `  github: ${rest.github}`)
    .replace(/^created:.*/m, `created: ${today}`)
    .replace(/^updated:.*/m, `updated: ${today}`)
    .replace(/^# Skill Name Here$/m, `# ${initial.name}`);

  writeFileSync(skillFile, replaced);

  console.log(`\nCreated ${relative(ROOT, targetDir)}`);
  console.log("\nNext steps:");
  console.log("  1. Fill in Overview, Instructions, Examples in SKILL.md");
  console.log("  2. Add any supporting files under resources/");
  console.log("  3. Run `npm run skills:validate` to check the skill");
  console.log("  4. Open a PR");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
