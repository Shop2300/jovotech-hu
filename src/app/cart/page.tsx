// src/app/cart/page.tsx
'use client';

import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-black">Váš košík je prázdný</h1>
            <p className="text-black mb-8">Přidejte si nějaké produkty z naší nabídky</p>
            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Zpět k nákupu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-black">Nákupní košík</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId || 'default'}`} className="border-b last:border-b-0 p-4">
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
                      <h3 className="font-semibold text-lg text-black">{item.name}</h3>
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
                      <p className="text-black mt-1">{formatPrice(item.price)}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                          className="p-1 hover:bg-gray-100 rounded transition"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} className="text-black" />
                        </button>
                        <span className="px-3 py-1 bg-gray-100 rounded text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <Plus size={16} className="text-black" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Price and Remove */}
                    <div className="text-right">
                      <p className="font-bold text-lg text-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id, item.variantId)}
                        className="text-red-500 hover:text-red-700 mt-2 transition"
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
              <h2 className="text-xl font-bold mb-4 text-black">Souhrn objednávky</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-black">
                  <span>Mezisoučet</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Doprava</span>
                  <span>{getTotalPrice() >= 1000 ? 'Zdarma' : formatPrice(99)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg text-black">
                    <span>Celkem</span>
                    <span>{formatPrice(getTotalPrice() + (getTotalPrice() >= 1000 ? 0 : 99))}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Přejít k pokladně
              </button>
              
              <Link 
                href="/"
                className="block text-center text-blue-600 mt-4 hover:underline"
              >
                Pokračovat v nákupu
              </Link>
              
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-black">
                  ✓ Doprava zdarma při nákupu nad 1000 Kč<br/>
                  ✓ 14 dní na vrácení<br/>
                  ✓ Zásilkovna po celé ČR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}