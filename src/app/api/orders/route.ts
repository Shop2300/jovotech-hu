// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/email/email-service';
import { getDeliveryMethodLabel, getPaymentMethodLabel } from '@/lib/order-options';

// Generate order number
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}${day}-${random}`;
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received order data:', data);
    
    // Validate required fields
    const requiredFields = [
      'customerEmail', 
      'customerPhone',
      'billingFirstName',
      'billingLastName',
      'billingAddress',
      'billingCity',
      'billingPostalCode',
      'items',
      'deliveryMethod',
      'paymentMethod'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate items array
    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Generate unique order number
    const orderNumber = generateOrderNumber();
    console.log('Generated order number:', orderNumber);
    
    // Calculate total
    const total = data.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Prepare delivery address fields
    const deliveryFirstName = data.useDifferentDelivery ? data.deliveryFirstName : data.billingFirstName;
    const deliveryLastName = data.useDifferentDelivery ? data.deliveryLastName : data.billingLastName;
    const deliveryAddress = data.useDifferentDelivery ? data.deliveryAddress : data.billingAddress;
    const deliveryCity = data.useDifferentDelivery ? data.deliveryCity : data.billingCity;
    const deliveryPostalCode = data.useDifferentDelivery ? data.deliveryPostalCode : data.billingPostalCode;
    
    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: data.customerEmail,
        customerName: `${data.billingFirstName} ${data.billingLastName}`.trim(),
        customerPhone: data.customerPhone,
        isCompany: data.isCompany || false,
        companyName: data.companyName || null,
        companyNip: data.companyNip || null,
        billingFirstName: data.billingFirstName,
        billingLastName: data.billingLastName,
        billingAddress: data.billingAddress,
        billingCity: data.billingCity,
        billingPostalCode: data.billingPostalCode,
        useDifferentDelivery: data.useDifferentDelivery || false,
        deliveryFirstName: deliveryFirstName,
        deliveryLastName: deliveryLastName,
        deliveryAddress: deliveryAddress,
        deliveryCity: deliveryCity,
        deliveryPostalCode: deliveryPostalCode,
        // Legacy fields for backward compatibility
        firstName: data.billingFirstName,
        lastName: data.billingLastName,
        address: data.billingAddress,
        city: data.billingCity,
        postalCode: data.billingPostalCode,
        items: data.items, // Store as JSON
        total: total,
        status: 'pending',
        paymentStatus: 'unpaid',
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        note: data.note || null,
        trackingNumber: null,
      }
    });
    
    console.log('Order created successfully:', order.orderNumber);
    
    // Create order history entry
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        action: 'order_created',
        description: 'Zamówienie zostało złożone',
        newValue: 'pending',
        performedBy: 'Customer',
        metadata: {
          customerEmail: data.customerEmail,
          total: total,
          itemCount: data.items.length
        }
      }
    });
    
    // Update product stock and sold count
    for (const item of data.items) {
      if (item.id) {
        try {
          await prisma.product.update({
            where: { id: item.id },
            data: {
              stock: { decrement: item.quantity },
              soldCount: { increment: item.quantity }
            }
          });
        } catch (error) {
          console.error(`Failed to update stock for product ${item.id}:`, error);
          // Continue with order creation even if stock update fails
        }
      }
    }
    
    // Send order confirmation email
    try {
      console.log('Sending order confirmation email to:', data.customerEmail);
      
      // Get product details for email
      const productIds = data.items.map((item: any) => item.id).filter(Boolean);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { category: true }
      });
      
      const productMap = new Map(products.map(p => [p.id, p]));
      
      // Enhance items with full details for email
      const emailItems = data.items.map((item: any) => {
        const product = productMap.get(item.id);
        return {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          productSlug: product?.slug || null,
          categorySlug: product?.category?.slug || null
        };
      });
      
      await EmailService.sendOrderConfirmation({
        orderNumber: orderNumber,
        customerEmail: data.customerEmail,
        customerName: `${data.billingFirstName} ${data.billingLastName}`.trim(),
        customerPhone: data.customerPhone,
        companyName: data.companyName || null,
        companyNip: data.companyNip || null,
        items: emailItems,
        total: total,
        deliveryMethod: getDeliveryMethodLabel(data.deliveryMethod, 'pl'),
        paymentMethod: getPaymentMethodLabel(data.paymentMethod, 'pl'),
        deliveryAddress: {
          street: deliveryAddress,
          city: deliveryCity,
          postalCode: deliveryPostalCode
        },
        billingAddress: data.useDifferentDelivery ? {
          street: data.billingAddress,
          city: data.billingCity,
          postalCode: data.billingPostalCode
        } : undefined,
        orderDate: new Date()
      });
      
      console.log('Order confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }
    
    return NextResponse.json({
      success: true,
      orderNumber: orderNumber,
      total: total,
      paymentMethod: data.paymentMethod
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('P2002')) {
        return NextResponse.json(
          { error: 'Order number already exists. Please try again.' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('P2003')) {
        return NextResponse.json(
          { error: 'Invalid product or category reference' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/orders - List orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // This endpoint could be protected for admin use
    // For now, it returns an error
    return NextResponse.json(
      { error: 'This endpoint requires authentication' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}