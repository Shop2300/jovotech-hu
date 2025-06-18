// src/app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, Banknote, Copy, Building2, ShoppingCart, CheckCircle } from 'lucide-react';
import { DELIVERY_METHODS, PAYMENT_METHODS, getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';

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
  accountNumber: '21291000062469800208837403',
  iban: 'PL21 2910 0006 2469 8002 0883 7403',
  swift: 'BMPBPLPP',
  bankName: 'Aion S.A. Spolka Akcyjna Oddzial w Polsce',
  bankAddress: 'Dobra 40, 00-344, Warszawa, Poland'
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalSavings, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkmarkIcon, setCheckmarkIcon] = useState<FeatureIcon | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, touchedFields }
  } = useForm<CheckoutForm>({
    defaultValues: {
      deliveryMethod: DELIVERY_METHODS[0].value, // Use first delivery method as default
      paymentMethod: PAYMENT_METHODS[0].value, // Use first payment method as default
      useDifferentDelivery: false,
    }
  });

  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');
  const useDifferentDelivery = watch('useDifferentDelivery');

  // Watch all form fields for checkmark display
  const formValues = watch();

  // Helper function to check if field is valid and has content
  const isFieldValid = (fieldName: keyof CheckoutForm) => {
    const fieldValue = formValues[fieldName];
    const hasContent = fieldValue && fieldValue.toString().trim().length > 0;
    return hasContent && touchedFields[fieldName] && !errors[fieldName];
  };

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

  // Calculate delivery and payment prices based on selected methods
  const selectedDeliveryMethod = getDeliveryMethod(deliveryMethod);
  const selectedPaymentMethod = getPaymentMethod(paymentMethod);
  const deliveryPrice = selectedDeliveryMethod?.price || 0;
  const paymentPrice = selectedPaymentMethod?.price || 0;
  const totalPrice = getTotalPrice() + deliveryPrice + paymentPrice;
  const totalSavings = getTotalSavings();

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
        total: totalPrice, // This now includes delivery and payment fees
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // If response is not JSON (like an HTML error page), try to get text
        const text = await response.text();
        console.error('Non-JSON response:', text);
        responseData = { error: 'Server error - please check console for details' };
      }

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
      {/* Progress Bar */}
      <div className="py-6">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/cart" 
              className="inline-flex items-center text-gray-400 hover:text-gray-600 text-sm"
            >
              <ArrowLeft size={16} className="mr-1" />
              Powrót do koszyka
            </Link>
            
            <div className="flex items-center flex-1 max-w-3xl mx-auto">
              {/* Step 1: Cart */}
              <div className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#8bc34a] rounded-full flex items-center justify-center text-white">
                    <ShoppingCart size={20} strokeWidth={2} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-[#131921]">Koszyk</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-gray-300 rounded">
                    <div className="h-1 bg-[#8bc34a] rounded w-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Step 2: Checkout */}
              <div className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#8bc34a] rounded-full flex items-center justify-center text-white">
                    <CreditCard size={20} strokeWidth={2} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-[#131921]">Dostawa i płatność</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-gray-300 rounded">
                    <div className="h-1 bg-[#8bc34a] rounded w-0"></div>
                  </div>
                </div>
              </div>
              
              {/* Step 3: Success */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                  <CheckCircle size={20} strokeWidth={2} />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-500">Potwierdzenie</span>
              </div>
            </div>
            
            <div className="w-[140px]"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-[#131921]">Dane kontaktowe</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                      <span>Email</span>
                      {isFieldValid('email') ? (
                        <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    <input
                      {...register('email', { 
                        required: 'Email jest wymagany',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Nieprawidłowy email'
                        }
                      })}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                      <span>Telefon</span>
                      {isFieldValid('phone') ? (
                        <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    <input
                      {...register('phone', { required: 'Telefon jest wymagany' })}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-[#131921]">Adres rozliczeniowy</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                      <span>Imię</span>
                      {isFieldValid('billingFirstName') ? (
                        <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    <input
                      {...register('billingFirstName', { required: 'Imię jest wymagane' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.billingFirstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingFirstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                      <span>Nazwisko</span>
                      {isFieldValid('billingLastName') ? (
                        <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    <input
                      {...register('billingLastName', { required: 'Nazwisko jest wymagane' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.billingLastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingLastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                    <span>Ulica i numer domu</span>
                    {isFieldValid('billingAddress') ? (
                      <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-red-500 ml-0.5">*</span>
                    )}
                  </label>
                  <input
                    {...register('billingAddress', { required: 'Adres jest wymagany' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.billingAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingAddress.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                      <span>Miasto</span>
                      {isFieldValid('billingCity') ? (
                        <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    <input
                      {...register('billingCity', { required: 'Miasto jest wymagane' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.billingCity && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingCity.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                      <span>Kod pocztowy</span>
                      {isFieldValid('billingPostalCode') ? (
                        <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    <input
                      {...register('billingPostalCode', { required: 'Kod pocztowy jest wymagany' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.billingPostalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.billingPostalCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#131921]">Adres dostawy</h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...register('useDifferentDelivery')}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                        <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                          <span>Imię</span>
                          {useDifferentDelivery && isFieldValid('deliveryFirstName') ? (
                            <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </label>
                        <input
                          {...register('deliveryFirstName', { 
                            required: useDifferentDelivery ? 'Imię jest wymagane' : false 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.deliveryFirstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryFirstName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                          <span>Nazwisko</span>
                          {useDifferentDelivery && isFieldValid('deliveryLastName') ? (
                            <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </label>
                        <input
                          {...register('deliveryLastName', { 
                            required: useDifferentDelivery ? 'Nazwisko jest wymagane' : false 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.deliveryLastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryLastName.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                        <span>Ulica i numer domu</span>
                        {useDifferentDelivery && isFieldValid('deliveryAddress') ? (
                          <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-red-500 ml-0.5">*</span>
                        )}
                      </label>
                      <input
                        {...register('deliveryAddress', { 
                          required: useDifferentDelivery ? 'Adres jest wymagany' : false 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                          <span>Miasto</span>
                          {useDifferentDelivery && isFieldValid('deliveryCity') ? (
                            <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </label>
                        <input
                          {...register('deliveryCity', { 
                            required: useDifferentDelivery ? 'Miasto jest wymagane' : false 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.deliveryCity && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryCity.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#131921] flex items-center">
                          <span>Kod pocztowy</span>
                          {useDifferentDelivery && isFieldValid('deliveryPostalCode') ? (
                            <svg className="w-4 h-4 text-[#8bc34a] ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </label>
                        <input
                          {...register('deliveryPostalCode', { 
                            required: useDifferentDelivery ? 'Kod pocztowy jest wymagane' : false 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-[#131921]">Sposób dostawy</h2>
                
                <div className="space-y-3">
                  {DELIVERY_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label key={method.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          {...register('deliveryMethod')}
                          type="radio"
                          value={method.value}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center flex-shrink-0 ${
                          deliveryMethod === method.value 
                            ? 'bg-[#8bc34a] border-[#8bc34a]' 
                            : 'border-gray-300'
                        }`}>
                          {deliveryMethod === method.value && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                          <Icon className="text-gray-600" size={24} />
                          <div className="flex-1">
                            <div className="font-medium text-[#131921]">{method.labelPl}</div>
                            {method.descriptionPl && (
                              <div className="text-sm text-gray-600">{method.descriptionPl}</div>
                            )}
                          </div>
                        </div>
                        {method.price === 0 ? (
                          <span className="font-semibold text-[#8bc34a] flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Gratis
                          </span>
                        ) : (
                          <span className="font-medium text-[#131921]">
                            {formatPrice(method.price)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-[#131921]">Sposób płatności</h2>
                
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label key={method.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          {...register('paymentMethod')}
                          type="radio"
                          value={method.value}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center flex-shrink-0 ${
                          paymentMethod === method.value 
                            ? 'bg-[#8bc34a] border-[#8bc34a]' 
                            : 'border-gray-300'
                        }`}>
                          {paymentMethod === method.value && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <Icon className="mr-3 text-gray-600" size={24} />
                        <div className="flex-1">
                          <div className="font-medium text-[#131921]">{method.labelPl}</div>
                          {method.descriptionPl && (
                            <div className="text-sm text-gray-600">{method.descriptionPl}</div>
                          )}
                        </div>
                        {method.price === 0 ? (
                          <span className="font-semibold text-[#8bc34a] flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Gratis
                          </span>
                        ) : (
                          <span className="font-medium text-[#131921]">
                            +{formatPrice(method.price)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Bank Details - shown when bank transfer is selected */}
                {paymentMethod === 'bank' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-[#131921] mb-2">Dane do przelewu:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Numer konta:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-[#131921]">{BANK_DETAILS.accountNumber}</span>
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
                          <span className="font-mono font-medium text-[#131921]">{BANK_DETAILS.iban}</span>
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
                          <span className="font-mono font-medium text-[#131921]">{BANK_DETAILS.swift}</span>
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
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-[#131921]">Uwagi do zamówienia</h2>
                <textarea
                  {...register('note')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tutaj mogą Państwo wpisać uwagi do zamówienia..."
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
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
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-[#6da306] font-medium">
                    <span>Zaoszczędzono</span>
                    <span>-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#131921]">
                  <span>Dostawa</span>
                  {deliveryPrice === 0 ? (
                    <span className="text-[#8bc34a] font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Gratis
                    </span>
                  ) : (
                    <span>{formatPrice(deliveryPrice)}</span>
                  )}
                </div>
                {paymentPrice > 0 && (
                  <div className="flex justify-between text-[#131921]">
                    <span>Opłata za płatność</span>
                    <span>{formatPrice(paymentPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-xl border-t border-gray-200 pt-2">
                  <span className="text-[#131921]">Razem</span>
                  <span className="text-[#8bc34a]">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className={`block w-full h-[44px] mt-6 rounded hover:bg-[#7cb342] transition relative overflow-hidden group ${
                  isSubmitting 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#8bc34a] text-white'
                }`}
              >
                <span className="flex items-center justify-center h-full">
                  <span className="font-normal">{isSubmitting ? 'Przetwarzanie...' : 'Złóż zamówienie'}</span>
                  {!isSubmitting && (
                    <span className="ml-3 flex items-center transition-transform group-hover:translate-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </span>
                  )}
                </span>
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-6">
                Składając zamówienie, akceptujesz{' '}
                <Link href="/regulamin" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                  regulamin
                </Link>
                {' '}i{' '}
                <Link href="/polityka-prywatnosci" className="underline hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                  politykę prywatności
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}