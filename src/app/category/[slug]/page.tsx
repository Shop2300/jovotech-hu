// src/app/category/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CategoryProductsClient } from '@/components/CategoryProductsClient';
import { FolderOpen, Home } from 'lucide-react';
import { Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';

const PRODUCTS_PER_PAGE = 32;
const PRODUCTS_PER_PAGE_MOBILE = 20;

// Cache category data
const getCachedCategory = unstable_cache(
  async (slug: string) => {
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
  },
  ['category-by-slug'],
  { revalidate: 3600, tags: ['categories'] }
);

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
  includeSubcategories: boolean = true,
  perPage: number = PRODUCTS_PER_PAGE
) {
  const skip = (page - 1) * perPage;
  
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
      orderBy = { totalRatings: 'desc' };
      break;
    case 'recommended':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }
  
  let whereClause: Prisma.ProductWhereInput;
  
  if (includeSubcategories) {
    const subcategories = await prisma.category.findMany({
      where: { 
        parentId: categoryId,
        isActive: true 
      },
      select: { id: true }
    });
    
    const categoryIds = [categoryId, ...subcategories.map(sub => sub.id)];
    whereClause = { categoryId: { in: categoryIds } };
  } else {
    whereClause = { categoryId };
  }
  
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' }
      },
      variants: {
        where: { isActive: true }
      }
    },
    orderBy,
    skip,
    take: perPage
  });
  
  return products.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating ? Number(product.averageRating) : undefined,
    totalRatings: product.totalRatings || 0,
    isActive: true,
    slug: product.slug || product.id,
    categoryId: product.categoryId || categoryId,
    availability: product.availability || 'in_stock',
    variants: product.variants?.map(v => ({
      id: v.id,
      colorName: v.colorName || '',
      colorCode: v.colorCode,
      stock: v.stock
    })) || []
  }));
}

// Cached sidebar products
const getCachedSidebarProducts = unstable_cache(
  async (categoryId: string, limit: number = 8) => {
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
        category: true,
        images: true,
        variants: {
          where: { isActive: true }
        }
      },
      take: limit * 3 // Get more to randomize
    });
    
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    const randomProducts = shuffled.slice(0, limit);
    
    return randomProducts.map(product => ({
      ...product,
      price: Number(product.price),
      regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
      isActive: true,
      slug: product.slug || product.id,
      categoryId: product.categoryId || categoryId,
      availability: product.availability || 'in_stock',
      averageRating: product.averageRating ? Number(product.averageRating) : undefined,
      totalRatings: product.totalRatings || 0,
      variants: product.variants?.map(v => ({
        id: v.id,
        colorName: v.colorName || '',
        colorCode: v.colorCode,
        stock: v.stock
      })) || []
    }));
  },
  ['category-sidebar-products'],
  { revalidate: 600 } // 10 minutes
);

export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const category = await getCachedCategory(slug);
  
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
  const category = await getCachedCategory(slug);

  if (!category) {
    notFound();
  }

  const currentPage = page ? parseInt(page) : 1;
  const currentSort = sort || 'recommended';
  
  // Simple mobile detection based on viewport
  const isMobile = false; // This will be handled on client side
  const perPage = PRODUCTS_PER_PAGE;
  
  const totalProducts = await getCategoryProductsCount(category.id);
  const totalPages = Math.ceil(totalProducts / perPage);
  
  // Redirect if page is out of bounds
  if (currentPage < 1 || (currentPage > totalPages && totalPages > 0)) {
    notFound();
  }

  // Validate sort parameter
  const validSorts = ['recommended', 'bestselling', 'cheapest', 'expensive', 'alphabetical'];
  if (!validSorts.includes(currentSort)) {
    notFound();
  }

  const products = await getSortedCategoryProducts(category.id, currentPage, currentSort, true, perPage);
  
  // Load sidebar products
  const [randomProducts, popularProduct] = await Promise.all([
    getCachedSidebarProducts(category.id, 8),
    getCachedSidebarProducts(category.id, 1)
  ]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 md:mb-6 text-xs md:text-sm flex items-center flex-wrap">
          <Link href="/" className="text-gray-600 hover:text-blue-600 p-1">
            <Home size={14} className="md:w-4 md:h-4" />
          </Link>
          {category.parent && (
            <>
              <span className="mx-1 md:mx-2 text-gray-400">/</span>
              <Link 
                href={`/category/${category.parent.slug}`} 
                className="text-gray-600 hover:text-blue-600 p-1"
              >
                {category.parent.name}
              </Link>
            </>
          )}
          <span className="mx-1 md:mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-black mb-1 md:mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-sm md:text-base text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Main Layout */}
        <div className="flex gap-4 md:gap-8">
          {/* Left Sidebar - Desktop only */}
          <aside className="w-64 flex-shrink-0 hidden lg:block space-y-6">
            {/* Najnowsze zamówienia section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-black">Najnowsze zamówienia</h3>
              <div className="space-y-3">
                {randomProducts.map((product) => (
                  <Link 
                    key={product.id}
                    href={`/${product.category?.slug || 'products'}/${product.slug || product.id}`}
                    className="block hover:bg-white rounded-lg p-2 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
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
                      href={`/${popularProduct[0].category?.slug || 'products'}/${popularProduct[0].slug || popularProduct[0].id}`}
                      className="block"
                    >
                      <div className="relative w-full pb-[100%]">
                        {popularProduct[0].image ? (
                          <img
                            src={popularProduct[0].image}
                            alt={popularProduct[0].name}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                            loading="lazy"
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
                        href={`/${popularProduct[0].category?.slug || 'products'}/${popularProduct[0].slug || popularProduct[0].id}`}
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
          <div className="flex-1">
            {/* Subcategories */}
            {currentPage === 1 && category.children && category.children.length > 0 && (
              <div className="mb-4 md:mb-8">
                <h2 className="text-base md:text-xl font-semibold mb-3 md:mb-4 text-black">Podkategorie</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {category.children.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/category/${subcategory.slug}`}
                      className="bg-white rounded-lg shadow hover:shadow-md transition p-3 md:p-4 flex items-center gap-2 md:gap-3"
                    >
                      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                        {subcategory.image ? (
                          <img
                            src={subcategory.image}
                            alt={subcategory.name}
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            <FolderOpen className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-xs md:text-sm text-gray-900 line-clamp-2">
                        {subcategory.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid with Filter */}
            <CategoryProductsClient 
              products={products}
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