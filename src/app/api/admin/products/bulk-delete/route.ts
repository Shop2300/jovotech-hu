// src/app/api/admin/products/bulk-delete/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided' },
        { status: 400 }
      );
    }

    // Delete all product images first (to clean up file references if needed in the future)
    await prisma.productImage.deleteMany({
      where: {
        productId: {
          in: productIds
        }
      }
    });

    // Delete all product variants
    await prisma.productVariant.deleteMany({
      where: {
        productId: {
          in: productIds
        }
      }
    });

    // Delete all product reviews if they exist
    await prisma.productReview.deleteMany({
      where: {
        productId: {
          in: productIds
        }
      }
    });

    // Delete all order items associated with these products
    // This is important to maintain database integrity
    await prisma.orderItem.deleteMany({
      where: {
        productId: {
          in: productIds
        }
      }
    });

    // Finally, delete the products
    const deleteResult = await prisma.product.deleteMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      message: `Successfully deleted ${deleteResult.count} products`
    });
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}