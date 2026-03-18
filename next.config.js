/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.jsdelivr.net'],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
