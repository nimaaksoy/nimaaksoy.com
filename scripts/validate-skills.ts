#!/usr/bin/env tsx
import { findSkillFiles, loadCategories, parseSkill, validateSkill } from "./skills-lib.js";

function main() {
  const categories = loadCategories();
  const files = findSkillFiles();
  const errors: string[] = [];
  let ok = 0;

  for (const file of files) {
    const skill = parseSkill(file);
    const result = validateSkill(skill, categories);
    if (result.ok) {
      ok++;
    } else {
      errors.push(...result.errors);
    }
  }

  if (errors.length > 0) {
    for (const e of errors) {
      console.error("ERROR " + e);
    }
    console.error(`\nValidation failed: ${errors.length} error(s) across ${files.length} skill(s).`);
    process.exit(1);
  }

  console.log(`Validated ${ok} skill(s) — all good.`);
}

main();
