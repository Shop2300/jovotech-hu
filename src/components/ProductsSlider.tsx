// src/components/ProductsSlider.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

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

interface ProductsSliderProps {
  products: Product[];
  title: string;
}

export function ProductsSlider({ products, title }: ProductsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    // Initial check
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
      const cardWidth = 320; // Approximate width of one card
      const scrollAmount = cardWidth * 2; // Scroll 2 cards at a time
      const currentScroll = scrollRef.current.scrollLeft;
      
      scrollRef.current.scrollTo({
        left: direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  const showArrows = products.length > 4; // Show arrows only if more than 4 products

  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-center text-black">{title}</h2>
        
        <div className="relative mx-auto" style={{ maxWidth: '1400px' }}>
          {/* Left Arrow - Higher z-index to ensure it's on top */}
          {showArrows && (
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`absolute -left-12 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 transition-all duration-200 ${
                canScrollLeft 
                  ? 'opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer' 
                  : 'opacity-30 cursor-not-allowed'
              }`}
              style={{ 
                border: '1px solid #e5e7eb',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50 // High z-index
              }}
              aria-label="Předchozí produkty"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
          )}

          {/* Right Arrow - Higher z-index to ensure it's on top */}
          {showArrows && (
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`absolute -right-12 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 transition-all duration-200 ${
                canScrollRight 
                  ? 'opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer' 
                  : 'opacity-30 cursor-not-allowed'
              }`}
              style={{ 
                border: '1px solid #e5e7eb',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50 // High z-index
              }}
              aria-label="Další produkty"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          )}

          {/* Products Container - ensure proper stacking context */}
          <div className="overflow-hidden relative" style={{ zIndex: 1 }}>
            <div 
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-none" style={{ width: '300px' }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}