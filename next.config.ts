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
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'lucide-react',
      'react-hook-form',
      'react-hot-toast',
      'date-fns',
    ],
  },

  // Optimize webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // More selective chunk splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: 1,
              reuseExistingChunk: true,
            },
            // Only common React packages in vendor
            reactVendor: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react-vendor',
              priority: 30,
            },
            // Framework essentials
            framework: {
              test: /[\\/]node_modules[\\/](next|@next)[\\/]/,
              name: 'framework',
              priority: 40,
            },
            // Separate large libraries that aren't used everywhere
            tiptap: {
              test: /[\\/]node_modules[\\/](@tiptap|prosemirror)[\\/]/,
              name: 'editor',
              chunks: 'async',
              priority: 20,
              enforce: true,
            },
            pdf: {
              test: /[\\/]node_modules[\\/](jspdf|html2canvas)[\\/]/,
              name: 'pdf-utils',
              chunks: 'async',
              priority: 20,
              enforce: true,
            },
            excel: {
              test: /[\\/]node_modules[\\/]xlsx[\\/]/,
              name: 'excel-utils',
              chunks: 'async',
              priority: 20,
              enforce: true,
            },
            forms: {
              test: /[\\/]node_modules[\\/]react-hook-form[\\/]/,
              name: 'forms',
              chunks: 'async',
              priority: 15,
            },
            // Everything else in commons
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
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