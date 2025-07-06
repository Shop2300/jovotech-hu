// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure for modern browsers to eliminate polyfills
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  experimental: {
    // Handle larger file uploads
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  
  // Configure SWC minifier for better optimization
  swcMinify: true,
  
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
      // Vercel Blob Storage
      {
        protocol: 'https',
        hostname: '9n6egvca0xi0rbfa.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      // Alternative Vercel Blob Storage patterns
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      // Production domain
      {
        protocol: 'https',
        hostname: 'galaxysklep.pl',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.galaxysklep.pl',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig