// src/app/api/orders/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/email-service';

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}${day}-${random}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log('Received order data:', JSON.stringify(formData, null, 2));
    
    const orderNumber = generateOrderNumber();
    console.log('Generated order number:', orderNumber);
    
    // Check if order number already exists
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber }
    });
    
    if (existingOrder) {
      console.log('Order number already exists, generating new one');
      // If it exists, generate a new one
      return POST(request);
    }
    
    // Validate required fields
    if (!formData.email || !formData.billingFirstName || !formData.billingLastName) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create the order with variant information preserved
    const orderData = {
      orderNumber,
      customerEmail: formData.email,
      customerName: `${formData.billingFirstName} ${formData.billingLastName}`,
      customerPhone: formData.phone || '',
      
      // Billing address
      billingFirstName: formData.billingFirstName,
      billingLastName: formData.billingLastName,
      billingAddress: formData.billingAddress,
      billingCity: formData.billingCity,
      billingPostalCode: formData.billingPostalCode,
      
      // Delivery address
      useDifferentDelivery: formData.useDifferentDelivery || false,
      deliveryFirstName: formData.deliveryFirstName || formData.billingFirstName,
      deliveryLastName: formData.deliveryLastName || formData.billingLastName,
      deliveryAddress: formData.deliveryAddress || formData.billingAddress,
      deliveryCity: formData.deliveryCity || formData.billingCity,
      deliveryPostalCode: formData.deliveryPostalCode || formData.billingPostalCode,
      
      // Old fields for backward compatibility
      firstName: formData.billingFirstName,
      lastName: formData.billingLastName,
      address: formData.billingAddress,
      city: formData.billingCity,
      postalCode: formData.billingPostalCode,
      
      // Store items with variant information
      items: formData.items.map((item: any) => ({
        id: item.id,
        productId: item.id, // Ensure productId is included
        name: item.name,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variantId: item.variantId || null,
        variantName: item.variantName || null,
        variantColor: item.variantColor || null
      })),
      
      total: formData.total,
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      paymentStatus: 'unpaid', // All orders start as unpaid
      note: formData.note || null,
    };
    
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    
    const order = await prisma.order.create({
      data: orderData,
    });
    
    console.log('Order created successfully:', order.id);
    
    // Create initial order history entry
    try {
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          action: 'order_created',
          description: 'Objednávka byla vytvořena',
          newValue: 'pending',
          metadata: {
            customerEmail: formData.email,
            total: formData.total,
            itemCount: formData.items.length,
            paymentMethod: formData.paymentMethod,
            paymentStatus: 'unpaid'
          }
        }
      });
      console.log('Order history entry created');
    } catch (historyError) {
      console.error('Failed to create order history:', historyError);
      // Don't fail the order if history fails
    }
    
    // Update product stock for each item
    for (const item of formData.items) {
      try {
        if (item.variantId) {
          // Update variant stock
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { 
              stock: { 
                decrement: item.quantity 
              } 
            }
          });
          console.log(`Updated stock for variant ${item.variantId}`);
        } else {
          // Update product stock (no variant)
          await prisma.product.update({
            where: { id: item.id },
            data: { 
              stock: { 
                decrement: item.quantity 
              } 
            }
          });
          console.log(`Updated stock for product ${item.id}`);
        }
      } catch (stockError) {
        console.error(`Failed to update stock for item ${item.id}:`, stockError);
        // Don't fail the order if stock update fails
      }
    }
    
    // Send confirmation email
    try {
      console.log('Attempting to send confirmation email');
      await EmailService.sendOrderConfirmation({
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        items: order.items as any[],
        total: order.total,
        deliveryMethod: order.deliveryMethod,
        paymentMethod: order.paymentMethod,
        deliveryAddress: {
          street: order.useDifferentDelivery ? order.deliveryAddress! : order.billingAddress,
          city: order.useDifferentDelivery ? order.deliveryCity! : order.billingCity,
          postalCode: order.useDifferentDelivery ? order.deliveryPostalCode! : order.billingPostalCode,
        },
      });
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order if email fails
    }
    
    return NextResponse.json({ 
      success: true, 
      orderNumber: order.orderNumber,
      orderId: order.id 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Return more specific error message
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to create order: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create order: Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invoice: true
      }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}