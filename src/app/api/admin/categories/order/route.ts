// src/app/api/admin/categories/order/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  console.log('PUT /api/admin/categories/order called');
  
  try {
    const body = await request.json();
    const { categoryId, newOrder } = body;
    
    console.log(`Updating category ${categoryId} to order ${newOrder}`);
    
    // Get the category to update
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    const oldOrder = category.order;
    
    // Get all categories with the same parent
    const siblings = await prisma.category.findMany({
      where: { parentId: category.parentId },
      orderBy: { order: 'asc' }
    });
    
    // Update orders
    const updates = [];
    
    if (newOrder < oldOrder) {
      // Moving up - increment orders between new and old position
      for (const sibling of siblings) {
        if (sibling.order >= newOrder && sibling.order < oldOrder && sibling.id !== categoryId) {
          updates.push(
            prisma.category.update({
              where: { id: sibling.id },
              data: { order: sibling.order + 1 }
            })
          );
        }
      }
    } else if (newOrder > oldOrder) {
      // Moving down - decrement orders between old and new position
      for (const sibling of siblings) {
        if (sibling.order > oldOrder && sibling.order <= newOrder && sibling.id !== categoryId) {
          updates.push(
            prisma.category.update({
              where: { id: sibling.id },
              data: { order: sibling.order - 1 }
            })
          );
        }
      }
    }
    
    // Update the target category
    updates.push(
      prisma.category.update({
        where: { id: categoryId },
        data: { order: newOrder }
      })
    );
    
    // Execute all updates in a transaction
    await prisma.$transaction(updates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating category order:', error);
    return NextResponse.json(
      { error: 'Failed to update category order' },
      { status: 500 }
    );
  }
}