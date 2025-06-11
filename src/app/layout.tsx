// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { ConditionalFooter } from '@/components/ConditionalFooter';
// Remove: import { CartProvider } from '@/contexts/CartContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
  verification: {
    // IMPORTANT: Replace rM73bzskVZTTR0tmKXijqULs5zrCBTgi1EY-th_ce3k with your actual Google verification code
    google: "rM73bzskVZTTR0tmKXijqULs5zrCBTgi1EY-th_ce3k",
    // Add these when you have them:
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        {/* Alternative Google verification method - uncomment and use if the metadata verification doesn't work */}
        {/* <meta name="google-site-verification" content="rM73bzskVZTTR0tmKXijqULs5zrCBTgi1EY-th_ce3k" /> */}
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-770697695"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-770697695');
            `,
          }}
        />
        
        {/* Remove CartProvider wrapper */}
        <LayoutWrapper />
        {children}
        <ConditionalFooter />
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