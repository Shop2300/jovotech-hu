'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useEffect, useState, useRef } from 'react';

export function CartIcon() {
  const { getTotalItems } = useCart();
  const [totalItems, setTotalItems] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevItemsRef = useRef(0);

  // Update cart count after component mounts to avoid hydration mismatch
  useEffect(() => {
    const items = getTotalItems();
    setTotalItems(items);
    prevItemsRef.current = items;
  }, [getTotalItems]);

  // Subscribe to cart changes
  useEffect(() => {
    const unsubscribe = useCart.subscribe(() => {
      const newTotal = getTotalItems();
      
      // Trigger animation if count increased
      if (newTotal > prevItemsRef.current) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      }
      
      setTotalItems(newTotal);
      prevItemsRef.current = newTotal;
    });

    return unsubscribe;
  }, [getTotalItems]);

  return (
    <Link
      href="/cart"
      className="relative group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 touch-manipulation"
      aria-label={`Koszyk - ${totalItems === 0 ? 'pusty' : `${totalItems} ${totalItems === 1 ? 'produkt' : totalItems < 5 ? 'produkty' : 'produktów'}`}`}
    >
      {/* Icon with subtle animations */}
      <div className="relative">
        <ShoppingBag
          size={36}
          className="text-[#131921] transition-transform duration-200 group-hover:scale-105 w-8 h-8 md:w-[30px] md:h-[30px]"
          strokeWidth={1.5}
        />
        
        {/* Modern minimalist badge */}
        {totalItems > 0 && (
          <div
            className={`
              absolute -top-2.5 -right-2.5
              bg-[#6da306]
              text-white rounded-full
              min-w-[20px] h-[20px]
              flex items-center justify-center
              text-xs font-semibold
              ring-2 ring-white
              transform transition-transform duration-500
              ${isAnimating ? 'scale-110 animate-bounce' : 'scale-100'}
            `}
            style={{
              paddingLeft: totalItems > 9 ? '5px' : '0',
              paddingRight: totalItems > 9 ? '5px' : '0',
            }}
          >
            {totalItems > 99 ? '99+' : totalItems}
          </div>
        )}
      </div>

      {/* Text label with count */}
      <div className="hidden md:flex flex-col items-start">
        <span className="text-xs text-gray-500 leading-tight">Koszyk</span>
        <span className="text-sm font-semibold text-[#131921] leading-tight">
          {totalItems === 0 ? 'pusty' : `${totalItems} ${totalItems === 1 ? 'produkt' : totalItems < 5 ? 'produkty' : 'produktów'}`}
        </span>
      </div>

      {/* Hover effect indicator */}
      <div className={`
        absolute bottom-0 left-1/2 transform -translate-x-1/2
        h-0.5 bg-[#6da306] transition-all duration-300
        ${totalItems > 0 ? 'w-0 group-hover:w-8' : 'w-0'}
      `} />
    </Link>
  );
}