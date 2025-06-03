// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* your existing config */
  // Add this to handle larger file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // or whatever limit you want
    },
  },
  // Add image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      // Add your production domain when you deploy
      // {
      //   protocol: 'https',
      //   hostname: 'your-domain.com',
      //   pathname: '/uploads/**',
      // },
    ],
    // Alternative simpler approach (less secure but easier):
    // domains: ['localhost', 'your-production-domain.com'],
  },
}

export default nextConfig