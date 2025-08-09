// src/app/vasarloi-velemenyek/layout.tsx
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Vásárlói vélemények - Értékelések | Jovotech.hu',
  description: 'Olvassa el, mit mondanak vásárlóink a Jovotech.hu-ról. Tekintse meg a véleményeket, ellenőrizze értékelésünket és ossza meg vásárlási tapasztalatait.',
  openGraph: {
    title: 'Vásárlói vélemények - Értékelések | Jovotech.hu',
    description: 'Olvassa el, mit mondanak vásárlóink a Jovotech.hu-ról. Tekintse meg a véleményeket, ellenőrizze értékelésünket és ossza meg vásárlási tapasztalatait.',
    type: 'website',
  },
};

export default function VasarloiVelemenyekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}