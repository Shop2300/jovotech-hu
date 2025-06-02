// src/app/api/admin/feature-icons/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const icon = await prisma.featureIcon.update({
      where: { id },
      data: {
        key: body.key,
        title: body.title,
        titleCs: body.titleCs,
        description: body.description || null,
        descriptionCs: body.descriptionCs || null,
        imageUrl: body.imageUrl || null,
        emoji: body.emoji || null,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      },
    });
    
    return NextResponse.json(icon);
  } catch (error) {
    console.error('Error updating feature icon:', error);
    return NextResponse.json(
      { error: 'Failed to update feature icon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.featureIcon.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting feature icon:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature icon' },
      { status: 500 }
    );
  }
}