import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
  }
};

export default nextConfig;
