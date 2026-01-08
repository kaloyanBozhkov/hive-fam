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
};

export default config;
