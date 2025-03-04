import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.node = {
      __dirname: true,
    };
    return config;
  },
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;
