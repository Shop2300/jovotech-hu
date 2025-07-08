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
  
  // Enhanced image configuration for better performance
  images: {
    // Use webp format for better compression
    formats: ['image/webp'],
    
    // Define device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Define image sizes for optimization
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Minimize image size
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    
    // Configure domains
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
      // YouTube thumbnails
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
        pathname: '/vi/**',
      },
    ],
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Compress static assets
  compress: true,
  
  // Remove powered by header for security
  poweredByHeader: false,
}

export default nextConfig