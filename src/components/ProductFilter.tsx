// src/components/ProductFilter.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
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

function DropdownPortal({ children, isOpen, targetRef, onClose }: DropdownPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
    
    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          right: window.innerWidth - rect.right + window.scrollX
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
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
        className="fixed inset-0 product-filter-overlay" 
        onClick={onClose}
      />
      <div
        className="product-filter-dropdown rounded-lg shadow-lg border border-gray-200 w-56 mt-1"
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
}

export function ProductFilter({ 
  onSortChange, 
  currentSort, 
  productCount,
  startProduct,
  endProduct 
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: 'recommended' as SortOption, label: 'Polecane', icon: Star },
    { value: 'bestselling' as SortOption, label: 'Najczęściej kupowane', icon: TrendingUp },
    { value: 'cheapest' as SortOption, label: 'Najtańsze', icon: Tag },
    { value: 'expensive' as SortOption, label: 'Najdroższe', icon: Gem },
    { value: 'alphabetical' as SortOption, label: 'Alfabetycznie', icon: SortAsc },
  ];

  const currentOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0];
  const currentLabel = currentOption.label;
  const CurrentIcon = currentOption.icon;

  const handleSortChange = (value: SortOption) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between mb-3 py-4">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-medium text-gray-700">
          Produkty
        </span>
        <span className="text-sm text-gray-700 font-bold">
          {productCount}
        </span>
        {startProduct && endProduct && (
          <>
            <span className="text-gray-500 mx-1">-</span>
            <span className="text-sm text-gray-700">
              Pokazano <span className="font-bold">{startProduct}–{endProduct}</span>
            </span>
          </>
        )}
      </div>
      
      <div ref={buttonRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm w-56"
        >
          <CurrentIcon size={16} className="text-gray-500" />
          <span className="flex-1 text-left">{currentLabel}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ml-auto ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <DropdownPortal 
          isOpen={isOpen} 
          targetRef={buttonRef}
          onClose={() => setIsOpen(false)}
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
                block w-full text-left px-4 py-2.5 text-sm transition-all duration-150 flex items-center gap-2
                ${currentSort === option.value 
                  ? 'font-medium text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === sortOptions.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              <option.icon size={16} className={currentSort === option.value ? 'text-blue-600' : 'text-gray-500'} />
              {option.label}
            </button>
          ))}
        </DropdownPortal>
      </div>
    </div>
  );
}