import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mongoose ne doit pas être bundlé par Turbopack (module Node natif)
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
