// src/app/admin/orders/[orderNumber]/page.tsx
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, Truck, CreditCard, CheckCircle, Package, Banknote } from 'lucide-react';
import { OrderActions } from './OrderActions';
import { CustomerInfoEdit } from './CustomerInfoEdit';
import { AddressEdit } from './AddressEdit';
import { AdminNotes } from './AdminNotes';
import { Comments } from './Comments';
import { OrderHistory } from '@/components/admin/OrderHistory';
import { getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';
import { CopyButton } from '@/components/admin/CopyButton';
import { Suspense } from 'react';

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

// Helper function to format dates - memoized to avoid recalculation
const formatDateWithTimezone = (dateString: string | Date) => {
  const date = new Date(dateString);
  // Add 2 hours for Central European Time (GMT+2)
  date.setHours(date.getHours() + 2);
  return format(date, 'MMMM d, yyyy HH:mm', { locale: enUS });
};

interface OrderItem {
  id?: string;
  productId?: string;
  name?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
  variantName?: string;
  variantColor?: string;
}

interface ProductInfo {
  id: string;
  name: string;
}

interface OrderItemWithProduct extends OrderItem {
  product: ProductInfo;
}

async function getOrder(orderNumber: string) {
  // OPTIMIZATION 1: Use a single query with optimized fields
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      // Only select fields we actually use
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      total: true,
      items: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      note: true,
      trackingNumber: true,
      adminNotes: true,
      comments: true,
      createdAt: true,
      
      // Billing fields
      billingFirstName: true,
      billingLastName: true,
      billingAddress: true,
      billingCity: true,
      billingPostalCode: true,
      firstName: true,
      lastName: true,
      address: true,
      city: true,
      postalCode: true,
      
      // Company fields
      isCompany: true,
      companyName: true,
      companyNip: true,
      
      // Delivery fields
      useDifferentDelivery: true,
      deliveryFirstName: true,
      deliveryLastName: true,
      deliveryAddress: true,
      deliveryCity: true,
      deliveryPostalCode: true,
      deliveryMethod: true,
      paymentMethod: true,
      
      // Relations
      history: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          description: true,
          oldValue: true,
          newValue: true,
          performedBy: true,
          metadata: true,
          createdAt: true,
        }
      },
      invoice: {
        select: {
          id: true,
          invoiceNumber: true,
        }
      }
    }
  });

  if (!order) {
    return null;
  }

  // Parse the JSON items
  const items = order.items as unknown as OrderItem[];

  // OPTIMIZATION 2: Only fetch products that actually exist and deduplicate IDs
  const uniqueProductIds = new Set<string>();
  items.forEach(item => {
    const productId = item.id || item.productId;
    if (productId) {
      uniqueProductIds.add(productId);
    }
  });

  // OPTIMIZATION 3: Fetch products only if we have IDs
  let productMap = new Map<string, ProductInfo>();
  
  if (uniqueProductIds.size > 0) {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: Array.from(uniqueProductIds)
        }
      },
      select: {
        id: true,
        name: true
      }
    });
    
    // OPTIMIZATION 4: Use Map for O(1) lookups instead of array.find()
    productMap = new Map(products.map(p => [p.id, p]));
  }

  // Map items with their products using the optimized Map
  const itemsWithProducts: OrderItemWithProduct[] = items.map(item => {
    const itemProductId = item.id || item.productId;
    
    if (!itemProductId) {
      return {
        ...item,
        product: {
          id: 'unknown',
          name: item.name || 'Unknown product',
        }
      };
    }

    const product = productMap.get(itemProductId);
    return {
      ...item,
      product: product || {
        id: itemProductId,
        name: item.name || 'Unknown product',
      }
    };
  });

  return {
    ...order,
    total: Number(order.total),
    items: itemsWithProducts,
    paymentStatus: order.paymentStatus || 'unpaid',
    adminNotes: order.adminNotes || '',
    comments: order.comments || ''
  };
}

// Memoized status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Shipped', className: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

