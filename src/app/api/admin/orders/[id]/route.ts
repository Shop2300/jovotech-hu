// src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/email/email-service';

// Helper function to get status label
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Čeká na vyřízení',
    processing: 'Zpracovává se',
    shipped: 'Odesláno',
    delivered: 'Doručeno',
    cancelled: 'Zrušeno'
  };
  return labels[status] || status;
}

// Helper function to get payment status label
function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    paid: 'Zaplaceno',
    unpaid: 'Nezaplaceno'
  };
  return labels[status] || status;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const order = await prisma.order.findUnique({
      where: { id },
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

    // Transform the order to include fullName
    const transformedOrder = {
      ...order,
      fullName: `${order.firstName} ${order.lastName}`,
      total: Number(order.total),
      paymentStatus: order.paymentStatus || 'unpaid',
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber, paymentStatus } = body;

    console.log('Order update request:', { id, status, trackingNumber, paymentStatus });

    // Fetch current order to get old values
    const currentOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Current order state:', { 
      status: currentOrder.status, 
      trackingNumber: currentOrder.trackingNumber,
      paymentStatus: currentOrder.paymentStatus
    });

    // Build update data object
    const updateData: any = {};
    const historyEntries: any[] = [];
    let shouldSendShippingEmail = false;

    // Handle status update
    if (status !== undefined && status !== currentOrder.status) {
      updateData.status = status;
      historyEntries.push({
        action: 'status_change',
        description: `Stav objednávky změněn z "${getStatusLabel(currentOrder.status)}" na "${getStatusLabel(status)}"`,
        oldValue: currentOrder.status,
        newValue: status
      });

      // Check if we should send shipping email
      if (status === 'shipped' && (trackingNumber || currentOrder.trackingNumber)) {
        shouldSendShippingEmail = true;
        console.log('Will send shipping email: status changed to shipped and tracking number exists');
      }
    }

    // Handle payment status update
    if (paymentStatus !== undefined && paymentStatus !== currentOrder.paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      historyEntries.push({
        action: 'payment_status_change',
        description: `Stav platby změněn z "${getPaymentStatusLabel(currentOrder.paymentStatus || 'unpaid')}" na "${getPaymentStatusLabel(paymentStatus)}"`,
        oldValue: currentOrder.paymentStatus || 'unpaid',
        newValue: paymentStatus
      });
    }

    // Handle tracking number update
    if (trackingNumber !== undefined && trackingNumber !== currentOrder.trackingNumber) {
      updateData.trackingNumber = trackingNumber;
      
      if (!currentOrder.trackingNumber && trackingNumber) {
        // Adding new tracking number
        historyEntries.push({
          action: 'tracking_added',
          description: `Přidáno sledovací číslo: ${trackingNumber}`,
          newValue: trackingNumber
        });

        // Check if we should send shipping email
        if (currentOrder.status === 'shipped' || status === 'shipped') {
          shouldSendShippingEmail = true;
          console.log('Will send shipping email: tracking number added and order is/will be shipped');
        }
      } else if (currentOrder.trackingNumber && trackingNumber) {
        // Updating existing tracking number
        historyEntries.push({
          action: 'tracking_updated',
          description: `Sledovací číslo změněno z "${currentOrder.trackingNumber}" na "${trackingNumber}"`,
          oldValue: currentOrder.trackingNumber,
          newValue: trackingNumber
        });
      } else if (currentOrder.trackingNumber && !trackingNumber) {
        // Removing tracking number
        historyEntries.push({
          action: 'tracking_removed',
          description: `Sledovací číslo odstraněno`,
          oldValue: currentOrder.trackingNumber
        });
      }
    }

    // Perform the update with history entries
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        history: {
          create: historyEntries
        }
      },
      include: { 
        invoice: true,
        history: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Send shipping notification email if conditions are met
    if (shouldSendShippingEmail) {
      // Use the new tracking number if provided, otherwise use the existing one
      const finalTrackingNumber = trackingNumber || currentOrder.trackingNumber;
      
      console.log('Checking if should send email:', { 
        shouldSendShippingEmail, 
        finalTrackingNumber,
        currentOrderTrackingNumber: currentOrder.trackingNumber,
        newTrackingNumber: trackingNumber
      });
      
      if (finalTrackingNumber) {
        try {
          // Parse items
          const items = order.items as any[];
          
          // Prepare email data
          const emailData = {
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            customerName: order.customerName || `${order.firstName} ${order.lastName}`,
            trackingNumber: finalTrackingNumber,
            items: items,
            deliveryAddress: {
              street: order.deliveryAddress || order.billingAddress || order.address,
              city: order.deliveryCity || order.billingCity || order.city,
              postalCode: order.deliveryPostalCode || order.billingPostalCode || order.postalCode,
            },
          };

          // Send shipping notification
          console.log('Sending shipping notification email to:', order.customerEmail);
          await EmailService.sendShippingNotification(emailData);
          
          // Add history entry for email sent
          await prisma.orderHistory.create({
            data: {
              orderId: order.id,
              action: 'email_sent',
              description: 'Informace o odeslání zásilky zaslány na email',
              newValue: order.customerEmail,
              metadata: {
                emailType: 'shipping_notification',
                trackingNumber: finalTrackingNumber
              }
            }
          });
        } catch (emailError) {
          console.error('Failed to send shipping notification email:', emailError);
          // Don't fail the update if email fails
        }
      } else {
        console.log('Cannot send shipping email: No tracking number available');
      }
    }

    // Transform the order to include fullName
    const transformedOrder = {
      ...order,
      fullName: `${order.firstName} ${order.lastName}`,
      total: Number(order.total),
      paymentStatus: order.paymentStatus || 'unpaid',
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Note: Invoice and history will be deleted automatically due to cascade delete
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}