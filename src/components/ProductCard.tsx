// src/components/ProductCard.tsx
'use client';

import Link from 'next/link';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { StarRating } from './StarRating';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart'; // Changed from '@/contexts/CartContext'
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

interface ProductVariant {
  id: string;
  colorName: string;
  colorCode?: string | null;
  stock: number;
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
  const { addItem } = useCart(); // Using addItem from Zustand store
  
  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = hasVariants ? product.variants?.some(v => v.stock > 0) || false
    : product.stock > 0;
    
  const discount = product.regularPrice 
    ? calculateDiscount(product.price, product.regularPrice) 
    : 0;

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
        regularPrice: product.regularPrice || undefined, // Add regular price
        image: product.image,
        categorySlug: product.category?.slug, // Add category slug
        productSlug: product.slug || undefined // Add product slug
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
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-contain bg-gray-50" 
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
            {discount > 0 && inStock && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold" style={{ fontFamily: sfFontFamily }}>
                -{discount}%
              </div>
            )}
          </div>
        </div>

        {/* Product Info Container */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Product Title - Centered and Less Bold */}
          <h3 className="text-lg font-medium mb-3 text-gray-900 hover:underline transition line-clamp-2 min-h-[3.5rem] text-center" style={{ fontFamily: sfFontFamily }}>
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
            {product.regularPrice && product.regularPrice > product.price ? (
              <div>
                <span className="text-xs text-gray-500 line-through block" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(product.regularPrice)}
                </span>
                <span className="text-lg font-bold text-red-600" style={{ fontFamily: sfFontFamily }}>
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-black" style={{ fontFamily: sfFontFamily }}>
                {formatPrice(product.price)}
              </span>
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