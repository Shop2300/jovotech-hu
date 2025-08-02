// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { CartIcon } from './CartIcon';
import { SearchBar } from './SearchBar';
import Image from 'next/image';
import { memo, useState, useEffect } from 'react';

export const Header = memo(function Header() {
  // Detect if we're on mobile for conditional loading
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    // Debounced resize handler for performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center touch-manipulation"
            prefetch={false}
          >
            <Image
              src="/images/galaxyskleplogo.png"
              alt="Galaxy Sklep - Odzież - hobby - elektronika"
              width={isMobile ? 180 : 250}
              height={isMobile ? 58 : 80}
              className="h-12 sm:h-16 w-auto"
              priority={!isMobile} // Only prioritize on desktop
              loading={isMobile ? 'lazy' : 'eager'} // Lazy load on mobile
              quality={isMobile ? 75 : 85} // Lower quality on mobile to save bandwidth
            />
          </Link>

          {/* Center Section - Search Bar with Order Tracking */}
          <div className="hidden md:flex items-center justify-center gap-12 flex-1 px-8">
            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <SearchBar />
            </div>
            
            {/* Order Tracking Link */}
            <Link 
              href="/order-status" 
              className="flex text-gray-700 hover:text-gray-900 text-sm font-medium items-center gap-2 whitespace-nowrap transition-colors touch-manipulation"
              prefetch={false}
            >
              <Package size={16} />
              Śledzenie zamówienia
            </Link>
          </div>

          {/* Cart Icon */}
          <CartIcon />
        </div>

        {/* Mobile Section */}
        <div className="md:hidden pb-3">
          {/* Search Bar - Mobile */}
          <div className="pb-3">
            <SearchBar />
          </div>
          
          {/* Order Tracking Link - Mobile */}
          <div className="border-t pt-3">
            <Link 
              href="/order-status" 
              className="flex text-gray-700 hover:text-gray-900 text-sm font-medium items-center gap-2 py-2 touch-manipulation"
              prefetch={false}
              // Increased touch target for mobile
              style={{ minHeight: '44px' }}
            >
              <Package size={20} className="shrink-0" />
              <span>Śledzenie zamówienia</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
});