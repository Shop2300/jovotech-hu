// src/app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma';
import { OrdersTable } from '@/components/admin/OrdersTable';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
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
// Then fetch all orders with invoice relation
const orders = await prisma.order.findMany({
orderBy: {
createdAt: 'desc',
 },
include: {
invoice: true
 }
 });
// Transform the orders to match the OrdersTable interface
return orders.map(order => ({
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
paymentMethod: order.paymentMethod || undefined,
deliveryMethod: order.deliveryMethod || undefined,
createdAt: order.createdAt.toISOString(),
items: order.items,
invoice: order.invoice ? {
id: order.invoice.id,
invoiceNumber: order.invoice.invoiceNumber
 } : null
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
<OrdersTable orders={orders} />
 )}
</div>
</div>
 );
}