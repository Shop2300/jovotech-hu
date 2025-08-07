// src/app/api/admin/products/bulk-delete/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { productIds, selectAll, category, search } = body;

    let idsToDelete: string[] = [];

    // Handle "select all matching filter" case
    if (selectAll) {
      // Build the same where conditions as in the products page
      const whereConditions: any = {};
      
      // Apply category filter if present
      if (category && category !== 'all') {
        whereConditions.categoryId = category;
      }
      
      // Apply search filter if present
      if (search) {
        whereConditions.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { code: { contains: search } }
        ];
      }

      // Get all product IDs matching the filter
      const productsToDelete = await prisma.product.findMany({
        where: Object.keys(whereConditions).length > 0 ? whereConditions : {},
        select: { id: true }
      });

      idsToDelete = productsToDelete.map(p => p.id);

      if (idsToDelete.length === 0) {
        return NextResponse.json(
          { error: 'No products found matching the filter' },
          { status: 400 }
        );
      }

      console.log(`Deleting ${idsToDelete.length} filtered products`);
    } 
    // Handle specific product IDs case (existing functionality)
    else {
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return NextResponse.json(
          { error: 'No product IDs provided' },
          { status: 400 }
        );
      }
      idsToDelete = productIds;
    }

    // Delete all product images first (to clean up file references if needed in the future)
    await prisma.productImage.deleteMany({
      where: {
        productId: {
          in: idsToDelete
        }
      }
    });

    // Delete all product variants
    await prisma.productVariant.deleteMany({
      where: {
        productId: {
          in: idsToDelete
        }
      }
    });

    // Delete all product reviews if they exist
    await prisma.productReview.deleteMany({
      where: {
        productId: {
          in: idsToDelete
        }
      }
    });

    // Delete all order items associated with these products
    // This is important to maintain database integrity
    await prisma.orderItem.deleteMany({
      where: {
        productId: {
          in: idsToDelete
        }
      }
    });

    // Finally, delete the products
    const deleteResult = await prisma.product.deleteMany({
      where: {
        id: {
          in: idsToDelete
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