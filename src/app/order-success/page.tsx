// src/app/order-success/page.tsx
'use client';

export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';

const BANK_DETAILS = {
  accountNumber: '2302034483 / 2010',
  iban: 'CZ79 2010 0000 0023 0203 4483',
  swift: 'FIOBCZPPXXX'
};

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const { clearCart } = useCart();
  
  // Ensure cart is cleared when arriving at success page
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} skopiowano do schowka`);
  };
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        
        <h1 className="text-2xl font-bold mb-4 text-black">Dziękujemy za Twoje zamówienie!</h1>
        
        <p className="text-gray-700 mb-6">
          Twoje zamówienie zostało pomyślnie przyjęte i wkrótce wyślemy potwierdzenie na e-mail.
        </p>
        
        {orderNumber && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 font-medium">Numer zamówienia:</p>
            <p className="font-semibold text-lg text-black">{orderNumber}</p>
          </div>
        )}

        {/* Bank Transfer Information */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-lg text-black mb-3">Informacje do przelewu bankowego:</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Numer konta:</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-medium text-black">{BANK_DETAILS.accountNumber}</p>
                <button
                  onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'Numer konta')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">IBAN:</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-medium text-black text-sm">{BANK_DETAILS.iban}</p>
                <button
                  onClick={() => copyToClipboard(BANK_DETAILS.iban, 'IBAN')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">BIC/SWIFT:</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-medium text-black">{BANK_DETAILS.swift}</p>
                <button
                  onClick={() => copyToClipboard(BANK_DETAILS.swift, 'BIC/SWIFT')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            {orderNumber && (
              <div>
                <p className="text-sm text-gray-600">Tytuł przelewu:</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-medium text-black">{orderNumber}</p>
                  <button
                    onClick={() => copyToClipboard(orderNumber, 'Tytuł przelewu')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Towar wyślemy natychmiast po zaksięgowaniu wpłaty na naszym koncie.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-black">Co dalej?</h2>
          <div className="text-left space-y-3 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Potwierdzenie zamówienia na Twój e-mail</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Opłacenie zamówienia przelewem bankowym</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Pakowanie i wysyłka po zaksięgowaniu wpłaty</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Numer śledzenia przesyłki</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Dostawa w ciągu 2-3 dni roboczych</span>
            </div>
          </div>
        </div>
        
        <Link 
          href="/"
          className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Powrót do strony głównej
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Ładowanie...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}