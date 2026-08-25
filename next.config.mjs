/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Keep native ffmpeg binaries out of random route NFT graphs; include only on metadata APIs.
  serverExternalPackages: ["ffmpeg-static", "ffprobe-static"],
  outputFileTracingExcludes: {
    "*": [
      // Never ship site media/zips into serverless function bundles
      "public/prompts/media/**",
      "public/skills-data/zips/**",
      "public/sponsor-assets/**",
      "docs/**",
      "skills/**",
      // Drop non-linux probe binaries (Vercel is linux x64)
      "node_modules/ffprobe-static/bin/darwin/**",
      "node_modules/ffprobe-static/bin/win32/**",
      "node_modules/ffprobe-static/bin/linux/ia32/**",
    ],
  },
  outputFileTracingIncludes: {
    "/api/metadata/**": [
      "./node_modules/ffmpeg-static/**/*",
      "./node_modules/ffprobe-static/bin/linux/x64/**",
    ],
  },
};

export default nextConfig;
