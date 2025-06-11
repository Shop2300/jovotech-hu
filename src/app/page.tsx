// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import { BannerSlider } from '@/components/BannerSlider';
import { ProductsSlider } from '@/components/ProductsSlider';
import { CategoryProductBoxes } from '@/components/CategoryProductBoxes';

// Force dynamic rendering to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch active banners
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  // Fetch featured products with images
  const featuredProducts = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
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

  // Fetch new products (Nowości) with images - Skip the first 8 to avoid duplicates
  const newProducts = await prisma.product.findMany({
    skip: 8,
    take: 8,
    orderBy: { createdAt: 'desc' },
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

  // Fetch products for the three category boxes
  const cleaningProducts = await prisma.product.findMany({
    where: {
      category: {
        slug: 'sprzet-czyszczacy'
      }
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
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

  const paintingProducts = await prisma.product.findMany({
    where: {
      category: {
        slug: 'malarstwo'
      }
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
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

  const autoMotoProducts = await prisma.product.findMany({
    where: {
      category: {
        slug: 'auto-moto'
      }
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
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
      
      {/* New Products (Nowości) - Horizontal Slider */}
      <ProductsSlider products={serializedNewProducts} title="Nowości" />
      
      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Wysokiej jakości produkty</h3>
              <p className="text-gray-600">Starannie wybrane produkty najwyższej jakości</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Szybka dostawa</h3>
              <p className="text-gray-600">Dostawa w ciągu 2-3 dni roboczych</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Bezpieczna płatność</h3>
              <p className="text-gray-600">Płatność kartą lub za pobraniem</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}