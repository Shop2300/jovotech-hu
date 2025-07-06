// src/components/GoogleTagManager.tsx
'use client';

import { useEffect } from 'react';

export function GoogleTagManager() {
  useEffect(() => {
    // Only load GTM after initial render
    const loadGTM = () => {
      // Prevent multiple loads
      if (window.dataLayer) return;
      
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'AW-770697695');

      // Load GTM script
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-770697695';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    // Load on first user interaction or after 4 seconds
    let loaded = false;
    const handleInteraction = () => {
      if (!loaded) {
        loaded = true;
        loadGTM();
      }
    };

    // Listen for user interactions
    ['click', 'scroll', 'touchstart', 'mousemove'].forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    // Fallback: load after 4 seconds if no interaction
    const timer = setTimeout(() => {
      if (!loaded) {
        loaded = true;
        loadGTM();
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      ['click', 'scroll', 'touchstart', 'mousemove'].forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  return null;
}