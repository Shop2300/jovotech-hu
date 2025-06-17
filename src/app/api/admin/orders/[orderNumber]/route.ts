// src/app/api/admin/orders/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth-middleware';
import { EmailService } from '@/lib/email/email-service';

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
    // First, find the order by orderNumber to get its ID and current data
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
      select: { 
        id: true, 
        status: true, 
        paymentStatus: true,
        customerEmail: true,
        customerName: true,
        items: true,
        deliveryAddress: true,
        billingAddress: true,
        deliveryCity: true,
        deliveryPostalCode: true,
        billingCity: true,
        billingPostalCode: true,
        useDifferentDelivery: true,
        trackingNumber: true
      }
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
        pending: 'Oczekuje na realizację',
        processing: 'W trakcie realizacji',
        shipped: 'Wysłane',
        delivered: 'Dostarczone',
        cancelled: 'Anulowane'
      };

      historyEntries.push({
        orderId: existingOrder.id,
        action: 'status_change',
        description: `Status zamówienia zmieniony na: ${statusLabels[data.status] || data.status}`,
        oldValue: existingOrder.status,
        newValue: data.status,
        metadata: { changedBy: 'Admin' }
      });

      // Check if status is being changed to "shipped"
      if (data.status === 'shipped' && existingOrder.status !== 'shipped') {
        // Check if we have a tracking number
        const trackingNumber = data.trackingNumber || existingOrder.trackingNumber;
        
        if (!trackingNumber) {
          return NextResponse.json(
            { error: 'Numer śledzenia jest wymagany do wysyłki' },
            { status: 400 }
          );
        }

        // Send shipping notification email
        try {
          console.log('Sending shipping notification email for order:', orderNumber);
          
          // Parse items from JSON
          const items = existingOrder.items as any[];
          
          // Prepare delivery address
          const deliveryAddress = existingOrder.useDifferentDelivery
            ? {
                street: existingOrder.deliveryAddress || '',
                city: existingOrder.deliveryCity || '',
                postalCode: existingOrder.deliveryPostalCode || ''
              }
            : {
                street: existingOrder.billingAddress || '',
                city: existingOrder.billingCity || '',
                postalCode: existingOrder.billingPostalCode || ''
              };

          await EmailService.sendShippingNotification({
            orderNumber: orderNumber,
            customerEmail: existingOrder.customerEmail,
            customerName: existingOrder.customerName,
            trackingNumber: trackingNumber,
            items: items.map(item => ({
              name: item.name || 'Produkt',
              quantity: item.quantity,
              price: item.price
            })),
            deliveryAddress: deliveryAddress
          });

          console.log('Shipping notification email sent successfully');
          
          historyEntries.push({
            orderId: existingOrder.id,
            action: 'email_sent',
            description: 'E-mail z informacją o wysyłce został wysłany do klienta',
            newValue: 'shipping_notification',
            metadata: { 
              changedBy: 'Admin',
              trackingNumber: trackingNumber,
              emailSent: true
            }
          });
        } catch (emailError) {
          console.error('Failed to send shipping notification email:', emailError);
          // Don't fail the status update if email fails
          // But add a note to history
          historyEntries.push({
            orderId: existingOrder.id,
            action: 'email_failed',
            description: 'Nie udało się wysłać e-maila z informacją o wysyłce',
            newValue: 'shipping_notification_failed',
            metadata: { 
              changedBy: 'Admin',
              error: emailError instanceof Error ? emailError.message : 'Unknown error'
            }
          });
        }
      }
    }

    // Track payment status changes
    if (data.paymentStatus && data.paymentStatus !== existingOrder.paymentStatus) {
      updateData.paymentStatus = data.paymentStatus;
      
      historyEntries.push({
        orderId: existingOrder.id,
        action: 'payment_status_change',
        description: `Status płatności zmieniony na: ${data.paymentStatus === 'paid' ? 'Opłacone' : 'Nieopłacone'}`,
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
          description: `Dodano numer śledzenia: ${data.trackingNumber}`,
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