/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare's OpenNext adapter bundles the standalone server output.
  output: 'standalone',
  images: {
    domains: ['cdn.jsdelivr.net'],
  },
  experimental: {
    // Lesson bodies are read from disk outside Cloudflare (lib/tutorials/content.ts).
    outputFileTracingIncludes: {
      '/tutorials/**': ['./.tutorial-content/**'],
      '/dashboard/courses/**': ['./.tutorial-content/**'],
      '/api/learn/tutor': ['./.tutorial-content/**'],
    },
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
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    // The Agora SDK is only loaded in the browser (AgoraRoom effects); keep it out of the
    // server bundle so the Cloudflare Worker stays under its size limit.
    if (isServer) config.resolve.alias['agora-rtc-sdk-ng'] = false;
    return config;
  },
};

module.exports = nextConfig;
