// src/emails/ShippingNotification.tsx
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Button,
    Hr,
  } from '@react-email/components';
  import * as React from 'react';
  
  interface ShippingNotificationEmailProps {
    orderNumber: string;
    customerName: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery?: string;
    items: Array<{
      name: string;
      quantity: number;
    }>;
    deliveryAddress: {
      street: string;
      city: string;
      postalCode: string;
    };
  }
  
  export const ShippingNotificationEmail = ({
    orderNumber,
    customerName,
    trackingNumber,
    carrier,
    estimatedDelivery,
    items,
    deliveryAddress,
  }: ShippingNotificationEmailProps) => {
    const previewText = `Vaše objednávka #${orderNumber} byla odeslána`;
  
    // Get tracking URL based on carrier
    const getTrackingUrl = () => {
      if (carrier.toLowerCase().includes('zásilkovna') || carrier.toLowerCase().includes('packeta')) {
        return `https://tracking.packeta.com/cs/?id=${trackingNumber}`;
      }
      // Add more carriers as needed
      return '#';
    };
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body style={main}>
          <Container style={container}>
            {/* Header */}
            <Section style={header}>
              <Heading style={h1}>Czech E-Shop</Heading>
            </Section>
  
            {/* Main Content */}
            <Section style={content}>
              {/* Success Icon */}
              <Section style={iconSection}>
                <Text style={shippingIcon}>📦</Text>
              </Section>
  
              <Heading as="h2" style={h2}>
                Vaše objednávka je na cestě!
              </Heading>
              
              <Text style={paragraph}>
                Dobrý den {customerName},
              </Text>
              
              <Text style={paragraph}>
                Skvělé zprávy! Vaše objednávka <strong>#{orderNumber}</strong> byla právě odeslána a je na cestě k vám.
              </Text>
  
              {/* Tracking Info Box */}
              <Section style={trackingBox}>
                <Heading as="h3" style={h3}>
                  Informace o sledování zásilky
                </Heading>
                
                <Row style={trackingRow}>
                  <Column>
                    <Text style={trackingLabel}>Sledovací číslo:</Text>
                  </Column>
                  <Column>
                    <Text style={trackingValue}>{trackingNumber}</Text>
                  </Column>
                </Row>
                
                <Row style={trackingRow}>
                  <Column>
                    <Text style={trackingLabel}>Dopravce:</Text>
                  </Column>
                  <Column>
                    <Text style={trackingValue}>{carrier}</Text>
                  </Column>
                </Row>
                
                {estimatedDelivery && (
                  <Row style={trackingRow}>
                    <Column>
                      <Text style={trackingLabel}>Předpokládané doručení:</Text>
                    </Column>
                    <Column>
                      <Text style={trackingValue}>{estimatedDelivery}</Text>
                    </Column>
                  </Row>
                )}
              </Section>
  
              {/* CTA Button */}
              <Section style={buttonContainer}>
                <Button
                  style={button}
                  href={getTrackingUrl()}
                >
                  Sledovat zásilku
                </Button>
              </Section>
  
              {/* Order Contents */}
              <Section style={orderContents}>
                <Heading as="h3" style={h3}>
                  Obsah zásilky
                </Heading>
                
                {items.map((item, index) => (
                  <Text key={index} style={itemText}>
                    • {item.name} × {item.quantity}
                  </Text>
                ))}
              </Section>
  
              {/* Delivery Address */}
              <Section style={addressSection}>
                <Heading as="h3" style={h3}>
                  Doručovací adresa
                </Heading>
                
                <Text style={addressText}>
                  {deliveryAddress.street}<br />
                  {deliveryAddress.city}, {deliveryAddress.postalCode}
                </Text>
              </Section>
  
              {/* Tips */}
              <Section style={tipsSection}>
                <Heading as="h3" style={h3}>
                  Užitečné tipy
                </Heading>
                
                <Text style={tipText}>
                  <strong>🔔 Tip:</strong> Ujistěte se, že někdo bude doma pro převzetí zásilky
                </Text>
                
                <Text style={tipText}>
                  <strong>📱 Tip:</strong> Sledujte zásilku online pomocí sledovacího čísla
                </Text>
                
                <Text style={tipText}>
                  <strong>📧 Tip:</strong> Dopravce vás může kontaktovat ohledně doručení
                </Text>
              </Section>
  
              {/* Footer */}
              <Hr style={divider} />
              
              <Text style={footer}>
                Máte-li jakékoli dotazy ohledně vaší objednávky, neváhejte nás kontaktovat na{' '}
                <Link href="mailto:info@czech-eshop.cz" style={link}>
                  info@czech-eshop.cz
                </Link>
              </Text>
              
              <Text style={footer}>
                Děkujeme za váš nákup!<br />
                Tým Czech E-Shop
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  // Styles
  const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
  };
  
  const header = {
    backgroundColor: '#1e293b',
    padding: '24px',
    textAlign: 'center' as const,
  };
  
  const h1 = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '600',
    lineHeight: '32px',
    margin: '0',
  };
  
  const content = {
    padding: '24px',
  };
  
  const iconSection = {
    textAlign: 'center' as const,
    marginBottom: '16px',
  };
  
  const shippingIcon = {
    fontSize: '48px',
    margin: '0',
  };
  
  const h2 = {
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '32px',
    marginBottom: '24px',
    textAlign: 'center' as const,
  };
  
  const h3 = {
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '24px',
    marginBottom: '16px',
  };
  
  const paragraph = {
    color: '#475569',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
  };
  
  const trackingBox = {
    backgroundColor: '#dbeafe',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    border: '2px solid #60a5fa',
  };
  
  const trackingRow = {
    marginBottom: '12px',
  };
  
  const trackingLabel = {
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0',
  };
  
  const trackingValue = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '700',
    margin: '0',
  };
  
  const buttonContainer = {
    textAlign: 'center' as const,
    marginBottom: '32px',
  };
  
  const button = {
    backgroundColor: '#2563eb',
    borderRadius: '8px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '48px',
    padding: '0 32px',
    textDecoration: 'none',
    textAlign: 'center' as const,
  };
  
  const orderContents = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  };
  
  const itemText = {
    color: '#475569',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '8px',
  };
  
  const addressSection = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  };
  
  const addressText = {
    color: '#475569',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
  };
  
  const tipsSection = {
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #fcd34d',
  };
  
  const tipText = {
    color: '#78350f',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '12px',
  };
  
  const divider = {
    borderColor: '#e2e8f0',
    marginTop: '32px',
    marginBottom: '24px',
  };
  
  const footer = {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
    textAlign: 'center' as const,
  };
  
  const link = {
    color: '#2563eb',
    textDecoration: 'underline',
  };
  
  export default ShippingNotificationEmail;