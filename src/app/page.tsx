// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import dynamic from 'next/dynamic';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';

// Critical above-the-fold components - loaded immediately
import { BannerSlider } from '@/components/BannerSlider';

// Lazy load ProductCard for better performance
const ProductCard = dynamic(
  () => import('@/components/ProductCard').then(mod => ({ default: mod.ProductCard })),
  { 
    loading: () => <div className="bg-gray-100 rounded-lg h-80 animate-pulse" />
  }
);

// Below-the-fold components - loaded dynamically with smaller chunks
const ProductsSlider = dynamic(
  () => import('@/components/ProductsSlider').then(mod => ({ default: mod.ProductsSlider })),
  { 
    loading: () => <div className="h-64 md:h-96" /> 
  }
);

const CategoryProductBoxes = dynamic(
  () => import('@/components/CategoryProductBoxes').then(mod => ({ default: mod.CategoryProductBoxes })),
  { 
    loading: () => <div className="h-64 md:h-96" />
  }
);

const FavoriteCategories = dynamic(
  () => import('@/components/FavoriteCategories').then(mod => ({ default: mod.FavoriteCategories })),
  { 
    loading: () => <div className="h-48 md:h-64" />
  }
);

const RecentReviews = dynamic(
  () => import('@/components/RecentReviews').then(mod => ({ default: mod.RecentReviews })),
  { 
    loading: () => <div className="h-48 md:h-64" />
  }
);

const ProductVideos = dynamic(
  () => import('@/components/ProductVideos').then(mod => ({ default: mod.ProductVideos })),
  { 
    loading: () => <div className="h-64 md:h-96" />
  }
);

// Static generation with ISR for better performance
export const revalidate = 3600; // Revalidate every hour

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Optimized product selection for mobile - reduce data transfer
const productSelectMobile = {
  id: true,
  name: true,
  slug: true,
  price: true,
  regularPrice: true,
  stock: true,
  averageRating: true,
  totalRatings: true,
  image: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  },
  // Only get first image for mobile to reduce payload
  images: {
    orderBy: { order: 'asc' as const },
    take: 1,
    select: {
      url: true
    }
  },
  // Reduce variants for mobile
  variants: {
    where: { isActive: true },
    take: 3, // Reduced from 5
    select: {
      id: true,
      colorName: true,
      colorCode: true,
      stock: true
    }
  }
};

// Cached banners fetch
const getCachedBanners = unstable_cache(
  async () => {
    return prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  },
  ['home-banners'],
  { revalidate: 3600, tags: ['banners'] }
);

// Cached products with reduced payload for mobile
const getCachedProductsMobile = unstable_cache(
  async () => {
    return prisma.product.findMany({
      select: productSelectMobile,
      take: 30, // Reduced from 50 for mobile
      orderBy: {
        updatedAt: 'desc'
      }
    });
  },
  ['home-products-mobile'],
  { revalidate: 3600, tags: ['products'] }
);

// Cached category products with mobile optimization
const getCachedCategoryProductsMobile = unstable_cache(
  async (categorySlug: string) => {
    return prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug
        }
      },
      select: productSelectMobile,
      take: 6, // Reduced from 20 for mobile
      orderBy: {
        createdAt: 'desc'
      }
    });
  },
  ['home-category-products-mobile'],
  { revalidate: 3600, tags: ['products'] }
);

export default async function HomePage() {
  // Run queries in parallel with mobile optimization
  const [
    banners,
    randomProducts,
    cleaningProducts,
    paintingProducts,
    autoMotoProducts
  ] = await Promise.all([
    getCachedBanners(),
    getCachedProductsMobile(),
    getCachedCategoryProductsMobile('sprzet-czyszczacy'),
    getCachedCategoryProductsMobile('malarstwo'),
    getCachedCategoryProductsMobile('auto-moto')
  ]);

  // Shuffle and slice products
  const shuffledProducts = shuffleArray(randomProducts);
  const featuredProducts = shuffledProducts.slice(0, 8);
  const newProducts = shuffledProducts.slice(8, 16);

  // Serialize products with mobile optimizations
  const serializeProduct = (product: any) => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating || 0,
    totalRatings: product.totalRatings || 0,
    slug: product.slug || undefined,
    image: product.image || product.images?.[0]?.url || null,
    variants: (product.variants || []).map((v: any) => ({
      ...v,
      colorName: v.colorName || ""
    }))
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Banner Slider - Critical, loads immediately */}
      <BannerSlider banners={banners} />
      
      {/* Category Product Boxes - Load after banner */}
      <Suspense fallback={<div className="h-64 md:h-96" />}>
        <CategoryProductBoxes 
          cleaningProducts={cleaningProducts.map(serializeProduct)}
          paintingProducts={paintingProducts.map(serializeProduct)}
          autoMotoProducts={autoMotoProducts.map(serializeProduct)}
        />
      </Suspense>
      
      {/* Featured Products */}
      <section className="pt-4 pb-8 md:pb-12">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center text-black">
            Ajánlott termékek
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {featuredProducts.map((product) => (
              <Suspense 
                key={product.id} 
                fallback={<div className="bg-gray-100 rounded-lg h-64 md:h-80 animate-pulse" />}
              >
                <ProductCard 
                  product={serializeProduct(product)} 
                />
              </Suspense>
            ))}
          </div>
        </div>
      </section>
      
      {/* Lazy load below-the-fold content */}
      <Suspense fallback={<div className="h-48 md:h-64" />}>
        <FavoriteCategories />
      </Suspense>
      
      {/* New Products Slider */}
      <Suspense fallback={<div className="h-64 md:h-96" />}>
        <ProductsSlider products={newProducts.map(serializeProduct)} title="Újdonságok" />
      </Suspense>
      
      {/* Product Videos - Lowest priority */}
      <Suspense fallback={<div className="h-64 md:h-96" />}>
        <ProductVideos />
      </Suspense>
      
      {/* Recent Reviews - Lowest priority */}
      <Suspense fallback={<div className="h-48 md:h-64" />}>
        <RecentReviews />
      </Suspense>
    </main>
  );
}