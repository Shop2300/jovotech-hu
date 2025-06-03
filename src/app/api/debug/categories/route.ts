// src/app/api/debug/categories/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all categories with full details
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Get parent-child relationships
    const parentCategories = categories.filter(c => !c.parentId);
    const childCategories = categories.filter(c => c.parentId);

    const debug = {
      totalCategories: categories.length,
      parentCategories: parentCategories.length,
      childCategories: childCategories.length,
      categoriesWithChildren: categories.filter(c => c._count.children > 0).map(c => ({
        name: c.name,
        childrenCount: c._count.children
      })),
      allCategories: categories.map(c => ({
        id: c.id,
        nameCs: c.name,
        parentId: c.parentId,
        parentName: c.parent?.nameCs || null,
        childrenCount: c._count.children
      }))
    };

    return NextResponse.json(debug, { status: 200 });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Failed to debug categories' },
      { status: 500 }
    );
  }
}