export const revalidate = 3600;

type NewsItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  date?: string;
};

const TELEGRAM_PUBLIC_URL = "https://t.me/s/VahidOnline";
const TELEGRAM_POST_URL = "https://t.me/VahidOnline";

export async function GET() {
  try {
    const response = await fetch(TELEGRAM_PUBLIC_URL, {
      next: { revalidate },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error("Telegram public page request failed");
    }

    const html = await response.text();
    const items = parseTelegramPosts(html);

    return Response.json(
      {
        ok: true,
        items,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return Response.json(
      {
        ok: false,
        items: [],
      },
      { status: 502 }
    );
  }
}

function parseTelegramPosts(html: string): NewsItem[] {
  const blocks = html.match(/<div class="tgme_widget_message[\s\S]*?(?=<\/div><div class="tgme_widget_message_wrap|<\/section>)/g) ?? [];
  const items: NewsItem[] = [];

  for (const block of blocks) {
    const postMatch = block.match(/data-post="VahidOnline\/(\d+)"/);
    const textMatch = block.match(/<div class="tgme_widget_message_text js-message_text"[^>]*>([\s\S]*?)<\/div>\s*<div class="tgme_widget_message_footer/);
    const dateMatch = block.match(/<time datetime="([^"]+)"/);
    const postId = postMatch?.[1];

    if (!postId || !textMatch?.[1]) {
      continue;
    }

    const text = cleanTelegramText(textMatch[1]);
    if (!text) {
      continue;
    }

    const sentences = text.split(/(?<=[.!؟])\s+/).filter(Boolean);
    const title = truncateText(sentences[0] ?? text, 120);
    const description = truncateText(sentences.slice(1).join(" ") || text, 240);

    items.push({
      id: postId,
      title,
      description,
      href: `${TELEGRAM_POST_URL}/${postId}`,
      ...(dateMatch?.[1] ? { date: dateMatch[1] } : {}),
    });
  }

  return items.slice(-3).reverse();
}

function cleanTelegramText(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<blockquote[\s\S]*?<\/blockquote>/g, " ")
      .replace(/<br\s*\/?>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/@\w+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1).trim()}...`;
}
