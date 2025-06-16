// src/app/admin/orders/[orderNumber]/invoice/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { InvoiceTemplate } from '@/components/admin/InvoiceTemplate';

interface OrderItem {
  productId: string;
  name?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

export default async function InvoicePage({ 
  params 
}: { 
  params: Promise<{ orderNumber: string }> 
}) {
  const { orderNumber } = await params;
  
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { invoice: true }
  });

  if (!order || !order.invoice) {
    notFound();
  }

  // Parse items from JSON
  const items = (order.items as unknown) as OrderItem[];

  // Convert Date objects to strings and prepare data for the InvoiceTemplate
  const orderForTemplate = {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: items, // Use the parsed items
    total: Number(order.total), // Ensure total is a number
    invoice: {
      ...order.invoice,
      createdAt: order.invoice.createdAt.toISOString(),
      updatedAt: order.invoice.updatedAt.toISOString(),
      issuedAt: order.invoice.issuedAt.toISOString(),
      dueDate: order.invoice.dueDate.toISOString(),
      paidAt: order.invoice.paidAt ? order.invoice.paidAt.toISOString() : null,
      totalAmount: Number(order.invoice.totalAmount),
      vatAmount: Number(order.invoice.vatAmount)
    }
  };

  return (
    <InvoiceTemplate 
      order={orderForTemplate}
    />
  );
}
