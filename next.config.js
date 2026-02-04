/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    esmExternals: true, // Enable ES Modules external resolution
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-eu-central-1.amazonaws.com",
        port: "",
        pathname: "/kems-bucket/**",
        search: "",
      },
    ],
  },
  async headers() {
    return [
      {
        // Static assets (images, fonts, etc.) - cache for 1 year
        source: '/:path*.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|eot|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // JS and CSS bundles - cache for 1 year (they have hashes in filenames)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Public assets folder
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Fonts folder
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Health check API - short cache with stale-while-revalidate
        source: '/api/health/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};

export default config;
