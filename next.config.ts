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
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-color',
      '@tiptap/extension-image',
      '@tiptap/extension-link',
      '@tiptap/extension-text-align',
      '@tiptap/extension-text-style',
      '@tiptap/extension-underline',
      'react-hook-form',
      'react-hot-toast',
      'date-fns',
    ],
  },

  // Optimize webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split chunks more aggressively
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Split vendor code
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
            },
            // Split common modules
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate heavy libraries
            tiptap: {
              test: /[\\/]node_modules[\\/](@tiptap)[\\/]/,
              name: 'tiptap',
              chunks: 'all',
              priority: 30,
            },
            pdf: {
              test: /[\\/]node_modules[\\/](jspdf|html2canvas)[\\/]/,
              name: 'pdf',
              chunks: 'all',
              priority: 30,
            },
            excel: {
              test: /[\\/]node_modules[\\/](xlsx)[\\/]/,
              name: 'excel',
              chunks: 'all',
              priority: 30,
            },
          },
        },
      };

      // Replace axios with native fetch
      config.resolve.alias = {
        ...config.resolve.alias,
        'axios': false,
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