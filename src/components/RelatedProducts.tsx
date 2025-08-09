'use client';

import { useState, useEffect, useRef, TouchEvent as ReactTouchEvent } from 'react';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug?: string | null;
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
    name: string;
    slug: string;
  } | null;
  variants?: any[];
  images?: any[];
}

interface RelatedProductsProps {
  productId: string;
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
    fetchRelatedProducts();
  }, [productId]);

  useEffect(() => {
    // Initial check
    setTimeout(checkScrollButtons, 100);
    
    const container = scrollContainerRef.current;
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

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/related`);
      if (response.ok) {
        const data = await response.json();
        const serializedProducts = data.map((product: any) => ({
          ...product,
          price: Number(product.price),
          regularPrice: product.regularPrice ? Number(product.regularPrice) : null,
          image: product.images?.[0]?.url || product.image
        }));
        setProducts(serializedProducts);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const updateCurrentIndex = () => {
    const container = scrollContainerRef.current;
    if (container && isMobile) {
      const cardWidth = window.innerWidth * 0.85; // Mobile card width
      const scrollPosition = container.scrollLeft;
      const index = Math.round(scrollPosition / cardWidth);
      setCurrentIndex(index);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = isMobile ? window.innerWidth * 0.85 : 320;
      const scrollAmount = isMobile ? cardWidth : cardWidth * 2;
      
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
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

  if (loading) {
    return (
      <div className="py-6 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-10 text-center px-4">Kapcsolódó termékek</h2>
        <div className="flex space-x-4 overflow-hidden px-4 md:px-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-64 md:w-72 h-80 md:h-96 bg-gray-200 animate-pulse rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const showArrows = !isMobile && products.length > 4;
  const showMobileNav = isMobile && products.length > 1;

  return (
    <div className="py-6 md:py-8">
      <h2 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-10 text-center px-4">Kapcsolódó termékek</h2>
      
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
            aria-label="Előző termékek"
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
            aria-label="Következő termékek"
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
              aria-label="Előző termékek"
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
              aria-label="Következő termékek"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Products container */}
        <div className="overflow-hidden relative" style={{ zIndex: 1 }}>
          <div
            ref={scrollContainerRef}
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
            {products.map((product, index) => (
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
                aria-label={`Ugrás a ${index + 1}. termékhez`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}