import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true, // optional, but helps sometimes with route resolution
  output: "standalone", // helps when deploying to custom environments like Cloudways
  distDir: ".next", // default, but make sure .next is being built and deployed
  // assetPrefix: '/', // Uncomment and set if your app is not in root
};

export default nextConfig;
