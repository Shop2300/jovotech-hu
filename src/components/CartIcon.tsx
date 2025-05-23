// src/components/CartIcon.tsx
'use client';

import { useCart } from '@/lib/cart';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function CartIcon() {
  const totalItems = useCart((state) => state.getTotalItems());

  return (
    <Link 
      href="/cart" 
      className="relative text-gray-700 hover:text-blue-600 transition"
    >
      <ShoppingCart size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}