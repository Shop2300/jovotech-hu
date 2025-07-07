// src/components/LazyToaster.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicToaster = dynamic(
  () => import('react-hot-toast').then(mod => ({ default: mod.Toaster })),
  { 
    ssr: false,
    loading: () => null 
  }
);

export function LazyToaster() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Check if there's any toast-related activity
    const checkForToasts = () => {
      // Look for any toast triggers in the DOM or check if we're on pages that use toasts
      const hasCartButton = document.querySelector('[data-cart-button]');
      const hasForm = document.querySelector('form');
      const isCheckout = window.location.pathname.includes('checkout');
      const isCart = window.location.pathname.includes('cart');
      const isAdmin = window.location.pathname.includes('admin');
      
      if (hasCartButton || hasForm || isCheckout || isCart || isAdmin) {
        setShouldLoad(true);
      }
    };

    // Check immediately
    checkForToasts();

    // Also check after a short delay for dynamic content
    const timer = setTimeout(checkForToasts, 100);

    // Listen for any click that might trigger a toast
    const handleInteraction = () => {
      setShouldLoad(true);
    };

    window.addEventListener('click', handleInteraction, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <DynamicToaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#10b981',
          },
        },
        error: {
          style: {
            background: '#ef4444',
          },
        },
      }}
    />
  );
}
