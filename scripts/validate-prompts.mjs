import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const promptsDirectory = path.join(process.cwd(), "content", "prompts");
const allowedMediaTypes = new Set(["image", "video"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const safeRemoteUrlPattern = /^https?:\/\//i;

function stripQuotes(value) {
  const trimmed = String(value).trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function normalizeTag(value) {
  return stripQuotes(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseScalar(value) {
  const stripped = stripQuotes(value);
  if (stripped === "true") return true;
  if (stripped === "false") return false;
  return stripped;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("missing frontmatter block");
  }

  const fields = {};
  const lines = match[1].split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9]*):(?:\s*(.*))?$/);
    if (!keyMatch) {
      throw new Error(`invalid frontmatter line: ${line}`);
    }

    const [, key, rawValue = ""] = keyMatch;
    if (rawValue.trim()) {
      fields[key] = parseScalar(rawValue);
      index += 1;
      continue;
    }

    const children = [];
    index += 1;
    while (index < lines.length && /^\s+/.test(lines[index])) {
      children.push(lines[index]);
      index += 1;
    }

    const items = [];
    let currentObject = null;

    for (const child of children) {
      const listMatch = child.match(/^\s*-\s*(.*)$/);
      if (listMatch) {
        const item = listMatch[1];
        const objectMatch = item.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
        if (objectMatch) {
          currentObject = { [objectMatch[1]]: stripQuotes(objectMatch[2]) };
          items.push(currentObject);
        } else {
          currentObject = null;
          items.push(stripQuotes(item));
        }
        continue;
      }

      const nestedMatch = child.match(/^\s+([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
      if (nestedMatch && currentObject) {
        currentObject[nestedMatch[1]] = stripQuotes(nestedMatch[2]);
      }
    }

    fields[key] = items;
  }

  return { fields, body: match[2].trim() };
}

function isValidMediaUrl(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  // Prefer self-hosted media under /public (site-relative path).
  if (value.startsWith("/prompts/media/")) {
    return !value.includes("..");
  }

  if (!safeRemoteUrlPattern.test(value)) {
    return false;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function isValidUrl(value) {
  if (!value || !safeRemoteUrlPattern.test(value)) {
    return false;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function validatePrompt(file, slugs) {
  const fullPath = path.join(promptsDirectory, file);
  const errors = [];
  let parsed;

  try {
    parsed = parseFrontmatter(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    return [`${file}: ${error.message}`];
  }

  const { fields, body } = parsed;
  const required = ["title", "slug", "description", "tags"];

  for (const field of required) {
    if (!fields[field] || (Array.isArray(fields[field]) && fields[field].length === 0)) {
      errors.push(`${file}: missing required field "${field}"`);
    }
  }

  if (!body) {
    errors.push(`${file}: prompt body is empty`);
  }

  if (typeof fields.slug === "string") {
    if (!slugPattern.test(fields.slug)) {
      errors.push(`${file}: slug must use lowercase letters, numbers, and hyphens`);
    }
    if (slugs.has(fields.slug)) {
      errors.push(`${file}: duplicate slug "${fields.slug}"`);
    }
    slugs.add(fields.slug);
  }

  if (fields.date && Number.isNaN(Date.parse(`${fields.date}T00:00:00Z`))) {
    errors.push(`${file}: invalid date "${fields.date}"`);
  }

  for (const urlField of ["sourceUrl", "authorUrl"]) {
    if (fields[urlField] && !isValidUrl(fields[urlField])) {
      errors.push(`${file}: invalid ${urlField}`);
    }
  }

  if (!Array.isArray(fields.tags)) {
    errors.push(`${file}: tags must be a list`);
  } else {
    const normalizedTags = fields.tags.map(normalizeTag);
    const uniqueTags = new Set(normalizedTags);
    if (uniqueTags.size !== normalizedTags.length) {
      errors.push(`${file}: duplicate tags after normalization`);
    }
    fields.tags.forEach((tag, index) => {
      if (tag !== normalizedTags[index]) {
        errors.push(`${file}: tag "${tag}" should be normalized as "${normalizedTags[index]}"`);
      }
    });
  }

  if (fields.media !== undefined) {
    if (!Array.isArray(fields.media)) {
      errors.push(`${file}: media must be a list`);
    } else {
      fields.media.forEach((item, index) => {
        if (!item || typeof item !== "object") {
          errors.push(`${file}: media item ${index + 1} must be an object`);
          return;
        }
        if (!allowedMediaTypes.has(item.type)) {
          errors.push(`${file}: media item ${index + 1} has invalid type`);
        }
        if (!isValidMediaUrl(item.url)) {
          errors.push(`${file}: media item ${index + 1} has invalid or unsafe url`);
        }
        if (item.poster && !isValidMediaUrl(item.poster)) {
          errors.push(`${file}: media item ${index + 1} has invalid poster url`);
        }
      });
    }
  }

  return errors;
}

if (!fs.existsSync(promptsDirectory)) {
  console.error("content/prompts does not exist");
  process.exit(1);
}

const files = fs
  .readdirSync(promptsDirectory)
  .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

const templateFiles = files.filter((file) => file.startsWith("_"));
for (const file of templateFiles) {
  console.log(`Ignoring template file: ${file}`);
}

const promptFiles = files
  .filter((file) => !file.startsWith("_"))
  .filter((file) => file !== "CONTRIBUTING.md")
  .sort();

const slugs = new Set();
const errors = promptFiles.flatMap((file) => validatePrompt(file, slugs));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${promptFiles.length} prompt file${promptFiles.length === 1 ? "" : "s"}.`);
