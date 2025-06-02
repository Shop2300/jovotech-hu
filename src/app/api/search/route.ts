// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
  const instant = searchParams.get('instant') === 'true';

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const searchTerm = query.toLowerCase().trim();
    
    // Get all products and filter in JavaScript for case-insensitive search
    const allProducts = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        variants: {
          select: {
            id: true,
            colorName: true,
            colorCode: true,
            stock: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter products with case-insensitive search
    const filteredProducts = allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const descriptionMatch = product.description ? 
        product.description.toLowerCase().includes(searchTerm) : false;
      const brandMatch = product.brand ? 
        product.brand.toLowerCase().includes(searchTerm) : false;
      const codeMatch = product.code ? 
        product.code.toLowerCase().includes(searchTerm) : false;
      
      return nameMatch || descriptionMatch || brandMatch || codeMatch;
    });

    // Limit results
    const limitedProducts = instant ? 
      filteredProducts.slice(0, limit) : 
      filteredProducts.slice(0, 50);

    // Convert Decimal to number
    const formattedProducts = limitedProducts.map(product => ({
      ...product,
      price: Number(product.price),
      regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    }));

    if (instant) {
      // Get all categories and filter for instant search
      const allCategories = await prisma.category.findMany();
      const matchingCategories = allCategories
        .filter(cat => cat.name.toLowerCase().includes(searchTerm))
        .slice(0, 3);

      return NextResponse.json({ 
        products: formattedProducts,
        categories: matchingCategories,
        totalResults: filteredProducts.length
      });
    }

    return NextResponse.json({ 
      products: formattedProducts,
      totalResults: filteredProducts.length 
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}