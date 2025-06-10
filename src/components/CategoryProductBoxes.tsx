// src/components/CategoryProductBoxes.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import Link from 'next/link';

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
}

function CategoryBox({ title, subtitle, icon, products, bgColor, categorySlug }: CategoryBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      const cardWidth = 260;
      const scrollAmount = cardWidth;
      const currentScroll = scrollRef.current.scrollLeft;
      
      scrollRef.current.scrollTo({
        left: direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const showArrows = products.length > 2;

  return (
    <div className={`${bgColor} rounded-md p-6 border border-gray-200`}>
      <div className="mb-5 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
        <Link 
          href={`/category/${categorySlug}`}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 text-gray-700 rounded-full transition-all duration-200 transform hover:scale-105 text-[13px] relative overflow-hidden group"
          style={{
            // Main gradient background - lighter grey
            background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8e8e8 100%)',
            // Very subtle shadow for minimal depth
            boxShadow: `
              0 1px 0 rgba(255,255,255,0.9) inset,
              0 -1px 0 rgba(0,0,0,0.03) inset,
              0 1px 1px rgba(0,0,0,0.06),
              0 2px 2px rgba(0,0,0,0.02)
            `,
            // Subtle border for definition
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {/* Glossy shine overlay */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(255,255,255,0.7) 0%,
                rgba(255,255,255,0.3) 45%,
                rgba(255,255,255,0) 50%,
                rgba(0,0,0,0.06) 100%
              )`,
            }}
          />
          
          {/* Extra gloss highlight at the top */}
          <div 
            className="absolute top-0 left-0 right-0 h-[50%] rounded-t-full pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)',
              filter: 'blur(1px)',
            }}
          />
          
          {/* Content with animated icon */}
          <span 
            className={`text-[13px] relative z-10 inline-block
              ${categorySlug === 'sprzet-czyszczacy' ? 'icon-sweep' : ''}
              ${categorySlug === 'malarstwo' ? 'icon-paint' : ''}
              ${categorySlug === 'auto-moto' ? 'icon-wrench' : ''}
            `}
          >
            {icon}
          </span>
          <span className="font-semibold text-[13px] relative z-10">{subtitle}</span>
          <span className="text-gray-600 text-[13px] font-semibold relative z-10">›</span>
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
                <div key={product.id} className="flex-none" style={{ width: '250px' }}>
                  <ProductCard product={product} />
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
            className={`absolute left-1 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-200 z-10 ${
              canScrollLeft 
                ? 'opacity-100 hover:scale-110 cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            style={{
              background: canScrollLeft 
                ? 'linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%)'
                : 'linear-gradient(to bottom, #f8f8f8 0%, #e8e8e8 100%)',
              boxShadow: canScrollLeft
                ? `
                  0 1px 0 rgba(255,255,255,0.9) inset,
                  0 -1px 0 rgba(0,0,0,0.03) inset,
                  0 1px 1px rgba(0,0,0,0.06),
                  0 1px 2px rgba(0,0,0,0.02)
                `
                : '0 1px 1px rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
            aria-label="Poprzednie produkty"
          >
            <div className="relative">
              {/* Glossy overlay for arrow buttons */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: `linear-gradient(
                    to bottom,
                    rgba(255,255,255,0.6) 0%,
                    rgba(255,255,255,0.2) 45%,
                    transparent 50%,
                    rgba(0,0,0,0.05) 100%
                  )`,
                }}
              />
              <ChevronLeft size={22} className="text-gray-700 relative z-10" />
            </div>
          </button>
        )}

        {showArrows && (
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-200 z-10 ${
              canScrollRight 
                ? 'opacity-100 hover:scale-110 cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            style={{
              background: canScrollRight 
                ? 'linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%)'
                : 'linear-gradient(to bottom, #f8f8f8 0%, #e8e8e8 100%)',
              boxShadow: canScrollRight
                ? `
                  0 1px 0 rgba(255,255,255,0.9) inset,
                  0 -1px 0 rgba(0,0,0,0.03) inset,
                  0 1px 1px rgba(0,0,0,0.06),
                  0 1px 2px rgba(0,0,0,0.02)
                `
                : '0 1px 1px rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
            aria-label="Następne produkty"
          >
            <div className="relative">
              {/* Glossy overlay for arrow buttons */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: `linear-gradient(
                    to bottom,
                    rgba(255,255,255,0.6) 0%,
                    rgba(255,255,255,0.2) 45%,
                    transparent 50%,
                    rgba(0,0,0,0.05) 100%
                  )`,
                }}
              />
              <ChevronRight size={22} className="text-gray-700 relative z-10" />
            </div>
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
          />
          
          <CategoryBox
            title="Malarstwo"
            subtitle="Sztuka w Kolorze"
            icon="🎨"
            products={paintingProducts}
            bgColor="bg-gray-50/50"
            categorySlug="malarstwo"
          />
          
          <CategoryBox
            title="Auto-Moto"
            subtitle="Dla Twojego Pojazdu"
            icon="🔧"
            products={autoMotoProducts}
            bgColor="bg-gray-50/50"
            categorySlug="auto-moto"
          />
        </div>
      </div>
    </section>
  );
}