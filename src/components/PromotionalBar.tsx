// src/components/PromotionalBar.tsx
'use client';

import { X, Truck } from 'lucide-react';
import { memo } from 'react';

interface PromotionalBarProps {
  showPromo: boolean;
  onClose: () => void;
}

// Memoize to prevent unnecessary re-renders
export const PromotionalBar = memo(function PromotionalBar({ showPromo, onClose }: PromotionalBarProps) {
  if (!showPromo) return null;

  return (
    <div 
      className="text-white py-2 text-center relative"
      style={{ backgroundColor: '#7db349' }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center gap-1 pr-8 md:pr-0">
          <Truck size={16} className="inline-block shrink-0" />
          {/* Improved mobile text sizing and line wrapping */}
          <span className="text-xs sm:text-sm">
            <span className="font-semibold">Darmowa dostawa:</span>
            <span className="hidden sm:inline"> Przy zakupach powyżej 0 zł dostawa gratis.</span>
            <span className="sm:hidden"> Powyżej 0 zł gratis!</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition hover:bg-black/10 touch-manipulation"
          aria-label="Zamknij powiadomienie"
          // Increased touch target size for mobile (44x44px minimum)
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <X size={18} className="m-auto" />
        </button>
      </div>
    </div>
  );
});