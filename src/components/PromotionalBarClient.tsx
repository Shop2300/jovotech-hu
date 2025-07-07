// src/components/PromotionalBarClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { PromotionalBar } from './PromotionalBar';

export function PromotionalBarClient() {
  const [showPromo, setShowPromo] = useState(true); // Default to true for SSR
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Check if user has previously closed the promo
    const promoClosed = localStorage.getItem('promoClosed');
    if (promoClosed === 'true') {
      setShowPromo(false);
    }
  }, []);
  
  const handleClosePromo = () => {
    setShowPromo(false);
    localStorage.setItem('promoClosed', 'true');
  };
  
  // During SSR, always show the promo to avoid layout shift
  if (!mounted) {
    return <PromotionalBar showPromo={true} onClose={handleClosePromo} />;
  }
  
  return <PromotionalBar showPromo={showPromo} onClose={handleClosePromo} />;
}