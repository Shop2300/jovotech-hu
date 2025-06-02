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
    
    // Check if name changed and generate new slug if needed
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    let slug = existingProduct?.slug;
    
    if (existingProduct && existingProduct.name !== productData.name) {
      slug = createSlug(productData.name);
      let counter = 1;
      
      // Ensure unique slug
      while (await prisma.product.findFirst({ 
        where: { slug, NOT: { id } } 
      })) {
        slug = `${createSlug(productData.name)}-${counter}`;
        counter++;
      }
    } else if (!slug) {
      // If no slug exists, create one
      slug = createSlug(productData.name);
      let counter = 1;
      
      while (await prisma.product.findFirst({ 
        where: { slug, NOT: { id } } 
      })) {
        slug = `${createSlug(productData.name)}-${counter}`;
        counter++;
      }
    }
    
    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: productData.name,
        code: productData.code || id, // Use product ID if code is empty
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
    
    return NextResponse.json(product);
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