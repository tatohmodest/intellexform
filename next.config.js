/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare's OpenNext adapter bundles the standalone server output.
  output: 'standalone',
  images: {
    domains: ['cdn.jsdelivr.net'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '80mb',
    },
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
