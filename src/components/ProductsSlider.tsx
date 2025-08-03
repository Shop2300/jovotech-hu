'use client';

import { useRef, useState, useEffect, TouchEvent as ReactTouchEvent } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Initial check
    setTimeout(checkScrollButtons, 100);
    
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      container.addEventListener('scroll', updateCurrentIndex);
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        container.removeEventListener('scroll', updateCurrentIndex);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [products, isMobile]);

  const checkScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const updateCurrentIndex = () => {
    const container = scrollRef.current;
    if (container && isMobile) {
      const cardWidth = window.innerWidth * 0.85; // Mobile card width
      const scrollPosition = container.scrollLeft;
      const index = Math.round(scrollPosition / cardWidth);
      setCurrentIndex(index);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = isMobile ? window.innerWidth * 0.85 : 320;
      const scrollAmount = isMobile ? cardWidth : cardWidth * 2;
      const currentScroll = scrollRef.current.scrollLeft;
      
      scrollRef.current.scrollTo({
        left: direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (container && isMobile) {
      const cardWidth = window.innerWidth * 0.85;
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: ReactTouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: ReactTouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canScrollRight) {
      scroll('right');
    }
    if (isRightSwipe && canScrollLeft) {
      scroll('left');
    }
  };

  if (products.length === 0) return null;

  const showArrows = !isMobile && products.length > 4;
  const showMobileNav = isMobile && products.length > 1;

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center text-black">{title}</h2>
        
        <div className="relative mx-auto" style={{ maxWidth: isMobile ? '100%' : '1400px' }}>
          {/* Desktop Left Arrow */}
          {showArrows && (
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`absolute -left-12 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 transition-all duration-200 hidden md:flex ${
                canScrollLeft 
                  ? 'opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer' 
                  : 'opacity-30 cursor-not-allowed'
              }`}
              style={{ 
                border: '1px solid #e5e7eb',
                width: '48px',
                height: '48px',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50
              }}
              aria-label="Przedchozí produkty"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
          )}

          {/* Desktop Right Arrow */}
          {showArrows && (
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`absolute -right-12 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 transition-all duration-200 hidden md:flex ${
                canScrollRight 
                  ? 'opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer' 
                  : 'opacity-30 cursor-not-allowed'
              }`}
              style={{ 
                border: '1px solid #e5e7eb',
                width: '48px',
                height: '48px',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50
              }}
              aria-label="Další produkty"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          )}

          {/* Mobile Navigation Arrows */}
          {showMobileNav && (
            <>
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full flex md:hidden items-center justify-center transition-all duration-200 touch-manipulation border border-gray-300 ${
                  canScrollLeft 
                    ? 'opacity-90' 
                    : 'opacity-30'
                }`}
                style={{ width: '40px', height: '40px', zIndex: 50 }}
                aria-label="Předchozí produkty"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full flex md:hidden items-center justify-center transition-all duration-200 touch-manipulation border border-gray-300 ${
                  canScrollRight 
                    ? 'opacity-90' 
                    : 'opacity-30'
                }`}
                style={{ width: '40px', height: '40px', zIndex: 50 }}
                aria-label="Další produkty"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Products Container */}
          <div className="overflow-hidden relative" style={{ zIndex: 1 }}>
            <div 
              ref={scrollRef}
              className={`flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 ${
                isMobile ? 'px-8' : ''
              }`}
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: isMobile ? 'x mandatory' : 'none'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex-none" 
                  style={{ 
                    width: isMobile ? '85vw' : '300px',
                    maxWidth: isMobile ? '400px' : '300px',
                    scrollSnapAlign: isMobile ? 'center' : 'none'
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Swipe Indicators */}
          {showMobileNav && (
            <div className="flex md:hidden justify-center gap-1.5 mt-4">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`transition-all ${
                    index === currentIndex 
                      ? 'w-6 h-2 bg-[#8bc34a]' 
                      : 'w-2 h-2 bg-gray-300'
                  } rounded-full`}
                  aria-label={`Přejít k produktu ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}