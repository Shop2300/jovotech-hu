// src/components/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { StarRating } from './StarRating';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
import { useState, useMemo, memo, useCallback } from 'react';

interface ProductVariant {
  id: string;
  colorName: string;
  colorCode?: string | null;
  stock: number;
  price?: number | null;
  regularPrice?: number | null;
}

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
  availability?: string | null;
  averageRating?: number;
  totalRatings?: number;
  category?: {
    id: string;
    slug: string;
  } | null;
  variants?: ProductVariant[];
}

export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = useMemo(() => 
    hasVariants 
      ? product.variants?.some(v => v.stock > 0) || false
      : product.stock > 0
  , [hasVariants, product.variants, product.stock]);
  
  // Memoize price calculations
  const { displayPrice, displayRegularPrice, bestDiscount } = useMemo(() => {
    let price = product.price;
    let regularPrice = product.regularPrice;
    let discount = product.regularPrice 
      ? calculateDiscount(product.price, product.regularPrice) 
      : 0;
    
    // Check if any variant has a better discount
    if (hasVariants && product.variants) {
      product.variants.forEach(variant => {
        if (variant.price && variant.regularPrice && variant.stock > 0) {
          const variantDiscount = calculateDiscount(Number(variant.price), Number(variant.regularPrice));
          if (variantDiscount > discount) {
            discount = variantDiscount;
            price = Number(variant.price);
            regularPrice = Number(variant.regularPrice);
          }
        }
      });
      
      // If no variant has a regular price, check if any variant has a lower price than base
      if (discount === 0) {
        const lowestPrice = Math.min(
          product.price,
          ...product.variants
            .filter(v => v.price && v.stock > 0)
            .map(v => Number(v.price))
        );
        
        if (lowestPrice < product.price) {
          price = lowestPrice;
          // Check if that variant has a regular price
          const lowestVariant = product.variants.find(v => v.price && Number(v.price) === lowestPrice);
          if (lowestVariant?.regularPrice) {
            regularPrice = Number(lowestVariant.regularPrice);
            discount = calculateDiscount(lowestPrice, Number(lowestVariant.regularPrice));
          }
        }
      }
    }
    
    return {
      displayPrice: price,
      displayRegularPrice: regularPrice,
      bestDiscount: discount
    };
  }, [product, hasVariants]);

  // Determine the product URL
  const productUrl = useMemo(() => 
    product.category?.slug && product.slug
      ? `/${product.category.slug}/${product.slug}`
      : `/products/${product.id}`
  , [product.category?.slug, product.slug, product.id]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent link navigation on mobile
    
    if (hasVariants) {
      router.push(productUrl);
    } else if (inStock) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        regularPrice: product.regularPrice || undefined,
        image: product.image,
        categorySlug: product.category?.slug,
        productSlug: product.slug || undefined
      });
      
      toast.success(`${product.name} dodany do koszyka`);
    }
  }, [hasVariants, inStock, router, productUrl, addItem, product]);

  // Determine availability text based on stock and availability field
  const availabilityText = useMemo(() => {
    if (!inStock) {
      return 'Wyprodáno';
    }
    
    if (product.availability === 'in_stock_supplier') {
      return 'W magazynie u dostawcy';
    }
    
    return 'Na stanie';
  }, [inStock, product.availability]);

  // San Francisco font family
  const sfFontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif';

  return (
    <Link href={productUrl} className="block touch-manipulation">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-sm transition cursor-pointer h-full flex flex-col border border-gray-100">
        {/* 1:1 Aspect Ratio Image Container */}
        <div className="relative w-full pb-[100%] bg-gray-50">
          <div className="absolute inset-0">
            {product.image && !imageError ? (
              <>
                {/* Loading skeleton */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 18vw"
                  className={`object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  quality={75} // Lower quality for mobile to save bandwidth
                  loading="lazy"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 text-sm" style={{ fontFamily: sfFontFamily }}>Obrázek produktu</span>
              </div>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-base md:text-lg" style={{ fontFamily: sfFontFamily }}>Wyprodáno</span>
              </div>
            )}
            {bestDiscount > 0 && inStock && (
              <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-600 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-xs md:text-sm font-bold z-10" style={{ fontFamily: sfFontFamily }}>
                -{bestDiscount}%
              </div>
            )}
          </div>
        </div>

        {/* Product Info Container */}
        <div className="p-3 md:p-4 flex-1 flex flex-col">
          {/* Product Title - Responsive Font Size */}
          <h3 className="text-sm md:text-base font-medium mb-2 md:mb-3 text-gray-900 hover:underline transition line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] text-center" style={{ fontFamily: sfFontFamily }}>
            {product.name}
          </h3>

          {/* Availability - Centered */}
          <div className="text-center mb-2 md:mb-3">
            <span className={`text-xs md:text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: sfFontFamily }}>
              {availabilityText}
            </span>
          </div>

          {/* Price - Responsive Font Size */}
          <div className="text-center mb-3 md:mb-4">
            {displayRegularPrice && displayRegularPrice > displayPrice ? (
              <div>
                <span className="text-xs text-gray-500 line-through block" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(displayRegularPrice)}
                </span>
                <span className="text-base md:text-lg font-bold text-red-600" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(displayPrice)}
                </span>
                {hasVariants && displayPrice !== product.price && (
                  <span className="text-xs text-gray-600 block mt-0.5 md:mt-1" style={{ fontFamily: sfFontFamily }}>
                    od
                  </span>
                )}
              </div>
            ) : (
              <div>
                <span className="text-base md:text-lg font-bold text-black" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(displayPrice)}
                </span>
                {hasVariants && product.variants?.some(v => v.price && v.price !== product.price && v.stock > 0) && (
                  <span className="text-xs text-gray-600 block mt-0.5 md:mt-1" style={{ fontFamily: sfFontFamily }}>
                    od
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart Button - Mobile Optimized */}
          <div className="mt-auto flex justify-center">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-[85%] md:w-[70%] py-2.5 md:py-1.5 px-3 md:px-4 rounded-lg font-medium transition flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base touch-manipulation ${
                inStock 
                  ? 'bg-[#6da306] text-white hover:bg-[#5d8c05] active:scale-95' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ 
                fontFamily: sfFontFamily,
                minHeight: '44px' // Ensure minimum touch target size
              }}
            >
              <ShoppingCart size={16} className="shrink-0" />
              <span className="truncate">
                {hasVariants ? 'Vybrat variantu' : 'Do koszyka'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
});