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
    
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        image: body.image || null,
        order: body.order || 0,
        isActive: body.isActive ?? true,
        parentId: body.parentId || null,
      },
    });
    
    return NextResponse.json(category);
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