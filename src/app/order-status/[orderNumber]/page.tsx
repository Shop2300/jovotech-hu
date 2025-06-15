// src/app/order-status/[orderNumber]/page.tsx
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  Clock,
  MapPin,
  CreditCard,
  Mail,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { SatisfactionRating } from '@/components/SatisfactionRating';
import { getDeliveryMethodLabel, getPaymentMethodLabel } from '@/lib/order-options';

interface OrderStatusData {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber: string | null;
  deliveryMethod: string;
  paymentMethod: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: {
    city: string;
    postalCode: string;
  };
  history: Array<{
    id: string;
    action: string;
    description: string;
    createdAt: string;
  }>;
}

async function getOrderStatus(orderNumber: string): Promise<OrderStatusData | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/order-status/${orderNumber}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch order status:', error);
    return null;
  }
}

const BANK_DETAILS = {
  accountNumber: '2302034483 / 2010',
  iban: 'CZ79 2010 0000 0023 0203 4483',
  swift: 'FIOBCZPPXXX'
};

export default async function OrderStatusPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = await params;
  const order = await getOrderStatus(resolvedParams.orderNumber);

  if (!order) {
    notFound();
  }

  // Status configuration - only 3 steps now
  const statusSteps = [
    { 
      key: 'pending', 
      label: 'Przyjęte', 
      icon: CheckCircle,
      description: 'Zamówienie zostało przyjęte'
    },
    { 
      key: 'processing', 
      label: 'W realizacji', 
      icon: Package,
      description: 'Przygotowujemy Twoje zamówienie'
    },
    { 
      key: 'shipped', 
      label: 'Wysłane', 
      icon: Truck,
      description: 'Zamówienie jest w drodze'
    },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);
  const isCancelled = order.status === 'cancelled';

  // Get tracking URL
  const getTrackingUrl = () => {
    if (!order.trackingNumber) return null;
    
    if (order.deliveryMethod === 'zasilkovna') {
      return `https://tracking.packeta.com/pl/?id=${order.trackingNumber}`;
    }
    // Add more carriers as needed
    return null;
  };

  const trackingUrl = getTrackingUrl();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Now starts from the top without header */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            href="/order-status" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Powrót do wyszukiwania zamówienia
          </Link>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Zamówienie #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Utworzone: {format(new Date(order.createdAt), 'd MMMM yyyy HH:mm', { locale: pl })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <CopyLinkButton />
              <Link 
                href="/" 
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                Strona główna
              </Link>
            </div>
          </div>

          {/* Payment Status Alert - Only for bank transfers */}
          {order.paymentMethod === 'bank' && order.paymentStatus === 'unpaid' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">Czekamy na płatność</h3>
                  <p className="text-sm text-amber-800 mb-3">
                    Aby sfinalizować zamówienie, prosimy o wpłatę kwoty <strong>{formatPrice(order.total)}</strong> na nasze konto bankowe:
                  </p>
                  <div className="bg-white rounded-md p-3 space-y-1 text-sm">
                    <p><strong>Numer konta:</strong> {BANK_DETAILS.accountNumber}</p>
                    <p><strong>Tytuł przelewu:</strong> {order.orderNumber}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      Zamówienie wyślemy natychmiast po zaksięgowaniu wpłaty na naszym koncie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cash on Delivery Alert */}
          {order.paymentMethod === 'cash' && order.paymentStatus === 'unpaid' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Truck className="text-blue-600 mt-0.5" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">Płatność przy odbiorze</h3>
                  <p className="text-sm text-blue-800">
                    Przygotuj kwotę <strong>{formatPrice(order.total)}</strong> do zapłaty kurierowi przy odbiorze przesyłki.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Success Alert - For bank transfers and paid cash orders */}
          {order.paymentStatus === 'paid' && order.paymentMethod === 'bank' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-600" size={20} />
                <p className="text-green-800 font-medium">Płatność została pomyślnie przyjęta</p>
              </div>
            </div>
          )}

          {/* Status Progress */}
          {!isCancelled ? (
            <div className="mt-8">
              <div className="relative">
                {/* Progress Line - adjusted to end at last icon */}
                <div className="absolute left-6 right-6 top-6 h-1 bg-gray-200">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ 
                      width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` 
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center
                            transition-all duration-300 relative z-10
                            ${isCompleted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                            }
                            ${isCurrent ? 'ring-4 ring-green-200' : ''}
                          `}
                        >
                          <Icon size={24} />
                        </div>
                        <div className="mt-2 text-center">
                          <p className={`text-sm font-medium ${
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Zamówienie zostało anulowane</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Information - Now in green */}
            {order.trackingNumber && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="text-green-600" size={20} />
                      <h3 className="font-semibold text-green-900">Śledzenie przesyłki</h3>
                    </div>
                    <p className="text-sm text-green-800 mb-1">
                      Numer śledzenia: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                    </p>
                    <p className="text-sm text-green-700">
                      Przewoźnik: {getDeliveryMethodLabel(order.deliveryMethod, 'pl')}
                    </p>
                  </div>
                  {trackingUrl && (
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Śledź online
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Pozycje zamówienia</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity}x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Razem</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} />
                Historia zamówienia
              </h2>
              <div className="space-y-3">
                {order.history.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {entry.action === 'order_created' && <CheckCircle className="text-green-500" size={16} />}
                      {entry.action === 'status_change' && <Package className="text-blue-500" size={16} />}
                      {entry.action === 'tracking_added' && <Truck className="text-purple-500" size={16} />}
                      {entry.action === 'email_sent' && <Mail className="text-gray-500" size={16} />}
                      {entry.action === 'payment_status_change' && <CreditCard className="text-green-500" size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{entry.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(entry.createdAt), 'd MMMM yyyy HH:mm', { locale: pl })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Informacje o dostawie</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adres dostawy</p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sposób dostawy</p>
                    <p className="text-sm text-gray-600">
                      {getDeliveryMethodLabel(order.deliveryMethod, 'pl')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sposób płatności</p>
                    <p className="text-sm text-gray-600">
                      {getPaymentMethodLabel(order.paymentMethod, 'pl')}
                    </p>
                    {/* Payment status - different display for cash on delivery */}
                    {order.paymentMethod === 'bank' && order.paymentStatus && (
                      <p className={`text-sm font-medium mt-1 ${
                        order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {order.paymentStatus === 'paid' ? '✓ Opłacone' : '⏳ Oczekuje na płatność'}
                      </p>
                    )}
                    {order.paymentMethod === 'cash' && (
                      <p className="text-sm font-medium mt-1 text-blue-600">
                        💵 Płatność przy odbiorze
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details (only for unpaid bank transfer) */}
            {order.paymentMethod === 'bank' && order.paymentStatus === 'unpaid' && (
              <div className="bg-amber-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-amber-900">Dane do przelewu</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Numer konta:</p>
                    <p className="font-mono font-medium">{BANK_DETAILS.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">IBAN:</p>
                    <p className="font-mono font-medium text-xs">{BANK_DETAILS.iban}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tytuł przelewu:</p>
                    <p className="font-mono font-medium">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Kwota:</p>
                    <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cash on Delivery Reminder */}
            {order.paymentMethod === 'cash' && order.paymentStatus === 'unpaid' && order.status === 'shipped' && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-blue-900">Przygotuj płatność</h3>
                <p className="text-sm text-blue-800">
                  Twoje zamówienie jest w drodze. Przygotuj kwotę <strong>{formatPrice(order.total)}</strong> do zapłaty kurierowi.
                </p>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Potrzebujesz pomocy?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Jeśli masz jakiekolwiek pytania dotyczące Twojego zamówienia, skontaktuj się z nami.
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:info@galaxysklep.pl" 
                  className="block text-sm text-blue-600 hover:text-blue-700"
                >
                  support@galaxysklep.pl
                </a>
                <a 
                  href="tel:+48123456789" 
                  className="block text-sm text-blue-600 hover:text-blue-700"
                >
                  +48 123 456 789
                </a>
              </div>
            </div>

            {/* Satisfaction Rating Section - NEW */}
            <SatisfactionRating orderNumber={order.orderNumber} />
          </div>
        </div>
      </main>
    </div>
  );
}