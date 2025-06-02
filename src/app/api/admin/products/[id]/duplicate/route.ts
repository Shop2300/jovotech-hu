// src/app/api/admin/products/[id]/duplicate/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/slug';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch the original product with all relations
    const originalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true
      }
    });

    if (!originalProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate new slug with (kopie) suffix
    let newName = `${originalProduct.name} (kopie)`;
    let slug = createSlug(newName);
    let counter = 1;
    
    // Ensure unique slug
    while (await prisma.product.findFirst({ where: { slug } })) {
      newName = `${originalProduct.name} (kopie ${counter})`;
      slug = createSlug(newName);
      counter++;
    }

    // Create the duplicate product (without code, so it will be auto-generated)
    const duplicatedProduct = await prisma.product.create({
      data: {
        name: newName,
        slug,
        description: originalProduct.description,
        detailDescription: originalProduct.detailDescription,
        price: originalProduct.price,
        regularPrice: originalProduct.regularPrice,
        stock: originalProduct.stock,
        image: originalProduct.image,
        categoryId: originalProduct.categoryId,
        brand: originalProduct.brand,
        warranty: originalProduct.warranty,
      },
    });

    // Set the code to the new product's ID
    await prisma.product.update({
      where: { id: duplicatedProduct.id },
      data: { code: duplicatedProduct.id }
    });

    // Duplicate images
    if (originalProduct.images.length > 0) {
      await prisma.productImage.createMany({
        data: originalProduct.images.map(image => ({
          url: image.url,
          order: image.order,
          alt: image.alt,
          productId: duplicatedProduct.id
        }))
      });
    }

    // Duplicate variants
    if (originalProduct.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: originalProduct.variants.map(variant => ({
          productId: duplicatedProduct.id,
          colorName: variant.colorName,
          colorCode: variant.colorCode,
          sizeName: variant.sizeName,
          sizeOrder: variant.sizeOrder,
          stock: variant.stock,
          price: variant.price,
          imageUrl: variant.imageUrl,
          order: variant.order,
          isActive: variant.isActive
        }))
      });
    }

    return NextResponse.json(duplicatedProduct);
  } catch (error) {
    console.error('Error duplicating product:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate product' },
      { status: 500 }
    );
  }
}