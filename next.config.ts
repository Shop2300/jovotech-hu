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
    // Optimize CSS loading
    optimizeCss: true,
    // Enable CSS modules optimization
    craCompat: true,
  },
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Configure webpack for CSS optimization
  webpack: (config, { isServer }) => {
    // Optimize CSS loading in production
    if (!isServer && process.env.NODE_ENV === 'production') {
      // Extract critical CSS
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          styles: {
            name: 'styles',
            test: /\.(css|scss)$/,
            chunks: 'all',
            enforce: true,
            priority: 20,
          },
          critical: {
            name: 'critical',
            test: /critical\.css$/,
            chunks: 'all',
            enforce: true,
            priority: 30,
          },
        },
      };
    }
    
    return config;
  },
  
  // Add headers for performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Link',
            value: '</fonts/inter-var.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous'
          },
        ],
      },
      {
        // Cache CSS files aggressively
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
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
}

export default nextConfig