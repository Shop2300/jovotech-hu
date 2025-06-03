// src/app/api/order-status/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    
    // Find order by order number
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        history: {
          where: {
            action: {
              in: [
                'order_created',
                'status_change',
                'tracking_added',
                'tracking_updated',
                'email_sent',
                'payment_status_change'
              ]
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Parse items for display
    const items = order.items as any[];

    // Return limited order information (no sensitive data)
    const publicOrderData = {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus || 'unpaid',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingNumber: order.trackingNumber,
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      total: Number(order.total),
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      deliveryAddress: {
        city: order.deliveryCity || order.billingCity || order.city,
        postalCode: order.deliveryPostalCode || order.billingPostalCode || order.postalCode,
      },
      history: order.history.map(entry => ({
        id: entry.id,
        action: entry.action,
        description: entry.description,
        createdAt: entry.createdAt
      }))
    };

    return NextResponse.json(publicOrderData);
  } catch (error) {
    console.error('Failed to fetch order status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order status' },
      { status: 500 }
    );
  }
}