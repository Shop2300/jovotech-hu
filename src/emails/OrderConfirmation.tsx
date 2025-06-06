// src/emails/OrderConfirmation.tsx
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

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(price);
};

// TODO: Zaktualizuj dane bankowe na polskie
const BANK_DETAILS = {
  accountNumber: '2302034483 / 2010',  // Twój numer konta / kod banku
  iban: 'CZ79 2010 0000 0023 0203 4483',  // Twój IBAN
  swift: 'FIOBCZPPXXX'  // Kod SWIFT Twojego banku
};

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  items,
  total,
  deliveryMethod,
  paymentMethod,
  deliveryAddress,
}: OrderConfirmationEmailProps) => {
  const previewText = `Potwierdzenie zamówienia #${orderNumber} - Galaxy Sklep`;

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
            <Heading as="h2" style={h2}>
              Dziękujemy za Twoje zamówienie!
            </Heading>
            
            <Text style={paragraph}>
              Dzień dobry {customerName},
            </Text>
            
            <Text style={paragraph}>
              Twoje zamówienie <strong>#{orderNumber}</strong> zostało pomyślnie przyjęte i jest obecnie przetwarzane.
            </Text>

            {/* Order Summary */}
            <Section style={orderSummary}>
              <Heading as="h3" style={h3}>
                Podsumowanie zamówienia
              </Heading>
              
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemName}>
                    <Text style={itemText}>
                      {item.name} × {item.quantity}
                    </Text>
                  </Column>
                  <Column style={itemPrice}>
                    <Text style={itemText}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              ))}
              
              <Hr style={divider} />
              
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>Razem:</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={totalAmount}>{formatPrice(total)}</Text>
                </Column>
              </Row>
            </Section>

            {/* Delivery Info */}
            <Section style={infoSection}>
              <Heading as="h3" style={h3}>
                Informacje o dostawie
              </Heading>
              
              <Text style={infoText}>
                <strong>Sposób dostawy:</strong> {deliveryMethod === 'zasilkovna' ? 'Paczkomat' : 'Odbiór osobisty'}
              </Text>
              
              <Text style={infoText}>
                <strong>Sposób płatności:</strong> {
                  paymentMethod === 'bank' ? 'Przelew bankowy' : 
                  paymentMethod === 'card' ? 'Płatność kartą online' :
                  'Płatność za pobraniem'
                }
              </Text>
              
              <Text style={infoText}>
                <strong>Adres dostawy:</strong><br />
                {deliveryAddress.street}<br />
                {deliveryAddress.city}, {deliveryAddress.postalCode}
              </Text>
            </Section>

            {/* Bank Transfer Instructions */}
            {paymentMethod === 'bank' && (
              <Section style={bankSection}>
                <Heading as="h3" style={h3}>
                  Informacje do przelewu bankowego
                </Heading>
                
                <Text style={bankText}>
                  Aby sfinalizować zamówienie, prosimy o wpłatę kwoty <strong>{formatPrice(total)}</strong> na poniższe konto bankowe:
                </Text>
                
                <Section style={bankDetails}>
                  <Text style={bankDetailRow}>
                    <strong>Numer konta:</strong> {BANK_DETAILS.accountNumber}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>IBAN:</strong> {BANK_DETAILS.iban}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>BIC/SWIFT:</strong> {BANK_DETAILS.swift}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>Tytuł przelewu:</strong> {orderNumber}
                  </Text>
                </Section>
                
                <Text style={bankNote}>
                  Twoje zamówienie zostanie wysłane natychmiast po zaksięgowaniu wpłaty na naszym koncie.
                </Text>
              </Section>
            )}

            {/* Next Steps */}
            <Section style={nextSteps}>
              <Heading as="h3" style={h3}>
                Co dalej?
              </Heading>
              
              <Text style={paragraph}>
                {paymentMethod === 'bank' ? (
                  <>
                    1. Proszę opłacić zamówienie przelewem bankowym<br />
                    2. Po zaksięgowaniu wpłaty wyślemy potwierdzenie<br />
                    3. Twoje zamówienie zostanie spakowane i wysłane<br />
                    4. Otrzymasz e-mail z informacjami o śledzeniu przesyłki
                  </>
                ) : (
                  <>
                    1. Twoje zamówienie jest obecnie przetwarzane<br />
                    2. Gdy zamówienie zostanie wysłane, otrzymasz e-mail z informacjami o śledzeniu<br />
                    3. Będziesz mógł śledzić przesyłkę za pomocą numeru śledzenia<br />
                    4. Ciesz się nowymi produktami!
                  </>
                )}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`https://galaxysklep.pl/order-status/${orderNumber}`}
              >
                Śledź zamówienie
              </Button>
            </Section>

            {/* Footer */}
            <Hr style={divider} />
            
            <Text style={footer}>
              Jeśli masz jakiekolwiek pytania, skontaktuj się z nami pod adresem{' '}
              <Link href="mailto:support@galaxysklep.pl" style={link}>
                support@galaxysklep.pl
              </Link>
            </Text>
            
            <Text style={footer}>
              Dziękujemy za zakupy!<br />
              Zespół Galaxy Sklep
            </Text>

            {/* Company Info */}
            <Section style={companyInfo}>
              <Text style={companyText}>
                <strong>Galaxy Sklep</strong><br />
                Twój ulubiony sklep internetowy<br />
                <Link href="https://galaxysklep.pl" style={link}>
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

// Styles
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
  borderRadius: '8px',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#8b5cf6',
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
  borderRadius: '8px',
};

const content = {
  padding: '32px 24px 48px',
};

const h2 = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '36px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#1e293b',
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

const orderSummary = {
  backgroundColor: '#f8f4ff',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid #e9d5ff',
};

const itemRow = {
  marginBottom: '12px',
};

const itemName = {
  width: '70%',
};

const itemPrice = {
  width: '30%',
  textAlign: 'right' as const,
};

const itemText = {
  color: '#475569',
  fontSize: '14px',
  margin: '0',
};

const divider = {
  borderColor: '#e2e8f0',
  marginTop: '16px',
  marginBottom: '16px',
};

const totalRow = {
  marginTop: '8px',
};

const totalLabel = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const totalAmount = {
  color: '#8b5cf6',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'right' as const,
};

const infoSection = {
  marginBottom: '24px',
};

const infoText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '12px',
};

const bankSection = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid #dbeafe',
};

const bankText = {
  color: '#1e293b',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '16px',
};

const bankDetails = {
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '16px',
};

const bankDetailRow = {
  color: '#1e293b',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '8px',
  fontFamily: 'monospace',
};

const bankNote = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '18px',
  fontStyle: 'italic' as const,
};

const nextSteps = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid #e0e7ff',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#8b5cf6',
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

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '8px',
  textAlign: 'center' as const,
};

const link = {
  color: '#8b5cf6',
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

export default OrderConfirmationEmail;