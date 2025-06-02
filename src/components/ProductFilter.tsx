// src/components/ProductFilter.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export type SortOption = 'recommended' | 'bestselling' | 'cheapest' | 'expensive' | 'alphabetical';

interface ProductFilterProps {
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
  productCount: number;
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
      // Add a style tag to force z-index
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
        className="product-filter-dropdown rounded-lg shadow-2xl border border-gray-300 w-48 mt-2"
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

export function ProductFilter({ onSortChange, currentSort, productCount }: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: 'recommended' as SortOption, label: 'Doporučujeme' },
    { value: 'bestselling' as SortOption, label: 'Nejprodávanější' },
    { value: 'cheapest' as SortOption, label: 'Nejlevnější' },
    { value: 'expensive' as SortOption, label: 'Nejdražší' },
    { value: 'alphabetical' as SortOption, label: 'Abecedně' },
  ];

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Doporučujeme';

  const handleSortChange = (value: SortOption) => {
    console.log('Sort clicked:', value);
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-black">
        Produkty ({productCount})
      </h2>
      
      <div ref={buttonRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <span className="text-sm font-medium">{currentLabel}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <DropdownPortal 
          isOpen={isOpen} 
          targetRef={buttonRef}
          onClose={() => setIsOpen(false)}
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSortChange(option.value);
              }}
              className={`
                block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                ${currentSort === option.value ? 'font-semibold text-blue-600 bg-blue-50' : 'text-gray-700'}
                ${option.value === sortOptions[0].value ? 'rounded-t-lg' : ''}
                ${option.value === sortOptions[sortOptions.length - 1].value ? 'rounded-b-lg' : ''}
              `}
              style={{ position: 'relative', zIndex: 999999 }}
            >
              {option.label}
            </button>
          ))}
        </DropdownPortal>
      </div>
    </div>
  );
}