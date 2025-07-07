// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Toaster } from 'react-hot-toast';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { ConditionalFooter } from '@/components/ConditionalFooter';
import { SideBadges } from '@/components/SideBadges';
import { GoogleTagManager } from '@/components/GoogleTagManager';

// Import CSS normally - Next.js will handle optimization
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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

// Critical CSS Component
function CriticalStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content */
          *,::after,::before{box-sizing:border-box;border:0 solid #e5e7eb}
          html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:Arial,Helvetica,sans-serif}
          body{margin:0;background:#fff;color:#171717}
          .container{width:100%;margin:0 auto;padding:0 1rem}
          @media(min-width:640px){.container{max-width:640px}}
          @media(min-width:768px){.container{max-width:768px}}
          @media(min-width:1024px){.container{max-width:1024px}}
          @media(min-width:1280px){.container{max-width:1280px}}
          img,video{max-width:100%;height:auto}
          .flex{display:flex}
          .hidden{display:none}
          .relative{position:relative}
          .sticky{position:sticky}
          .top-0{top:0}
          .z-50{z-index:50}
          .min-h-screen{min-height:100vh}
          .bg-white{background-color:#fff}
          .w-full{width:100%}
          /* Prevent layout shift */
          header{min-height:60px}
          main{min-height:calc(100vh - 300px)}
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        {/* Critical CSS inline */}
        <CriticalStyles />
        
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body suppressHydrationWarning>
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