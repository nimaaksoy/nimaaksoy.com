import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ext = path.join(root, "chrome-extension", "nima-aksoy-today-v1");

function escape(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function text(x, y, value, size, color = "#eeeeee", weight = 400, family = "Vazirmatn, Arial, sans-serif") {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${escape(value)}</text>`;
}

function card(x, y, width, height, radius = 18) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="#181818"/>`;
}

function field(x, y, width, height, radius = 12) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="#0f0f0f"/>`;
}

function svg(width, height, body) {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#080808"/>
  ${body}
</svg>
`);
}

async function writePng(target, width, height, body) {
  await mkdir(path.dirname(target), { recursive: true });
  await sharp(svg(width, height, body)).png().toFile(target);
}

function iconBody(size) {
  const pad = Math.max(2, Math.round(size / 12));
  const inner = size - pad * 2;
  const stroke = Math.max(1, Math.round(size / 18));
  return `
    <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${Math.round(size / 5)}" fill="#181818"/>
    <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${Math.round(size / 5)}" fill="none" stroke="#2cff05" stroke-width="${stroke}"/>
    <text x="${size / 2}" y="${size * 0.66}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size * 0.52}" font-weight="700" fill="#2cff05">T</text>
  `;
}

function dashboard(width, height, compact = false) {
  if (compact) {
    return [
      card(24, 24, 592, 178),
      text(46, 76, "Nima Aksoy Today", 30),
      text(46, 112, "Sunday, August 16, 2026 / 25 Mordad 1405", 16, "#b8b8b8"),
      field(46, 134, 72, 48),
      field(126, 134, 72, 48),
      field(206, 134, 72, 48),
      card(24, 218, 290, 158),
      text(46, 270, "Currency converter", 22),
      text(46, 324, "1 USD = 187,585 Toman", 20, "#2cff05"),
      card(330, 218, 286, 158),
      text(352, 270, "Personal Note", 22),
      text(352, 316, "Stored only in Chrome", 15, "#858585"),
    ].join("\n");
  }

  const dayCells = [];
  const startX = 72;
  const startY = 238;
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const x = startX + col * 82;
      const y = startY + row * 72;
      const today = row === 1 && col === 6;
      dayCells.push(`<rect x="${x}" y="${y}" width="72" height="62" rx="10" fill="${today ? "#173312" : "#0f0f0f"}"${today ? ' stroke="#2cff05" stroke-width="2"' : ""}/>`);
      dayCells.push(text(x + 28, y + 38, row * 7 + col + 1, 20, today ? "#2cff05" : "#eeeeee"));
    }
  }

  return [
    card(40, 34, 740, 492),
    text(72, 96, "Nima Aksoy Today", 40),
    text(72, 132, "August 2026 / Mordad 1405", 22, "#b8b8b8"),
    ...["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label, i) => text(72 + i * 82, 198, label, 13, "#858585", 400, "Menlo, monospace")),
    ...dayCells,
    card(40, 552, 740, 196),
    text(72, 616, "Currency converter", 34),
    field(72, 650, 220, 68),
    text(104, 696, "1", 38),
    field(308, 650, 166, 68),
    text(342, 694, "USD", 26),
    text(520, 696, "187,585 Toman", 34, "#2cff05"),
    card(812, 34, 428, 164),
    text(844, 92, "Personal Note", 28),
    text(844, 132, "Private. Local. Ready.", 18, "#858585"),
    card(812, 224, 428, 164),
    text(844, 282, "Radar Updates", 28),
    text(844, 322, "Trending open source projects", 18, "#858585"),
    card(812, 414, 428, 164),
    text(844, 472, "Prompts collection", 28),
    text(844, 512, "Prompts make your life easier", 18, "#858585"),
    card(812, 604, 428, 124),
    text(844, 658, "Latest news", 28),
    text(844, 698, "Public posts refreshed hourly", 18, "#858585"),
  ].join("\n");
}

function promo(width, height) {
  return [
    `<circle cx="${width - 82}" cy="74" r="58" fill="#173312"/>`,
    text(38, 78, "Nima Aksoy Today", width < 800 ? 38 : 54, "#eeeeee", 700),
    text(40, 124, "Local-first daily new tab dashboard", width < 800 ? 20 : 28, "#b8b8b8"),
    text(40, 174, "Calendar · Persian dates · Toman currency · Personal Note", width < 800 ? 16 : 22, "#858585"),
    card(40, height - 94, width - 80, 54, 14),
    text(64, height - 58, "No account. Notes stay in Chrome storage.", width < 800 ? 16 : 22, "#2cff05"),
  ].join("\n");
}

for (const size of [16, 32, 48, 128]) {
  for (const folder of ["assets/icons", "store-listing/logos"]) {
    await writePng(path.join(ext, folder, `icon${size}.png`), size, size, iconBody(size));
  }
}

await writePng(path.join(ext, "store-listing/images/screenshot-desktop-newtab.png"), 1280, 800, dashboard(1280, 800));
await writePng(path.join(ext, "store-listing/images/screenshot-compact-newtab.png"), 640, 400, dashboard(640, 400, true));
await writePng(path.join(ext, "store-listing/images/promo-small-440x280.png"), 440, 280, promo(440, 280));
await writePng(path.join(ext, "store-listing/images/promo-marquee-1400x560.png"), 1400, 560, promo(1400, 560));

await writeFile(
  path.join(ext, "store-listing/images/ASSET-DIMENSIONS.txt"),
  [
    "screenshot-desktop-newtab.png 1280x800",
    "screenshot-compact-newtab.png 640x400",
    "promo-small-440x280.png 440x280",
    "promo-marquee-1400x560.png 1400x560",
    "",
  ].join("\n")
);
