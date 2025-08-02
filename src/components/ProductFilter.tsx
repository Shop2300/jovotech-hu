// src/components/ProductFilter.tsx
'use client';

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Filter, Star, TrendingUp, Tag, Gem, SortAsc } from 'lucide-react';

export type SortOption = 'recommended' | 'bestselling' | 'cheapest' | 'expensive' | 'alphabetical';

interface ProductFilterProps {
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
  productCount: number;
  startProduct?: number;
  endProduct?: number;
}

interface DropdownPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  targetRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

const DropdownPortal = memo(function DropdownPortal({ children, isOpen, targetRef, onClose }: DropdownPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    
    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const dropdownHeight = 250; // Approximate height
        
        // On mobile, check if dropdown fits below
        if (window.innerWidth < 768) {
          if (spaceBelow < dropdownHeight) {
            // Position above the button on mobile if not enough space below
            setPosition({
              top: rect.top + window.scrollY - dropdownHeight - 8,
              right: window.innerWidth - rect.right + window.scrollX
            });
          } else {
            setPosition({
              top: rect.bottom + window.scrollY,
              right: window.innerWidth - rect.right + window.scrollX
            });
          }
        } else {
          // Desktop positioning
          setPosition({
            top: rect.bottom + window.scrollY,
            right: window.innerWidth - rect.right + window.scrollX
          });
        }
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [targetRef, isOpen]);

  useEffect(() => {
    if (isOpen && mounted) {
      const style = document.createElement('style');
      style.innerHTML = `
        .product-filter-dropdown {
          z-index: 999999 !important;
          position: absolute !important;
          background: white !important;
        }
        .product-filter-overlay {
          z-index: 999998 !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isOpen, mounted]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 product-filter-overlay bg-black/20 md:bg-transparent" 
        onClick={onClose}
      />
      <div
        className={`product-filter-dropdown rounded-lg border border-gray-200 mt-1 ${
          isMobile ? 'w-[calc(100vw-2rem)] max-w-sm' : 'w-56'
        }`}
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
      >
        {children}
      </div>
    </>,
    document.body
  );
});

const sortOptions = [
  { value: 'recommended' as SortOption, label: 'Polecane', icon: Star },
  { value: 'bestselling' as SortOption, label: 'Najczęściej kupowane', icon: TrendingUp },
  { value: 'cheapest' as SortOption, label: 'Najtańsze', icon: Tag },
  { value: 'expensive' as SortOption, label: 'Najdroższe', icon: Gem },
  { value: 'alphabetical' as SortOption, label: 'Alfabetycznie', icon: SortAsc },
];

export const ProductFilter = memo(function ProductFilter({ 
  onSortChange, 
  currentSort, 
  productCount,
  startProduct,
  endProduct 
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const currentOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0];
  const currentLabel = currentOption.label;
  const CurrentIcon = currentOption.icon;

  const handleSortChange = useCallback((value: SortOption) => {
    onSortChange(value);
    setIsOpen(false);
  }, [onSortChange]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  return (
    <div className="flex items-center justify-between mb-3 py-2 md:py-4">
      {/* Product count - Mobile responsive */}
      <div className="flex items-baseline gap-1 md:gap-3">
        <span className="text-xs md:text-sm font-medium text-gray-700">
          Produkty
        </span>
        <span className="text-xs md:text-sm text-gray-700 font-bold">
          {productCount}
        </span>
        {startProduct && endProduct && (
          <>
            <span className="text-gray-500 mx-1 hidden md:inline">-</span>
            <span className="text-xs md:text-sm text-gray-700 hidden md:inline">
              Pokazano <span className="font-bold">{startProduct}–{endProduct}</span>
            </span>
          </>
        )}
      </div>
      
      {/* Sort dropdown - Mobile optimized */}
      <div ref={buttonRef} className="relative">
        <button
          onClick={toggleDropdown}
          className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 touch-manipulation ${
            isOpen ? 'border-gray-400 bg-gray-50' : ''
          } w-auto md:w-56`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          style={{ minHeight: '40px' }}
        >
          <CurrentIcon size={14} className="text-gray-500 md:w-4 md:h-4 shrink-0" />
          <span className="flex-1 text-left line-clamp-1">{currentLabel}</span>
          <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-gray-500 transition-transform duration-200 ml-1 md:ml-auto shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>
        
        <DropdownPortal 
          isOpen={isOpen} 
          targetRef={buttonRef}
          onClose={closeDropdown}
        >
          {sortOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSortChange(option.value);
              }}
              className={`
                block w-full text-left px-3 md:px-4 py-3 md:py-2.5 text-xs md:text-sm transition-all duration-150 flex items-center gap-2 touch-manipulation
                ${currentSort === option.value 
                  ? 'font-medium text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === sortOptions.length - 1 ? 'rounded-b-lg' : ''}
              `}
              style={{ minHeight: '44px' }}
            >
              <option.icon size={14} className={`${
                currentSort === option.value ? 'text-blue-600' : 'text-gray-500'
              } md:w-4 md:h-4 shrink-0`} />
              <span className="line-clamp-1">{option.label}</span>
              {currentSort === option.value && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </button>
          ))}
        </DropdownPortal>
      </div>
    </div>
  );
});