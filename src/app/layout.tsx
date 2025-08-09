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
  title: "Jovotech.hu - Elektronika, Divat, Kiegészítők",
  description: "Az Ön webáruháza elektronikával, divattal és kiegészítőkkel. CNC marógép, ultrahang, hőprés. A legjobb árak, ingyenes szállítás 20 000 Ft felett!",
  keywords: "elektronika, divat, kiegészítők, webáruház, CNC marógép, ultrahang, hőprés, lézerek, Jovotech",
  authors: [{ name: "Jovotech" }],
  creator: "Jovotech",
  publisher: "Jovotech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jovotech.hu"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jovotech.hu - Elektronika, Divat, Kiegészítők",
    description: "Az Ön webáruháza elektronikával, divattal és kiegészítőkkel. CNC marógép, ultrahang, hőprés. A legjobb árak!",
    url: "https://jovotech.hu",
    siteName: "Jovotech",
    locale: "hu_HU",
    type: "website",
    images: [
      {
        url: "/images/galaxyskleplogo.png",
        width: 1200,
        height: 630,
        alt: "Jovotech - Az Ön webáruháza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jovotech.hu - Elektronika, Divat, Kiegészítők",
    description: "Az Ön webáruháza elektronikával, divattal és kiegészítőkkel. A legjobb árak, gyors szállítás!",
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
    <html lang="hu" suppressHydrationWarning>
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