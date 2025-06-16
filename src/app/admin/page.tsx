// src/app/admin/page.tsx
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { OrdersTable } from '@/components/admin/OrdersTable';
import Link from 'next/link';

async function getAdminStats() {
  // Get all products and orders (without including items relation)
  const [products, orders] = await Promise.all([
    prisma.product.findMany(),
    prisma.order.findMany(), // Remove the include since items is JSON
  ]);

  // Calculate stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  // Get recent orders with correct field names and include invoice
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      invoice: true
    }
  });

  // Transform the orders to match OrdersTable interface
  const transformedOrders = recentOrders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName || 
      (order.billingFirstName && order.billingLastName 
        ? `${order.billingFirstName} ${order.billingLastName}`
        : order.firstName && order.lastName
          ? `${order.firstName} ${order.lastName}`
          : order.customerEmail || 'Unknown Customer'),
    customerEmail: order.customerEmail,
    total: Number(order.total),
    status: order.status,
    paymentStatus: order.paymentStatus || 'unpaid',
    createdAt: order.createdAt.toISOString(),
    invoice: order.invoice ? {
      id: order.invoice.id,
      invoiceNumber: order.invoice.invoiceNumber
    } : null
  }));

  return {
    totalProducts,
    totalOrders,
    totalRevenue,
    pendingOrders,
    recentOrders: transformedOrders,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-black">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Celkové tržby"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          color="green"
          trend="+12.5%"
          trendColor="text-green-600"
        />
        <StatsCard
          title="Počet objednávek"
          value={stats.totalOrders.toString()}
          icon={ShoppingCart}
          color="blue"
          trend="+3"
          trendColor="text-blue-600"
        />
        <StatsCard
          title="Produkty skladem"
          value={stats.totalProducts.toString()}
          icon={Package}
          color="purple"
        />
        <StatsCard
          title="Čekající objednávky"
          value={stats.pendingOrders.toString()}
          icon={TrendingUp}
          color="yellow"
          trend="Vyřídit"
          trendColor="text-yellow-600"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Poslední objednávky</h2>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800">
            Zobrazit vše →
          </Link>
        </div>
        <OrdersTable orders={stats.recentOrders} />
      </div>
    </div>
  );
}