// src/app/order-success/page.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        
        <h1 className="text-2xl font-bold mb-4">Děkujeme za vaši objednávku!</h1>
        
        <p className="text-gray-600 mb-6">
          Vaše objednávka byla úspěšně přijata a brzy vám zašleme potvrzení na email.
        </p>
        
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Číslo objednávky:</p>
            <p className="font-semibold text-lg">{orderId}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Co bude následovat?</h2>
          <div className="text-left space-y-3 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Potvrzení objednávky na váš email</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Zabalení a odeslání do 24 hodin</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Sledovací číslo zásilky</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500">✓</span>
              <span>Doručení do 2-3 pracovních dnů</span>
            </div>
          </div>
        </div>
        
        <Link 
          href="/"
          className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Zpět na hlavní stránku
        </Link>
      </div>
    </main>
  );
}