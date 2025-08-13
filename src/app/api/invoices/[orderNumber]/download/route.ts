// src/app/api/invoices/[orderNumber]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice-pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    
    // Fetch the order with invoice
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        invoice: true
      }
    });

    if (!order || !order.invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoice = order.invoice;

    // If PDF URL exists, fetch and return it
    if (invoice.pdfUrl) {
      if (invoice.pdfUrl.startsWith('http')) {
        const response = await fetch(invoice.pdfUrl);
        
        if (response.ok) {
          const pdfBuffer = await response.arrayBuffer();
          
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
        }
      }
    }

    // Generate PDF on-the-fly if URL missing or fetch failed
    let items = [];
    try {
      items = typeof order.items === 'string' 
        ? JSON.parse(order.items as string)
        : order.items as any[];
    } catch (parseError) {
      console.error('Error parsing order items:', parseError);
      items = [];
    }
    
    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      customerEmail: order.customerEmail || '',
      customerPhone: order.customerPhone || '',
      billingFirstName: order.billingFirstName || order.firstName || '',
      billingLastName: order.billingLastName || order.lastName || '',
      billingAddress: order.billingAddress || order.address || '',
      billingCity: order.billingCity || order.city || '',
      billingPostalCode: order.billingPostalCode || order.postalCode || '',
      billingCountry: 'Magyarorszag',
      billingCompany: order.companyName || '',
      billingNip: order.companyNip || '',
      shippingFirstName: order.useDifferentDelivery ? (order.deliveryFirstName || '') : (order.billingFirstName || order.firstName || ''),
      shippingLastName: order.useDifferentDelivery ? (order.deliveryLastName || '') : (order.billingLastName || order.lastName || ''),
      shippingAddress: order.useDifferentDelivery ? (order.deliveryAddress || '') : (order.billingAddress || order.address || ''),
      shippingCity: order.useDifferentDelivery ? (order.deliveryCity || '') : (order.billingCity || order.city || ''),
      shippingPostalCode: order.useDifferentDelivery ? (order.deliveryPostalCode || '') : (order.billingPostalCode || order.postalCode || ''),
      items: items.map((item: any) => ({
        name: item.name || 'Product',
        quantity: item.quantity || 1,
        price: item.price || 0
      })),
      total: Number(order.total),
      paymentMethod: order.paymentMethod || 'bank',
      deliveryMethod: order.deliveryMethod || 'zasilkovna',
      notes: order.note || ''
    };
    
    const pdfDoc = generateInvoicePDF(invoiceData);
    const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Failed to download invoice:', error);
    return NextResponse.json(
      { error: 'Failed to download invoice' },
      { status: 500 }
    );
  }
}