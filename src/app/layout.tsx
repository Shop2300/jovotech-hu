// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { ConditionalFooter } from '@/components/ConditionalFooter';
import { SideBadges } from '@/components/SideBadges';
import { GoogleTagManager } from '@/components/GoogleTagManager';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Removed maximumScale to allow users to zoom in for accessibility
}

export const metadata: Metadata = {
  title: "Galaxysklep.pl - Elektronika, Moda, Akcesoria",
  description: "Twój sklep z elektroniką, modą i akcesoriami. Router CNC, ultradźwięki, prasy termotransferowe. Najlepsze ceny, darmowa dostawa od 200 zł!",
  keywords: "elektronika, moda, akcesoria, sklep internetowy, router CNC, ultradźwięki, prasy termotransferowe, lasery, Galaxy Sklep",
  authors: [{ name: "Galaxy Sklep" }],
  creator: "Galaxy Sklep",
  publisher: "Galaxy Sklep",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://galaxysklep.pl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Galaxysklep.pl - Elektronika, Moda, Akcesoria",
    description: "Twój sklep z elektroniką, modą i akcesoriami. Router CNC, ultradźwięki, prasy termotransferowe. Najlepsze ceny!",
    url: "https://galaxysklep.pl",
    siteName: "Galaxy Sklep",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/images/galaxyskleplogo.png",
        width: 1200,
        height: 630,
        alt: "Galaxy Sklep - Twój sklep internetowy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galaxysklep.pl - Elektronika, Moda, Akcesoria",
    description: "Twój sklep z elektroniką, modą i akcesoriami. Najlepsze ceny, szybka dostawa!",
    images: ["/images/galaxyskleplogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: "rM73bzskVZTTR0tmKXijqULs5zrCBTgi1EY-th_ce3k",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        <LayoutWrapper />
        {children}
        <ConditionalFooter />
        <SideBadges />
        <GoogleTagManager />
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