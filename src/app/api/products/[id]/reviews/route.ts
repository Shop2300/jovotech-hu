// src/app/api/products/[id]/reviews/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const reviews = await prisma.productReview.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { rating, comment, authorName, authorEmail } = body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      );
    }
    
    // Create review
    const review = await prisma.productReview.create({
      data: {
        productId: id,
        rating,
        comment,
        authorName,
        authorEmail,
      },
    });
    
    // Update product average rating
    const reviews = await prisma.productReview.findMany({
      where: { productId: id },
      select: { rating: true },
    });
    
    const totalRatings = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
    
    await prisma.product.update({
      where: { id },
      data: {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalRatings,
      },
    });
    
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}