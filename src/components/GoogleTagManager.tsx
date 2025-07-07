// src/components/GoogleTagManager.tsx
'use client';

import Script from 'next/script';

export function GoogleTagManager() {
  return (
    <Script
      id="google-tag-manager"
      src="https://www.googletagmanager.com/gtag/js?id=AW-770697695"
      strategy="lazyOnload"
      onLoad={() => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          window.dataLayer.push(args);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'AW-770697695');
      }}
    />
  );
}
