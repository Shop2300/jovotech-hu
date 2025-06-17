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
  const previewText = `Twoje zamówienie #${orderNumber} zostało wysłane - Galaxy Sklep`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img 
              src="https://galaxysklep.pl/images/galaxyskleplogo.png" 
              alt="Galaxy Sklep" 
              height="60" 
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Success Icon */}
            <Section style={iconSection}>
              <Text style={shippingIcon}>🚀</Text>
            </Section>

            <Heading as="h2" style={h2}>
              Twoje zamówienie jest w drodze!
            </Heading>
            
            <Text style={paragraph}>
              Dzień dobry {customerName},
            </Text>
            
            <Text style={paragraph}>
              Świetna wiadomość! Twoje zamówienie <strong style={primaryText}>#{orderNumber}</strong> zostało właśnie wysłane i jest w drodze do Ciebie.
            </Text>

            {/* Tracking Info Box */}
            <Section style={trackingBox}>
              <Heading as="h3" style={h3}>
                📦 Informacje o przesyłce
              </Heading>
              
              <Row style={trackingRow}>
                <Column>
                  <Text style={trackingLabel}>Numer śledzenia:</Text>
                </Column>
                <Column>
                  <Text style={trackingValue}>{trackingNumber}</Text>
                </Column>
              </Row>
              
              {estimatedDelivery && (
                <Row style={trackingRow}>
                  <Column>
                    <Text style={trackingLabel}>Przewidywana dostawa:</Text>
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
                href={`https://www.galaxysklep.pl/order-status/${orderNumber}`}
              >
                Śledź przesyłkę online
              </Button>
            </Section>

            {/* Order Contents */}
            <Section style={orderContents}>
              <Heading as="h3" style={h3}>
                📋 Zawartość przesyłki
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
                📍 Adres dostawy
              </Heading>
              
              <Section style={addressBox}>
                <Text style={addressText}>
                  {deliveryAddress.street}<br />
                  {deliveryAddress.city}, {deliveryAddress.postalCode}
                </Text>
              </Section>
            </Section>

            {/* Tips */}
            <Section style={tipsSection}>
              <Heading as="h3" style={h3}>
                💡 Przydatne wskazówki
              </Heading>
              
              <Text style={tipText}>
                <strong>🔔</strong> Upewnij się, że ktoś będzie w domu, aby odebrać przesyłkę
              </Text>
              
              <Text style={tipText}>
                <strong>📱</strong> Śledź przesyłkę online za pomocą numeru śledzenia
              </Text>
              
              <Text style={tipText}>
                <strong>📧</strong> Przewoźnik może skontaktować się z Tobą w sprawie dostawy
              </Text>

              <Text style={tipText}>
                <strong>📦</strong> Przy odbiorze sprawdź, czy przesyłka nie jest uszkodzona
              </Text>
            </Section>

            {/* Help Section */}
            <Section style={helpSection}>
              <Text style={helpText}>
                Masz pytania? Jesteśmy tutaj, aby pomóc!
              </Text>
              <Text style={helpContact}>
                📧 <Link href="mailto:support@galaxysklep.pl" style={link}>support@galaxysklep.pl</Link><br />
                🕐 Pon-Pt: 9:00-17:00
              </Text>
            </Section>

            {/* Footer */}
            <Hr style={divider} />
            
            <Text style={footer}>
              Dziękujemy za zakupy i życzymy miłego dnia!<br />
              Z pozdrowieniami,<br />
              <strong>Zespół Galaxy Sklep</strong>
            </Text>

            {/* Company Info */}
            <Section style={companyInfo}>
              <Text style={companyText}>
                <strong>Galaxy Sklep</strong><br />
                <Link href="https://galaxysklep.pl" style={companyLink}>
                  www.galaxysklep.pl
                </Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles with brand colors
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#6da306', // Primary green
  padding: '40px 24px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  borderRadius: '8px',
};

const content = {
  padding: '32px 24px 48px',
};

const iconSection = {
  textAlign: 'center' as const,
  marginBottom: '16px',
};

const shippingIcon = {
  fontSize: '64px',
  margin: '0',
};

const h2 = {
  color: '#020b1d', // Dark blue/black
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '36px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#073635', // Dark green
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '28px',
  marginBottom: '16px',
};

const paragraph = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
};

const primaryText = {
  color: '#6da306',
};

const trackingBox = {
  backgroundColor: '#f0fdf4', // Light green tint
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  border: '2px solid #6da306',
};

const trackingRow = {
  marginBottom: '12px',
};

const trackingLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const trackingValue = {
  color: '#020b1d',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#6da306',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '48px',
  padding: '0 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  boxShadow: '0 2px 4px rgba(109, 163, 6, 0.2)',
};

const orderContents = {
  backgroundColor: '#f8f9fa',
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
  marginBottom: '24px',
};

const addressBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  padding: '16px',
  borderLeft: '4px solid #6da306',
};

const addressText = {
  color: '#020b1d',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  fontWeight: '500' as const,
};

const tipsSection = {
  backgroundColor: '#fef9e7', // Light yellow for attention
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid #fde68a',
};

const tipText = {
  color: '#713f12',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '12px',
};

const helpSection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const helpText = {
  color: '#073635',
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '12px',
};

const helpContact = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const divider = {
  borderColor: '#e2e8f0',
  marginTop: '32px',
  marginBottom: '24px',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '8px',
  textAlign: 'center' as const,
};

const link = {
  color: '#6da306',
  textDecoration: 'underline',
};

const companyInfo = {
  marginTop: '32px',
  paddingTop: '24px',
  borderTop: '1px solid #e2e8f0',
};

const companyText = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
};

const companyLink = {
  color: '#073635',
  textDecoration: 'none',
  fontWeight: '500' as const,
};

export default ShippingNotificationEmail;