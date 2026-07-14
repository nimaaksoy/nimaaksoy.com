/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const iconsDir = path.join(__dirname, "..", "chrome-extension", "life-in-dots", "icons");
const listingLogosDir = path.join(
  __dirname,
  "..",
  "chrome-extension",
  "life-in-dots",
  "store-listing",
  "logos",
);

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function setPixel(buffer, size, x, y, rgba) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const index = (y * size + x) * 4;
  buffer[index] = rgba[0];
  buffer[index + 1] = rgba[1];
  buffer[index + 2] = rgba[2];
  buffer[index + 3] = rgba[3];
}

function fillRect(buffer, size, x, y, width, height, rgba) {
  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) {
      setPixel(buffer, size, xx, yy, rgba);
    }
  }
}

function fillCircle(buffer, size, cx, cy, radius, rgba) {
  const r2 = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        setPixel(buffer, size, x, y, rgba);
      }
    }
  }
}

function makeIcon(size) {
  const pixels = Buffer.alloc(size * size * 4, 0);
  const bg = [10, 10, 10, 255];
  const green = [44, 255, 5, 255];
  const white = [234, 234, 234, 255];
  const muted = [234, 234, 234, 95];

  fillRect(pixels, size, 0, 0, size, size, bg);

  const border = Math.max(1, Math.round(size / 32));
  fillRect(pixels, size, 0, 0, size, border, green);
  fillRect(pixels, size, 0, size - border, size, border, green);
  fillRect(pixels, size, 0, 0, border, size, green);
  fillRect(pixels, size, size - border, 0, border, size, green);

  const dotRadius = Math.max(1, Math.round(size * 0.055));
  const gap = Math.max(2, Math.round(size * 0.14));
  const start = Math.round(size / 2 - gap);
  let index = 0;

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const color = index === 4 ? green : index >= 6 ? muted : white;
      fillCircle(pixels, size, start + col * gap, start + row * gap, dotRadius, color);
      index += 1;
    }
  }

  const rawRows = [];
  for (let y = 0; y < size; y += 1) {
    rawRows.push(Buffer.from([0]));
    rawRows.push(pixels.subarray(y * size * 4, (y + 1) * size * 4));
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(Buffer.concat(rawRows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

fs.mkdirSync(iconsDir, { recursive: true });
fs.mkdirSync(listingLogosDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const icon = makeIcon(size);
  for (const dir of [iconsDir, listingLogosDir]) {
    const filePath = path.join(dir, `icon${size}.png`);
    fs.writeFileSync(filePath, icon);
    console.log(`Created icon: ${filePath}`);
  }
}
