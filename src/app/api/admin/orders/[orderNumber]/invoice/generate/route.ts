// src/app/api/admin/orders/[orderNumber]/invoice/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth-middleware';
import { put } from '@vercel/blob';
import { generateInvoicePDF } from '@/lib/invoice-pdf-generator';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const authResponse = await checkAuth(request);
  if (authResponse) return authResponse;

  const { orderNumber } = await params;

  try {
    // Fetch order by orderNumber with complete data
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

    // Check if invoice already exists
    if (order.invoice) {
      return NextResponse.json(
        { error: 'Invoice already exists', invoice: order.invoice },
        { status: 200 }
      );
    }

    // Generate invoice number
    const year = new Date().getFullYear();
    const count = await prisma.invoice.count({
      where: {
        invoiceNumber: {
          startsWith: `FAK${year}`
        }
      }
    });
    
    const invoiceNumber = `FAK${year}${order.orderNumber}`;

    // Create invoice record - NO VAT since Galaxy Sklep is not a VAT payer
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
      
      // Prepare invoice data in the format expected by generateInvoicePDF
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
        billingCountry: 'Polska', // Default to Poland
        billingCompany: order.companyName || '', // Company name from order
        billingNip: order.companyNip || '', // Company NIP from order
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
        paymentMethod: order.paymentMethod || 'bank',
        deliveryMethod: order.deliveryMethod || 'courier',
        notes: order.note || ''
      };
      
      // Generate PDF (returns jsPDF instance)
      const pdfDoc = generateInvoicePDF(invoiceData);
      
      // Convert jsPDF to Buffer
      const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
      
      // Upload to Vercel Blob Storage with a unique timestamp to avoid caching issues
      // This ensures we always get a fresh PDF even if regenerating
      const timestamp = Date.now();
      const { url } = await put(
        `invoices/${invoiceNumber}_${timestamp}.pdf`,
        pdfBuffer,
        {
          access: 'public',
          contentType: 'application/pdf',
          addRandomSuffix: false,
          cacheControlMaxAge: 0, // Disable caching
        }
      );

      // Update invoice with PDF URL
      const updatedInvoice = await prisma.invoice.update({
        where: { id: invoice.id },
        data: { pdfUrl: url }
      });

      // Add to order history
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          action: 'invoice_generated',
          description: `Faktura ${invoiceNumber} została wygenerowana`,
          newValue: invoiceNumber,
          metadata: {
            invoiceId: invoice.id,
            generatedBy: 'Admin'
          }
        }
      });

      return NextResponse.json({ 
        success: true, 
        invoice: updatedInvoice 
      });

    } catch (pdfError) {
      // If PDF generation fails, delete the invoice record
      await prisma.invoice.delete({
        where: { id: invoice.id }
      });
      throw pdfError;
    }

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}