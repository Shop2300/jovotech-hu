// src/app/[categorySlug]/[productSlug]/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from './ProductDetailClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ categorySlug: string; productSlug: string }> 
}) {
  const { categorySlug, productSlug } = await params;
  
  // First find the category
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    notFound();
  }

  // Then find the product
  const product = await prisma.product.findFirst({
    where: { 
      slug: productSlug,
      categoryId: category.id
    },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' }
      },
      variants: {
        where: { isActive: true },
        orderBy: [
          { sizeOrder: 'asc' },
          { order: 'asc' }
        ]
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Convert Decimal to number for client component
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
    variants: product.variants.map(variant => ({
      ...variant,
      price: variant.price ? Number(variant.price) : null
    }))
  };

  return <ProductDetailClient product={serializedProduct} />;
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ categorySlug: string; productSlug: string }> 
}): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) return {};

  const product = await prisma.product.findFirst({
    where: { 
      slug: productSlug,
      categoryId: category.id
    }
  });

  if (!product) return {};

  return {
    title: `${product.name} - ${category.name}`,
    description: product.description || `${product.name} z kategorie ${category.name}`,
  };
}