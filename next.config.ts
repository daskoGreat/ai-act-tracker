import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-act-tracker",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
