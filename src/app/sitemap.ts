// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.galaxysklep.pl'
  
  // Get all products (remove isActive since it doesn't exist in your schema)
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      updatedAt: true,
      category: {
        select: {
          slug: true
        }
      }
    }
  })
  
  // Get all categories (remove isActive check)
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true
    }
  })
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/rolunk`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kapcsolat`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/szallitas-es-fizetes`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/visszaru-es-reklamacio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/aszf`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/adatvedelmi-szabalyzat`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]
  
  // Category pages
  const categoryPages = categories
    .filter(category => category.slug) // Only include categories with slugs
    .map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  
  // Product pages
  const productPages = products
    .filter(product => product.slug && product.category?.slug) // Only include products with slugs and categories
    .map((product) => ({
      url: `${baseUrl}/${product.category?.slug}/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  
  return [...staticPages, ...categoryPages, ...productPages]
}