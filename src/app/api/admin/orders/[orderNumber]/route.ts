// src/app/api/admin/orders/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth-middleware';
import { EmailService } from '@/lib/email/email-service';
import { getDeliveryMethodLabel } from '@/lib/order-options';

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
      where: { orderNumber }
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
          
          // Get product details for slugs
          const productIds = items.map(item => item.productId || item.id);
          const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { category: true }
          });
          
          // Create a map of product details
          const productMap = new Map(products.map(p => [p.id, p]));
          
          // Enhance items with slug information
          const itemsWithSlugs = items.map(item => {
            const product = productMap.get(item.productId || item.id);
            return {
              name: item.name || 'Produkt',
              quantity: item.quantity,
              price: item.price,
              productSlug: product?.slug || null,
              categorySlug: product?.category?.slug || null
            };
          });
          
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

          // Get delivery method label
          const deliveryMethodLabel = getDeliveryMethodLabel(existingOrder.deliveryMethod, 'pl');

          await EmailService.sendShippingNotification({
            orderNumber: orderNumber,
            customerEmail: existingOrder.customerEmail,
            customerName: existingOrder.customerName,
            trackingNumber: trackingNumber,
            items: itemsWithSlugs,
            deliveryAddress: deliveryAddress,
            deliveryMethod: existingOrder.deliveryMethod,
            carrier: deliveryMethodLabel
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

      // Check if payment status is being changed to "paid"
      if (data.paymentStatus === 'paid' && existingOrder.paymentStatus !== 'paid') {
        // Send payment confirmation email
        try {
          console.log('Sending payment confirmation email for order:', orderNumber);
          
          // Parse items from JSON
          const items = existingOrder.items as any[];
          
          // Get product details for slugs and images
          const productIds = items.map(item => item.productId || item.id).filter(Boolean);
          const products = productIds.length > 0 ? await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { 
              category: true,
              images: {
                orderBy: { order: 'asc' },
                take: 1
              }
            }
          }) : [];
          
          // Create a map of product details
          const productMap = new Map(products.map(p => [p.id, p]));
          
          // Enhance items with slug and image information
          const itemsWithDetails = items.map(item => {
            const product = productMap.get(item.productId || item.id);
            return {
              name: item.name || product?.name || 'Produkt',
              quantity: item.quantity,
              price: item.price,
              image: item.image || (product?.images?.[0]?.url ? product.images[0].url : null),
              productSlug: product?.slug || null,
              categorySlug: product?.category?.slug || null
            };
          });
          
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

          await EmailService.sendPaymentConfirmation({
            orderNumber: orderNumber,
            customerEmail: existingOrder.customerEmail,
            customerName: existingOrder.customerName,
            items: itemsWithDetails,
            total: Number(existingOrder.total),
            deliveryMethod: existingOrder.deliveryMethod,
            paymentMethod: existingOrder.paymentMethod,
            deliveryAddress: deliveryAddress,
            paymentDate: new Date()
          });

          console.log('Payment confirmation email sent successfully');
          
          historyEntries.push({
            orderId: existingOrder.id,
            action: 'email_sent',
            description: 'E-mail z potwierdzeniem płatności został wysłany do klienta',
            newValue: 'payment_confirmation',
            metadata: { 
              changedBy: 'Admin',
              emailSent: true
            }
          });
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError);
          // Don't fail the payment status update if email fails
          // But add a note to history
          historyEntries.push({
            orderId: existingOrder.id,
            action: 'email_failed',
            description: 'Nie udało się wysłać e-maila z potwierdzeniem płatności',
            newValue: 'payment_confirmation_failed',
            metadata: { 
              changedBy: 'Admin',
              error: emailError instanceof Error ? emailError.message : 'Unknown error'
            }
          });
        }
      }
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

    // Handle customer information updates
    if (data.billingFirstName !== undefined) updateData.billingFirstName = data.billingFirstName;
    if (data.billingLastName !== undefined) updateData.billingLastName = data.billingLastName;
    if (data.customerEmail !== undefined) {
      updateData.customerEmail = data.customerEmail;
      // Update customerName based on first and last name
      if (data.billingFirstName || data.billingLastName) {
        updateData.customerName = `${data.billingFirstName || existingOrder.billingFirstName || ''} ${data.billingLastName || existingOrder.billingLastName || ''}`.trim();
      }
    }
    if (data.customerPhone !== undefined) updateData.customerPhone = data.customerPhone;
    if (data.isCompany !== undefined) updateData.isCompany = data.isCompany;
    if (data.companyName !== undefined) updateData.companyName = data.companyName;
    if (data.companyNip !== undefined) updateData.companyNip = data.companyNip;

    // Handle address updates
    if (data.billingAddress !== undefined) updateData.billingAddress = data.billingAddress;
    if (data.billingCity !== undefined) updateData.billingCity = data.billingCity;
    if (data.billingPostalCode !== undefined) updateData.billingPostalCode = data.billingPostalCode;
    
    if (data.useDifferentDelivery !== undefined) updateData.useDifferentDelivery = data.useDifferentDelivery;
    if (data.deliveryFirstName !== undefined) updateData.deliveryFirstName = data.deliveryFirstName;
    if (data.deliveryLastName !== undefined) updateData.deliveryLastName = data.deliveryLastName;
    if (data.deliveryAddress !== undefined) updateData.deliveryAddress = data.deliveryAddress;
    if (data.deliveryCity !== undefined) updateData.deliveryCity = data.deliveryCity;
    if (data.deliveryPostalCode !== undefined) updateData.deliveryPostalCode = data.deliveryPostalCode;
    
    // Add history entry for address changes
    if (data.billingAddress || data.billingCity || data.billingPostalCode || 
        data.deliveryAddress || data.deliveryCity || data.deliveryPostalCode ||
        data.useDifferentDelivery !== undefined) {
      historyEntries.push({
        orderId: existingOrder.id,
        action: 'address_updated',
        description: 'Adresy byly aktualizovány',
        metadata: { changedBy: 'Admin' }
      });
    }

    // Handle admin notes update
    if (data.adminNotes !== undefined) {
      updateData.adminNotes = data.adminNotes;
      
      if (data.adminNotes !== existingOrder.adminNotes) {
        historyEntries.push({
          orderId: existingOrder.id,
          action: 'admin_note_updated',
          description: data.adminNotes ? 'Dodano/zaktualizowano interní poznámky' : 'Usunięto interní poznámky',
          oldValue: existingOrder.adminNotes,
          newValue: data.adminNotes,
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