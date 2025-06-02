// src/app/api/products/[id]/related/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // First, get the current product to find its category
    const currentProduct = await prisma.product.findUnique({
      where: { id: id },
      select: { categoryId: true }
    });

    if (!currentProduct || !currentProduct.categoryId) {
      return NextResponse.json([]);
    }

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        id: {
          not: id // Exclude current product
        }
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1
        },
        variants: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      take: 10, // Limit to 10 related products
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related products' },
      { status: 500 }
    );
  }
}