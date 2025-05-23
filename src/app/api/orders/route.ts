// src/app/api/orders/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('Received order data:', body);
    
    const orderNumber = generateOrderNumber();
    
    // Create order with all fields
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        customerEmail: body.email,
        customerName: `${body.firstName} ${body.lastName}`,
        customerPhone: body.phone,
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        items: body.items,
        total: body.total,
        deliveryMethod: body.deliveryMethod,
        paymentMethod: body.paymentMethod,
        note: body.note || null,
        status: 'pending',
      },
    });
    
    console.log('Order created successfully:', order);
    
    return NextResponse.json({ 
      id: orderNumber,
      success: true,
      order: order 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error },
      { status: 500 }
    );
  }
}