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
    
    // Find order with invoice by order number
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { invoice: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (!order.invoice) {
      return NextResponse.json(
        { error: 'Invoice not found for this order' },
        { status: 404 }
      );
    }

    // Try to fetch from URL if exists
    if (order.invoice.pdfUrl && order.invoice.pdfUrl.startsWith('http')) {
      try {
        const response = await fetch(order.invoice.pdfUrl);
        
        if (response.ok) {
          const pdfBuffer = await response.arrayBuffer();
          
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="Faktura-${order.invoice.invoiceNumber}.pdf"`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
        }
      } catch (fetchError) {
        console.error('Failed to fetch PDF from URL, generating new one:', fetchError);
      }
    }

    // Generate PDF on-the-fly as fallback
    console.log('Generating PDF on-the-fly for invoice:', order.invoice.invoiceNumber);
    
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
      invoiceNumber: order.invoice.invoiceNumber,
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
        'Content-Disposition': `attachment; filename="Faktura-${order.invoice.invoiceNumber}.pdf"`,
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