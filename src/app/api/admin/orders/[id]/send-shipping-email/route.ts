// src/app/api/admin/orders/[id]/send-shipping-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/email/email-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch the order
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order has tracking number
    if (!order.trackingNumber) {
      return NextResponse.json(
        { error: 'Order has no tracking number' },
        { status: 400 }
      );
    }

    // Parse items
    const items = order.items as any[];
    
    // Prepare email data
    const emailData = {
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerName: order.customerName || `${order.firstName} ${order.lastName}`,
      trackingNumber: order.trackingNumber,
      items: items,
      deliveryAddress: {
        street: order.deliveryAddress || order.billingAddress || order.address,
        city: order.deliveryCity || order.billingCity || order.city,
        postalCode: order.deliveryPostalCode || order.billingPostalCode || order.postalCode,
      },
    };

    // Send shipping notification
    await EmailService.sendShippingNotification(emailData);
    
    // Add history entry for email sent
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        action: 'email_sent',
        description: 'Informace o odeslání zásilky zaslány na email (manuálně)',
        newValue: order.customerEmail,
        metadata: {
          emailType: 'shipping_notification',
          trackingNumber: order.trackingNumber,
          manual: true
        }
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Shipping notification email sent successfully' 
    });

  } catch (error) {
    console.error('Failed to send shipping email:', error);
    return NextResponse.json(
      { error: 'Failed to send shipping email' },
      { status: 500 }
    );
  }
}