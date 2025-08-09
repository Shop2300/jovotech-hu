// src/app/order-status/[orderNumber]/not-found.tsx
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function OrderNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Megrendelés nem található
        </h1>
        <p className="text-gray-600 mb-8">
          Sajnáljuk, de nem találtuk meg a megrendelést ezzel a számmal.
          Kérjük, ellenőrizze a rendelési számot és próbálja újra.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Vissza a főoldalra
          </Link>
          
          <div className="text-sm text-gray-500">
            Segítségre van szüksége? Lépjen kapcsolatba velünk:{' '}
            <a href="mailto:support@jovotech.hu" className="text-blue-600 hover:text-blue-700">
              support@jovotech.hu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}