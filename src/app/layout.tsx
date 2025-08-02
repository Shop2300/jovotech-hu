// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import dynamic from 'next/dynamic';
import { LayoutWrapper } from '@/components/LayoutWrapper';

// Dynamically import non-critical components
const ConditionalFooter = dynamic(
  () => import('@/components/ConditionalFooter').then(mod => ({ default: mod.ConditionalFooter })),
  { 
    loading: () => null 
  }
);

const SideBadges = dynamic(
  () => import('@/components/SideBadges').then(mod => ({ default: mod.SideBadges })),
  { 
    loading: () => null 
  }
);

const GoogleTagManager = dynamic(
  () => import('@/components/GoogleTagManager').then(mod => ({ default: mod.GoogleTagManager })),
  { 
    loading: () => null 
  }
);

// Lazy load the toaster to reduce initial bundle
const Toaster = dynamic(
  () => import('react-hot-toast').then(mod => ({ default: mod.Toaster })),
  { 
    loading: () => null 
  }
);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: true, // Allow zooming for accessibility
  themeColor: '#ffffff',
  colorScheme: 'light', // Force light mode
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
  // Performance hints
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Optimize mobile rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html {
              -webkit-text-size-adjust: 100%;
              text-size-adjust: 100%;
              -webkit-tap-highlight-color: transparent;
            }
            body {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `
        }} />
      </head>
      <body suppressHydrationWarning>
        <LayoutWrapper />
        {children}
        <ConditionalFooter />
        <SideBadges />
        <GoogleTagManager />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 16px',
              maxWidth: '90vw',
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
          containerStyle={{
            bottom: 20,
          }}
        />
      </body>
    </html>
  );
}