// src/app/api/admin/products/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/slug';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { images, variants, ...productData } = body;
    
    // Handle slug
    let slug = productData.slug; // Use provided slug if available
    
    if (!slug) {
      // If no slug provided, generate from name
      const existingProduct = await prisma.product.findUnique({ where: { id } });
      
      if (existingProduct && existingProduct.name !== productData.name) {
        // Name changed and no slug provided, generate new one
        slug = createSlug(productData.name);
      } else if (existingProduct) {
        // Keep existing slug if name didn't change
        slug = existingProduct.slug;
      } else {
        // Fallback: generate from current name
        slug = createSlug(productData.name);
      }
    }
    
    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    
    while (await prisma.product.findFirst({ 
      where: { 
        slug: finalSlug, 
        NOT: { id } 
      } 
    })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    
    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: productData.name,
        code: productData.code || id, // Use product ID if code is empty
        slug: finalSlug,
        description: productData.description || null,
        detailDescription: productData.detailDescription || null,
        price: parseFloat(productData.price),
        regularPrice: productData.regularPrice ? parseFloat(productData.regularPrice) : null,
        stock: parseInt(productData.stock),
        image: productData.image || null,
        categoryId: productData.categoryId || null,
        brand: productData.brand || null,
        warranty: productData.warranty || null,
        availability: productData.availability || 'in_stock', // NEW FIELD with default
      },
    });
    
    // Delete existing images and variants
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });
    
    await prisma.productVariant.deleteMany({
      where: { productId: id }
    });
    
    // Create new images
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((image: any) => ({
          url: image.url,
          order: image.order,
          alt: image.alt || null,
          productId: id
        }))
      });
    }
    
    // Create new variants
    if (variants && Array.isArray(variants) && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((variant: any) => ({
          productId: id,
          colorName: variant.colorName || null,
          colorCode: variant.colorCode || null,
          sizeName: variant.sizeName || null,
          sizeOrder: variant.sizeOrder || 0,
          stock: parseInt(variant.stock) || 0,
          price: variant.price ? parseFloat(variant.price) : null,
          regularPrice: variant.regularPrice ? parseFloat(variant.regularPrice) : null, // NEW FIELD
          imageUrl: variant.imageUrl || null,
          order: variant.order || 0
        }))
      });
    }
    
    // Fetch updated product
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        variants: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        variants: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Convert Decimal fields to numbers before sending to client
    const serializedProduct = {
      ...product,
      price: product.price ? Number(product.price) : 0,
      regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
      variants: product.variants.map((variant: any) => ({
        ...variant,
        price: variant.price ? Number(variant.price) : null,
        regularPrice: variant.regularPrice ? Number(variant.regularPrice) : null,
      }))
    };
    
    return NextResponse.json(serializedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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
    await prisma.product.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}