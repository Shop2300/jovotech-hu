// src/app/ocena-sklepu/layout.tsx
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Ocena sklepu - Opinie klientów | Galaxysklep.pl',
  description: 'Zobacz co mówią nasi klienci o Galaxysklep.pl. Przeczytaj opinie, sprawdź naszą ocenę i podziel się swoim doświadczeniem zakupowym.',
  openGraph: {
    title: 'Ocena sklepu - Opinie klientów | Galaxysklep.pl',
    description: 'Zobacz co mówią nasi klienci o Galaxysklep.pl. Przeczytaj opinie, sprawdź naszą ocenę i podziel się swoim doświadczeniem zakupowym.',
    type: 'website',
  },
};

export default function OcenaSklepuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}