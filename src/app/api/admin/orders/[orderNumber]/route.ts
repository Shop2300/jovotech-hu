// src/app/api/admin/orders/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth-middleware';

// GET /api/admin/orders/[orderNumber]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const authResponse = await checkAuth(request);
  if (authResponse) return authResponse;

  const { orderNumber } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { 
        invoice: true,
        history: {
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

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/orders/[orderNumber]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const authResponse = await checkAuth(request);
  if (authResponse) return authResponse;

  const { orderNumber } = await params;

  try {
    // First, find the order by orderNumber to get its ID
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true, status: true, paymentStatus: true }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const updateData: any = {};
    const historyEntries: any[] = [];

    // Track status changes
    if (data.status && data.status !== existingOrder.status) {
      updateData.status = data.status;
      
      const statusLabels: Record<string, string> = {
        pending: 'Čeká na vyřízení',
        processing: 'Zpracovává se',
        shipped: 'Odesláno',
        delivered: 'Doručeno',
        cancelled: 'Zrušeno'
      };

      historyEntries.push({
        orderId: existingOrder.id,
        action: 'status_change',
        description: `Stav objednávky změněn na: ${statusLabels[data.status] || data.status}`,
        oldValue: existingOrder.status,
        newValue: data.status,
        metadata: { changedBy: 'Admin' }
      });
    }

    // Track payment status changes
    if (data.paymentStatus && data.paymentStatus !== existingOrder.paymentStatus) {
      updateData.paymentStatus = data.paymentStatus;
      
      historyEntries.push({
        orderId: existingOrder.id,
        action: 'payment_status_change',
        description: `Stav platby změněn na: ${data.paymentStatus === 'paid' ? 'Zaplaceno' : 'Nezaplaceno'}`,
        oldValue: existingOrder.paymentStatus,
        newValue: data.paymentStatus,
        metadata: { changedBy: 'Admin' }
      });
    }

    // Track tracking number changes
    if (data.trackingNumber !== undefined) {
      updateData.trackingNumber = data.trackingNumber || null;
      
      if (data.trackingNumber) {
        historyEntries.push({
          orderId: existingOrder.id,
          action: 'tracking_added',
          description: `Přidáno sledovací číslo: ${data.trackingNumber}`,
          newValue: data.trackingNumber,
          metadata: { changedBy: 'Admin' }
        });
      }
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: updateData,
      include: { invoice: true }
    });

    // Create history entries
    if (historyEntries.length > 0) {
      await prisma.orderHistory.createMany({
        data: historyEntries
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/orders/[orderNumber]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const authResponse = await checkAuth(request);
  if (authResponse) return authResponse;

  const { orderNumber } = await params;

  try {
    // First check if order exists
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Delete using the ID (since cascade deletes work with ID relationships)
    await prisma.order.delete({
      where: { id: order.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}