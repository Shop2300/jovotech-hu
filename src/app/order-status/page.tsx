// src/app/order-status/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderSearchPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!orderNumber.trim()) {
      setError('Proszę podać numer zamówienia');
      return;
    }

    // Navigate to order status page
    router.push(`/order-status/${orderNumber.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Now starts from the top */}
      <main className="max-w-md mx-auto px-4 py-16">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Powrót do strony głównej
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Śledzenie zamówienia
            </h1>
            <p className="text-gray-600">
              Wprowadź numer zamówienia, aby sprawdzić aktualny status
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Numer zamówienia
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="np. 20250526-8982"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="off"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Wyszukaj zamówienie
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 text-center">
              Numer zamówienia znajdziesz w e-mailu potwierdzającym
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Nie możesz znaleźć swojego zamówienia?
          </p>
          <a 
            href="mailto:info@galaxysklep.pl" 
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Skontaktuj się z nami
          </a>
        </div>
      </main>
    </div>
  );
}