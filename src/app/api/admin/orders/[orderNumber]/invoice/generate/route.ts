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
  let order: any = null; // Declare order in outer scope

  try {
    // Fetch order by orderNumber with complete data
    order = await prisma.order.findUnique({
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
        { 
          success: true,
          invoice: order.invoice,
          message: 'Invoice already exists'
        },
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

    // Create invoice record first (without PDF)
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        totalAmount: order.total,
        vatAmount: 0, // No VAT - not a VAT payer
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      }
    });

    try {
      // Parse order items - handle as JSON
      let items = [];
      try {
        items = typeof order.items === 'string' 
          ? JSON.parse(order.items as string)
          : order.items as any[];
      } catch (parseError) {
        console.error('Error parsing order items:', parseError);
        items = [];
      }
      
      // Ensure delivery and payment methods have values
      const deliveryMethod = order.deliveryMethod || 'zasilkovna';
      const paymentMethod = order.paymentMethod || 'bank';
      
      // Prepare invoice data in the format expected by generateInvoicePDF
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
        billingCountry: 'Magyarorszag', // Default to Hungary
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
        paymentMethod: paymentMethod,
        deliveryMethod: deliveryMethod,
        notes: order.note || ''
      };
      
      // Generate PDF (returns jsPDF instance)
      const pdfDoc = generateInvoicePDF(invoiceData);
      
      // Convert jsPDF to Buffer
      const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
      
      // Upload to Vercel Blob Storage with a unique timestamp
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
          description: `Invoice ${invoiceNumber} was generated`,
          newValue: invoiceNumber,
          metadata: {
            invoiceId: invoice.id,
            generatedBy: 'Admin'
          }
        }
      });

      return NextResponse.json({ 
        success: true, 
        invoice: updatedInvoice,
        message: 'Invoice generated successfully'
      });

    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      
      // Don't delete the invoice record - keep it even if PDF fails
      // Just log the error but keep the invoice record
      const updatedInvoice = await prisma.invoice.update({
        where: { id: invoice.id },
        data: { 
          pdfUrl: null // Mark that PDF generation failed
        }
      });

      // Still add to order history with error info
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          action: 'invoice_generation_partial',
          description: `Invoice ${invoiceNumber} created but PDF generation failed`,
          newValue: invoiceNumber,
          metadata: {
            invoiceId: invoice.id,
            error: pdfError instanceof Error ? pdfError.message : 'Unknown error'
          }
        }
      });

      return NextResponse.json({ 
        success: true, 
        invoice: updatedInvoice,
        warning: 'Invoice created but PDF generation failed. You can try regenerating it later.',
        error: pdfError instanceof Error ? pdfError.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Error generating invoice:', error);
    
    // Clean up any created invoice if the main process fails
    try {
      const partialInvoice = await prisma.invoice.findFirst({
        where: { 
          orderId: order?.id,
          pdfUrl: null 
        }
      });
      
      if (partialInvoice) {
        await prisma.invoice.delete({
          where: { id: partialInvoice.id }
        });
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate invoice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}