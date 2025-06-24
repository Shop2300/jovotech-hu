// src/emails/ShippingNotification.tsx
import {
  Body,
  Container,
  Column,
  Head,
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
    productSlug?: string | null;
    categorySlug?: string | null;
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
  const previewText = `Zamówienie #${orderNumber} zostało wysłane - Galaxysklep.pl`;

  const trackingUrl = `https://www.galaxysklep.pl/order-status/${orderNumber}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header - Same as OrderConfirmation */}
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
                  ZAMÓWIENIE #{orderNumber}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={content}>
            {/* Title with icon */}
            <Section style={titleSection}>
              <Text style={confirmationTitle}>
                <span style={checkmarkStyle}>📦</span>
                TWOJA PRZESYŁKA JEST W DRODZE
              </Text>
            </Section>

            {/* Tracking Information Box */}
            <Section style={infoBlock}>
              <Row>
                <Column style={infoColumn}>
                  <Text style={infoLabel}>NUMER ŚLEDZENIA</Text>
                  <Text style={trackingNumberText}>
                    {trackingNumber}
                  </Text>
                  <Text style={carrierText}>
                    {carrier}
                  </Text>
                </Column>
                <Column style={infoColumn}>
                  <Text style={infoLabel}>PRZEWIDYWANA DOSTAWA</Text>
                  <Text style={infoText}>
                    {estimatedDelivery}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Track Button */}
            <Section style={buttonSection}>
              <Button
                style={trackButton}
                href={trackingUrl}
              >
                ŚLEDŹ PRZESYŁKĘ
              </Button>
            </Section>

            {/* Delivery Address */}
            <Section style={addressSection}>
              <Text style={addressLabel}>ADRES DOSTAWY</Text>
              <Text style={addressText}>
                {customerName}<br />
                {deliveryAddress.street}<br />
                {deliveryAddress.postalCode} {deliveryAddress.city}
              </Text>
            </Section>

            {/* Order Items */}
            <Section style={itemsSection}>
              <Text style={itemsSectionTitle}>ZAWARTOŚĆ PRZESYŁKI</Text>
              <table style={itemsTable}>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td style={tableCell}>
                        {item.productSlug && item.categorySlug ? (
                          <Link 
                            href={`https://www.galaxysklep.pl/${item.categorySlug}/${item.productSlug}`}
                            style={productNameLink}
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <Text style={productName}>{item.name}</Text>
                        )}
                      </td>
                      <td style={tableCellCenter}>x{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* Contact */}
            <Text style={contactText}>
              Pytania? Skontaktuj się z nami:<br />
              <Link href="mailto:support@galaxysklep.pl" style={contactLink}>support@galaxysklep.pl</Link>
            </Text>

            {/* Footer - Same as OrderConfirmation */}
            <Hr style={footerDivider} />
            
            {/* Combined Company Info and Footer */}
            <Section style={companyInfo}>
              <Text style={companyText}>
                Dziękujemy za zakupy w Galaxysklep.pl!<br />
                Z pozdrowieniami,<br />
                <strong>Zespół Galaxysklep.pl</strong>
                <br /><br />
                <strong>Galaxysklep.pl</strong><br />
                <Link href="https://galaxysklep.pl" style={companyLink}>
                  www.galaxysklep.pl
                </Link>
              </Text>
            </Section>

            {/* Legal Text */}
            <Section style={legalSection}>
              <Text style={legalText}>
                W przypadku uszkodzenia przesyłki podczas transportu, należy niezwłocznie poinformować dostawcę i upewnić się, 
                że fakt ten zostanie odpowiednio odnotowany w protokole przewozowym. Zalecamy zachowanie wszystkich materiałów 
                opakowaniowych i niezwłoczny kontakt z nami pod adresem e-mail support@galaxysklep.pl. Faktury za zamówienie 
                są wysyłane wyłącznie elektronicznie na adres e-mail podany przy składaniu zamówienia. Prosimy o sprawdzenie 
                poprawności podanego adresu e-mail i zachowanie kopii faktur dla własnych potrzeb. Przetwarzamy Państwa dane 
                osobowe zgodnie z obowiązującymi przepisami o ochronie danych osobowych oraz naszą Polityką Prywatności. 
                Dane osobowe nie są przekazywane osobom trzecim bez Państwa wyraźnej zgody, z wyjątkiem podmiotów przetwarzających 
                niezbędnych do realizacji dostawy przesyłki. Szczegółowe informacje znajdują się na naszej stronie internetowej 
                w sekcji Polityka Prywatności. W przypadku jakichkolwiek pytań lub opinii prosimy o kontakt pod adresem 
                support@galaxysklep.pl. Szczegóły dotyczące warunków zakupu znajdują się w sekcji Regulamin.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles - Matching OrderConfirmation design
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

const checkmarkStyle = {
  color: '#0a5f0a',
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

const infoBlock = {
  backgroundColor: '#fafafa',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '20px',
};

const infoColumn = {
  width: '50%',
  verticalAlign: 'top' as const,
};

const infoLabel = {
  color: '#666666',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  marginBottom: '4px',
};

const infoText = {
  color: '#000000',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '0 0 8px 0',
};

const trackingNumberText = {
  color: '#000000',
  fontSize: '16px',
  fontWeight: '700',
  lineHeight: '20px',
  margin: '0 0 4px 0',
  fontFamily: 'monospace',
};

const carrierText = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '0',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const trackButton = {
  backgroundColor: '#0a5f0a',
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
  backgroundColor: '#fafafa',
  borderLeft: '3px solid #0a5f0a',
  borderRadius: '0 4px 4px 0',
  padding: '16px',
  marginBottom: '20px',
};

const addressLabel = {
  color: '#666666',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  marginBottom: '8px',
};

const addressText = {
  color: '#000000',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '0',
};

const itemsSection = {
  marginBottom: '24px',
};

const itemsSectionTitle = {
  color: '#000000',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  marginBottom: '12px',
};

const itemsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const tableCell = {
  borderBottom: '1px solid #f0f0f0',
  color: '#333333',
  fontSize: '13px',
  padding: '12px 0',
};

const tableCellCenter = {
  borderBottom: '1px solid #f0f0f0',
  color: '#666666',
  fontSize: '13px',
  padding: '12px 0',
  textAlign: 'right' as const,
  width: '60px',
};

const productName = {
  margin: '0',
  fontSize: '13px',
  color: '#000000',
};

const productNameLink = {
  margin: '0',
  fontSize: '13px',
  color: '#073635',
  textDecoration: 'none',
  fontWeight: '500' as const,
};

const contactText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const contactLink = {
  color: '#333333',
  textDecoration: 'underline',
};

const footerDivider = {
  borderColor: '#e0e0e0',
  marginTop: '24px',
  marginBottom: '16px',
};

const companyInfo = {
  paddingTop: '16px',
  marginBottom: '24px',
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

const legalSection = {
  marginTop: '24px',
  paddingTop: '24px',
  borderTop: '1px solid #f1f5f9',
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingBottom: '24px',
};

const legalText = {
  color: '#aaaaaa',
  fontSize: '10px',
  lineHeight: '14px',
  textAlign: 'justify' as const,
  padding: '0 20px',
};

export default ShippingNotificationEmail;