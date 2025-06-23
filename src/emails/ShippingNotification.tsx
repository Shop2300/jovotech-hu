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
  estimatedDelivery: string;
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
  const previewText = `Twoje zamówienie #${orderNumber} zostało wysłane`;

  // Get tracking URL based on carrier
  const getTrackingUrl = (trackingNumber: string, carrier: string) => {
    const carrierLower = carrier.toLowerCase();
    
    if (carrierLower.includes('inpost') || carrierLower.includes('paczkomat')) {
      return `https://inpost.pl/sledzenie-przesylek?number=${trackingNumber}`;
    } else if (carrierLower.includes('dpd')) {
      return `https://www.dpd.com.pl/tracking?parcels=${trackingNumber}`;
    } else if (carrierLower.includes('dhl')) {
      return `https://www.dhl.com/pl-pl/home/tracking.html?tracking-id=${trackingNumber}`;
    } else if (carrierLower.includes('poczta') || carrierLower.includes('polska')) {
      return `https://emonitoring.poczta-polska.pl/?numer=${trackingNumber}`;
    } else if (carrierLower.includes('ups')) {
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    } else {
      // Default to order status page if carrier not recognized
      return `https://www.galaxysklep.pl/order-status/${orderNumber}`;
    }
  };

  const trackingUrl = getTrackingUrl(trackingNumber, carrier);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Minimal Header */}
          <Section style={header}>
            <Row>
              <Column style={headerLeft}>
                <Img 
                  src="https://galaxysklep.pl/images/galaxyskleplogo.png" 
                  alt="Galaxysklep.pl" 
                  height="32" 
                  style={logo}
                />
              </Column>
              <Column style={headerRight}>
                <Text style={headerText}>
                  POTWIERDZENIE WYSYŁKI
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Shipping Icon and Title */}
            <Section style={titleSection}>
              <Text style={confirmationTitle}>
                <span style={packageIconStyle}>📦</span>
                TWOJE ZAMÓWIENIE ZOSTAŁO WYSŁANE
              </Text>
            </Section>

            <Text style={greeting}>
              Dzień dobry {customerName},
            </Text>
            
            <Text style={paragraph}>
              Informujemy, że Twoje zamówienie <strong>#{orderNumber}</strong> zostało przekazane do przewoźnika i jest w drodze.
            </Text>

            {/* Tracking Information */}
            <Section style={trackingSection}>
              <Text style={sectionTitle}>INFORMACJE O PRZESYŁCE</Text>
              
              <table style={infoTable}>
                <tbody>
                  <tr>
                    <td style={infoLabel}>Numer śledzenia:</td>
                    <td style={infoValue}>
                      <strong>{trackingNumber}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={infoLabel}>Przewoźnik:</td>
                    <td style={infoValue}>{carrier}</td>
                  </tr>
                  <tr>
                    <td style={infoLabel}>Przewidywana dostawa:</td>
                    <td style={infoValue}>{estimatedDelivery}</td>
                  </tr>
                </tbody>
              </table>

              <Section style={buttonSection}>
                <Button
                  style={trackButton}
                  href={trackingUrl}
                >
                  ŚLEDŹ PRZESYŁKĘ
                </Button>
              </Section>
            </Section>

            {/* Delivery Address */}
            <Section style={addressSection}>
              <Text style={sectionTitle}>ADRES DOSTAWY</Text>
              <Section style={addressBox}>
                <Text style={addressText}>
                  {deliveryAddress.street}<br />
                  {deliveryAddress.postalCode} {deliveryAddress.city}
                </Text>
              </Section>
            </Section>

            {/* Order Items */}
            <Section style={itemsSection}>
              <Text style={sectionTitle}>ZAWARTOŚĆ PRZESYŁKI</Text>
              <table style={itemsTable}>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td style={itemName}>{item.name}</td>
                      <td style={itemQuantity}>x{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* Delivery Instructions */}
            <Section style={instructionsSection}>
              <Text style={sectionTitle}>WAŻNE INFORMACJE</Text>
              <Text style={instructionItem}>
                • Podczas odbioru przesyłki sprawdź stan opakowania
              </Text>
              <Text style={instructionItem}>
                • W przypadku uszkodzeń spisz protokół z kurierem
              </Text>
              <Text style={instructionItem}>
                • Zachowaj dokument dostawy na wypadek reklamacji
              </Text>
              <Text style={instructionItem}>
                • Jeśli nie możesz odebrać przesyłki, skontaktuj się z kurierem
              </Text>
            </Section>

            {/* Help Section */}
            <Text style={helpText}>
              Masz pytania dotyczące dostawy?<br />
              Skontaktuj się z nami: <Link href="mailto:support@galaxysklep.pl" style={contactLink}>support@galaxysklep.pl</Link>
            </Text>

            {/* Footer */}
            <Hr style={footerDivider} />
            <Text style={footerText}>
              Galaxysklep.pl • 1. máje 535/50, 46007 Liberec, Czechy • NIP: 04688465
            </Text>

            {/* Legal */}
            <Text style={legalText}>
              Ta wiadomość została wygenerowana automatycznie. Prosimy na nią nie odpowiadać. 
              Jeśli masz pytania, skontaktuj się z nami pod adresem support@galaxysklep.pl.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Industrial/Minimal Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  border: '1px solid #e0e0e0',
};

