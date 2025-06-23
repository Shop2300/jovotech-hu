// src/lib/email/email-service.ts
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { ShippingNotificationEmail } from '@/emails/ShippingNotification';
import React from 'react';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration - Using support@galaxysklep.pl
const FROM_EMAIL = 'Galaxysklep.pl <support@galaxysklep.pl>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@galaxysklep.pl';

interface OrderItem {
  name?: string;
  quantity: number;
  price: number;
  image?: string | null; // Added image field
}

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  companyName?: string | null;  // Added for business orders
  companyNip?: string | null;   // Added for business orders
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
        image: item.image || null, // Include image
      }));

      // Send the email using React component
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customerEmail,
        replyTo: REPLY_TO,
        subject: `Potwierdzenie zamówienia #${data.orderNumber} - Galaxysklep.pl`,
        react: OrderConfirmationEmail({
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          companyName: data.companyName,  // Pass company details to email template
          companyNip: data.companyNip,    // Pass company details to email template
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
      let carrier = 'Paczkomat InPost';
      if (data.trackingNumber.startsWith('PL')) {
        carrier = 'Poczta Polska';
      } else if (data.trackingNumber.startsWith('DPD')) {
        carrier = 'DPD';
      } else if (data.trackingNumber.startsWith('UPS')) {
        carrier = 'UPS';
      } else if (data.trackingNumber.startsWith('6')) {
        carrier = 'InPost';
      }

      // Estimate delivery (3-5 business days)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
      const estimatedDeliveryStr = estimatedDelivery.toLocaleDateString('pl-PL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      // Send the email using React component
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customerEmail,
        replyTo: REPLY_TO,
        subject: `Twoje zamówienie #${data.orderNumber} zostało wysłane - Galaxysklep.pl`,
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
        subject: 'Test Email - Galaxysklep.pl',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 100%; margin: 0 auto;">
            <div style="background-color: #6da306; padding: 20px;">
              <h1 style="color: white; margin: 0;">Galaxysklep.pl</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #1e293b;">Test Email z Galaxysklep.pl</h2>
              <p>Ten email potwierdza, że usługa emailowa działa prawidłowo.</p>
              <p>Jeśli widzisz ten email, oznacza to, że:</p>
              <ul>
                <li>✅ Domena jest prawidłowo zweryfikowana w Resend</li>
                <li>✅ Rekordy DNS są poprawnie skonfigurowane</li>
                <li>✅ Usługa emailowa jest gotowa do użycia</li>
              </ul>
              <hr style="border: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 14px;">
                Ten testowy email został wysłany z Galaxysklep.pl<br>
                <a href="https://galaxysklep.pl" style="color: #6da306;">www.galaxysklep.pl</a>
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
      image: item.image || null,
    }));

    return React.createElement(OrderConfirmationEmail, {
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      companyName: data.companyName,  // Include company details in preview
      companyNip: data.companyNip,    // Include company details in preview
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
      carrier: 'Paczkomat InPost',
      estimatedDelivery: '3-5 dni roboczych',
      items: emailItems,
      deliveryAddress: data.deliveryAddress,
    });
  }
}