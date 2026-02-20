import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: "standalone",
  distDir: ".next",
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
