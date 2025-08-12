// src/lib/email/email-service.ts
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { ShippingNotificationEmail } from '@/emails/ShippingNotification';
import { PaymentConfirmationEmail } from '@/emails/PaymentConfirmation';
import React from 'react';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration - Using support@jovotech.hu
const FROM_EMAIL = 'Jovotech.hu <support@jovotech.hu>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@jovotech.hu';

interface OrderItem {
  name?: string;
  quantity: number;
  price: number;
  image?: string | null;
  productSlug?: string | null;
  categorySlug?: string | null;
}

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string; // Added
  companyName?: string | null;
  companyNip?: string | null;
  items: OrderItem[];
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  billingAddress?: { // Added
    street: string;
    city: string;
    postalCode: string;
  };
  orderDate?: Date; // Added
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
  deliveryMethod?: string;
  carrier?: string;
  orderDate?: Date | string;
}

interface PaymentEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  paymentDate?: Date;
}

export class EmailService {
  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(data: OrderEmailData): Promise<void> {
    try {
      // Transform items for email template
      const emailItems = data.items.map(item => ({
        name: item.name || 'Termék',
        quantity: item.quantity,
        price: item.price,
        image: item.image || null,
        productSlug: item.productSlug || null,
        categorySlug: item.categorySlug || null,
      }));

      // Send the email using React component
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customerEmail,
        replyTo: REPLY_TO,
        subject: `Rendelés visszaigazolása #${data.orderNumber} - Jovotech.hu`,
        react: OrderConfirmationEmail({
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail, // Pass email
          customerPhone: data.customerPhone, // Pass phone
          companyName: data.companyName,
          companyNip: data.companyNip,
          items: emailItems,
          total: data.total,
          deliveryMethod: data.deliveryMethod,
          paymentMethod: data.paymentMethod,
          deliveryAddress: data.deliveryAddress,
          billingAddress: data.billingAddress, // Pass billing address
          orderDate: data.orderDate || new Date(), // Pass order date
        }),
      });

