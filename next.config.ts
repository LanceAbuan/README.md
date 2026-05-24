import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone directory for easier Docker deployment
  output: undefined,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 24h cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'none'; style-src 'unsafe-inline'; script-src 'none';",
  },

  // Compression
  compress: true,

  // React compiler for performance (Next.js 16)
  reactCompiler: true,

  // Experimental: optimize package preloading
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
