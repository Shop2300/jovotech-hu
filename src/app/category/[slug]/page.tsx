// src/app/category/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CategoryProductsClient } from '@/components/CategoryProductsClient';
import { FolderOpen, Home } from 'lucide-react';

async function getCategory(slug: string) {
  const category = await prisma.category.findFirst({
    where: { 
      slug,
      isActive: true 
    },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
      parent: true
    }
  });

  return category;
}

async function getCategoryProducts(categoryId: string, includeSubcategories: boolean = true) {
  if (includeSubcategories) {
    // Get all subcategory IDs
    const subcategories = await prisma.category.findMany({
      where: { 
        parentId: categoryId,
        isActive: true 
      },
      select: { id: true }
    });
    
    const categoryIds = [categoryId, ...subcategories.map(sub => sub.id)];
    
    const products = await prisma.product.findMany({
      where: { 
        categoryId: { in: categoryIds }
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return products.map(product => ({
      ...product,
      price: Number(product.price),
      regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : undefined,
      totalRatings: product.totalRatings || 0}));
  } else {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        variants: {
          where: { isActive: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return products.map(product => ({
      ...product,
      price: Number(product.price),
      regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : undefined,
      totalRatings: product.totalRatings || 0}));
  }
}

// Updated function to get random products from the category
async function getRandomCategoryProducts(categoryId: string, limit: number = 8) {
  // Get all subcategory IDs
  const subcategories = await prisma.category.findMany({
    where: { 
      parentId: categoryId,
      isActive: true 
    },
    select: { id: true }
  });
  
  const categoryIds = [categoryId, ...subcategories.map(sub => sub.id)];
  
  // Get all products from this category and subcategories
  const allProducts = await prisma.product.findMany({
    where: { 
      categoryId: { in: categoryIds },
      image: { not: null } // Only get products with images
    },
    include: {
      category: true
    }
  });
  
  // Shuffle and take only the required number
  const shuffled = allProducts.sort(() => 0.5 - Math.random());
  const randomProducts = shuffled.slice(0, limit);
  
  return randomProducts.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null
  }));
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const products = await getCategoryProducts(category.id);
  const randomProducts = await getRandomCategoryProducts(category.id, 8);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm flex items-center">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            <Home size={16} />
          </Link>
          {category.parent && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <Link href={`/category/${category.parent.slug}`} className="text-gray-600 hover:text-blue-600">
                {category.parent.name}
              </Link>
            </>
          )}
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Main Layout with Sidebar */}
        <div className="flex gap-8" style={{ overflow: "visible" }}>
          {/* Left Sidebar - Najnowsze zamówienia */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-black">Najnowsze zamówienia</h3>
              <div className="space-y-3">
                {randomProducts.map((product) => (
                  <Link 
                    key={product.id}
                    href={`/${product.category?.slug || 'products'}/${product.slug}`}
                    className="block hover:bg-white rounded-lg p-2 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-sm font-semibold text-red-600 mt-1">
                          {product.price.toLocaleString('pl-PL')} zł
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 relative" style={{ overflow: "visible" }}>
            {/* Subcategories */}
            {category.children && category.children.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-black">Podkategorie</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.children.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/category/${subcategory.slug}`}
                      className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex items-center gap-3"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        {subcategory.image ? (
                          <img
                            src={subcategory.image}
                            alt={subcategory.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            <FolderOpen className="text-blue-600" size={24} />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{subcategory.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid with Filter */}
            <CategoryProductsClient products={products.map(p => ({
    ...p, 
    isActive: true, 
    slug: p.slug || p.id, 
    categoryId: p.categoryId || p.category?.id || "",
    variants: p.variants?.map(v => ({
      id: v.id,
      colorName: v.colorName || "",
      colorCode: v.colorCode,
      stock: v.stock
    }))
  }))} />
          </div>
        </div>
      </div>
    </main>
  );
}