// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import { BannerSlider } from '@/components/BannerSlider';
import { ProductsSlider } from '@/components/ProductsSlider';
import { CategoryProductBoxes } from '@/components/CategoryProductBoxes';
import { FavoriteCategories } from '@/components/FavoriteCategories';
import { RecentReviews } from '@/components/RecentReviews';
import { ProductVideos } from '@/components/ProductVideos';

// Force dynamic rendering to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  // Fetch active banners
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  // Fetch ALL products for random selection
  const allProducts = await prisma.product.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      images: {
        orderBy: { order: 'asc' },
        take: 1,
        select: {
          url: true
        }
      },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          colorName: true,
          colorCode: true,
          stock: true
        }
      }
    }
  });

  // Shuffle all products randomly
  const shuffledProducts = shuffleArray(allProducts);

  // Take first 8 for featured products (Polecane produkty)
  const featuredProducts = shuffledProducts.slice(0, 8);

  // Take next 8 for new products (Nowości) - no overlap with featured
  const newProducts = shuffledProducts.slice(8, 16);

  // Fetch ALL products for the three category boxes, then shuffle and take 6
  const allCleaningProducts = await prisma.product.findMany({
    where: {
      category: {
        slug: 'sprzet-czyszczacy'
      }
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      images: {
        orderBy: { order: 'asc' },
        take: 1,
        select: {
          url: true
        }
      },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          colorName: true,
          colorCode: true,
          stock: true
        }
      }
    }
  });
  const cleaningProducts = shuffleArray(allCleaningProducts).slice(0, 6);

  const allPaintingProducts = await prisma.product.findMany({
    where: {
      category: {
        slug: 'malarstwo'
      }
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      images: {
        orderBy: { order: 'asc' },
        take: 1,
        select: {
          url: true
        }
      },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          colorName: true,
          colorCode: true,
          stock: true
        }
      }
    }
  });
  const paintingProducts = shuffleArray(allPaintingProducts).slice(0, 6);

  const allAutoMotoProducts = await prisma.product.findMany({
    where: {
      category: {
        slug: 'auto-moto'
      }
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      images: {
        orderBy: { order: 'asc' },
        take: 1,
        select: {
          url: true
        }
      },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          colorName: true,
          colorCode: true,
          stock: true
        }
      }
    }
  });
  const autoMotoProducts = shuffleArray(allAutoMotoProducts).slice(0, 6);

  // Serialize products for client components
  const serializedProducts = featuredProducts.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
    slug: product.slug || undefined,
    image: product.image || product.images?.[0]?.url || null,
    variants: product.variants.map(v => ({
      ...v,
      colorName: v.colorName || ""
    }))
  }));

  const serializedNewProducts = newProducts.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
    slug: product.slug || undefined,
    image: product.image || product.images?.[0]?.url || null,
    variants: product.variants.map(v => ({
      ...v,
      colorName: v.colorName || ""
    }))
  }));

  const serializedCleaningProducts = cleaningProducts.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
    slug: product.slug || undefined,
    image: product.image || product.images?.[0]?.url || null,
    variants: product.variants.map(v => ({
      ...v,
      colorName: v.colorName || ""
    }))
  }));

  const serializedPaintingProducts = paintingProducts.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
    slug: product.slug || undefined,
    image: product.image || product.images?.[0]?.url || null,
    variants: product.variants.map(v => ({
      ...v,
      colorName: v.colorName || ""
    }))
  }));

  const serializedAutoMotoProducts = autoMotoProducts.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
    slug: product.slug || undefined,
    image: product.image || product.images?.[0]?.url || null,
    variants: product.variants.map(v => ({
      ...v,
      colorName: v.colorName || ""
    }))
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* Banner Slider - Full width edge to edge */}
      <BannerSlider banners={banners} />
      
      {/* Category Product Boxes - Replaces Categories Section */}
      <CategoryProductBoxes 
        cleaningProducts={serializedCleaningProducts}
        paintingProducts={serializedPaintingProducts}
        autoMotoProducts={serializedAutoMotoProducts}
      />
      
      {/* Featured Products - Reduced top padding */}
      <section className="pt-4 pb-12">
        <div className="max-w-screen-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center text-black">Polecane produkty</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serializedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Favorite Categories Section - NEW */}
      <FavoriteCategories />
      
      {/* New Products (Nowości) - Horizontal Slider */}
      <ProductsSlider products={serializedNewProducts} title="Nowości" />
      
      {/* Product Videos Section - NEW */}
      <ProductVideos />
      
      {/* Recent Reviews Section - NEW */}
      <RecentReviews />
    </main>
  );
}