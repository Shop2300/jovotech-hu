// src/app/admin/products/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';
import { createSlug } from '@/lib/slug';

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      variants: {
        orderBy: [
          { sizeOrder: 'asc' },
          { order: 'asc' }
        ]
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Convert Decimal fields to numbers for client component
  const serializedProduct = {
    ...product,
    code: product.code || undefined,
    slug: product.slug || createSlug(product.name),
    price: product.price.toNumber(),
    regularPrice: product.regularPrice?.toNumber() || null,
    description: product.description || null,
    detailDescription: product.detailDescription || null,
    brand: product.brand || null,
    warranty: product.warranty || null,
    categoryId: product.categoryId || null,
    image: product.image || null,
    images: product.images.map(img => ({
      ...img,
      alt: img.alt || undefined
    })),
    variants: product.variants.map(v => {
      // Check if this is a "random" variant (stored in colorName but with no color code)
      const isRandomVariant = v.colorName && !v.colorCode && !v.sizeName;
      
      return {
        ...v,
        price: v.price?.toNumber() || undefined,
        regularPrice: v.regularPrice?.toNumber() || undefined,
        colorName: isRandomVariant ? undefined : (v.colorName ?? undefined),
        colorCode: v.colorCode ?? undefined,
        sizeName: v.sizeName ?? undefined,
        imageUrl: v.imageUrl ?? undefined,
        // For random variants, move colorName to variantName
        variantName: isRandomVariant ? (v.colorName ?? undefined) : (v.variantName ?? undefined),
        stock: v.stock,
      };
    })
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upravit produkt</h1>
      <ProductForm initialData={serializedProduct} />
    </div>
  );
}