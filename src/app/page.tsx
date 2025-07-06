// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import dynamic from 'next/dynamic';
import { unstable_cache } from 'next/cache';

// Critical above-the-fold components - loaded immediately
import { ProductCard } from '@/components/ProductCard';
import { BannerSlider } from '@/components/BannerSlider';

// Below-the-fold components - loaded dynamically
const ProductsSlider = dynamic(
  () => import('@/components/ProductsSlider').then(mod => ({ default: mod.ProductsSlider })),
  { 
    ssr: true,
    loading: () => <div className="h-96" /> 
  }
);

const CategoryProductBoxes = dynamic(
  () => import('@/components/CategoryProductBoxes').then(mod => ({ default: mod.CategoryProductBoxes })),
  { 
    ssr: true,
    loading: () => <div className="h-96" />
  }
);

const FavoriteCategories = dynamic(
  () => import('@/components/FavoriteCategories').then(mod => ({ default: mod.FavoriteCategories })),
  { 
    ssr: true,
    loading: () => <div className="h-64" />
  }
);

const RecentReviews = dynamic(
  () => import('@/components/RecentReviews').then(mod => ({ default: mod.RecentReviews })),
  { 
    ssr: true,
    loading: () => <div className="h-64" />
  }
);

const ProductVideos = dynamic(
  () => import('@/components/ProductVideos').then(mod => ({ default: mod.ProductVideos })),
  { 
    ssr: true,
    loading: () => <div className="h-96" />
  }
);

// Static generation with ISR for better performance
export const revalidate = 3600; // Revalidate every hour instead of 5 minutes

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Cached product fetch function
const getCachedProducts = unstable_cache(
  async (categorySlug?: string, take: number = 20) => {
    const where = categorySlug ? {
      category: { slug: categorySlug }
    } : {};

    const products = await prisma.product.findMany({
      where,
      select: {
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
        images: {
          orderBy: { order: 'asc' as const },
          take: 1,
          select: {
            url: true
          }
        },
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
      },
      orderBy: { createdAt: 'desc' as const },
      take
    });

    return products;
  },
  ['home-products'],
  { revalidate: 3600, tags: ['products'] }
);

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

export default async function HomePage() {
  // Fetch only banners and general products first (critical data)
  const [banners, allProducts] = await Promise.all([
    getCachedBanners(),
    getCachedProducts(undefined, 50) // Get 50 products total
  ]);

  // Process products in memory instead of making multiple DB queries
  const productsByCategory = {
    cleaning: allProducts.filter(p => p.category?.slug === 'sprzet-czyszczacy'),
    painting: allProducts.filter(p => p.category?.slug === 'malarstwo'),
    autoMoto: allProducts.filter(p => p.category?.slug === 'auto-moto')
  };

  // Shuffle and slice products
  const shuffledProducts = shuffleArray(allProducts);
  const featuredProducts = shuffledProducts.slice(0, 8);
  const newProducts = shuffledProducts.slice(8, 16);

  // Get category products
  const cleaningProducts = shuffleArray(productsByCategory.cleaning).slice(0, 6);
  const paintingProducts = shuffleArray(productsByCategory.painting).slice(0, 6);
  const autoMotoProducts = shuffleArray(productsByCategory.autoMoto).slice(0, 6);

  // Serialize products for client components
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
      {/* Banner Slider - Full width edge to edge */}
      <BannerSlider banners={banners} />
      
      {/* Category Product Boxes */}
      <CategoryProductBoxes 
        cleaningProducts={cleaningProducts.map(serializeProduct)}
        paintingProducts={paintingProducts.map(serializeProduct)}
        autoMotoProducts={autoMotoProducts.map(serializeProduct)}
      />
      
      {/* Featured Products */}
      <section className="pt-4 pb-12">
        <div className="max-w-screen-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center text-black">Polecane produkty</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={serializeProduct(product)} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Favorite Categories Section */}
      <FavoriteCategories />
      
      {/* New Products (Nowości) - Horizontal Slider */}
      <ProductsSlider products={newProducts.map(serializeProduct)} title="Nowości" />
      
      {/* Product Videos Section */}
      <ProductVideos />
      
      {/* Recent Reviews Section */}
      <RecentReviews />
    </main>
  );
}