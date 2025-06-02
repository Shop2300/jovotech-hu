// src/components/ConditionalFooter.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Define paths where footer should NOT appear
  const noFooterPaths = ['/cart', '/checkout'];
  
  // Check if current path is in the no-footer list
  const shouldHideFooter = noFooterPaths.includes(pathname);
  
  // Don't render footer if we're on a no-footer page
  if (shouldHideFooter) {
    return null;
  }
  
  return <Footer />;
}