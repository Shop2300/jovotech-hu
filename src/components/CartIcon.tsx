// src/components/CartIcon.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const { getTotalItems } = useCart();
  const [totalItems, setTotalItems] = useState(0);

  // Update cart count after component mounts to avoid hydration mismatch
  useEffect(() => {
    setTotalItems(getTotalItems());
  }, [getTotalItems]);

  // Subscribe to cart changes
  useEffect(() => {
    const unsubscribe = useCart.subscribe(() => {
      setTotalItems(getTotalItems());
    });
    
    return unsubscribe;
  }, [getTotalItems]);

  return (
    <Link 
      href="/cart" 
      className="relative flex items-center text-gray-600 hover:text-gray-900"
      title="Koszyk"
    >
      <ShoppingCart size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {totalItems}
        </span>
      )}
    </Link>
  );
}