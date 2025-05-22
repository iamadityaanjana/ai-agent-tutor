import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || ""
  },
  reactStrictMode: true
};

export default nextConfig;
