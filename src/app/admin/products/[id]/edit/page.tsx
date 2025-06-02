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
    code: product.code || '', // Ensure code is included
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    images: product.images,
    variants: product.variants.map(variant => ({
      ...variant,
      price: variant.price ? Number(variant.price) : null
    }))
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upravit produkt</h1>
      <ProductForm initialData={serializedProduct} />
    </div>
  );
}