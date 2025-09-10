import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "https://your-project.vercel.app"],
    },
  },
  eslint: {
    // ❌ Build will succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
