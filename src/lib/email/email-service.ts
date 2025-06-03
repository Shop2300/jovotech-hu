// src/lib/email/email-service.ts
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { ShippingNotificationEmail } from '@/emails/ShippingNotification';
import React from 'react';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'Czech E-Shop <onboarding@resend.dev>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'info@czech-eshop.cz';

interface OrderItem {
  name?: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

interface ShippingEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  trackingNumber: string;
  items: OrderItem[];
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

export class EmailService {
  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(data: OrderEmailData): Promise<void> {
    try {
      // Transform items for email template
      const emailItems = data.items.map(item => ({
        name: item.name || item.name || 'Produkt',
        quantity: item.quantity,
        price: item.price,
      }));

      // Send the email using React component
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customerEmail,
        replyTo: REPLY_TO,
        subject: `Potvrzení objednávky #${data.orderNumber}`,
        react: OrderConfirmationEmail({
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          items: emailItems,
          total: data.total,
          deliveryMethod: data.deliveryMethod,
          paymentMethod: data.paymentMethod,
          deliveryAddress: data.deliveryAddress,
        }),
      });

      console.log('Order confirmation email sent:', result);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      // Don't throw error to prevent order creation failure
      // In production, you might want to queue this for retry
    }
  }

  /**
   * Send shipping notification email
   */
  static async sendShippingNotification(data: ShippingEmailData): Promise<void> {
    try {
      // Transform items for email template
      const emailItems = data.items.map(item => ({
        name: item.name || item.name || 'Produkt',
        quantity: item.quantity,
      }));

      // Determine carrier from tracking number format
      let carrier = 'Zásilkovna';
      if (data.trackingNumber.startsWith('CZ')) {
        carrier = 'Česká pošta';
      } else if (data.trackingNumber.startsWith('PPL')) {
        carrier = 'PPL';
      }

      // Estimate delivery (3-5 business days)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
      const estimatedDeliveryStr = estimatedDelivery.toLocaleDateString('cs-CZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      // Send the email using React component
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customerEmail,
        replyTo: REPLY_TO,
        subject: `Vaše objednávka #${data.orderNumber} byla odeslána`,
        react: ShippingNotificationEmail({
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          trackingNumber: data.trackingNumber,
          carrier: carrier,
          estimatedDelivery: estimatedDeliveryStr,
          items: emailItems,
          deliveryAddress: data.deliveryAddress,
        }),
      });

      console.log('Shipping notification email sent:', result);
    } catch (error) {
      console.error('Failed to send shipping notification email:', error);
      // Don't throw error to prevent operation failure
      // In production, you might want to queue this for retry
    }
  }

  /**
   * Preview email HTML (for testing)
   */
  static previewOrderConfirmation(data: Omit<OrderEmailData, 'customerEmail'>): React.ReactElement {
    const emailItems = data.items.map(item => ({
      name: item.name || item.name || 'Produkt',
      quantity: item.quantity,
      price: item.price,
    }));

    return React.createElement(OrderConfirmationEmail, {
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      items: emailItems,
      total: data.total,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      deliveryAddress: data.deliveryAddress,
    });
  }

  /**
   * Preview shipping notification HTML (for testing)
   */
  static previewShippingNotification(data: Omit<ShippingEmailData, 'customerEmail'>): React.ReactElement {
    const emailItems = data.items.map(item => ({
      name: item.name || item.name || 'Produkt',
      quantity: item.quantity,
    }));

    return React.createElement(ShippingNotificationEmail, {
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      trackingNumber: data.trackingNumber,
      carrier: 'Zásilkovna',
      estimatedDelivery: '3-5 pracovních dnů',
      items: emailItems,
      deliveryAddress: data.deliveryAddress,
    });
  }
}