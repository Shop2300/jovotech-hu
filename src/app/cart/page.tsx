// src/app/cart/page.tsx
'use client';

import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        {/* Progress Bar */}
        <div className="py-6">
          <div className="max-w-screen-2xl mx-auto px-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full max-w-3xl">
                {/* Step 1: Cart */}
                <div className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#8bc34a] rounded-full flex items-center justify-center text-white font-medium">
                      1
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">Koszyk</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-gray-300 rounded">
                      <div className="h-1 bg-[#8bc34a] rounded w-0"></div>
                    </div>
                  </div>
                </div>
                
                {/* Step 2: Checkout */}
                <div className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                      2
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-500">Dostawa i płatność</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
                
                {/* Step 3: Success */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                    3
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-500">Potwierdzenie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-screen-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-black">Twój koszyk jest pusty</h1>
            <p className="text-black mb-8">Dodaj produkty z naszej oferty</p>
            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Wróć do zakupów
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="py-6">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-3xl">
              {/* Step 1: Cart */}
              <div className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#8bc34a] rounded-full flex items-center justify-center text-white font-medium">
                    1
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">Koszyk</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-gray-300 rounded">
                    <div className="h-1 bg-[#8bc34a] rounded w-0"></div>
                  </div>
                </div>
              </div>
              
              {/* Step 2: Checkout */}
              <div className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                    2
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-500">Dostawa i płatność</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-gray-300 rounded"></div>
                </div>
              </div>
              
              {/* Step 3: Success */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                  3
                </div>
                <span className="ml-3 text-sm font-medium text-gray-500">Potwierdzenie</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div>
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId || 'default'}`} className="border-b border-gray-200 last:border-b-0 py-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingCart size={32} />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="text-base text-black">{item.name}</h3>
                      {item.variantName && (
                        <div className="flex items-center gap-2 mt-1">
                          {item.variantColor && (
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.variantColor }}
                            />
                          )}
                          <span className="text-gray-600">{item.variantName}</span>
                        </div>
                      )}
                      {/* Availability */}
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-2 h-2 bg-[#8bc34a] rounded-full"></span>
                        <span className="text-sm text-[#8bc34a]">Na stanie</span>
                      </div>
                      
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center mt-3">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 text-lg font-light"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              if (value > 0) {
                                updateQuantity(item.id, value, item.variantId);
                              }
                            }}
                            className="w-12 h-8 text-center border-x border-gray-300 focus:outline-none text-black"
                            maxLength={5}
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 text-lg font-light"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price and Remove */}
                    <div className="text-right">
                      <p className="text-lg text-[#8bc34a]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id, item.variantId)}
                        className="text-gray-400 hover:text-gray-600 mt-2 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-black">Podsumowanie zamówienia</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-black">
                  <span>Suma częściowa</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Dostawa</span>
                  <span>{getTotalPrice() >= 1000 ? 'Gratis' : formatPrice(99)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg text-black">
                    <span>Razem</span>
                    <span>{formatPrice(getTotalPrice() + (getTotalPrice() >= 1000 ? 0 : 99))}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="block w-full h-[44px] bg-[#8bc34a] text-white rounded hover:bg-[#7cb342] transition relative overflow-hidden group"
              >
                <span className="flex items-center justify-center h-full">
                  <span className="font-normal">Przejdź do kasy</span>
                  <span className="ml-3 flex items-center transition-transform group-hover:translate-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </span>
                </span>
              </button>
              
              <Link 
                href="/"
                className="block text-center text-blue-600 mt-4 hover:underline"
              >
                Kontynuuj zakupy
              </Link>
              
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  ✓ Darmowa wysyłka przy zakupach powyżej 0 zł<br/>
                  ✓ 14 dni na zwrot<br/>
                  ✓ Paczkomaty w całej Polsce
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}