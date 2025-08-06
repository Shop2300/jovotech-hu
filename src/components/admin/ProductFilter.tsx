// src/components/admin/ProductFilter.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface ProductFilterProps {
  currentSearch?: string;
}

export function ProductFilter({ currentSearch }: ProductFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentSearch || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchTerm(currentSearch || '');
  }, [currentSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set('search', searchTerm);
      params.set('page', '1'); // Reset to first page when searching
    } else {
      params.delete('search');
    }
    
    router.push(`${pathname}?${params.toString()}`);
    
    // Blur input on mobile after search
    if (window.innerWidth < 640) {
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page'); // Reset page when clearing search
    router.push(`${pathname}?${params.toString()}`);
    
    // Refocus input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 w-full sm:max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Hledat produkty..."
          className={`
            w-full pl-10 pr-10 py-2.5 sm:py-2 
            border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            text-sm sm:text-base
            min-h-[44px] sm:min-h-[40px]
            ${isFocused ? 'bg-white' : 'bg-gray-50 sm:bg-white'}
            transition-colors
          `}
          // Mobile-specific attributes
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        
        {/* Search Icon */}
        <button
          type="submit"
          className="absolute left-0 top-0 h-full px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Search"
        >
          <Search size={18} className="sm:w-5 sm:h-5" />
        </button>
        
        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
      
      {/* Mobile Search Hint */}
      {isFocused && searchTerm.length > 0 && searchTerm.length < 3 && (
        <p className="sm:hidden text-xs text-gray-500 mt-1 px-1">
          Zadejte alespoň 3 znaky pro vyhledávání
        </p>
      )}
      
      {/* Current Search Indicator */}
      {currentSearch && !isFocused && (
        <div className="sm:hidden mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-600">
            Výsledky pro: <strong>{currentSearch}</strong>
          </span>
          <button
            type="button"
            onClick={clearSearch}
            className="text-xs text-blue-600 hover:text-blue-700 underline"
          >
            Zrušit
          </button>
        </div>
      )}
    </form>
  );
}