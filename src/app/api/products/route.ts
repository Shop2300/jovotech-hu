// src/app/api/products/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract images and variants from body
    const { images, variants, ...productData } = body;
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description || null,
        detailDescription: productData.detailDescription || null,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        image: productData.image || null,
        categoryId: productData.categoryId || null,
      },
    });
    
    // Create product images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((image: any) => ({
          url: image.url,
          order: image.order,
          alt: image.alt || null,
          productId: product.id
        }))
      });
    }
    
    // Create product variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((variant: any) => ({
          productId: product.id,
          colorName: variant.colorName,
          colorCode: variant.colorCode || null,
          stock: parseInt(variant.stock) || 0,
          price: variant.price ? parseFloat(variant.price) : null,
          imageUrl: variant.imageUrl || null,
          order: variant.order || 0
        }))
      });
    }
    
    // Fetch created product with all relations
    const createdProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        variants: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    // Convert Decimal fields to numbers
    const serializedProduct = createdProduct ? {
      ...createdProduct,
      price: Number(createdProduct.price),
      regularPrice: createdProduct.regularPrice ? Number(createdProduct.regularPrice) : null,
      variants: createdProduct.variants.map(variant => ({
        ...variant,
        price: variant.price ? Number(variant.price) : null,
        regularPrice: variant.regularPrice ? Number(variant.regularPrice) : null
      }))
    } : null;
    
    return NextResponse.json(serializedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Validate and cap limit to prevent timeouts
    const safeLimit = Math.min(Math.max(1, limit), 50); // Max 50 items
    
    // Optimized query with limited fields
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        regularPrice: true,
        stock: true,
        image: true,
        averageRating: true,
        totalRatings: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { order: 'asc' },
          take: 1,
          select: {
            url: true
          }
        },
        variants: {
          where: { isActive: true },
          take: 5, // Limit variants per product
          orderBy: { order: 'asc' },
          select: {
            id: true,
            colorName: true,
            colorCode: true,
            stock: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
      skip: offset
    });
    
    // Convert Decimal fields to numbers
    const serializedProducts = products.map(product => {
      let displayPrice = Number(product.price);
      let displayRegularPrice = product.regularPrice ? Number(product.regularPrice) : null;
      
      // If product has active variants with prices, use the lowest variant price
      if (product.variants && product.variants.length > 0) {
        const variantPrices = product.variants
          .filter(v => v.price !== null && v.stock > 0)
          .map(v => Number(v.price));
        
        if (variantPrices.length > 0) {
          displayPrice = Math.min(...variantPrices);
        }
      }
      
      return {
        ...product,
        price: displayPrice,
        regularPrice: displayRegularPrice,
        averageRating: product.averageRating ? Number(product.averageRating) : 0,
        totalRatings: product.totalRatings || 0,
        image: product.images?.[0]?.url || product.image || null,
        variants: product.variants.map(variant => ({
          ...variant,
          price: variant.price ? Number(variant.price) : null
        }))
      };
    });
    
    return NextResponse.json(serializedProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}