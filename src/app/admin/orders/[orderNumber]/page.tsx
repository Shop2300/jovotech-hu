// src/app/admin/orders/[orderNumber]/page.tsx
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, Truck, CreditCard, CheckCircle, Package, Banknote } from 'lucide-react';
import { OrderActions } from './OrderActions';
import { OrderHistory } from '@/components/admin/OrderHistory';
import { getDeliveryMethodLabel, getPaymentMethodLabel, getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';

interface OrderItem {
  productId: string;
  name?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

async function getOrder(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
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
      } : {
        id: item.productId,
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
  params: Promise<{ orderNumber: string }> 
}) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);

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

  // Check if we have new address fields
  const hasNewAddressFormat = order.billingFirstName && order.billingLastName;

  // Get delivery and payment methods
  const deliveryMethod = getDeliveryMethod(order.deliveryMethod);
  const paymentMethod = getPaymentMethod(order.paymentMethod);

  // Calculate subtotal (sum of all product items)
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
              {/* Product Items */}
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b">
                  <div className="flex items-start gap-3">
                    {/* Product Image */}
                    {item.image ? (
                      <Link 
                        href={item.product.id !== 'unknown' ? `/admin/products/${item.product.id}/edit` : '#'}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <div className="relative w-16 h-16">
                          <Image 
                            src={item.image} 
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="64px"
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package size={24} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div>
                      {item.product.id !== 'unknown' ? (
                        <Link 
                          href={`/admin/products/${item.product.id}/edit`}
                          className="font-medium text-black hover:text-blue-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      ) : (
                        <h3 className="font-medium text-black">{item.product.name}</h3>
                      )}
                      <p className="text-sm text-gray-600">
                        {item.quantity}x {formatPrice(item.price)}
                      </p>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.size && `Velikost: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Barva: ${item.color}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-black">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              {/* Delivery Method as Item */}
              {deliveryMethod && (
                <div className="flex justify-between items-center pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <Truck size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-black">{deliveryMethod.labelPl}</h3>
                      {deliveryMethod.descriptionPl && (
                        <p className="text-sm text-gray-600 mt-1">
                          {deliveryMethod.descriptionPl}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-black">
                    {deliveryMethod.price > 0 ? formatPrice(deliveryMethod.price) : 'Zdarma'}
                  </p>
                </div>
              )}

              {/* Payment Method as Item */}
              {paymentMethod && (
                <div className="flex justify-between items-center pb-4 border-b last:border-0">
                  <div className="flex items-start gap-3">
                    {paymentMethod.value === 'bank' ? (
                      <CreditCard size={20} className="text-green-600 mt-0.5" />
                    ) : (
                      <Banknote size={20} className="text-green-600 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium text-black">{paymentMethod.labelPl}</h3>
                      {paymentMethod.descriptionPl && (
                        <p className="text-sm text-gray-600 mt-1">
                          {paymentMethod.descriptionPl}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-black">
                    {paymentMethod.price > 0 ? formatPrice(paymentMethod.price) : 'Zdarma'}
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Mezisoučet (produkty)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {deliveryMethod && deliveryMethod.price > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Doprava</span>
                  <span>{formatPrice(deliveryMethod.price)}</span>
                </div>
              )}
              {paymentMethod && paymentMethod.price > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Poplatek za platbu</span>
                  <span>{formatPrice(paymentMethod.price)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
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
          <OrderHistory history={order.history.map(h => ({
            ...h,
            createdAt: h.createdAt.toISOString()
          }))} />
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
              
              <div className="pt-3 mt-3">
                <p className="text-black mb-1">
                  <strong>Stav platby:</strong>
                </p>
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
              </div>

              {order.trackingNumber && (
                <div className="pt-3">
                  <p className="text-black">
                    <strong>Sledovací číslo:</strong><br />
                    <span className="text-blue-600">{order.trackingNumber}</span>
                  </p>
                </div>
              )}
              
              {order.note && (
                <div className="pt-3">
                  <p className="text-black">
                    <strong>Poznámka:</strong><br />
                    {order.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <OrderActions 
            orderId={order.id}
            orderNumber={order.orderNumber}
            currentStatus={order.status}
            currentTrackingNumber={order.trackingNumber || ''}
            currentPaymentStatus={order.paymentStatus}
          />
        </div>
      </div>
    </div>
  );
}