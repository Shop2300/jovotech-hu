// src/app/api/admin/categories/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/slug';
import { checkAuth } from '@/lib/auth-middleware';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authError = await checkAuth(request as any);
  if (authError) return authError;

  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authError = await checkAuth(request as any);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    
    // Get the current category to check if order is changing
    const currentCategory = await prisma.category.findUnique({
      where: { id },
      select: { order: true, parentId: true }
    });

    if (!currentCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate slug if name changed
    const slug = body.slug || createSlug(body.name);
    
    // Check if slug already exists (excluding current category)
    const existing = await prisma.category.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Kategorie s tímto slug již existuje' },
        { status: 400 }
      );
    }
    
    // Prevent category from being its own parent
    if (body.parentId === id) {
      return NextResponse.json(
        { error: 'Kategorie nemůže být svou vlastní nadřazenou kategorií' },
        { status: 400 }
      );
    }
    
    // Prevent circular references
    if (body.parentId) {
      const isDescendant = await checkIfDescendant(id, body.parentId);
      if (isDescendant) {
        return NextResponse.json(
          { error: 'Nelze nastavit podkategorii jako nadřazenou kategorii' },
          { status: 400 }
        );
      }
    }

    // Handle order change
    const newOrder = body.order || 0;
    const oldOrder = currentCategory.order;
    const parentId = body.parentId || null;

    // If order is changing, we need to shift other categories
    if (newOrder !== oldOrder || parentId !== currentCategory.parentId) {
      // Get all sibling categories (same parent)
      const siblings = await prisma.category.findMany({
        where: {
          parentId: parentId,
          id: { not: id }
        },
        orderBy: { order: 'asc' }
      });

      // Use a transaction to update all affected categories
      const updates = [];

      // If moving to a different parent or order changed
      if (parentId !== currentCategory.parentId) {
        // When moving to a different parent, just insert at the new position
        siblings.forEach(sibling => {
          if (sibling.order >= newOrder) {
            updates.push(
              prisma.category.update({
                where: { id: sibling.id },
                data: { order: sibling.order + 10 }
              })
            );
          }
        });
      } else if (newOrder > oldOrder) {
        // Moving down: shift categories between old and new position up
        siblings.forEach(sibling => {
          if (sibling.order > oldOrder && sibling.order <= newOrder) {
            updates.push(
              prisma.category.update({
                where: { id: sibling.id },
                data: { order: sibling.order - 10 }
              })
            );
          }
        });
      } else if (newOrder < oldOrder) {
        // Moving up: shift categories between new and old position down
        siblings.forEach(sibling => {
          if (sibling.order >= newOrder && sibling.order < oldOrder) {
            updates.push(
              prisma.category.update({
                where: { id: sibling.id },
                data: { order: sibling.order + 10 }
              })
            );
          }
        });
      }

      // Add the main category update
      updates.push(
        prisma.category.update({
          where: { id },
          data: {
            name: body.name,
            slug,
            description: body.description || null,
            image: body.image || null,
            order: newOrder,
            isActive: body.isActive ?? true,
            parentId: parentId,
          },
        })
      );

      // Execute all updates in a transaction
      const results = await prisma.$transaction(updates);
      const updatedCategory = results[results.length - 1]; // The last update is our category

      return NextResponse.json(updatedCategory);
    } else {
      // No order change, just update the category normally
      const category = await prisma.category.update({
        where: { id },
        data: {
          name: body.name,
          slug,
          description: body.description || null,
          image: body.image || null,
          order: newOrder,
          isActive: body.isActive ?? true,
          parentId: parentId,
        },
      });
      
      return NextResponse.json(category);
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// Helper function to check if a category is a descendant of another
async function checkIfDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
  const category = await prisma.category.findUnique({
    where: { id: descendantId },
    select: { parentId: true }
  });
  
  if (!category || !category.parentId) {
    return false;
  }
  
  if (category.parentId === ancestorId) {
    return true;
  }
  
  return checkIfDescendant(ancestorId, category.parentId);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authError = await checkAuth(request as any);
  if (authError) return authError;

  try {
    const { id } = await params;
    
    // Check if category has products or subcategories
    const [productsCount, childrenCount] = await Promise.all([
      prisma.product.count({ where: { categoryId: id } }),
      prisma.category.count({ where: { parentId: id } })
    ]);
    
    if (productsCount > 0) {
      return NextResponse.json(
        { error: `Nelze smazat kategorii s ${productsCount} produkty` },
        { status: 400 }
      );
    }
    
    if (childrenCount > 0) {
      return NextResponse.json(
        { error: `Nelze smazat kategorii s ${childrenCount} podkategoriemi` },
        { status: 400 }
      );
    }
    
    await prisma.category.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}