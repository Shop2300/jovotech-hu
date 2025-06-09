// src/app/admin/products/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { CategoryFilter } from '@/components/admin/CategoryFilter';
import { ProductFilter } from '@/components/admin/ProductFilter';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const categoryId = params.category as string | undefined;
  const searchTerm = params.search as string | undefined;
  const page = parseInt(params.page as string || '1');
  const limit = parseInt(params.limit as string || '25');
  
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
  
  // Get total count for pagination
  const totalCount = await prisma.product.count({
    where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined
  });
  
  // Calculate pagination
  const skip = (page - 1) * limit;
  
  // Fetch paginated products
  const productsData = await prisma.product.findMany({
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

  // Convert Decimal fields to numbers for the component
  const products = productsData.map(product => ({
    ...product,
    price: product.price.toNumber(),
    regularPrice: product.regularPrice?.toNumber() || null,
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produkty</h1>
          <p className="text-sm text-gray-600 mt-1">
            Celkem {totalCount} produktů
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Přidat produkt
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <CategoryFilter selectedCategory={categoryId} />
        <ProductFilter currentSearch={searchTerm} />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <ProductsTable 
          products={products} 
          totalCount={totalCount}
          currentPage={page}
          itemsPerPage={limit}
        />
      </div>
    </div>
  );
}