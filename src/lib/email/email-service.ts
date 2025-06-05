// src/lib/email/email-service.ts
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { ShippingNotificationEmail } from '@/emails/ShippingNotification';
import React from 'react';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration - Using support@galaxysklep.pl
const FROM_EMAIL = process.env.EMAIL_FROM || 'Galaxy Sklep <support@galaxysklep.pl>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@galaxysklep.pl';

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
        name: item.name || 'Produkt',
        quantity: item.quantity,
        price: item.price,
      }));

      // Send the email using React component
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customerEmail,
        replyTo: REPLY_TO,
        subject: `Potvrzení objednávky #${data.orderNumber} - Galaxy Sklep`,
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
      // Log more details in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Email error details:', error);
      }
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
        name: item.name || 'Produkt',
        quantity: item.quantity,
      }));

      // Determine carrier from tracking number format
      let carrier = 'Zásilkovna';
      if (data.trackingNumber.startsWith('CZ')) {
        carrier = 'Česká pošta';
      } else if (data.trackingNumber.startsWith('PPL')) {
        carrier = 'PPL';
      } else if (data.trackingNumber.startsWith('Z')) {
        carrier = 'Zásilkovna';
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
        subject: `Vaše objednávka #${data.orderNumber} byla odeslána - Galaxy Sklep`,
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Email error details:', error);
      }
      // Don't throw error to prevent operation failure
      // In production, you might want to queue this for retry
    }
  }

  /**
   * Send test email (for verification)
   */
  static async sendTestEmail(toEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmail,
        replyTo: REPLY_TO,
        subject: 'Test Email - Galaxy Sklep',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #8b5cf6; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Galaxy Sklep</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #1e293b;">Test Email z Galaxy Sklep</h2>
              <p>Tento email potvrzuje, že emailová služba funguje správně.</p>
              <p>Pokud vidíte tento email, znamená to, že:</p>
              <ul>
                <li>✅ Doména je správně ověřena v Resend</li>
                <li>✅ DNS záznamy jsou správně nastaveny</li>
                <li>✅ Emailová služba je připravena k použití</li>
              </ul>
              <hr style="border: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 14px;">
                Tento testovací email byl odeslán z Galaxy Sklep<br>
                <a href="https://galaxysklep.pl" style="color: #8b5cf6;">www.galaxysklep.pl</a>
              </p>
            </div>
          </div>
        `,
      });

      console.log('Test email sent successfully:', result);
      return { success: true };
    } catch (error) {
      console.error('Failed to send test email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Preview email HTML (for testing)
   */
  static previewOrderConfirmation(data: Omit<OrderEmailData, 'customerEmail'>): React.ReactElement {
    const emailItems = data.items.map(item => ({
      name: item.name || 'Produkt',
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
      name: item.name || 'Produkt',
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