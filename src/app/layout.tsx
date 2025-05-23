// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: "Můj E-shop",
  description: "Kvalitní produkty s rychlým doručením",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>
        <Header />
        {children}
        <Toaster 
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
      </body>
    </html>
  );
}