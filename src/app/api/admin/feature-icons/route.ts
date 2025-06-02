// src/app/api/admin/feature-icons/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const icons = await prisma.featureIcon.findMany({
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(icons);
  } catch (error) {
    console.error('Error fetching feature icons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature icons' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const icon = await prisma.featureIcon.create({
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
    console.error('Error creating feature icon:', error);
    return NextResponse.json(
      { error: 'Failed to create feature icon' },
      { status: 500 }
    );
  }
}