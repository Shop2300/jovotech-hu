// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import dynamic from 'next/dynamic';

// Critical above-the-fold components - loaded immediately
import { ProductCard } from '@/components/ProductCard';
import { BannerSlider } from '@/components/BannerSlider';

// Below-the-fold components - loaded dynamically to reduce initial bundle
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

// Enable ISR instead of force-dynamic for caching
export const revalidate = 300; // Revalidate every 5 minutes

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function HomePage() {
  // Optimized product selection to reduce payload
  const productSelect = {
    id: true,
    name: true,
    slug: true,
    price: true,
    regularPrice: true,
    stock: true,
    averageRating: true,
    totalRatings: true,
    image: true, // Keep this if it exists in your schema
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
      take: 5,
      select: {
        id: true,
        colorName: true,
        colorCode: true,
        stock: true
      }
    }
  };

  // Run ALL queries in parallel - reduces time from 9.7s to ~1s
  const [
    banners,
    randomProducts,
    cleaningProducts,
    paintingProducts,
    autoMotoProducts
  ] = await Promise.all([
    // 1. Fetch active banners
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    }),

    // 2. Fetch 50 random products (not ALL) and shuffle in memory
    prisma.product.findMany({
      select: productSelect,
      take: 50, // Only fetch 50, not ALL products
      orderBy: {
        updatedAt: 'desc' // Order by recent updates for variety
      }
    }),

    // 3. Fetch cleaning products
    prisma.product.findMany({
      where: {
        category: {
          slug: 'sprzet-czyszczacy'
        }
      },
      select: productSelect,
      take: 20, // Fetch more than needed for shuffling
      orderBy: {
        createdAt: 'desc'
      }
    }),

    // 4. Fetch painting products
    prisma.product.findMany({
      where: {
        category: {
          slug: 'malarstwo'
        }
      },
      select: productSelect,
      take: 20,
      orderBy: {
        createdAt: 'desc'
      }
    }),

    // 5. Fetch auto-moto products
    prisma.product.findMany({
      where: {
        category: {
          slug: 'auto-moto'
        }
      },
      select: productSelect,
      take: 20,
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);

  // Shuffle products for randomness
  const shuffledProducts = shuffleArray(randomProducts);
  const featuredProducts = shuffledProducts.slice(0, 8);
  const newProducts = shuffledProducts.slice(8, 16);

  // Shuffle category products and take only 6
  const shuffledCleaningProducts = shuffleArray(cleaningProducts).slice(0, 6);
  const shuffledPaintingProducts = shuffleArray(paintingProducts).slice(0, 6);
  const shuffledAutoMotoProducts = shuffleArray(autoMotoProducts).slice(0, 6);

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
        cleaningProducts={shuffledCleaningProducts.map(serializeProduct)}
        paintingProducts={shuffledPaintingProducts.map(serializeProduct)}
        autoMotoProducts={shuffledAutoMotoProducts.map(serializeProduct)}
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