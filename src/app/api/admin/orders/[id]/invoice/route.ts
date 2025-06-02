// src/app/api/admin/orders/[id]/invoice/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Parse the JSON items
    const items = order.items as any[];

    // Transform the order data for the invoice
    const invoiceData = {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      billingFirstName: order.billingFirstName || order.firstName,
      billingLastName: order.billingLastName || order.lastName,
      billingAddress: order.billingAddress || order.address,
      billingCity: order.billingCity || order.city,
      billingPostalCode: order.billingPostalCode || order.postalCode,
      items: items,
      total: Number(order.total),
      paymentMethod: order.paymentMethod,
      deliveryMethod: order.deliveryMethod,
    };

    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error('Failed to fetch invoice data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice data' },
      { status: 500 }
    );
  }
}