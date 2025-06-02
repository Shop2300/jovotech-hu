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
          Objednávka nenalezena
        </h1>
        
        <p className="text-gray-600 mb-8">
          Omlouváme se, ale objednávku s tímto číslem jsme nenašli. 
          Zkontrolujte prosím číslo objednávky a zkuste to znovu.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Zpět na hlavní stránku
          </Link>
          
          <div className="text-sm text-gray-500">
            Potřebujete pomoc? Kontaktujte nás na{' '}
            <a href="mailto:info@czech-eshop.cz" className="text-blue-600 hover:text-blue-700">
              info@czech-eshop.cz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}