/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const base64Png = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8xMS8zMC0xMzo0NzozMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkNFREY0MkUzNzQwMTFFOEFFQTRBMUY3QTkwRUU3RTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkNFREY0MkYzNzQwMTFFOEFFQTRBMUY3QTkwRUU3RTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Q0VERjQyQzM3NDAxMUU4QUVPNEExRjdBOTBFRTdFNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2Q0VERjQyRDM3NDAxMUU4QUVPNEExRjdBOTBFRTdF5SIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps8K8JIAAAArSURBVHja7MExAQAAAMKg9U9tDC5gAAAAAAAAAAAAAAAAAAAAAAAAAAAA4G8CDADZ0AAB2un3lwAAAABJRU5ErkJggg==";

const iconBuffer = Buffer.from(base64Png, "base64");
const iconsDir = path.join(__dirname, "..", "chrome-extension", "life-in-dots", "icons");

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [16, 32, 48, 128];

sizes.forEach((size) => {
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, iconBuffer);
  console.log(`Created icon: ${filePath}`);
});

console.log("All Chrome extension icons generated successfully!");
