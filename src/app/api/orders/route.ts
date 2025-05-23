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
    
    // Create order
    const order = await prisma.order.create({
      data: {
        customerEmail: body.email,
        customerName: `${body.firstName} ${body.lastName}`,
        customerPhone: body.phone,
        items: body.items,
        total: body.total,
        status: 'pending',
      },
    });
    
    // In a real app, you would:
    // 1. Send confirmation email
    // 2. Process payment if card payment
    // 3. Notify warehouse
    // 4. Create invoice
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}