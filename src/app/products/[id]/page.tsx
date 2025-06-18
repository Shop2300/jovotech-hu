// src/app/products/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export default async function ProductRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Find the product with its category
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      category: true
    }
  });

  if (!product) {
    notFound();
  }

  // Redirect to the new URL structure
  if (product.category && product.slug) {
    redirect(`/${product.category.slug}/${product.slug}`);
  } else {
    // If no slug, redirect to home or show not found
    notFound();
  }
}
