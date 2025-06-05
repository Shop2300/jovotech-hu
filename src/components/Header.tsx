// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { CartIcon } from './CartIcon';
import { SearchBar } from './SearchBar';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0" style={{ zIndex: 1000 }}>
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/galaxyskleplogo.png"
              alt="Galaxy Sklep - Odzież - hobby - elektronika"
              width={250}  // Adjust based on your logo's aspect ratio
              height={80}  // Adjust based on your logo's aspect ratio
              className="h-16 w-auto"  // This ensures the logo maintains aspect ratio
              priority
            />
          </Link>

          {/* Center Section - Search Bar with Order Tracking */}
          <div className="hidden md:flex items-center justify-center gap-12 flex-1 px-8">
            {/* Search Bar */}
            <div className="w-full max-w-2xl" style={{ position: 'relative', zIndex: 1001 }}>
              <SearchBar />
            </div>
            
            {/* Order Tracking Link */}
            <Link 
              href="/order-status" 
              className="flex text-gray-700 hover:text-gray-900 text-sm font-medium items-center gap-2 whitespace-nowrap"
            >
              <Package size={16} />
              Śledzenie zamówienia
            </Link>
          </div>

          {/* Cart Icon */}
          <CartIcon />
        </div>

        {/* Mobile Section */}
        <div className="md:hidden pb-4">
          {/* Search Bar - Mobile */}
          <div className="pb-3" style={{ position: 'relative', zIndex: 1001 }}>
            <SearchBar />
          </div>
          
          {/* Order Tracking Link - Mobile */}
          <div className="border-t pt-3">
            <Link 
              href="/order-status" 
              className="flex text-gray-700 hover:text-gray-900 text-sm font-medium items-center gap-2"
            >
              <Package size={16} />
              Śledzenie zamówienia
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}