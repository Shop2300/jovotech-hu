// src/app/order-status/[orderNumber]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
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
  ArrowLeft,
  FileText,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { SatisfactionRating } from '@/components/SatisfactionRating';
import { InvoiceDownloadButton } from '@/components/InvoiceDownloadButton';
import { getDeliveryMethodLabel, getPaymentMethodLabel, getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';
import SimpleQRDisplay from '@/components/SimpleQRDisplay';

// Helper function to format dates in the correct format with timezone adjustment
const formatDateWithTimezone = (dateString: string, includeTime: boolean = true) => {
  const date = new Date(dateString);
  // If the server returns UTC and you need to add 2 hours for CET/CEST
  // Uncomment the next line:
   date.setHours(date.getHours() + 2);
  
  if (includeTime) {
    return format(date, 'yyyy.MM.dd, HH:mm', { locale: hu });
  } else {
    return format(date, 'yyyy.MM.dd', { locale: hu });
  }
};

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
    id?: string;
    name: string;
    quantity: number;
    price: number;
    image?: string | null;
    variantName?: string | null;
    variantColor?: string | null;
  }>;
  deliveryAddress: {
    street?: string;
    city: string;
    postalCode: string;
  };
  history: Array<{
    id: string;
    action: string;
    description: string;
    createdAt: string;
  }>;
  invoice?: {
    id: string;
    invoiceNumber: string;
    status: string;
    issuedAt: string;
    pdfUrl: string | null;
  } | null;
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
  accountNumber: '12600016-10426947-95638648',
  iban: 'HU86126000161042694795638648',
  swift: 'TRWIBEBBXXX',
  bankName: 'WISE EUROPE S.A.',
  bankAddress: 'Rue du Trône 100, 1050 Brussels'
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
      label: 'Fogadva', 
      icon: CheckCircle,
      description: 'A megrendelés beérkezett'
    },
    { 
      key: 'processing', 
      label: 'Feldolgozás alatt', 
      icon: Package,
      description: 'Készítjük a megrendelését'
    },
    { 
      key: 'shipped', 
      label: 'Feladva', 
      icon: Truck,
      description: 'A megrendelés úton van'
    },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Now starts from the top without header */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation and Invoice Download */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1.5" />
            Vissza a főoldalra
          </Link>
          
          {/* Invoice Download Button */}
          {order.invoice ? (
            <InvoiceDownloadButton 
              orderNumber={order.orderNumber}
              invoiceNumber={order.invoice.invoiceNumber}
              pdfUrl={order.invoice.pdfUrl}
            />
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-500 rounded-md cursor-not-allowed">
              <FileText size={16} />
              <span>Számla nem elérhető</span>
            </div>
          )}
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Megrendelés #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Létrehozva: {formatDateWithTimezone(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <CopyLinkButton />
            </div>
          </div>

          {/* Payment Status Alert - Only for bank transfers */}
          {order.paymentMethod === 'bank' && order.paymentStatus === 'unpaid' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900 mb-2">Fizetésre várunk</h3>
                      <p className="text-sm text-amber-800 mb-3">
                        A megrendelés véglegesítéséhez kérjük, utalja át a <strong>{formatPrice(order.total)}</strong> összeget bankszámlánkra:
                      </p>
                      <div className="bg-white rounded-md p-3 space-y-1 text-sm">
                        <p><strong>Számlaszám:</strong> {BANK_DETAILS.accountNumber}</p>
                        <p><strong>IBAN:</strong> <span className="font-mono">{BANK_DETAILS.iban}</span></p>
                        <p><strong>SWIFT/BIC:</strong> {BANK_DETAILS.swift}</p>
                        <p><strong>Bank:</strong> {BANK_DETAILS.bankName}</p>
                        <p className="text-xs">{BANK_DETAILS.bankAddress}</p>
                        <p><strong>Közlemény:</strong> {order.orderNumber.replace('-', '')}</p>
                        <p className="text-xs text-gray-600 mt-2">
                          A megrendelést azonnal feladjuk, amint a befizetés megérkezik számlánkra.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* QR Code on the right */}
                <div className="hidden md:block w-48 flex-shrink-0">
                  <SimpleQRDisplay
                    orderNumber={order.orderNumber}
                    amount={order.total}
                    recipientAccount={BANK_DETAILS.accountNumber}
                    iban={BANK_DETAILS.iban}
                  />
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
                  <h3 className="font-semibold text-blue-900 mb-2">Utánvétes fizetés</h3>
                  <p className="text-sm text-blue-800">
                    Készítse elő a <strong>{formatPrice(order.total)}</strong> összeget a futárnak történő fizetéshez a csomag átvételekor.
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
                <p className="text-green-800 font-medium">A fizetés sikeresen megtörtént</p>
              </div>
            </div>
          )}

          {/* Status Progress */}
          {!isCancelled ? (
            <div className="mt-8 px-16 pb-8">
              <div className="relative">
                {/* Progress Line - adjusted for edge positioning */}
                <div 
                  className="absolute top-6 h-1 bg-gray-200"
                  style={{ 
                    left: '24px',   // Half of circle width
                    right: '24px'   // Half of circle width
                  }}
                >
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
                      <div key={step.key} className="relative">
                        <div className="flex flex-col items-center">
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
                          <p className={`text-sm font-medium mt-2 ${
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                        {isCurrent && (
                          <p className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 hidden sm:block text-center whitespace-nowrap">
                            {step.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">A megrendelés törölve lett</p>
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
                      <h3 className="font-semibold text-green-900">Csomag követése</h3>
                    </div>
                    <p className="text-sm text-green-800 mb-1">
                      Nyomkövetési szám: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                    </p>
                    <p className="text-sm text-green-700">
                      Futárszolgálat: {getDeliveryMethodLabel(order.deliveryMethod, 'pl')}
                    </p>
                  </div>
                  {order.trackingNumber && (
                    <Link
                      href="/szallitasi-informaciok"
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Követés online
                      <ExternalLink size={16} />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Megrendelt termékek</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    {/* Product Image */}
                    <Link 
                      href={item.id ? `/products/${item.id}` : '#'}
                      className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.image ? (
                        <div className="relative w-20 h-20">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </Link>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <Link 
                        href={item.id ? `/products/${item.id}` : '#'}
                        className="font-medium hover:text-blue-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="text-sm text-gray-600">
                          {item.variantName}
                          {item.variantColor && ` - ${item.variantColor}`}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        {item.quantity}x {formatPrice(item.price)}
                      </p>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Shipping Row */}
                <div className="flex gap-4 pb-4 border-b border-gray-200">
                  <div className="flex-shrink-0 flex items-center h-20">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div>
                      <h3 className="font-medium">Szállítás</h3>
                      <p className="text-sm text-gray-600">
                        {getDeliveryMethodLabel(order.deliveryMethod, 'pl')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center">
                    <p className="font-medium">
                      {formatPrice(getDeliveryMethod(order.deliveryMethod)?.price || 0)}
                    </p>
                  </div>
                </div>

                {/* Payment Row */}
                <div className="flex gap-4 pb-4 border-b border-gray-200">
                  <div className="flex-shrink-0 flex items-center h-20">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div>
                      <h3 className="font-medium">Fizetés</h3>
                      <p className="text-sm text-gray-600">
                        {getPaymentMethodLabel(order.paymentMethod, 'pl')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center">
                    <p className="font-medium">
                      {formatPrice(getPaymentMethod(order.paymentMethod)?.price || 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Total Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Részösszeg</span>
                    <span>{formatPrice(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Szállítás</span>
                    <span>{formatPrice(getDeliveryMethod(order.deliveryMethod)?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Fizetés</span>
                    <span>{formatPrice(getPaymentMethod(order.paymentMethod)?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Összesen</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Section - Only if invoice exists */}
            {order.invoice && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-medium mb-3 text-gray-700">Számla</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Számlaszám:</p>
                    <p className="text-sm font-medium text-gray-900">{order.invoice.invoiceNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Kiállítva: {formatDateWithTimezone(order.invoice.issuedAt, false)}
                    </p>
                  </div>
                  <InvoiceDownloadButton 
                    orderNumber={order.orderNumber}
                    invoiceNumber={order.invoice.invoiceNumber}
                    pdfUrl={order.invoice.pdfUrl}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Szállítási információk</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Szállítási cím</p>
                    <div className="text-sm text-gray-600">
                      {order.deliveryAddress.street && (
                        <p>{order.deliveryAddress.street}</p>
                      )}
                      <p>{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Szállítási mód</p>
                    <p className="text-sm text-gray-600">
                      {getDeliveryMethodLabel(order.deliveryMethod, 'pl')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fizetési mód</p>
                    <p className="text-sm text-gray-600">
                      {getPaymentMethodLabel(order.paymentMethod, 'pl')}
                    </p>
                    {/* Payment status - different display for cash on delivery */}
                    {order.paymentMethod === 'bank' && order.paymentStatus && (
                      <p className={`text-sm font-medium mt-1 ${
                        order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {order.paymentStatus === 'paid' ? '✓ Fizetve' : '⏳ Fizetésre vár'}
                      </p>
                    )}
                    {order.paymentMethod === 'cash' && (
                      <p className="text-sm font-medium mt-1 text-blue-600">
                        💵 Utánvét
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details (only for unpaid bank transfer) */}
            {order.paymentMethod === 'bank' && order.paymentStatus === 'unpaid' && (
              <div className="bg-amber-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-amber-900">Utalási adatok</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Számlaszám:</p>
                    <p className="font-mono font-medium">{BANK_DETAILS.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">IBAN:</p>
                    <p className="font-mono font-medium">{BANK_DETAILS.iban}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">SWIFT/BIC:</p>
                    <p className="font-mono font-medium">{BANK_DETAILS.swift}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bank:</p>
                    <p className="font-medium">{BANK_DETAILS.bankName}</p>
                    <p className="text-xs text-gray-500">{BANK_DETAILS.bankAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Közlemény:</p>
                    <p className="font-mono font-medium">{order.orderNumber.replace('-', '')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Összeg:</p>
                    <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                  </div>
                </div>
                
                {/* Simple QR Code Display */}
                <SimpleQRDisplay
                  orderNumber={order.orderNumber}
                  amount={order.total}
                  recipientAccount={BANK_DETAILS.accountNumber}
                  iban={BANK_DETAILS.iban}
                />
              </div>
            )}

            {/* Cash on Delivery Reminder */}
            {order.paymentMethod === 'cash' && order.paymentStatus === 'unpaid' && order.status === 'shipped' && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-blue-900">Készítse elő a fizetést</h3>
                <p className="text-sm text-blue-800">
                  A megrendelése úton van. Készítse elő a <strong>{formatPrice(order.total)}</strong> összeget a futárnak történő fizetéshez.
                </p>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Segítségre van szüksége?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ha bármilyen kérdése van a megrendelésével kapcsolatban, lépjen kapcsolatba velünk.
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:support@jovotech.hu" 
                  className="block text-sm text-blue-600 hover:text-blue-700"
                >
                  support@jovotech.hu
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