      console.log('Order confirmation email sent:', result);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      if (process.env.NODE_ENV === 'development') {
        console.error('Email error details:', error);
      }
    }
  }

  /**
   * Send shipping notification email
   */
  static async sendShippingNotification(data: ShippingEmailData): Promise<void> {
    try {
      // Transform items for email template
      const emailItems = data.items.map(item => ({
        name: item.name || 'Termék',
        quantity: item.quantity,
        productSlug: item.productSlug || null,
        categorySlug: item.categorySlug || null,
      }));

      // Determine carrier from delivery method or tracking number format
      let carrier = data.carrier || 'Szállítási szolgáltató';
      
      // If no carrier provided, try to determine from tracking number
      if (!data.carrier && data.trackingNumber) {
        if (data.trackingNumber.startsWith('HU')) {
          carrier = 'Magyar Posta';
        } else if (data.trackingNumber.startsWith('DPD')) {
          carrier = 'DPD';
        } else if (data.trackingNumber.startsWith('UPS')) {
          carrier = 'UPS';
        } else if (data.trackingNumber.startsWith('GLS')) {
          carrier = 'GLS';
        }
      }

      // Estimate delivery (3-5 business days)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
      const estimatedDeliveryStr = estimatedDelivery.toLocaleDateString('hu-HU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

      // Send the email using React component
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customerEmail,
        replyTo: REPLY_TO,
        subject: `Rendelése #${data.orderNumber} feladásra került - Jovotech.hu`,
        react: ShippingNotificationEmail({
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          trackingNumber: data.trackingNumber,
          carrier: carrier,
          estimatedDelivery: estimatedDeliveryStr,
          items: emailItems,
          deliveryAddress: data.deliveryAddress,
          orderDate: data.orderDate,
        }),
      });

      console.log('Shipping notification email sent:', result);
    } catch (error) {
      console.error('Failed to send shipping notification email:', error);
      if (process.env.NODE_ENV === 'development') {
        console.error('Email error details:', error);
      }
    }
  }

  /**
   * Send payment confirmation email
   */
  static async sendPaymentConfirmation(data: PaymentEmailData): Promise<void> {
    try {
      // Transform items for email template
      const emailItems = data.items.map(item => ({
        name: item.name || 'Termék',
        quantity: item.quantity,
        price: item.price,
        image: item.image || null,
        productSlug: item.productSlug || null,
        categorySlug: item.categorySlug || null,
      }));

      // Send the email using React component
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customerEmail,
        replyTo: REPLY_TO,
        subject: `Fizetés beérkezett - Rendelés #${data.orderNumber} - Jovotech.hu`,
        react: PaymentConfirmationEmail({
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          items: emailItems,
          total: data.total,
          deliveryMethod: data.deliveryMethod,
          paymentMethod: data.paymentMethod,
          paymentDate: data.paymentDate || new Date(),
        }),
      });

      console.log('Payment confirmation email sent:', result);
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
      if (process.env.NODE_ENV === 'development') {
        console.error('Email error details:', error);
      }
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
        subject: 'Teszt Email - Jovotech.hu',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 100%; margin: 0 auto;">
            <div style="background-color: #073635; padding: 20px;">
              <h1 style="color: white; margin: 0;">Jovotech.hu</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #1e293b;">Teszt Email a Jovotech.hu-tól</h2>
              <p>Ez az email megerősíti, hogy az email szolgáltatás megfelelően működik.</p>
              <p>Ha látja ezt az emailt, az azt jelenti, hogy:</p>
              <ul>
                <li>✅ A domain megfelelően ellenőrizve van a Resend-ben</li>
                <li>✅ A DNS rekordok helyesen vannak beállítva</li>
                <li>✅ Az email szolgáltatás használatra kész</li>
              </ul>
              <hr style="border: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 14px;">
                Ez a teszt email a Jovotech.hu-tól lett küldve<br>
                <a href="https://jovotech.hu" style="color: #073635;">www.jovotech.hu</a>
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
      name: item.name || 'Termék',
      quantity: item.quantity,
      price: item.price,
      image: item.image || null,
      productSlug: item.productSlug || null,
      categorySlug: item.categorySlug || null,
    }));

    return React.createElement(OrderConfirmationEmail, {
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerEmail: 'preview@example.com', // Default for preview
      customerPhone: data.customerPhone,
      companyName: data.companyName,
      companyNip: data.companyNip,
      items: emailItems,
      total: data.total,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      deliveryAddress: data.deliveryAddress,
      billingAddress: data.billingAddress,
      orderDate: data.orderDate || new Date(),
    });
  }

  /**
   * Preview shipping notification HTML (for testing)
   */
  static previewShippingNotification(data: Omit<ShippingEmailData, 'customerEmail'>): React.ReactElement {
    const emailItems = data.items.map(item => ({
      name: item.name || 'Termék',
      quantity: item.quantity,
      productSlug: item.productSlug || null,
      categorySlug: item.categorySlug || null,
    }));

    return React.createElement(ShippingNotificationEmail, {
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier || 'Szállítási szolgáltató',
      estimatedDelivery: '3-5 munkanap',
      items: emailItems,
      deliveryAddress: data.deliveryAddress,
      orderDate: data.orderDate || new Date(),
    });
  }

  /**
   * Preview payment confirmation HTML (for testing)
   */
  static previewPaymentConfirmation(data: Omit<PaymentEmailData, 'customerEmail'>): React.ReactElement {
    const emailItems = data.items.map(item => ({
      name: item.name || 'Termék',
      quantity: item.quantity,
      price: item.price,
      image: item.image || null,
      productSlug: item.productSlug || null,
      categorySlug: item.categorySlug || null,
    }));

    return React.createElement(PaymentConfirmationEmail, {
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerEmail: 'preview@example.com',
      items: emailItems,
      total: data.total,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate || new Date(),
    });
  }
}