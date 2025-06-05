// src/components/PromotionalBar.tsx
'use client';

import { X } from 'lucide-react';

interface PromotionalBarProps {
  showPromo: boolean;
  onClose: () => void;
}

export function PromotionalBar({ showPromo, onClose }: PromotionalBarProps) {
  if (!showPromo) return null;

  return (
    <div 
      className="text-white py-2 text-center text-sm relative"
      style={{ backgroundColor: '#7db349' }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-center">
        <div>
          <span className="font-semibold">Darmowa dostawa:</span> Przy zakupach powyżej 500 zł dostawa gratis.
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:bg-black/10"
          aria-label="Zamknij powiadomienie"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}