// Loading skeleton for order items
function OrderItemsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Order Items</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Order items component
async function OrderItems({ order }: { order: Awaited<ReturnType<typeof getOrder>> }) {
  if (!order) return null;

  // Get delivery and payment methods
  const deliveryMethod = getDeliveryMethod(order.deliveryMethod);
  const paymentMethod = getPaymentMethod(order.paymentMethod);

  // Calculate subtotal
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 overflow-visible">
      <h2 className="text-xl font-semibold mb-4 text-black">Order Items</h2>
      <div className="space-y-4 overflow-visible">
        {/* Product Items */}
        {order.items.map((item, index) => {
          const canLinkToProduct = item.product.id !== 'unknown';
          const productEditUrl = canLinkToProduct ? `/admin/products/${item.product.id}/edit` : '#';

          return (
            <div key={index} className="flex justify-between items-center pb-4 border-b relative">
              <div className="flex items-start gap-3">
                {/* Product Image */}
                {item.image ? (
                  canLinkToProduct ? (
                    <div className="flex-shrink-0 relative">
                      <Link 
                        href={productEditUrl}
                        className="relative group block"
                      >
                        <div className="relative w-16 h-16 overflow-hidden rounded-lg">
                          <Image 
                            src={item.image} 
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            priority={index < 3}
                          />
                        </div>
                        {/* Large preview on hover - 6x size */}
                        <div className="absolute top-0 left-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                          <div className="relative w-96 h-96 bg-white rounded-lg shadow-2xl border-2 border-gray-300 overflow-hidden">
                            <Image 
                              src={item.image} 
                              alt={item.product.name}
                              fill
                              className="object-contain"
                              sizes="384px"
                              quality={100}
                              unoptimized
                            />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="relative group flex-shrink-0">
                      <div className="relative w-16 h-16 overflow-hidden rounded-lg">
                        <Image 
                          src={item.image} 
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                          priority={index < 3}
                        />
                        {/* Large preview on hover - 6x size */}
                        <div className="absolute top-0 left-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                          <div className="relative w-96 h-96 bg-white rounded-lg shadow-2xl border-2 border-gray-300 overflow-hidden">
                            <Image 
                              src={item.image} 
                              alt={item.product.name}
                              fill
                              className="object-contain"
                              sizes="384px"
                              quality={100}
                              unoptimized
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={24} className="text-gray-400" />
                  </div>
                )}
                
                {/* Product Details */}
                <div>
                  <div className="flex items-center gap-2">
                    {canLinkToProduct ? (
                      <>
                        <Link 
                          href={productEditUrl}
                          className="font-medium text-black hover:text-blue-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <span className="text-xs text-gray-400">
                          (ID: {item.product.id})
                        </span>
                      </>
                    ) : (
                      <h3 className="font-medium text-black">{item.product.name}</h3>
                    )}
                    <CopyButton text={item.product.name} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {item.quantity}x {formatPrice(item.price)}
                  </p>
                  {/* Variant Information */}
                  {(item.variantName || item.variantColor || item.size || item.color) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.variantName && item.variantName}
                      {item.variantName && item.variantColor && ' - '}
                      {item.variantColor && !item.variantName && item.variantColor}
                      {(item.variantName || item.variantColor) && (item.size || item.color) && ' • '}
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' • '}
                      {item.color && `Color: ${item.color}`}
                    </p>
                  )}
                </div>
              </div>
              <p className="font-medium text-black">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          );
        })}

        {/* Delivery Method */}
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
              {deliveryMethod.price > 0 ? formatPrice(deliveryMethod.price) : 'Free'}
            </p>
          </div>
        )}

        {/* Payment Method */}
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
              {paymentMethod.price > 0 ? formatPrice(paymentMethod.price) : 'Free'}
            </p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="mt-6 pt-4 border-t space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal (products)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {deliveryMethod && deliveryMethod.price > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{formatPrice(deliveryMethod.price)}</span>
          </div>
        )}
        {paymentMethod && paymentMethod.price > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Payment fee</span>
            <span>{formatPrice(paymentMethod.price)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
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

  // Format date once
  const formattedDate = formatDateWithTimezone(order.createdAt);

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
            Order #{order.orderNumber}
          </h1>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items with Suspense */}
          <Suspense fallback={<OrderItemsSkeleton />}>
            <OrderItems order={order} />
          </Suspense>

          {/* Customer Information */}
          <CustomerInfoEdit
            orderNumber={order.orderNumber}
            billingFirstName={order.billingFirstName || order.firstName || ''}
            billingLastName={order.billingLastName || order.lastName || ''}
            customerEmail={order.customerEmail}
            customerPhone={order.customerPhone}
            isCompany={order.isCompany}
            companyName={order.companyName}
            companyNip={order.companyNip}
          />

          {/* Addresses */}
          <AddressEdit
            orderNumber={order.orderNumber}
            billingFirstName={order.billingFirstName || order.firstName || ''}
            billingLastName={order.billingLastName || order.lastName || ''}
            billingAddress={order.billingAddress || order.address || ''}
            billingCity={order.billingCity || order.city || ''}
            billingPostalCode={order.billingPostalCode || order.postalCode || ''}
            useDifferentDelivery={order.useDifferentDelivery}
            deliveryFirstName={order.deliveryFirstName}
            deliveryLastName={order.deliveryLastName}
            deliveryAddress={order.deliveryAddress}
            deliveryCity={order.deliveryCity}
            deliveryPostalCode={order.deliveryPostalCode}
            isCompany={order.isCompany}
          />

          {/* Admin Notes */}
          <AdminNotes 
            orderNumber={order.orderNumber}
            initialNotes={order.adminNotes}
          />

          {/* Comments */}
          <Comments 
            orderNumber={order.orderNumber}
            initialComments={order.comments}
          />

          {/* Order History */}
          <OrderHistory history={order.history.map(h => ({
            ...h,
            createdAt: h.createdAt.toISOString()
          }))} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Order Information</h2>
            <div className="space-y-2 text-sm">
              <p className="text-black">
                <strong>Created:</strong><br />
                {formattedDate}
              </p>
              
              <div className="pt-3 mt-3">
                <p className="text-black mb-1">
                  <strong>Payment status:</strong>
                </p>
                <span className={`inline-flex items-center gap-1 font-semibold ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {order.paymentStatus === 'paid' ? (
                    <>
                      <CheckCircle size={16} />
                      Paid
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Unpaid
                    </>
                  )}
                </span>
              </div>

              {order.trackingNumber && (
                <div className="pt-3">
                  <p className="text-black">
                    <strong>Tracking number:</strong><br />
                    <span className="text-blue-600">{order.trackingNumber}</span>
                  </p>
                </div>
              )}
              
              {order.note && (
                <div className="pt-3">
                  <p className="text-black">
                    <strong>Customer note:</strong><br />
                    {order.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Actions */}
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