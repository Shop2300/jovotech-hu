// src/app/order-success/page.tsx
'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Copy, ArrowRight, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const BANK_DETAILS = {
  accountNumber: '2302034483 / 2010',
  iban: 'CZ79 2010 0000 0023 0203 4483',
  swift: 'FIOBCZPPXXX'
};

interface OrderDetails {
  orderNumber: string;
  paymentMethod: string;
  total: number;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/order-status/${orderNumber}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails({
            orderNumber: data.orderNumber,
            paymentMethod: data.paymentMethod,
            total: data.total
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderNumber]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} skopiowano do schowka`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orderNumber || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nie znaleziono numeru zamówienia</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Powrót do sklepu
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  const showBankDetails = orderDetails.paymentMethod === 'bank';
  const isCashOnDelivery = orderDetails.paymentMethod === 'cash';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Icon and Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dziękujemy za złożenie zamówienia!
          </h1>
          <p className="text-lg text-gray-600">
            Twoje zamówienie #{orderNumber} zostało pomyślnie złożone
          </p>
        </div>

        {/* Order Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="text-gray-600" size={24} />
            Informacje o zamówieniu
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Numer zamówienia:</span>
              <span className="font-mono font-medium">{orderNumber}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Sposób płatności:</span>
              <span className="font-medium">
                {isCashOnDelivery ? 'Płatność za pobraniem' : 'Przelew bankowy'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Kwota do zapłaty:</span>
              <span className="font-bold text-lg">{formatPrice(orderDetails.total)}</span>
            </div>
          </div>

          {/* Payment Instructions */}
          {showBankDetails && (
            <>
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="font-semibold mb-4 text-amber-900 bg-amber-50 p-3 rounded-lg">
                  ⚠️ Aby sfinalizować zamówienie, prosimy o dokonanie przelewu
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Numer konta:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{BANK_DETAILS.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'Numer konta')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">IBAN:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{BANK_DETAILS.iban}</span>
                      <button
                        onClick={() => copyToClipboard(BANK_DETAILS.iban, 'IBAN')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SWIFT/BIC:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{BANK_DETAILS.swift}</span>
                      <button
                        onClick={() => copyToClipboard(BANK_DETAILS.swift, 'SWIFT')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tytuł przelewu:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{orderNumber.replace(/-/g, '')}</span>
                      <button
                        onClick={() => copyToClipboard(orderNumber.replace(/-/g, ''), 'Tytuł przelewu')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Kwota:</span>
                    <span className="font-bold text-lg">{formatPrice(orderDetails.total)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-3">
                  Zamówienie zostanie wysłane natychmiast po zaksięgowaniu wpłaty na naszym koncie.
                </p>
              </div>
            </>
          )}

          {/* Cash on Delivery Instructions */}
          {isCashOnDelivery && (
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                <Truck className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Płatność przy odbiorze</h3>
                  <p className="text-sm text-blue-800">
                    Przygotuj kwotę <strong>{formatPrice(orderDetails.total)}</strong> do zapłaty kurierowi przy odbiorze przesyłki.
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    Twoje zamówienie zostało przekazane do realizacji i wkrótce zostanie wysłane.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Co dalej?</h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <div>
                <p className="font-medium">Potwierdzenie emailem</p>
                <p className="text-sm text-gray-600">
                  Wysłaliśmy potwierdzenie zamówienia na Twój adres email
                </p>
              </div>
            </li>
            
            {showBankDetails && (
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <div>
                  <p className="font-medium">Dokonaj płatności</p>
                  <p className="text-sm text-gray-600">
                    Przelej kwotę {formatPrice(orderDetails.total)} na podane konto bankowe
                  </p>
                </div>
              </li>
            )}
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {showBankDetails ? '3' : '2'}
              </span>
              <div>
                <p className="font-medium">Przygotowanie zamówienia</p>
                <p className="text-sm text-gray-600">
                  {showBankDetails 
                    ? 'Po otrzymaniu płatności przygotujemy Twoje zamówienie do wysyłki'
                    : 'Przygotujemy Twoje zamówienie do wysyłki'
                  }
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {showBankDetails ? '4' : '3'}
              </span>
              <div>
                <p className="font-medium">Wysyłka</p>
                <p className="text-sm text-gray-600">
                  Otrzymasz email z numerem śledzenia przesyłki
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/"
            className="flex-1 bg-gray-200 text-gray-800 text-center py-3 px-6 rounded-lg hover:bg-gray-300 transition"
          >
            Kontynuuj zakupy
          </Link>
          
          <Link
            href={`/order-status/${orderNumber}`}
            className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Sprawdź status zamówienia
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}