// src/app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma';
import { OrdersTable } from '@/components/admin/OrdersTable';

async function updateOldPendingOrders() {
  // Find orders that are:
  // 1. In "pending" status
  // 2. Created more than 30 minutes ago
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  const oldPendingOrders = await prisma.order.findMany({
    where: {
      status: 'pending',
      createdAt: {
        lt: thirtyMinutesAgo
      }
    }
  });

  // Update each old pending order to "processing"
  for (const order of oldPendingOrders) {
    try {
      // Update the order status
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: 'processing',
          updatedAt: new Date()
        }
      });

      // Create order history entry
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          action: 'status_change',
          description: 'Stav objednávky automaticky změněn na "Zpracovává se" po 30 minutách',
          oldValue: 'pending',
          newValue: 'processing',
          performedBy: 'System',
          metadata: {
            automaticUpdate: true,
            minutesElapsed: 30
          }
        }
      });

      console.log(`Automatically updated order ${order.orderNumber} from pending to processing`);
    } catch (error) {
      console.error(`Failed to update order ${order.orderNumber}:`, error);
    }
  }
}

async function getOrders() {
  // First, update any old pending orders
  await updateOldPendingOrders();
  
  // Then fetch all orders
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerEmail: true,
      firstName: true,
      lastName: true,
      billingFirstName: true,
      billingLastName: true,
      total: true,
      status: true,
      paymentStatus: true,
      trackingNumber: true,
      createdAt: true,
    },
  });

  // Transform the orders to include fullName with proper fallbacks
  return orders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    fullName: order.customerName || 
      (order.billingFirstName && order.billingLastName 
        ? `${order.billingFirstName} ${order.billingLastName}`
        : order.firstName && order.lastName
          ? `${order.firstName} ${order.lastName}`
          : order.customerEmail || 'Unknown Customer'),
    total: Number(order.total),
    status: order.status,
    paymentStatus: order.paymentStatus || 'unpaid',
    trackingNumber: order.trackingNumber,
    createdAt: order.createdAt,
  }));
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-black">Správa objednávek</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Zatím nemáte žádné objednávky.
          </p>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 space-y-1">
              <p className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                Objednávky ve stavu "Čeká na vyřízení" se automaticky změní na "Zpracovává se" po 30 minutách.
              </p>
              <p className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                Nezapomeňte označit objednávky jako zaplacené po přijetí platby.
              </p>
            </div>
            <OrdersTable orders={orders} />
          </>
        )}
      </div>
    </div>
  );
}