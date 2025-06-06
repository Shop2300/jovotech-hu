// src/app/admin/products/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { CategoryFilter } from '@/components/admin/CategoryFilter';
import Link from 'next/link';
import { Plus } from 'lucide-react';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SearchParams {
  category?: string;
  search?: string;
}

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const selectedCategoryId = params.category || 'all';
  
  // Fetch categories for filter
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  
  // Fetch products with optional category filter
  const productsQuery: any = {
    include: {
      category: true,
      _count: {
        select: {
          images: true,
          variants: true
        }
      }
    },
    orderBy: { createdAt: 'desc' as const }
  };
  
  // Add where conditions
  const whereConditions: any = {};
  
  if (selectedCategoryId !== 'all') {
    whereConditions.categoryId = selectedCategoryId;
  }
  
  if (params.search) {
    whereConditions.OR = [
      { name: { contains: params.search } },
      { description: { contains: params.search } },
      { code: { contains: params.search } }  // Add code to search
    ];
  }
  
  if (Object.keys(whereConditions).length > 0) {
    productsQuery.where = whereConditions;
  }
  
  const products = await prisma.product.findMany(productsQuery);
  
  // Convert Decimal to number for client component
  const serializedProducts = products.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null
  }));
  
  // Get selected category name for display
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Produkty</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Nový produkt
        </Link>
      </div>
      
      {/* Category Filter Component */}
      <CategoryFilter 
        categories={categories} 
        selectedCategoryId={selectedCategoryId} 
      />
      
      {/* Products count */}
      <div className="mb-4 text-sm text-gray-600">
        Zobrazeno {products.length} produktů
        {selectedCategory && ` v kategorii "${selectedCategory.name}"`}
        {params.search && ` obsahujících "${params.search}"`}
      </div>
      
      <ProductsTable products={serializedProducts} />
    </div>
  );
}