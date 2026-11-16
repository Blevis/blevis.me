import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: the whole site becomes plain files in ./out,
  // which is what GitHub Pages serves.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
