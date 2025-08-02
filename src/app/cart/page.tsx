'use client';

import { useCart } from '@/lib/cart';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Trash2, ShoppingCart, Truck, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalSavings } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        {/* Progress Bar */}
        <div className="py-4 md:py-6">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full max-w-3xl">
                {/* Step 1: Cart */}
                <div className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#8bc34a] rounded-full flex items-center justify-center text-white">
                      <ShoppingCart size={16} strokeWidth={2} className="md:w-5 md:h-5" />
                    </div>
                    <span className="ml-2 md:ml-3 text-xs md:text-sm font-medium text-[#131921] hidden sm:inline">Koszyk</span>
                  </div>
                  <div className="flex-1 mx-2 md:mx-4">
                    <div className="h-1 bg-gray-300 rounded">
                      <div className="h-1 bg-[#8bc34a] rounded w-0"></div>
                    </div>
                  </div>
                </div>
                
                {/* Step 2: Checkout */}
                <div className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                      <CreditCard size={16} strokeWidth={2} className="md:w-5 md:h-5" />
                    </div>
                    <span className="ml-2 md:ml-3 text-xs md:text-sm font-medium text-gray-500 hidden sm:inline">Dostawa i płatność</span>
                  </div>
                  <div className="flex-1 mx-2 md:mx-4">
                    <div className="h-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
                
                {/* Step 3: Success */}
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                    <CheckCircle size={16} strokeWidth={2} className="md:w-5 md:h-5" />
                  </div>
                  <span className="ml-2 md:ml-3 text-xs md:text-sm font-medium text-gray-500 hidden sm:inline">Potwierdzenie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center max-w-2xl mx-auto">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4 md:w-16 md:h-16" />
            <h1 className="text-xl md:text-2xl font-bold mb-4 text-[#131921]">Twój koszyk jest pusty</h1>
            <p className="text-[#131921] mb-6 md:mb-8">Dodaj produkty z naszej oferty</p>
            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition min-h-[44px] touch-manipulation"
            >
              Wróć do zakupów
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalPrice = getTotalPrice();
  const totalSavings = getTotalSavings();

  return (
    <main className="min-h-screen bg-white pb-32 lg:pb-0">
      {/* Progress Bar */}
      <div className="py-4 md:py-6">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-3xl">
              {/* Step 1: Cart */}
              <div className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#8bc34a] rounded-full flex items-center justify-center text-white">
                    <ShoppingCart size={16} strokeWidth={2} className="md:w-5 md:h-5" />
                  </div>
                  <span className="ml-2 md:ml-3 text-xs md:text-sm font-medium text-[#131921] hidden sm:inline">Koszyk</span>
                </div>
                <div className="flex-1 mx-2 md:mx-4">
                  <div className="h-1 bg-gray-300 rounded">
                    <div className="h-1 bg-[#8bc34a] rounded w-0"></div>
                  </div>
                </div>
              </div>
              
              {/* Step 2: Checkout */}
              <div className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                    <CreditCard size={16} strokeWidth={2} className="md:w-5 md:h-5" />
                  </div>
                  <span className="ml-2 md:ml-3 text-xs md:text-sm font-medium text-gray-500 hidden sm:inline">Dostawa i płatność</span>
                </div>
                <div className="flex-1 mx-2 md:mx-4">
                  <div className="h-1 bg-gray-300 rounded"></div>
                </div>
              </div>
              
              {/* Step 3: Success */}
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                  <CheckCircle size={16} strokeWidth={2} className="md:w-5 md:h-5" />
                </div>
                <span className="ml-2 md:ml-3 text-xs md:text-sm font-medium text-gray-500 hidden sm:inline">Potwierdzenie</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-4 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items - Full width on mobile */}
          <div className="lg:col-span-2">
            <div className="space-y-4 md:space-y-0 md:divide-y md:divide-gray-200">
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId || 'default'}`} className="bg-white rounded-lg p-4 md:p-0 md:py-4 border border-gray-100 md:border-0">
                  <div className="flex gap-3 md:gap-4">
                    {/* Product Image - Smaller on mobile */}
                    <Link 
                      href={item.categorySlug && item.productSlug 
                        ? `/${item.categorySlug}/${item.productSlug}` 
                        : `/products/${item.id}`}
                      className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity touch-manipulation"
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingCart size={24} className="md:hidden" />
                          <ShoppingCart size={32} className="hidden md:block" />
                        </div>
                      )}
                    </Link>
                    
                    {/* Product Info - Mobile optimized */}
                    <div className="flex-grow min-w-0">
                      {/* Product Name */}
                      <Link 
                        href={item.categorySlug && item.productSlug 
                          ? `/${item.categorySlug}/${item.productSlug}` 
                          : `/products/${item.id}`}
                        className="text-sm md:text-base text-[#131921] hover:underline transition-all block truncate pr-2"
                      >
                        <h3 className="font-medium">{item.name}</h3>
                      </Link>
                      
                      {item.variantName && (
                        <div className="flex items-center gap-2 mt-1">
                          {item.variantColor && (
                            <span
                              className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.variantColor }}
                            />
                          )}
                          <span className="text-xs md:text-sm text-gray-600">{item.variantName}</span>
                        </div>
                      )}
                      
                      {/* Availability - Hidden on mobile to save space */}
                      <div className="hidden md:flex items-center gap-1 mt-1">
                        <span className="inline-block w-2 h-2 bg-[#8bc34a] rounded-full"></span>
                        <span className="text-sm text-[#8bc34a]">Na stanie</span>
                      </div>
                      
                      {/* Quantity Controls - Touch optimized */}
                      <div className="flex items-center mt-2 md:mt-3">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                            className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 text-lg font-light touch-manipulation"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              if (value > 0) {
                                updateQuantity(item.id, value, item.variantId);
                              }
                            }}
                            className="w-12 h-10 md:h-8 text-center border-x border-gray-300 focus:outline-none text-[#131921] text-sm md:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            maxLength={5}
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                            className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 text-lg font-light touch-manipulation"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price and Remove - Mobile layout */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Price at top */}
                      <div className="text-right">
                        {item.regularPrice && item.regularPrice > item.price ? (
                          <div>
                            <p className="text-base md:text-lg text-[#8bc34a] font-bold">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500 line-through">
                              {formatPrice(item.regularPrice * item.quantity)}
                            </p>
                            <span className="inline-block bg-red-600 text-white px-1 py-0.5 rounded text-[10px] md:text-xs font-bold mt-0.5 md:mt-1">
                              -{calculateDiscount(item.price, item.regularPrice)}%
                            </span>
                          </div>
                        ) : (
                          <p className="text-base md:text-lg text-[#8bc34a] font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                      
                      {/* Remove button at bottom - Larger touch target */}
                      <button
                        onClick={() => removeItem(item.id, item.variantId)}
                        className="text-gray-400 hover:text-gray-600 p-2 -mr-2 -mb-2 md:p-0 md:mr-0 md:mb-0 transition touch-manipulation"
                        aria-label="Usuń produkt"
                      >
                        <Trash2 size={18} className="md:hidden" />
                        <Trash2 size={20} className="hidden md:block" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary - Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-[#131921]">Podsumowanie zamówienia</h2>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variantId || 'default'}`} className="flex items-center gap-2">
                    {/* Small Product Image in Summary */}
                    <Link 
                      href={item.categorySlug && item.productSlug 
                        ? `/${item.categorySlug}/${item.productSlug}` 
                        : `/products/${item.id}`}
                      className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingCart size={16} />
                        </div>
                      )}
                    </Link>
                    
                    {/* Product Details - Vertically Centered */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <Link 
                        href={item.categorySlug && item.productSlug 
                          ? `/${item.categorySlug}/${item.productSlug}` 
                          : `/products/${item.id}`}
                        className="text-sm text-[#131921] hover:underline transition-all block truncate"
                      >
                        {item.quantity}x {item.name}
                      </Link>
                      {item.variantName && (
                        <span className="text-xs text-gray-500">{item.variantName}</span>
                      )}
                    </div>
                    
                    {/* Price - Also Vertically Centered */}
                    <div className="text-right flex flex-col justify-center">
                      {item.regularPrice && item.regularPrice > item.price ? (
                        <>
                          <span className="text-sm text-[#131921] font-medium block">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(item.regularPrice * item.quantity)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-[#131921] font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-[#131921]">
                  <span>Suma częściowa</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-[#6da306] font-medium">
                    <span>Zaoszczędzono</span>
                    <span>-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#131921]">
                  <span>Dostawa</span>
                  <span className="text-[#8bc34a] font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Gratis
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-xl border-t border-gray-200 pt-2">
                  <span className="text-[#131921]">Razem</span>
                  <span className="text-[#8bc34a]">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="block w-full h-[48px] mt-6 rounded hover:bg-[#7cb342] transition relative overflow-hidden group bg-[#8bc34a] text-white touch-manipulation"
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
              
              {/* Free Shipping Message - No Animation */}
              <div className="flex items-center justify-center gap-2 text-[#8bc34a] mt-4">
                <Truck size={20} />
                <span className="font-medium">Masz darmową dostawę!</span>
              </div>
              
              {/* Advantages */}
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
      
      {/* Mobile Sticky Order Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="p-4 space-y-3">
          {/* Total and Savings */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Razem ({items.length} {items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktów'})</p>
              <p className="text-xl font-semibold text-[#131921]">{formatPrice(totalPrice)}</p>
              {totalSavings > 0 && (
                <p className="text-xs text-[#6da306] font-medium">Zaoszczędzono: {formatPrice(totalSavings)}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Dostawa</p>
              <p className="text-sm text-[#8bc34a] font-semibold">Gratis</p>
            </div>
          </div>
          
          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="block w-full h-[48px] rounded-xl hover:bg-[#7cb342] transition relative overflow-hidden group bg-[#8bc34a] text-white touch-manipulation"
          >
            <span className="flex items-center justify-center h-full">
              <span className="font-medium text-base">Przejdź do kasy</span>
              <span className="ml-3 flex items-center transition-transform group-hover:translate-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}