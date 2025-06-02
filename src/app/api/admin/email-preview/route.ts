// src/app/api/admin/email-preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/email-service';
import { render } from '@react-email/render';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  // Sample data for preview
  const sampleOrderData = {
    orderNumber: '20250001',
    customerName: 'Jan Novák',
    items: [
      { name: 'Český med', quantity: 2, price: 250 },
      { name: 'Moravské víno', quantity: 1, price: 350 },
    ],
    total: 850,
    deliveryMethod: 'zasilkovna',
    paymentMethod: 'card',
    deliveryAddress: {
      street: 'Václavské náměstí 1',
      city: 'Praha',
      postalCode: '110 00',
    },
  };

  const sampleShippingData = {
    orderNumber: '20250001',
    customerName: 'Jan Novák',
    trackingNumber: 'Z123456789',
    items: [
      { name: 'Český med', quantity: 2, price: 250 },
      { name: 'Moravské víno', quantity: 1, price: 350 },
    ],
    deliveryAddress: {
      street: 'Václavské náměstí 1',
      city: 'Praha',
      postalCode: '110 00',
    },
  };

  let html = '';

  try {
    if (type === 'confirmation') {
      const emailComponent = EmailService.previewOrderConfirmation(sampleOrderData);
      html = render(emailComponent);
    } else if (type === 'shipping') {
      const emailComponent = EmailService.previewShippingNotification(sampleShippingData);
      html = render(emailComponent);
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use ?type=confirmation or ?type=shipping' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error rendering email:', error);
    return NextResponse.json(
      { error: 'Failed to render email preview' },
      { status: 500 }
    );
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}