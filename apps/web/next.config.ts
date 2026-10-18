import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@kinetix/shared"],
  reactStrictMode: true,
};

export default nextConfig;
