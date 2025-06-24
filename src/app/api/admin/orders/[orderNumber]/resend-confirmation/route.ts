// src/app/api/admin/orders/[orderNumber]/resend-confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/email/email-service';
import { AUTH_CONFIG } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  // Check authentication
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token || token !== AUTH_CONFIG.ADMIN_TOKEN) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Fetch the order with product details
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get product details for slugs
    const orderItems = order.items as any[];
    const productIds = orderItems.map(item => item.productId || item.id);
    
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true }
    });

    // Create a map of product details
    const productMap = new Map(products.map(p => [p.id, p]));

    // Enhance items with slug information
    const itemsWithSlugs = orderItems.map(item => {
      const product = productMap.get(item.productId || item.id);
      return {
        ...item,
        productSlug: product?.slug || null,
        categorySlug: product?.category?.slug || null
      };
    });

    // Send the confirmation email
    await EmailService.sendOrderConfirmation({
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerPhone: order.customerPhone || undefined,
      companyName: order.companyName,
      companyNip: order.companyNip,
      items: itemsWithSlugs,
      total: order.total,
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      deliveryAddress: {
        street: order.useDifferentDelivery ? order.deliveryAddress! : order.billingAddress,
        city: order.useDifferentDelivery ? order.deliveryCity! : order.billingCity,
        postalCode: order.useDifferentDelivery ? order.deliveryPostalCode! : order.billingPostalCode,
      },
      billingAddress: {
        street: order.billingAddress,
        city: order.billingCity,
        postalCode: order.billingPostalCode,
      },
      orderDate: order.createdAt,
    });

    // Log the action in order history
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        action: 'email_resent',
        description: 'Potwierdzenie zamówienia zostało ponownie wysłane',
        metadata: {
          emailType: 'order_confirmation',
          sentTo: order.customerEmail,
          sentAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to resend confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to resend confirmation email' },
      { status: 500 }
    );
  }
}