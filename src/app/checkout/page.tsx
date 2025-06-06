// src/app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, Banknote, Copy, Building2 } from 'lucide-react';

interface CheckoutForm {
  email: string;
  phone: string;
  // Billing address
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  // Delivery address
  useDifferentDelivery: boolean;
  deliveryFirstName?: string;
  deliveryLastName?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryPostalCode?: string;
  // Other
  deliveryMethod: string;
  paymentMethod: string;
  note: string;
}

interface FeatureIcon {
  id: string;
  key: string;
  title: string;
  titleCs: string;
  imageUrl: string | null;
  emoji: string | null;
}

const BANK_DETAILS = {
  accountNumber: '2302034483 / 2010',
  iban: 'CZ79 2010 0000 0023 0203 4483',
  swift: 'FIOBCZPPXXX'
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkmarkIcon, setCheckmarkIcon] = useState<FeatureIcon | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CheckoutForm>({
    defaultValues: {
      deliveryMethod: 'zasilkovna',
      paymentMethod: 'bank',
      useDifferentDelivery: false,
    }
  });

  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');
  const useDifferentDelivery = watch('useDifferentDelivery');

  // Fetch checkmark icon
  useEffect(() => {
    async function fetchCheckmarkIcon() {
      try {
        const response = await fetch('/api/feature-icons');
        if (response.ok) {
          const icons = await response.json();
          const checkmark = icons.find((icon: FeatureIcon) => icon.key === 'checkmark');
          if (checkmark) {
            setCheckmarkIcon(checkmark);
          }
        }
      } catch (error) {
        console.error('Error fetching checkmark icon:', error);
      }
    }
    fetchCheckmarkIcon();
  }, []);

  // Only redirect if cart is empty and we're not processing an order
  useEffect(() => {
    if (items.length === 0 && !isProcessingOrder) {
      router.push('/cart');
    }
  }, [items.length, router, isProcessingOrder]);

  const deliveryPrice = 0; // Always free
  const totalPrice = getTotalPrice() + deliveryPrice;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} skopiowano do schowka`);
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    setIsProcessingOrder(true); // Prevent redirect during processing

    try {
      const orderData = {
        email: data.email,
        phone: data.phone,
        // Billing address
        billingFirstName: data.billingFirstName,
        billingLastName: data.billingLastName,
        billingAddress: data.billingAddress,
        billingCity: data.billingCity,
        billingPostalCode: data.billingPostalCode,
        // Delivery address
        useDifferentDelivery: data.useDifferentDelivery,
        deliveryFirstName: data.useDifferentDelivery ? data.deliveryFirstName : data.billingFirstName,
        deliveryLastName: data.useDifferentDelivery ? data.deliveryLastName : data.billingLastName,
        deliveryAddress: data.useDifferentDelivery ? data.deliveryAddress : data.billingAddress,
        deliveryCity: data.useDifferentDelivery ? data.deliveryCity : data.billingCity,
        deliveryPostalCode: data.useDifferentDelivery ? data.deliveryPostalCode : data.billingPostalCode,
        // For backward compatibility
        firstName: data.billingFirstName,
        lastName: data.billingLastName,
        address: data.billingAddress,
        city: data.billingCity,
        postalCode: data.billingPostalCode,
        customerName: `${data.billingFirstName} ${data.billingLastName}`,
        // Other fields
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        note: data.note,
        items: items,
        total: totalPrice,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create order');
      }

      // Show success message
      toast.success('Zamówienie zostało pomyślnie utworzone!');
      
      // Navigate to success page first, then clear cart
      router.push(`/order-success?orderNumber=${responseData.orderNumber}`);
      
      // Clear cart after navigation starts
      setTimeout(() => {
        clearCart();
      }, 500);
      
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Błąd podczas tworzenia zamówienia');
      setIsSubmitting(false);
      setIsProcessingOrder(false);
    }
  };

  if (items.length === 0 && !isProcessingOrder) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Powrót do koszyka
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-black">Finalizacja zamówienia</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Dane kontaktowe</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Email *</label>
                    <input
                      {...register('email', { 
                        required: 'Email jest wymagany',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Nieprawidłowy email'
                        }
                      })}
                      type="email"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Telefon *</label>
                    <input
                      {...register('phone', { required: 'Telefon jest wymagany' })}
                      type="tel"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Adres rozliczeniowy</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Imię *</label>
                    <input
                      {...register('billingFirstName', { required: 'Imię jest wymagane' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.billingFirstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingFirstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Nazwisko *</label>
                    <input
                      {...register('billingLastName', { required: 'Nazwisko jest wymagane' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.billingLastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingLastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black">Ulica i numer domu *</label>
                  <input
                    {...register('billingAddress', { required: 'Adres jest wymagany' })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billingAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingAddress.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Miasto *</label>
                    <input
                      {...register('billingCity', { required: 'Miasto jest wymagane' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.billingCity && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingCity.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">Kod pocztowy *</label>
                    <input
                      {...register('billingPostalCode', { required: 'Kod pocztowy jest wymagany' })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.billingPostalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingPostalCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Adres dostawy</h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...register('useDifferentDelivery')}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Inny niż rozliczeniowy</span>
                  </label>
                </div>
                
                {!useDifferentDelivery ? (
                  <div className="text-gray-600 text-sm flex items-center gap-2">
                    <Copy size={16} />
                    <span>Będzie użyty adres rozliczeniowy</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black">Imię *</label>
                        <input
                          {...register('deliveryFirstName', { 
                            required: useDifferentDelivery ? 'Imię jest wymagane' : false 
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.deliveryFirstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryFirstName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black">Nazwisko *</label>
                        <input
                          {...register('deliveryLastName', { 
                            required: useDifferentDelivery ? 'Nazwisko jest wymagane' : false 
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.deliveryLastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryLastName.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-black">Ulica i numer domu *</label>
                      <input
                        {...register('deliveryAddress', { 
                          required: useDifferentDelivery ? 'Adres jest wymagany' : false 
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black">Miasto *</label>
                        <input
                          {...register('deliveryCity', { 
                            required: useDifferentDelivery ? 'Miasto jest wymagane' : false 
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.deliveryCity && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryCity.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black">Kod pocztowy *</label>
                        <input
                          {...register('deliveryPostalCode', { 
                            required: useDifferentDelivery ? 'Kod pocztowy jest wymagane' : false 
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.deliveryPostalCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryPostalCode.message}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Delivery Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Sposób dostawy</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('deliveryMethod')}
                      type="radio"
                      value="zasilkovna"
                      className="mr-3"
                      checked
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <Truck className="text-gray-600" size={24} />
                      <div className="flex-1">
                        <div className="font-medium text-black">Najwygodniejsza dostawa</div>
                        <div className="text-sm text-gray-600">Dostarczymy paczkę do Twojego domu za pośrednictwem firmy spedycyjnej. Wybieramy pomiędzy DPD, InPost, DHL lub Pocztą Polską.</div>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Sposób płatności</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="bank"
                      className="mr-3"
                    />
                    <Building2 className="mr-3 text-gray-600" size={24} />
                    <div className="flex-1">
                      <div className="font-medium text-black">Przelew bankowy</div>
                      <div className="text-sm text-gray-600">Płatność przelewem na konto</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="cash"
                      className="mr-3"
                    />
                    <Banknote className="mr-3 text-gray-600" size={24} />
                    <div className="flex-1">
                      <div className="font-medium text-black">Płatność za pobraniem</div>
                      <div className="text-sm text-gray-600">Płatność przy odbiorze</div>
                    </div>
                  </label>
                </div>

                {/* Bank Details - shown when bank transfer is selected */}
                {paymentMethod === 'bank' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-black mb-2">Dane do przelewu:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Numer konta:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-black">{BANK_DETAILS.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'Numer konta')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">IBAN:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-black">{BANK_DETAILS.iban}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_DETAILS.iban, 'IBAN')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">BIC/SWIFT:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-black">{BANK_DETAILS.swift}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_DETAILS.swift, 'BIC/SWIFT')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                      * Jako tytuł przelewu proszę wpisać numer zamówienia, który otrzymają Państwo po finalizacji.
                    </p>
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Uwagi do zamówienia</h2>
                <textarea
                  {...register('note')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tutaj mogą Państwo wpisać uwagi do zamówienia..."
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-black">Podsumowanie zamówienia</h2>
              
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variantId || 'default'}`} className="flex justify-between text-sm text-black">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-black">
                  <span>Suma częściowa</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Dostawa</span>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2 text-black">
                  <span>Razem</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                  isSubmitting 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Przetwarzanie...' : 'Złóż zamówienie'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}