// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import { BannerSlider } from '@/components/BannerSlider';
import { ProductsSlider } from '@/components/ProductsSlider';
import Link from 'next/link';

// Static categories configuration
const staticCategories = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'elektronika',
    icon: '🔋'
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'obleceni',
    icon: '👚'
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'dum-zahrada',
    icon: '🏠'
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sport',
    icon: '⚽️'
  },
  {
    id: '5',
    name: 'Poker',
    slug: 'poker',
    icon: '♣️'
  },
  {
    id: '6',
    name: 'Telefony',
    slug: 'telefony',
    icon: '📲'
  }
];

export default async function HomePage() {
  // Fetch active banners
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  // Fetch featured products
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

  // Fetch new products (Novinky) - Skip the first 8 to avoid duplicates
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

  // Convert Decimal to number for client components
  const serializedProducts = featuredProducts.map(product => ({
    ...product,
    price: Number(product.price),
    regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
    slug: product.slug || undefined,
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
    slug: product.slug || undefined
  ,
    variants: product.variants.map(v => ({
      ...v,
      colorName: v.colorName || ""
    }))
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* Banner Slider - Full width edge to edge */}
      <BannerSlider banners={banners} />
      
      {/* Categories Section - Now using static categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center text-black">Kategorie produktů</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {staticCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-screen-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center text-black">Doporučené produkty</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serializedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* New Products (Novinky) - Horizontal Slider */}
      <ProductsSlider products={serializedNewProducts} title="Novinky" />
      
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
              <h3 className="text-lg font-semibold mb-2 text-black">Kvalitní produkty</h3>
              <p className="text-gray-600">Pečlivě vybrané produkty nejvyšší kvality</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Rychlé doručení</h3>
              <p className="text-gray-600">Doručení do 2-3 pracovních dnů</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black">Bezpečná platba</h3>
              <p className="text-gray-600">Platba kartou nebo na dobírku</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}