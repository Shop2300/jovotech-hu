// src/app/category/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CategoryProductsClient } from '@/components/CategoryProductsClient';
import { FolderOpen, Home } from 'lucide-react';
import { Prisma } from '@prisma/client';

const PRODUCTS_PER_PAGE = 32;

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

async function getCategoryProductsCount(categoryId: string, includeSubcategories: boolean = true) {
  if (includeSubcategories) {
    const subcategories = await prisma.category.findMany({
      where: { 
        parentId: categoryId,
        isActive: true 
      },
      select: { id: true }
    });
    
    const categoryIds = [categoryId, ...subcategories.map(sub => sub.id)];
    
    return await prisma.product.count({
      where: { 
        categoryId: { in: categoryIds }
      }
    });
  } else {
    return await prisma.product.count({
      where: { categoryId }
    });
  }
}

async function getSortedCategoryProducts(
  categoryId: string, 
  page: number = 1,
  sort: string = 'recommended',
  includeSubcategories: boolean = true
) {
  const skip = (page - 1) * PRODUCTS_PER_PAGE;
  
  // Define order by clause based on sort
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  
  switch (sort) {
    case 'cheapest':
      orderBy = { price: 'asc' };
      break;
    case 'expensive':
      orderBy = { price: 'desc' };
      break;
    case 'alphabetical':
      orderBy = { name: 'asc' };
      break;
    case 'bestselling':
      // Using totalRatings as a proxy for popularity
      // In a real scenario, you'd have a salesCount or similar field
      orderBy = { totalRatings: 'desc' };
      break;
    case 'recommended':
    default:
      // Default to newest products first
      orderBy = { createdAt: 'desc' };
      break;
  }
  
  if (includeSubcategories) {
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
      orderBy,
      skip,
      take: PRODUCTS_PER_PAGE
    });
    
    return products.map(product => ({
      ...product,
      price: Number(product.price),
      regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : undefined,
      totalRatings: product.totalRatings || 0
    }));
  } else {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        variants: {
          where: { isActive: true }
        }
      },
      orderBy,
      skip,
      take: PRODUCTS_PER_PAGE
    });
    
    return products.map(product => ({
      ...product,
      price: Number(product.price),
      regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
      averageRating: product.averageRating ? Number(product.averageRating) : undefined,
      totalRatings: product.totalRatings || 0
    }));
  }
}

async function getRandomCategoryProducts(categoryId: string, limit: number = 8) {
  const subcategories = await prisma.category.findMany({
    where: { 
      parentId: categoryId,
      isActive: true 
    },
    select: { id: true }
  });
  
  const categoryIds = [categoryId, ...subcategories.map(sub => sub.id)];
  
  const allProducts = await prisma.product.findMany({
    where: { 
      categoryId: { in: categoryIds },
      image: { not: null }
    },
    include: {
      category: true
    }
  });
  
  const shuffled = allProducts.sort(() => 0.5 - Math.random());
  const randomProducts = shuffled.slice(0, limit);
  
  return randomProducts.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null
  }));
}

export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const category = await getCategory(slug);
  
  if (!category) {
    return {
      title: 'Kategorie nenalezena',
    };
  }

  const pageNumber = page ? parseInt(page) : 1;
  const titleSuffix = pageNumber > 1 ? ` - Strana ${pageNumber}` : '';
  
  return {
    title: `${category.name}${titleSuffix} | Galaxysklep.pl`,
    description: category.description || `Produkty v kategorii ${category.name}`,
    openGraph: {
      title: `${category.name}${titleSuffix}`,
      description: category.description || `Produkty v kategorii ${category.name}`,
      url: `https://www.galaxysklep.pl/category/${category.slug}${pageNumber > 1 ? `?page=${pageNumber}` : ''}`,
    },
  };
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const { page, sort } = await searchParams;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const currentPage = page ? parseInt(page) : 1;
  const currentSort = sort || 'recommended';
  const totalProducts = await getCategoryProductsCount(category.id);
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  
  // Redirect if page is out of bounds
  if (currentPage < 1 || (currentPage > totalPages && totalPages > 0)) {
    notFound();
  }

  // Validate sort parameter
  const validSorts = ['recommended', 'bestselling', 'cheapest', 'expensive', 'alphabetical'];
  if (!validSorts.includes(currentSort)) {
    notFound();
  }

  const products = await getSortedCategoryProducts(category.id, currentPage, currentSort);
  const randomProducts = await getRandomCategoryProducts(category.id, 8);
  const popularProduct = await getRandomCategoryProducts(category.id, 1);

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
          <aside className="w-64 flex-shrink-0 hidden lg:block space-y-6">
            {/* Najnowsze zamówienia section */}
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

            {/* Popularny produkt section */}
            {popularProduct.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-black">Popularny produkt</h3>
                <div className="hover:bg-white rounded-lg p-3 transition-colors">
                  <div className="space-y-3">
                    <Link 
                      href={`/${popularProduct[0].category?.slug || 'products'}/${popularProduct[0].slug}`}
                      className="block"
                    >
                      <div className="relative w-full pb-[100%]">
                        {popularProduct[0].image ? (
                          <img
                            src={popularProduct[0].image}
                            alt={popularProduct[0].name}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        {popularProduct[0].regularPrice && popularProduct[0].regularPrice > popularProduct[0].price && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            -{Math.round(((popularProduct[0].regularPrice - popularProduct[0].price) / popularProduct[0].regularPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 mt-3">
                        {popularProduct[0].name}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between">
                      {popularProduct[0].regularPrice && popularProduct[0].regularPrice > popularProduct[0].price ? (
                        <div>
                          <span className="text-xs text-gray-500 line-through block">
                            {popularProduct[0].regularPrice.toLocaleString('pl-PL')} zł
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {popularProduct[0].price.toLocaleString('pl-PL')} zł
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-black">
                          {popularProduct[0].price.toLocaleString('pl-PL')} zł
                        </span>
                      )}
                      <Link 
                        href={`/${popularProduct[0].category?.slug || 'products'}/${popularProduct[0].slug}`}
                        className="inline-block px-3 py-1.5 bg-[#6da306] text-white text-xs font-medium rounded-lg hover:bg-[#5d8c05] transition-colors"
                      >
                        Zobacz
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <div className="flex-1 relative" style={{ overflow: "visible" }}>
            {/* Subcategories - Only show on first page */}
            {currentPage === 1 && category.children && category.children.length > 0 && (
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
            <CategoryProductsClient 
              products={products.map(p => ({
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
              }))}
              currentPage={currentPage}
              totalPages={totalPages}
              totalProducts={totalProducts}
              categorySlug={category.slug}
            />
          </div>
        </div>
      </div>
    </main>
  );
}