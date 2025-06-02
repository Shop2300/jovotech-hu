// src/components/LayoutWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CategoryBar } from '@/components/CategoryBar';
import { X } from 'lucide-react';

export function LayoutWrapper() {
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    // Check if user has previously closed the promo
    const promoClosed = localStorage.getItem('promoClosed');
    if (promoClosed !== 'true') {
      setShowPromo(true);
    }
  }, []);

  const handleClosePromo = () => {
    setShowPromo(false);
    localStorage.setItem('promoClosed', 'true');
  };

  return (
    <>
      {/* Promotional Bar */}
      {showPromo && (
        <div 
          className="text-white py-2 text-center text-sm relative"
          style={{ backgroundColor: '#7db349' }}
        >
          <div className="max-w-screen-2xl mx-auto px-6 relative flex items-center justify-center">
            <div>
              <span className="font-semibold">Doprava zdarma:</span> Při nákupu nad 3 000 Kč máte od nás dopravu zadarmo.
            </div>
            <button
              onClick={handleClosePromo}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:bg-black/10"
              aria-label="Zavřít oznámení"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      <Header />
      <div style={{ position: 'relative' }}>
        <CategoryBar />
        
        {/* Shadow overlapping content below - now in grey */}
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            height: '12px',
            background: 'linear-gradient(to bottom, rgba(156, 163, 175, 0.2) 0%, rgba(156, 163, 175, 0.1) 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 50
          }}
        />
      </div>
    </>
  );
}