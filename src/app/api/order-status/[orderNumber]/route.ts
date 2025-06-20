// src/app/api/order-status/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    
    // Find order by order number - NOW INCLUDING INVOICE
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        invoice: true, // Include invoice information
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

    // Determine delivery address based on useDifferentDelivery flag
    const deliveryStreet = order.useDifferentDelivery 
      ? order.deliveryAddress 
      : order.billingAddress || order.address;
      
    const deliveryCity = order.useDifferentDelivery
      ? order.deliveryCity
      : order.billingCity || order.city;
      
    const deliveryPostalCode = order.useDifferentDelivery
      ? order.deliveryPostalCode
      : order.billingPostalCode || order.postalCode;

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
        id: item.productId || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || null,
        variantName: item.variantName || null,
        variantColor: item.variantColor || null
      })),
      deliveryAddress: {
        street: deliveryStreet,
        city: deliveryCity,
        postalCode: deliveryPostalCode,
      },
      history: order.history.map(entry => ({
        id: entry.id,
        action: entry.action,
        description: entry.description,
        createdAt: entry.createdAt
      })),
      // Include invoice information if available
      invoice: order.invoice ? {
        id: order.invoice.id,
        invoiceNumber: order.invoice.invoiceNumber,
        status: order.invoice.status,
        issuedAt: order.invoice.issuedAt,
        pdfUrl: order.invoice.pdfUrl
      } : null
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