const header = {
  backgroundColor: '#fafafa',
  borderBottom: '1px solid #e0e0e0',
  padding: '16px 24px',
};

const headerLeft = {
  width: '50%',
  textAlign: 'left' as const,
};

const headerRight = {
  width: '50%',
  textAlign: 'right' as const,
};

const logo = {
  margin: '0',
};

const headerText = {
  color: '#333333',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '32px',
  letterSpacing: '0.5px',
};

const content = {
  padding: '24px',
};

const titleSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const packageIconStyle = {
  color: '#666666',
  fontSize: '20px',
  marginRight: '8px',
};

const confirmationTitle = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  margin: '0',
  textAlign: 'center' as const,
};

const greeting = {
  color: '#333333',
  fontSize: '16px',
  marginBottom: '16px',
};

const paragraph = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '20px',
};

const orderNumber = {
  color: '#333333',
};

const trackingSection = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #bae6fd',
  borderRadius: '4px',
  padding: '20px',
  marginBottom: '24px',
};

const sectionTitle = {
  color: '#000000',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  marginBottom: '12px',
};

const infoTable = {
  width: '100%',
  marginBottom: '16px',
};

const infoLabel = {
  color: '#666666',
  fontSize: '13px',
  padding: '6px 0',
  width: '140px',
};

const infoValue = {
  color: '#000000',
  fontSize: '14px',
  padding: '6px 0',
};

const buttonSection = {
  textAlign: 'center' as const,
  marginTop: '20px',
};

const trackButton = {
  backgroundColor: '#2563eb',
  borderRadius: '3px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  lineHeight: '40px',
  padding: '0 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const addressSection = {
  marginBottom: '24px',
};

const addressBox = {
  backgroundColor: '#fafafa',
  borderLeft: '3px solid #2563eb',
  padding: '12px 16px',
  borderRadius: '0 3px 3px 0',
};

const addressText = {
  color: '#000000',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '0',
  fontWeight: '500' as const,
};

const itemsSection = {
  marginBottom: '24px',
};

const itemsTable = {
  width: '100%',
  borderTop: '1px solid #e0e0e0',
};

const itemName = {
  color: '#333333',
  fontSize: '13px',
  padding: '8px 0',
  borderBottom: '1px solid #f0f0f0',
};

const itemQuantity = {
  color: '#666666',
  fontSize: '13px',
  padding: '8px 0',
  textAlign: 'right' as const,
  borderBottom: '1px solid #f0f0f0',
  width: '60px',
};

const instructionsSection = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '24px',
};

const instructionItem = {
  color: '#92400e',
  fontSize: '12px',
  lineHeight: '18px',
  marginBottom: '6px',
};

const helpText = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '18px',
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '24px',
};

const contactLink = {
  color: '#333333',
  textDecoration: 'underline',
};

const footerDivider = {
  borderColor: '#e0e0e0',
  marginTop: '32px',
  marginBottom: '16px',
};

const footerText = {
  color: '#999999',
  fontSize: '11px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginBottom: '8px',
};

const legalText = {
  color: '#aaaaaa',
  fontSize: '10px',
  lineHeight: '14px',
  textAlign: 'center' as const,
  padding: '0 40px',
};

export default ShippingNotificationEmail;