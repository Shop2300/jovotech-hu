// src/app/admin/products/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

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
    price: product.price.toNumber(),
    regularPrice: product.regularPrice?.toNumber() || null,
    images: product.images.map(img => ({
      ...img,
      alt: img.alt || undefined
    })),
    variants: product.variants.map(v => ({
      ...v,
      price: v.price?.toNumber() || undefined,
      colorName: v.colorName || undefined,
      colorCode: v.colorCode || undefined,
      sizeName: v.sizeName || undefined,
      imageUrl: v.imageUrl || undefined
    }))
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upravit produkt</h1>
      <ProductForm initialData={serializedProduct} />
    </div>
  );
}