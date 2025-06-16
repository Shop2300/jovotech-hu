// src/app/products/[id]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from './ProductDetailClient';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      category: true, // Added this line
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
    })),
    category: product.category ? {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug
    } : undefined
  };

  return <ProductDetailClient product={serializedProduct} />;
}