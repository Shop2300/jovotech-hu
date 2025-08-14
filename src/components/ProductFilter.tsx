'use client';

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Star, TrendingUp, Tag, Gem, SortAsc, ChevronDown } from 'lucide-react';

export type SortOption = 'recommended' | 'bestselling' | 'cheapest' | 'expensive' | 'alphabetical';

interface ProductFilterProps {
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
  productCount: number;
  startProduct?: number;
  endProduct?: number;
}

const sortOptions = [
  { value: 'recommended' as SortOption, label: 'Ajánlott', icon: Star },
  { value: 'bestselling' as SortOption, label: 'Legnépszerűbb', icon: TrendingUp },
  { value: 'cheapest' as SortOption, label: 'Legolcsóbb', icon: Tag },
  { value: 'expensive' as SortOption, label: 'Legdrágább', icon: Gem },
  { value: 'alphabetical' as SortOption, label: 'ABC sorrendben', icon: SortAsc },
];

export const ProductFilter = memo(function ProductFilter({
  onSortChange,
  currentSort,
  productCount,
  startProduct,
  endProduct,
}: ProductFilterProps) {
  const currentIndex = Math.max(0, sortOptions.findIndex(o => o.value === currentSort));
  const [focusIndex, setFocusIndex] = useState<number>(currentIndex);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  
  const groupRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setFocusIndex(currentIndex), [currentIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMobileDropdownOpen(false);
      }
    };
    
    if (mobileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileDropdownOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const last = sortOptions.length - 1;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(focusIndex + 1, last);
      setFocusIndex(next);
      btnRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(focusIndex - 1, 0);
      setFocusIndex(prev);
      btnRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusIndex(0);
      btnRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusIndex(last);
      btnRefs.current[last]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSortChange(sortOptions[focusIndex].value);
    }
  };

  const select = useCallback(
    (value: SortOption, index: number) => {
      onSortChange(value);
      setFocusIndex(index);
      setMobileDropdownOpen(false);
    },
    [onSortChange]
  );

  // announce changes for SR users
  const [announce, setAnnounce] = useState('');
  useEffect(() => {
    const opt = sortOptions.find(o => o.value === currentSort);
    setAnnounce(`Rendezés: ${opt?.label ?? ''}`);
  }, [currentSort]);

  const currentOption = sortOptions.find(o => o.value === currentSort) || sortOptions[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-3 md:mb-4">
      {/* Mobile layout */}
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-medium text-gray-700">Termékek:</span>
          <span className="text-sm text-gray-900 font-bold">{productCount}</span>
          {startProduct != null && endProduct != null && (
            <span className="text-xs text-gray-500 ml-1">
              ({startProduct}–{endProduct})
            </span>
          )}
        </div>
        
        {/* Mobile dropdown trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 touch-manipulation min-h-[44px]"
            aria-label="Rendezési beállítások"
            aria-expanded={mobileDropdownOpen}
          >
            <CurrentIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{currentOption.label}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown menu */}
          {mobileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
              {sortOptions.map((opt, index) => {
                const Icon = opt.icon;
                const isSelected = currentSort === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => select(opt.value, index)}
                    className={[
                      'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                      isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    ].join(' ')}
                  >
                    <Icon className={isSelected ? 'w-4 h-4 text-blue-600' : 'w-4 h-4 text-gray-500'} />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <span className="sr-only" aria-live="polite">{announce}</span>
      </div>

      {/* Desktop left: product count - original style */}
      <div className="hidden md:flex items-baseline gap-1 md:gap-3">
        <span className="text-xs md:text-sm font-medium text-gray-700">Termékek</span>
        <span className="text-xs md:text-sm text-gray-700 font-bold">{productCount}</span>
        {startProduct != null && endProduct != null && (
          <>
            <span className="text-gray-500 mx-1">-</span>
            <span className="text-xs md:text-sm text-gray-700">
              Megjelenítve <span className="font-bold">{startProduct}–{endProduct}</span>
            </span>
          </>
        )}
        <span className="sr-only" aria-live="polite">{announce}</span>
      </div>

      {/* Desktop right: inline pills (radiogroup) - original style */}
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label="Rendezés"
        className="hidden md:block relative -mx-2 px-2"
        onKeyDown={handleKeyDown}
      >
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto py-1 no-scrollbar">
          {sortOptions.map((opt, i) => {
            const selected = currentSort === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                ref={(el: HTMLButtonElement | null) => {
                  btnRefs.current[i] = el;
                }}
                role="radio"
                aria-checked={selected}
                tabIndex={i === focusIndex ? 0 : -1}
                onClick={() => select(opt.value, i)}
                className={[
                  'inline-flex items-center gap-1.5 md:gap-2 whitespace-nowrap',
                  'px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-full border transition-all duration-150',
                  selected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ].join(' ')}
              >
                <Icon className={selected ? 'w-3.5 h-3.5 md:w-4 md:h-4 text-white' : 'w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500'} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});