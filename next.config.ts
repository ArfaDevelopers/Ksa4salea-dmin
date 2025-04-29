import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "standalone",
  distDir: ".next",
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
