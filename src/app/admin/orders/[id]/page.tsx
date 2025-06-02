// src/app/admin/orders/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { OrderActions } from './OrderActions';
import { OrderHistory } from '@/components/admin/OrderHistory';

interface OrderItem {
  productId: string;
  name?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      history: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!order) {
    return null;
  }

  // Parse the JSON items - use unknown first then cast
  const items = order.items as unknown as OrderItem[];

  // Filter out items without productId and get valid product IDs
  const validItems = items.filter(item => item.productId);
  const productIds = validItems.map(item => item.productId);

  // Only fetch products if we have valid IDs
  let products: any[] = [];
  if (productIds.length > 0) {
    products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });
  }

  // Map products to items, handling items without valid productId
  const itemsWithProducts = items.map(item => {
    if (!item.productId) {
      // Handle items without productId
      return {
        ...item,
        product: {
          id: 'unknown',
          name: item.name || 'Unknown Product',
          name: item.name || 'Neznámý produkt',
        }
      };
    }

    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: product ? {
        id: product.id,
        name: product.name,
        name: product.name,
      } : {
        id: item.productId,
        name: item.name || 'Unknown Product',
        name: item.name || 'Neznámý produkt',
      }
    };
  });

  return {
    ...order,
    total: Number(order.total),
    items: itemsWithProducts,
    paymentStatus: order.paymentStatus || 'unpaid',
  };
}

export default async function OrderDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Čeká na vyřízení', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Zpracovává se', className: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Odesláno', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Doručeno', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Zrušeno', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      card: 'Platba kartou online',
      bank: 'Bankovní převod',
      cash: 'Platba na dobírku'
    };
    return labels[method] || method;
  };

  // Check if we have new address fields
  const hasNewAddressFormat = order.billingFirstName && order.billingLastName;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/orders" 
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-black">
            Objednávka #{order.orderNumber}
          </h1>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Položky objednávky</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0">
                  <div>
                    <h3 className="font-medium text-black">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity}x {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-medium text-black">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-bold text-lg">
                <span>Celkem</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-gray-600" />
                <h2 className="text-xl font-semibold text-black">Fakturační adresa</h2>
              </div>
              <div className="space-y-2">
                <p className="text-black">
                  <strong>
                    {hasNewAddressFormat 
                      ? `${order.billingFirstName} ${order.billingLastName}`
                      : `${order.firstName} ${order.lastName}`
                    }
                  </strong>
                </p>
                <p className="text-black">{hasNewAddressFormat ? order.billingAddress : order.address}</p>
                <p className="text-black">
                  {hasNewAddressFormat ? order.billingCity : order.city}, {hasNewAddressFormat ? order.billingPostalCode : order.postalCode}
                </p>
                <div className="pt-2 border-t mt-2">
                  <p className="text-black"><strong>Email:</strong> {order.customerEmail}</p>
                  <p className="text-black"><strong>Telefon:</strong> {order.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={20} className="text-gray-600" />
                <h2 className="text-xl font-semibold text-black">Doručovací adresa</h2>
              </div>
              <div className="space-y-2">
                {hasNewAddressFormat && order.useDifferentDelivery ? (
                  <>
                    <p className="text-black">
                      <strong>{order.deliveryFirstName} {order.deliveryLastName}</strong>
                    </p>
                    <p className="text-black">{order.deliveryAddress}</p>
                    <p className="text-black">{order.deliveryCity}, {order.deliveryPostalCode}</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm italic">Stejná jako fakturační</p>
                    <p className="text-black">
                      <strong>
                        {hasNewAddressFormat 
                          ? `${order.billingFirstName} ${order.billingLastName}`
                          : `${order.firstName} ${order.lastName}`
                        }
                      </strong>
                    </p>
                    <p className="text-black">{hasNewAddressFormat ? order.billingAddress : order.address}</p>
                    <p className="text-black">
                      {hasNewAddressFormat ? order.billingCity : order.city}, {hasNewAddressFormat ? order.billingPostalCode : order.postalCode}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order History */}
          <OrderHistory history={order.history} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Informace o objednávce</h2>
            <div className="space-y-2 text-sm">
              <p className="text-black">
                <strong>Datum vytvoření:</strong><br />
                {format(new Date(order.createdAt), 'd. MMMM yyyy HH:mm', { locale: cs })}
              </p>
              <p className="text-black">
                <strong>Způsob doručení:</strong><br />
                {order.deliveryMethod === 'zasilkovna' ? 'Zásilkovna' : 'Osobní odběr'}
              </p>
              <p className="text-black">
                <strong>Způsob platby:</strong><br />
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
              <p className="text-black">
                <strong>Stav platby:</strong><br />
                <span className={`inline-flex items-center gap-1 font-semibold ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {order.paymentStatus === 'paid' ? (
                    <>
                      <CheckCircle size={16} />
                      Zaplaceno
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Nezaplaceno
                    </>
                  )}
                </span>
              </p>
              {order.trackingNumber && (
                <p className="text-black">
                  <strong>Sledovací číslo:</strong><br />
                  <span className="text-blue-600">{order.trackingNumber}</span>
                </p>
              )}
              {order.note && (
                <p className="text-black">
                  <strong>Poznámka:</strong><br />
                  {order.note}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <OrderActions 
            orderId={order.id} 
            currentStatus={order.status}
            currentTrackingNumber={order.trackingNumber || ''}
            currentPaymentStatus={order.paymentStatus}
          />
        </div>
      </div>
    </div>
  );
}