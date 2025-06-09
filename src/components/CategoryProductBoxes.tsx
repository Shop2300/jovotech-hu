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
  buttonBgColor: string;
  categorySlug: string;
}

function CategoryBox({ title, subtitle, icon, products, bgColor, buttonBgColor, categorySlug }: CategoryBoxProps) {
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
    <div className={`${bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <div className="mb-5 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
        <Link 
          href={`/category/${categorySlug}`}
          className={`inline-flex items-center gap-2 px-4 py-2 ${buttonBgColor} text-white rounded-full hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-sm text-sm`}
        >
          <span className="text-base">{icon}</span>
          <span className="font-medium">{subtitle}</span>
          <span className="text-white/80">›</span>
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
            className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur shadow-lg rounded-full p-2 transition-all duration-200 z-10 ${
              canScrollLeft 
                ? 'opacity-100 hover:shadow-xl hover:scale-110 hover:bg-white cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Poprzednie produkty"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}

        {showArrows && (
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur shadow-lg rounded-full p-2 transition-all duration-200 z-10 ${
              canScrollRight 
                ? 'opacity-100 hover:shadow-xl hover:scale-110 hover:bg-white cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Następne produkty"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
}

export function CategoryProductBoxes({ cleaningProducts, paintingProducts, autoMotoProducts }: CategoryProductBoxesProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategoryBox
            title="Sprzęt Czyszczący"
            subtitle="Czysta Perfekcja"
            icon="🧹"
            products={cleaningProducts}
            bgColor="bg-green-50 border border-green-100"
            buttonBgColor="bg-green-600 hover:bg-green-700"
            categorySlug="sprzet-czyszczacy"
          />
          
          <CategoryBox
            title="Malarstwo"
            subtitle="Sztuka w Kolorze"
            icon="🎨"
            products={paintingProducts}
            bgColor="bg-yellow-50 border border-yellow-100"
            buttonBgColor="bg-yellow-600 hover:bg-yellow-700"
            categorySlug="malarstwo"
          />
          
          <CategoryBox
            title="Auto-Moto"
            subtitle="Dla Twojego Pojazdu"
            icon="🔧"
            products={autoMotoProducts}
            bgColor="bg-blue-50 border border-blue-100"
            buttonBgColor="bg-blue-600 hover:bg-blue-700"
            categorySlug="auto-moto"
          />
        </div>
      </div>
    </section>
  );
}