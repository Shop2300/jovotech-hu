// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/email/email-service';
import { getDeliveryMethodLabel, getPaymentMethodLabel } from '@/lib/order-options';
import { put } from '@vercel/blob';
import { generateInvoicePDF } from '@/lib/invoice-pdf-generator';

// Generate order number
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}${day}-${random}`;
}

// Generate invoice function (extracted from invoice generate route)
async function generateInvoice(order: any) {
  try {
    // Generate invoice number
    const year = new Date().getFullYear();
    const invoiceNumber = `FAK${year}${order.orderNumber}`;

    // Create invoice record - NO VAT since not a VAT payer
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        totalAmount: order.total,
        vatAmount: 0, // No VAT - not a VAT payer
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        status: 'issued',
        issuedAt: new Date()
      }
    });

    // Generate PDF
    try {
      // Parse order items
      const items = order.items as any[];
      
      // Ensure delivery and payment methods have values
      const deliveryMethod = order.deliveryMethod || 'zasilkovna';
      const paymentMethod = order.paymentMethod || 'bank';
      
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
        billingCountry: 'Magyarorszag', // Hungarian default
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
      
      // Generate PDF (returns jsPDF instance)
      const pdfDoc = generateInvoicePDF(invoiceData);
      
      // Convert jsPDF to Buffer
      const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
      
      // Upload to Vercel Blob Storage with a unique timestamp to avoid caching issues
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
          description: `Számla ${invoiceNumber} automatikusan létrehozva`,
          newValue: invoiceNumber,
          metadata: {
            invoiceId: invoice.id,
            generatedBy: 'System'
          }
        }
      });

      return updatedInvoice;

    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      // Keep the invoice record even if PDF generation fails
      // Admin can regenerate PDF later
      
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          action: 'invoice_generation_partial',
          description: `Számla ${invoiceNumber} létrehozva, de PDF generálás sikertelen`,
          newValue: invoiceNumber,
          metadata: {
            error: pdfError instanceof Error ? pdfError.message : 'Unknown error'
          }
        }
      });
      
      return invoice; // Return invoice even without PDF
    }

  } catch (error) {
    console.error('Error generating invoice:', error);
    // Don't throw - just log the error
    // Order should succeed even if invoice fails
    return null;
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received order data:', data);
    
    // Validate required fields
    const requiredFields = [
      'customerEmail', 
      'customerPhone',
      'billingFirstName',
      'billingLastName',
      'billingAddress',
      'billingCity',
      'billingPostalCode',
      'items',
      'deliveryMethod',
      'paymentMethod'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate items array
    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Generate unique order number
    const orderNumber = generateOrderNumber();
    console.log('Generated order number:', orderNumber);
    
    // Calculate total
    const total = data.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Prepare delivery address fields
    const deliveryFirstName = data.useDifferentDelivery ? data.deliveryFirstName : data.billingFirstName;
    const deliveryLastName = data.useDifferentDelivery ? data.deliveryLastName : data.billingLastName;
    const deliveryAddress = data.useDifferentDelivery ? data.deliveryAddress : data.billingAddress;
    const deliveryCity = data.useDifferentDelivery ? data.deliveryCity : data.billingCity;
    const deliveryPostalCode = data.useDifferentDelivery ? data.deliveryPostalCode : data.billingPostalCode;
    
    // Create order with 'processing' status instead of 'pending'
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: data.customerEmail,
        customerName: `${data.billingFirstName} ${data.billingLastName}`.trim(),
        customerPhone: data.customerPhone,
        isCompany: data.isCompany || false,
        companyName: data.companyName || null,
        companyNip: data.companyNip || null,
        billingFirstName: data.billingFirstName,
        billingLastName: data.billingLastName,
        billingAddress: data.billingAddress,
        billingCity: data.billingCity,
        billingPostalCode: data.billingPostalCode,
        useDifferentDelivery: data.useDifferentDelivery || false,
        deliveryFirstName: deliveryFirstName,
        deliveryLastName: deliveryLastName,
        deliveryAddress: deliveryAddress,
        deliveryCity: deliveryCity,
        deliveryPostalCode: deliveryPostalCode,
        // Legacy fields for backward compatibility
        firstName: data.billingFirstName,
        lastName: data.billingLastName,
        address: data.billingAddress,
        city: data.billingCity,
        postalCode: data.billingPostalCode,
        items: data.items, // Store as JSON
        total: total,
        status: 'processing', // Changed from 'pending' to 'processing'
        paymentStatus: 'unpaid',
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        note: data.note || null,
        trackingNumber: null,
      }
    });
    
    console.log('Order created successfully with processing status:', order.orderNumber);
    
    // Create order history entry
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        action: 'order_created',
        description: 'Megrendelés létrehozva', // Hungarian text
        newValue: 'processing',
        performedBy: 'Customer',
        metadata: {
          customerEmail: data.customerEmail,
          total: total,
          itemCount: data.items.length
        }
      }
    });

    // Add status change history entry
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        action: 'status_change',
        description: 'Megrendelés státusza: Feldolgozás alatt', // Hungarian text
        oldValue: 'pending',
        newValue: 'processing',
        performedBy: 'System',
        metadata: {
          autoProcessed: true
        }
      }
    });
    
    // Generate invoice immediately
    try {
      console.log('Generating invoice for order:', order.orderNumber);
      const invoice = await generateInvoice(order);
      if (invoice) {
        console.log('Invoice generated successfully:', invoice.invoiceNumber);
      }
    } catch (invoiceError) {
      console.error('Failed to generate invoice:', invoiceError);
      // Don't fail the order creation if invoice generation fails
      // Admin can manually generate it later
    }
    
    // Update product stock and sold count
    for (const item of data.items) {
      if (item.id) {
        try {
          await prisma.product.update({
            where: { id: item.id },
            data: {
              stock: { decrement: item.quantity },
              soldCount: { increment: item.quantity }
            }
          });
        } catch (error) {
          console.error(`Failed to update stock for product ${item.id}:`, error);
          // Continue with order creation even if stock update fails
        }
      }
    }
    
    // Send order confirmation email
    try {
      console.log('Sending order confirmation email to:', data.customerEmail);
      
      // Get product details for email
      const productIds = data.items.map((item: any) => item.id).filter(Boolean);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { category: true }
      });
      
      const productMap = new Map(products.map(p => [p.id, p]));
      
      // Enhance items with full details for email
      const emailItems = data.items.map((item: any) => {
        const product = productMap.get(item.id);
        return {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          productSlug: product?.slug || null,
          categorySlug: product?.category?.slug || null
        };
      });
      
      await EmailService.sendOrderConfirmation({
        orderNumber: orderNumber,
        customerEmail: data.customerEmail,
        customerName: `${data.billingFirstName} ${data.billingLastName}`.trim(),
        customerPhone: data.customerPhone,
        companyName: data.companyName || null,
        companyNip: data.companyNip || null,
        items: emailItems,
        total: total,
        deliveryMethod: getDeliveryMethodLabel(data.deliveryMethod, 'pl'),
        paymentMethod: getPaymentMethodLabel(data.paymentMethod, 'pl'),
        deliveryAddress: {
          street: deliveryAddress,
          city: deliveryCity,
          postalCode: deliveryPostalCode
        },
        billingAddress: data.useDifferentDelivery ? {
          street: data.billingAddress,
          city: data.billingCity,
          postalCode: data.billingPostalCode
        } : undefined,
        orderDate: new Date()
      });
      
      console.log('Order confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }
    
    return NextResponse.json({
      success: true,
      orderNumber: orderNumber,
      total: total,
      paymentMethod: data.paymentMethod
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('P2002')) {
        return NextResponse.json(
          { error: 'Order number already exists. Please try again.' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('P2003')) {
        return NextResponse.json(
          { error: 'Invalid product or category reference' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/orders - List orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // This endpoint could be protected for admin use
    // For now, it returns an error
    return NextResponse.json(
      { error: 'This endpoint requires authentication' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}