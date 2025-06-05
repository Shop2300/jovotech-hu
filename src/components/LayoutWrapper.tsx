// src/components/LayoutWrapper.tsx
'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CategoryBar } from '@/components/CategoryBar';
import { PromotionalBar } from '@/components/PromotionalBar';

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
      <PromotionalBar showPromo={showPromo} onClose={handleClosePromo} />
      <Header />
      <CategoryBar />
    </>
  );
}