// src/app/api/admin/products/bulk-move/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { productIds, categoryId } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided' },
        { status: 400 }
      );
    }

    // Validate that category exists if categoryId is provided (not null)
    if (categoryId !== null && categoryId !== undefined) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Selected category does not exist' },
          { status: 400 }
        );
      }
    }

    // Update all products with the new category
    const updateResult = await prisma.product.updateMany({
      where: {
        id: {
          in: productIds
        }
      },
      data: {
        categoryId: categoryId === null ? null : categoryId
      }
    });

    // If moving to no category, we might want to log this
    if (categoryId === null) {
      console.log(`Moved ${updateResult.count} products to no category`);
    }

    return NextResponse.json({
      success: true,
      movedCount: updateResult.count,
      message: `Successfully moved ${updateResult.count} products`
    });
  } catch (error) {
    console.error('Error bulk moving products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to move products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}