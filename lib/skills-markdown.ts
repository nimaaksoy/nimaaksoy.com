import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderSkillMarkdown(source: string) {
  return marked.parse(source, { async: false }) as string;
}
