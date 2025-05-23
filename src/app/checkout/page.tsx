'use client';

import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryMethod: string;
  paymentMethod: string;
  note?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CheckoutForm>({
    defaultValues: {
      deliveryMethod: 'zasilkovna',
      paymentMethod: 'card'
    }
  });

  const deliveryMethod = watch('deliveryMethod');
  const shippingCost = getTotalPrice() >= 1000 ? 0 : 99;
  const totalAmount = getTotalPrice() + shippingCost;

  const [hasCheckedCart, setHasCheckedCart] = useState(false);

  useEffect(() => {
    // Don't redirect if order is completed or being submitted
    if (!hasCheckedCart && items.length === 0 && !orderCompleted && !isSubmitting) {
      setHasCheckedCart(true);
      router.push('/cart');
    }
  }, [items.length, router, hasCheckedCart, orderCompleted, isSubmitting]);

  if (items.length === 0 && !isSubmitting && !orderCompleted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">Přesměrování do košíku...</div>
    </div>;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    
    try {
      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          total: totalAmount,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Order creation failed:', responseData);
        throw new Error(responseData.error || 'Failed to create order');
      }
      
      console.log('Order created successfully:', responseData);
      console.log('About to clear cart...');
      
      // Mark order as completed to prevent redirect to cart
      setOrderCompleted(true);
      
      // Clear cart
      clearCart();
      
      console.log('Cart cleared, redirecting to:', `/order-success?orderId=${responseData.id || responseData.orderNumber}`);
      
      // Small delay then redirect
      setTimeout(() => {
        window.location.href = `/order-success?orderId=${responseData.id || responseData.orderNumber}`;
      }, 100);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Něco se pokazilo. Zkuste to prosím znovu.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dokončení objednávky</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Kontaktní údaje</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Jméno *</label>
                    <input
                      {...register('firstName', { required: 'Jméno je povinné' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Příjmení *</label>
                    <input
                      {...register('lastName', { required: 'Příjmení je povinné' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email je povinný',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Neplatný email'
                        }
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon *</label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Telefon je povinný' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Doručovací adresa</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ulice a číslo popisné *</label>
                    <input
                      {...register('address', { required: 'Adresa je povinná' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Město *</label>
                      <input
                        {...register('city', { required: 'Město je povinné' })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">PSČ *</label>
                      <input
                        {...register('postalCode', { required: 'PSČ je povinné' })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Delivery Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Způsob doručení</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('deliveryMethod')}
                      value="zasilkovna"
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <div className="font-medium">Zásilkovna</div>
                      <div className="text-sm text-gray-600">Výdejní místa po celé ČR</div>
                    </div>
                    <div className="font-medium">{formatPrice(79)}</div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('deliveryMethod')}
                      value="ppl"
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <div className="font-medium">PPL</div>
                      <div className="text-sm text-gray-600">Doručení na adresu</div>
                    </div>
                    <div className="font-medium">{formatPrice(99)}</div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('deliveryMethod')}
                      value="czechpost"
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <div className="font-medium">Česká pošta</div>
                      <div className="text-sm text-gray-600">Balík do ruky</div>
                    </div>
                    <div className="font-medium">{formatPrice(89)}</div>
                  </label>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Způsob platby</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value="card"
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <div className="font-medium">Platba kartou online</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value="bank"
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <div className="font-medium">Bankovní převod</div>
                      <div className="text-sm text-gray-600">Platba předem</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value="cod"
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <div className="font-medium">Dobírka</div>
                      <div className="text-sm text-gray-600">Platba při převzetí</div>
                    </div>
                    <div className="font-medium">+ {formatPrice(30)}</div>
                  </label>
                </div>
              </div>
              
              {/* Note */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Poznámka k objednávce</h2>
                <textarea
                  {...register('note')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Zde můžete napsat poznámku k objednávce..."
                />
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Shrnutí objednávky</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.nameCs} x {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Mezisoučet</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doprava</span>
                    <span>{shippingCost === 0 ? 'Zdarma' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Celkem k úhradě</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                    isSubmitting 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? 'Zpracovávám...' : 'Dokončit objednávku'}
                </button>
                
                <p className="text-xs text-gray-600 mt-4 text-center">
                  Kliknutím na "Dokončit objednávku" souhlasíte s našimi obchodními podmínkami
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}