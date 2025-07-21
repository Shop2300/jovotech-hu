// src/app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { put } from '@vercel/blob';
import { generateInvoicePDF } from '@/lib/invoice-pdf-generator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This function is used when admin manually changes order status to "processing"
// It's not called on page load anymore since orders are created as "processing"
async function generateInvoiceForOrder(order: any) {
  try {
    // Check if invoice already exists
    if (order.invoice) {
      console.log(`Invoice already exists for order ${order.orderNumber}`);
      return;
    }

    // Generate invoice number
    const year = new Date().getFullYear();
    const invoiceNumber = `FAK${year}${order.orderNumber}`;

    // Create invoice record
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        totalAmount: order.total,
        vatAmount: 0, // No VAT - not a VAT payer
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      }
    });

    // Generate PDF
    try {
      // Parse order items
      const items = order.items as any[];
      
      // Ensure delivery and payment methods have values
      const deliveryMethod = order.deliveryMethod || 'zasilkovna';
      const paymentMethod = order.paymentMethod || 'bank';
      
      // Prepare invoice data
      const invoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt.toISOString(),
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone || '',
        billingFirstName: order.billingFirstName || order.firstName || '',
        billingLastName: order.billingLastName || order.lastName || '',
        billingAddress: order.billingAddress || order.address || '',
        billingCity: order.billingCity || order.city || '',
        billingPostalCode: order.billingPostalCode || order.postalCode || '',
        billingCountry: 'Polska',
        billingCompany: order.companyName || '',
        billingNip: order.companyNip || '',
        shippingFirstName: order.useDifferentDelivery ? (order.deliveryFirstName || '') : (order.billingFirstName || ''),
        shippingLastName: order.useDifferentDelivery ? (order.deliveryLastName || '') : (order.billingLastName || ''),
        shippingAddress: order.useDifferentDelivery ? (order.deliveryAddress || '') : (order.billingAddress || ''),
        shippingCity: order.useDifferentDelivery ? (order.deliveryCity || '') : (order.billingCity || ''),
        shippingPostalCode: order.useDifferentDelivery ? (order.deliveryPostalCode || '') : (order.billingPostalCode || ''),
        items: items.map(item => ({
          name: item.name || 'Product',
          quantity: item.quantity,
          price: item.price
        })),
        total: Number(order.total),
        paymentMethod: paymentMethod,
        deliveryMethod: deliveryMethod,
        notes: order.note || ''
      };
      
      // Generate PDF
      const pdfDoc = generateInvoicePDF(invoiceData);
      
      // Convert to Buffer
      const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
      
      // Upload to Vercel Blob Storage
      const timestamp = Date.now();
      const { url } = await put(
        `invoices/${invoiceNumber}_${timestamp}.pdf`,
        pdfBuffer,
        {
          access: 'public',
          contentType: 'application/pdf',
          addRandomSuffix: false,
          cacheControlMaxAge: 0,
        }
      );

      // Update invoice with PDF URL
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { pdfUrl: url }
      });

      // Add to order history
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          action: 'invoice_generated',
          description: `Invoice ${invoiceNumber} was generated automatically`,
          newValue: invoiceNumber,
          metadata: {
            invoiceId: invoice.id,
            generatedBy: 'System',
            automaticGeneration: true
          }
        }
      });

      console.log(`Invoice ${invoiceNumber} generated automatically for order ${order.orderNumber}`);
    } catch (pdfError) {
      // If PDF generation fails, delete the invoice record
      await prisma.invoice.delete({
        where: { id: invoice.id }
      });
      throw pdfError;
    }
  } catch (error) {
    console.error(`Failed to generate invoice for order ${order.orderNumber}:`, error);
  }
}

async function getOrders() {
  // NOTE: Removed automatic pending->processing update since orders 
  // are now created with "processing" status immediately
  
  // Since orders are created as "processing" immediately,
  // we don't need to update pending orders anymore
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerEmail: true,
      total: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      deliveryMethod: true,
      createdAt: true,
      items: true,
      adminNotes: true,
      invoice: {
        select: {
          id: true,
          invoiceNumber: true
        }
      },
      // Only fetch name fields for fallback
      billingFirstName: true,
      billingLastName: true,
      firstName: true,
      lastName: true,
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
    hasAdminNotes: !!order.adminNotes,
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
      <h1 className="text-3xl font-bold mb-8 text-black">Order Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            You don't have any orders yet.
          </p>
        ) : (
          <OrdersTable orders={orders} />
        )}
      </div>
    </div>
  );
}