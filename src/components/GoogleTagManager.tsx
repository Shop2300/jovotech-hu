// src/components/GoogleTagManager.tsx
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function GoogleTagManager() {
  useEffect(() => {
    // Only load GTM after page is interactive
    const loadGTM = () => {
      // Prevent multiple loads
      if (window.gtag) return;
      
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'AW-770697695');

      // Load GTM script
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-770697695';
      script.async = true;
      document.head.appendChild(script);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadGTM);
    } else {
      setTimeout(loadGTM, 1);
    }
  }, []);

  return null;
}