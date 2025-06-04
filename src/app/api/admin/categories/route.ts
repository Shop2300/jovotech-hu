// src/app/api/admin/categories/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/slug';
import { checkAuth } from '@/lib/auth-middleware';

export async function GET(request: Request) {
  // Check authentication
  const authError = await checkAuth(request as any);
  if (authError) return authError;

  try {
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
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Check authentication
  const authError = await checkAuth(request as any);
  if (authError) return authError;

  try {
    const body = await request.json();
    
    // Generate slug
    const slug = body.slug || createSlug(body.name);
    
    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        image: body.image || null,
        order: body.order || 0,
        isActive: body.isActive ?? true,
        parentId: body.parentId || null
      }
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// Endpoint for updating category orders
export async function PATCH(request: Request) {
  // Check authentication
  const authError = await checkAuth(request as any);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { updates } = body;
    
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Invalid updates format' },
        { status: 400 }
      );
    }
    
    // Update all categories in a transaction
    const results = await prisma.$transaction(
      updates.map((update: { id: string; order: number }) =>
        prisma.category.update({
          where: { id: update.id },
          data: { order: update.order }
        })
      )
    );
    
    return NextResponse.json({ success: true, updated: results.length });
  } catch (error) {
    console.error('Error updating category orders:', error);
    return NextResponse.json(
      { error: 'Failed to update category orders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}