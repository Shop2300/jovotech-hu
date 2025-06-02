// src/app/api/feature-icons/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const icons = await prisma.featureIcon.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        key: true,
        title: true,
        titleCs: true,
        imageUrl: true,
        emoji: true,
      }
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