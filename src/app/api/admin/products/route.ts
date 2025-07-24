// src/app/api/admin/products/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/slug';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const searchTerm = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    
    // Build query conditions
    const whereConditions: any = {};
    
    if (categoryId && categoryId !== 'all') {
      whereConditions.categoryId = categoryId;
    }
    
    if (searchTerm) {
      whereConditions.OR = [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { code: { contains: searchTerm } }
      ];
    }
    
    // Get total count
    const totalCount = await prisma.product.count({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined
    });
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const products = await prisma.product.findMany({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            images: true,
            variants: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    // Convert Decimal fields to numbers
    const serializedProducts = products.map((product: any) => ({
      ...product,
      price: Number(product.price),
      regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    }));
    
    return NextResponse.json({
      products: serializedProducts,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, variants, ...productData } = body;
    
    // Use provided slug or generate from name
    let slug = productData.slug || createSlug(productData.name);
    let counter = 1;
    
    // Ensure unique slug
    const baseSlug = slug;
    while (await prisma.product.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        code: productData.code || undefined,
        slug,
        description: productData.description || null,
        detailDescription: productData.detailDescription || null,
        price: parseFloat(productData.price),
        regularPrice: productData.regularPrice ? parseFloat(productData.regularPrice) : null,
        stock: parseInt(productData.stock),
        image: productData.image || null,
        categoryId: productData.categoryId || null,
        brand: productData.brand || null,
        warranty: productData.warranty || null,
        availability: productData.availability || 'in_stock',
      },
    });
    
    // If no code was provided, update the product to use its ID as code
    if (!productData.code) {
      await prisma.product.update({
        where: { id: product.id },
        data: { code: product.id }
      });
    }
    
    // Create images
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
    
    // Create variants
    if (variants && Array.isArray(variants) && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((variant: any) => ({
          productId: product.id,
          colorName: variant.colorName || null,
          colorCode: variant.colorCode || null,
          sizeName: variant.sizeName || null,
          variantName: variant.variantName || null, // NEW FIELD
          sizeOrder: variant.sizeOrder || 0,
          stock: parseInt(variant.stock) || 0,
          price: variant.price ? parseFloat(variant.price) : null,
          regularPrice: variant.regularPrice ? parseFloat(variant.regularPrice) : null,
          imageUrl: variant.imageUrl || null,
          order: variant.order || 0
        }))
      });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}