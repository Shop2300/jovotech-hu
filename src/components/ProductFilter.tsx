'use client';

import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import { Star, TrendingUp, Tag, Gem, SortAsc } from 'lucide-react';

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

  const groupRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => setFocusIndex(currentIndex), [currentIndex]);

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
    },
    [onSortChange]
  );

  // announce changes for SR users
  const [announce, setAnnounce] = useState('');
  useEffect(() => {
    const opt = sortOptions.find(o => o.value === currentSort);
    setAnnounce(`Rendezés: ${opt?.label ?? ''}`);
  }, [currentSort]);

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-3 md:mb-4">
      {/* Left: product count */}
      <div className="flex items-baseline gap-1 md:gap-3">
        <span className="text-xs md:text-sm font-medium text-gray-700">Termékek</span>
        <span className="text-xs md:text-sm text-gray-700 font-bold">{productCount}</span>
        {startProduct != null && endProduct != null && (
          <>
            <span className="text-gray-500 mx-1 hidden md:inline">-</span>
            <span className="text-xs md:text-sm text-gray-700 hidden md:inline">
              Megjelenítve <span className="font-bold">{startProduct}–{endProduct}</span>
            </span>
          </>
        )}
        <span className="sr-only" aria-live="polite">{announce}</span>
      </div>

      {/* Right: inline pills (radiogroup) */}
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label="Rendezés"
        className="relative -mx-2 px-2"
        onKeyDown={handleKeyDown}
      >
        {/* horizontal scroll on small screens */}
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto py-1 no-scrollbar">
          {sortOptions.map((opt, i) => {
            const selected = currentSort === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                ref={(el: HTMLButtonElement | null) => {
                  btnRefs.current[i] = el; // callback returns void
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
