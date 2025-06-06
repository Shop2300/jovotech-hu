// src/components/RelatedProducts.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId]);

  useEffect(() => {
    // Initial check
    setTimeout(checkScrollButtons, 100);
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [products]);

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

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = 320; // Approximate width of one card
      const scrollAmount = cardWidth * 2; // Scroll 2 cards at a time
      
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-black mb-10 text-center">Powiązane produkty</h2>
        <div className="flex space-x-4 overflow-hidden px-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-72 h-96 bg-gray-200 animate-pulse rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const showArrows = products.length > 4; // Show arrows only if more than 4 products

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-black mb-10 text-center">Powiązane produkty</h2>
      
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
              zIndex: 50 // Increased z-index
            }}
            aria-label="Poprzednie produkty"
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
              zIndex: 50 // Increased z-index
            }}
            aria-label="Następne produkty"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        )}

        {/* Products container - ensure proper stacking context */}
        <div className="overflow-hidden relative" style={{ zIndex: 1 }}>
          <div
            ref={scrollContainerRef}
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
  );
}