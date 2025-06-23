// src/app/api/admin/orders/[orderNumber]/resend-confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth-middleware';
import { EmailService } from '@/lib/email/email-service';
import { getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const authResponse = await checkAuth(request);
  if (authResponse) return authResponse;

  const { orderNumber } = await params;

  try {
    // Fetch order with all details
    const order = await prisma.order.findUnique({
      where: { orderNumber }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare order data for email
    const items = order.items as any[];
    
    // Get delivery and payment method labels
    const deliveryMethod = getDeliveryMethod(order.deliveryMethod || 'zasilkovna');
    const paymentMethod = getPaymentMethod(order.paymentMethod || 'bank');
    
    // Prepare delivery address
    const deliveryAddress = order.useDifferentDelivery
      ? {
          street: order.deliveryAddress || '',
          city: order.deliveryCity || '',
          postalCode: order.deliveryPostalCode || ''
        }
      : {
          street: order.billingAddress || order.address || '',
          city: order.billingCity || order.city || '',
          postalCode: order.billingPostalCode || order.postalCode || ''
        };

    // Send confirmation email
    await EmailService.sendOrderConfirmation({
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      companyName: order.companyName,
      companyNip: order.companyNip,
      items: items.map(item => ({
        name: item.name || 'Produkt',
        quantity: item.quantity,
        price: item.price,
        image: item.image || null
      })),
      total: Number(order.total),
      deliveryMethod: deliveryMethod?.labelPl || 'Dostawa',
      paymentMethod: paymentMethod?.labelPl || 'Płatność',
      deliveryAddress: deliveryAddress
    });

    // Add to order history
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        action: 'email_sent',
        description: 'Potwierdzenie zamówienia zostało ponownie wysłane do klienta',
        newValue: 'order_confirmation_resent',
        metadata: { 
          changedBy: 'Admin',
          emailType: 'order_confirmation',
          sentTo: order.customerEmail
        }
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Email potwierdzenia został wysłany ponownie'
    });

  } catch (error) {
    console.error('Error resending order confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to resend order confirmation' },
      { status: 500 }
    );
  }
}