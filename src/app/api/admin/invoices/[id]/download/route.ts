// src/app/api/admin/invoices/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth-middleware';
import { generateInvoicePDF } from '@/lib/invoice-pdf-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Add authentication check
  const authResponse = await checkAuth(request);
  if (authResponse) return authResponse;

  try {
    const { id } = await params;
    
    // Fetch the invoice with order data
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: true
      }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // If PDF URL exists, fetch and return it
    if (invoice.pdfUrl) {
      // Check if it's a Blob URL (starts with http)
      if (invoice.pdfUrl.startsWith('http')) {
        // Fetch the PDF from Blob storage
        const response = await fetch(invoice.pdfUrl);
        
        if (!response.ok) {
          console.error('Failed to fetch from Blob storage, generating new PDF');
          // Fall through to generate new PDF
        } else {
          const pdfBuffer = await response.arrayBuffer();
          
          // Return the PDF with download headers
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
    const order = invoice.order;
    
    // Parse order items
    let items = [];
    try {
      items = typeof order.items === 'string' 
        ? JSON.parse(order.items as string)
        : order.items as any[];
    } catch (parseError) {
      console.error('Error parsing order items:', parseError);
      items = [];
    }
    
    // Prepare invoice data
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
    
    // Generate PDF
    const pdfDoc = generateInvoicePDF(invoiceData);
    
    // Convert to buffer
    const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
    
    // Return PDF as response
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