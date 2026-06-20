import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Brotli/gzip compression for all responses
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Optimize image device sizes and qualities
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96],
  },

  // Performance & security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Immutable cache for versioned Next.js assets
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache static media assets aggressively
      {
        source: "/:path*(.woff2|.woff|.svg|.png|.jpg|.jpeg|.gif|.webp|.avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Mantine tree-shaking with app router
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },

  // Turbopack code splitting is automatic in Next.js 16
  turbopack: {},
};

export default nextConfig;
