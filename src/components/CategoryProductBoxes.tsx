// src/components/CategoryProductBoxes.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  price: number;
  regularPrice?: number | null;
  stock: number;
  image: string | null;
  brand?: string | null;
  averageRating?: number;
  totalRatings?: number;
  category?: {
    id: string;
    slug: string;
  } | null;
  variants?: any[];
}

interface CategoryProductBoxesProps {
  cleaningProducts: Product[];
  paintingProducts: Product[];
  autoMotoProducts: Product[];
}

interface CategoryBoxProps {
  title: string;
  subtitle: string;
  icon: string;
  products: Product[];
  bgColor: string;
  categorySlug: string;
  buttonColor: string;
}

// Mini Product Card Component for the boxes
function MiniProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  
  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = hasVariants ? product.variants?.some(v => v.stock > 0) || false
    : product.stock > 0;
    
  const discount = product.regularPrice 
    ? calculateDiscount(product.price, product.regularPrice) 
    : 0;

  const productUrl = product.category?.slug && product.slug
    ? `/${product.category.slug}/${product.slug}`
    : `/products/${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (hasVariants) {
      router.push(productUrl);
    } else if (inStock) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        regularPrice: product.regularPrice || undefined, // Add regular price
        image: product.image,
        categorySlug: product.category?.slug, // Add category slug
        productSlug: product.slug || undefined // Add product slug
      });
      
      toast.success(`${product.name} został dodany do koszyka`);
    }
  };

  const sfFontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif';

  return (
    <Link href={productUrl} className="block">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-sm transition cursor-pointer h-full flex flex-col border border-gray-100">
        {/* Square Image Container */}
        <div className="relative w-full pb-[100%]">
          <div className="absolute inset-0">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-contain bg-gray-50" 
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-sm" style={{ fontFamily: sfFontFamily }}>Zdjęcie</span>
              </div>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: sfFontFamily }}>Wyprzedane</span>
              </div>
            )}
            {discount > 0 && inStock && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold" style={{ fontFamily: sfFontFamily }}>
                -{discount}%
              </div>
            )}
          </div>
        </div>

        {/* Product Info - More Compact */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Product Title - Smaller */}
          <h3 className="text-sm font-medium mb-2 text-gray-900 line-clamp-2 min-h-[2.5rem] text-center" style={{ fontFamily: sfFontFamily }}>
            {product.name}
          </h3>

          {/* Price - Smaller */}
          <div className="text-center mb-2">
            {product.regularPrice && product.regularPrice > product.price ? (
              <div>
                <span className="text-xs text-gray-500 line-through block" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(product.regularPrice)}
                </span>
                <span className="text-base font-bold text-red-600" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-black" style={{ fontFamily: sfFontFamily }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button - Smaller */}
          <div className="mt-auto flex justify-center">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full py-1.5 px-3 rounded-md text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                inStock 
                  ? 'bg-[#6da306] text-white hover:bg-[#5d8c05]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ fontFamily: sfFontFamily }}
            >
              <ShoppingCart size={14} />
              {hasVariants ? 'Wybierz' : 'Do koszyka'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategoryBox({ title, subtitle, icon, products, bgColor, categorySlug, buttonColor }: CategoryBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Add CSS animations for icons
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sweep {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      @keyframes paint {
        0%, 100% { transform: rotate(-10deg) scale(1); }
        50% { transform: rotate(10deg) scale(1.1); }
      }
      @keyframes wrench {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-20deg); }
        75% { transform: rotate(20deg); }
      }
      .icon-sweep { animation: sweep 2s ease-in-out infinite; display: inline-block; }
      .icon-paint { animation: paint 2.5s ease-in-out infinite; display: inline-block; }
      .icon-wrench { animation: wrench 3s ease-in-out infinite; display: inline-block; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    setTimeout(checkScrollButtons, 100);
    
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [products]);

  const checkScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 191; // Width of mini cards (5% bigger than 182px)
      const gap = 16; // Gap between cards (gap-4)
      const scrollAmount = (cardWidth + gap) * 2; // Scroll by 2 cards
      const currentScroll = scrollRef.current.scrollLeft;
      
      scrollRef.current.scrollTo({
        left: direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const showArrows = products.length > 3; // Show arrows if more than 3 products

  return (
    <div className={`${bgColor} rounded-md p-6 border border-gray-200`}>
      <div className="mb-5 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
        <Link 
          href={`/category/${categorySlug}`}
          className="inline-flex items-center gap-1.5 px-8 py-2.5 text-gray-700 rounded-full transition-all duration-200 hover:opacity-90 text-[13px]"
          style={{ backgroundColor: buttonColor }}
        >
          <span className={`text-[13px] ${
            categorySlug === 'sprzet-czyszczacy' ? 'icon-sweep' : 
            categorySlug === 'malarstwo' ? 'icon-paint' : 
            categorySlug === 'auto-moto' ? 'icon-wrench' : ''
          }`}>
            {icon}
          </span>
          <span className="font-semibold text-[13px]">{subtitle}</span>
          <span className="text-gray-600 text-[13px] font-semibold">›</span>
        </Link>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="flex-none" style={{ width: '191px' }}>
                  <MiniProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 text-gray-500">
                <p>Brak produktów w tej kategorii</p>
              </div>
            )}
          </div>
        </div>

        {showArrows && (
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute -left-4 top-[105px] -translate-y-1/2 bg-white rounded-full p-1.5 transition-all duration-200 z-10 ${
              canScrollLeft 
                ? 'opacity-100 hover:scale-[1.05] cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            style={{
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
            aria-label="Poprzednie produkty"
          >
            <ChevronLeft size={18} className="text-gray-700" />
          </button>
        )}

        {showArrows && (
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute -right-4 top-[105px] -translate-y-1/2 bg-white rounded-full p-1.5 transition-all duration-200 z-10 ${
              canScrollRight 
                ? 'opacity-100 hover:scale-[1.05] cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            style={{
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
            aria-label="Następne produkty"
          >
            <ChevronRight size={18} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
}

export function CategoryProductBoxes({ cleaningProducts, paintingProducts, autoMotoProducts }: CategoryProductBoxesProps) {
  return (
    <section className="pt-12 pb-6 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategoryBox
            title="Sprzęt Czyszczący"
            subtitle="Czysta Perfekcja"
            icon="🧹"
            products={cleaningProducts}
            bgColor="bg-gray-50/50"
            categorySlug="sprzet-czyszczacy"
            buttonColor="#feebeb"
          />
          
          <CategoryBox
            title="Malarstwo"
            subtitle="Sztuka w Kolorze"
            icon="🎨"
            products={paintingProducts}
            bgColor="bg-gray-50/50"
            categorySlug="malarstwo"
            buttonColor="#fff6dd"
          />
          
          <CategoryBox
            title="Auto-Moto"
            subtitle="Dla Twojego Pojazdu"
            icon="🔧"
            products={autoMotoProducts}
            bgColor="bg-gray-50/50"
            categorySlug="auto-moto"
            buttonColor="#fff6dd"
          />
        </div>
      </div>
    </section>
  );
}