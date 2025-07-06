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
import { useState } from 'react';

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
  averageRating?: number;
  totalRatings?: number;
  category?: {
    id: string;
    slug: string;
  } | null;
  variants?: ProductVariant[];
}

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  
  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = hasVariants ? product.variants?.some(v => v.stock > 0) || false
    : product.stock > 0;
  
  // Calculate the best discount among variants and base product
  let displayPrice = product.price;
  let displayRegularPrice = product.regularPrice;
  let bestDiscount = product.regularPrice 
    ? calculateDiscount(product.price, product.regularPrice) 
    : 0;
  
  // Check if any variant has a better discount
  if (hasVariants && product.variants) {
    product.variants.forEach(variant => {
      if (variant.price && variant.regularPrice && variant.stock > 0) {
        const variantDiscount = calculateDiscount(Number(variant.price), Number(variant.regularPrice));
        if (variantDiscount > bestDiscount) {
          bestDiscount = variantDiscount;
          displayPrice = Number(variant.price);
          displayRegularPrice = Number(variant.regularPrice);
        }
      }
    });
    
    // If no variant has a regular price, check if any variant has a lower price than base
    if (bestDiscount === 0) {
      const lowestPrice = Math.min(
        product.price,
        ...product.variants
          .filter(v => v.price && v.stock > 0)
          .map(v => Number(v.price))
      );
      
      if (lowestPrice < product.price) {
        displayPrice = lowestPrice;
        // Check if that variant has a regular price
        const lowestVariant = product.variants.find(v => v.price && Number(v.price) === lowestPrice);
        if (lowestVariant?.regularPrice) {
          displayRegularPrice = Number(lowestVariant.regularPrice);
          bestDiscount = calculateDiscount(lowestPrice, Number(lowestVariant.regularPrice));
        }
      }
    }
  }

  // Determine the product URL
  const productUrl = product.category?.slug && product.slug
    ? `/${product.category.slug}/${product.slug}`
    : `/products/${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    
    if (hasVariants) {
      // If product has variants, redirect to detail page
      router.push(productUrl);
    } else if (inStock) {
      // If no variants and in stock, add to cart directly
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        regularPrice: product.regularPrice || undefined,
        image: product.image,
        categorySlug: product.category?.slug,
        productSlug: product.slug || undefined
      });
      
      // Show success notification with toast
      toast.success(`${product.name} dodany do koszyka`);
    }
  };

  // San Francisco font family
  const sfFontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif';

  return (
    <Link href={productUrl} className="block">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-sm transition cursor-pointer h-full flex flex-col border border-gray-100">
        {/* 1:1 Aspect Ratio Image Container */}
        <div className="relative w-full pb-[100%]">
          <div className="absolute inset-0">
            {product.image && !imageError ? (
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-contain"
                quality={85}
                onError={() => setImageError(true)}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600" style={{ fontFamily: sfFontFamily }}>Obrázek produktu</span>
              </div>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: sfFontFamily }}>Wyprodáno</span>
              </div>
            )}
            {bestDiscount > 0 && inStock && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold z-10" style={{ fontFamily: sfFontFamily }}>
                -{bestDiscount}%
              </div>
            )}
          </div>
        </div>

        {/* Product Info Container */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Product Title - Smaller Font Size */}
          <h3 className="text-base font-medium mb-3 text-gray-900 hover:underline transition line-clamp-2 min-h-[3rem] text-center" style={{ fontFamily: sfFontFamily }}>
            {product.name}
          </h3>

          {/* Availability - Centered */}
          <div className="text-center mb-3">
            <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: sfFontFamily }}>
              {inStock ? 'Na stanie' : 'Wyprodáno'}
            </span>
          </div>

          {/* Price - Centered with SMALLER FONT SIZE */}
          <div className="text-center mb-4">
            {displayRegularPrice && displayRegularPrice > displayPrice ? (
              <div>
                <span className="text-xs text-gray-500 line-through block" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(displayRegularPrice)}
                </span>
                <span className="text-lg font-bold text-red-600" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(displayPrice)}
                </span>
                {hasVariants && displayPrice !== product.price && (
                  <span className="text-xs text-gray-600 block mt-1" style={{ fontFamily: sfFontFamily }}>
                    od
                  </span>
                )}
              </div>
            ) : (
              <div>
                <span className="text-lg font-bold text-black" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(displayPrice)}
                </span>
                {hasVariants && product.variants?.some(v => v.price && v.price !== product.price && v.stock > 0) && (
                  <span className="text-xs text-gray-600 block mt-1" style={{ fontFamily: sfFontFamily }}>
                    od
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart Button - Green Color, Shorter Height, and 70% Width */}
          <div className="mt-auto flex justify-center">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-[70%] py-1.5 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                inStock 
                  ? 'bg-[#6da306] text-white hover:bg-[#5d8c05]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ fontFamily: sfFontFamily }}
            >
              <ShoppingCart size={16} />
              {hasVariants ? 'Vybrat variantu' : 'Do koszyka'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}