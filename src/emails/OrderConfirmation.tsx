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
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
  }).format(price);
};

const BANK_DETAILS = {
  accountNumber: '2302034483 / 2010',
  iban: 'CZ79 2010 0000 0023 0203 4483',
  swift: 'FIOBCZPPXXX'
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
  const previewText = `Potvrzení objednávky #${orderNumber}`;

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
            <Heading as="h2" style={h2}>
              Děkujeme za vaši objednávku!
            </Heading>
            
            <Text style={paragraph}>
              Dobrý den {customerName},
            </Text>
            
            <Text style={paragraph}>
              Vaše objednávka <strong>#{orderNumber}</strong> byla úspěšně přijata a nyní ji zpracováváme.
            </Text>

            {/* Order Summary */}
            <Section style={orderSummary}>
              <Heading as="h3" style={h3}>
                Shrnutí objednávky
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
                  <Text style={totalLabel}>Celkem:</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={totalAmount}>{formatPrice(total)}</Text>
                </Column>
              </Row>
            </Section>

            {/* Delivery Info */}
            <Section style={infoSection}>
              <Heading as="h3" style={h3}>
                Informace o doručení
              </Heading>
              
              <Text style={infoText}>
                <strong>Způsob doručení:</strong> {deliveryMethod === 'zasilkovna' ? 'Zásilkovna' : 'Osobní odběr'}
              </Text>
              
              <Text style={infoText}>
                <strong>Způsob platby:</strong> {paymentMethod === 'bank' ? 'Bankovní převod' : 'Platba na dobírku'}
              </Text>
              
              <Text style={infoText}>
                <strong>Doručovací adresa:</strong><br />
                {deliveryAddress.street}<br />
                {deliveryAddress.city}, {deliveryAddress.postalCode}
              </Text>
            </Section>

            {/* Bank Transfer Instructions */}
            {paymentMethod === 'bank' && (
              <Section style={bankSection}>
                <Heading as="h3" style={h3}>
                  Informace pro platbu bankovním převodem
                </Heading>
                
                <Text style={bankText}>
                  Pro dokončení objednávky prosím uhraďte částku <strong>{formatPrice(total)}</strong> na následující bankovní účet:
                </Text>
                
                <Section style={bankDetails}>
                  <Text style={bankDetailRow}>
                    <strong>Číslo účtu:</strong> {BANK_DETAILS.accountNumber}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>IBAN:</strong> {BANK_DETAILS.iban}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>BIC/SWIFT:</strong> {BANK_DETAILS.swift}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>Variabilní symbol:</strong> {orderNumber}
                  </Text>
                </Section>
                
                <Text style={bankNote}>
                  Vaše objednávka bude odeslána ihned po připsání platby na náš účet.
                </Text>
              </Section>
            )}

            {/* Next Steps */}
            <Section style={nextSteps}>
              <Heading as="h3" style={h3}>
                Co bude následovat?
              </Heading>
              
              <Text style={paragraph}>
                {paymentMethod === 'bank' ? (
                  <>
                    1. Uhraďte prosím objednávku bankovním převodem<br />
                    2. Po připsání platby vám zašleme potvrzení<br />
                    3. Vaši objednávku zabalíme a odešleme<br />
                    4. Obdržíte e-mail s informacemi o sledování zásilky
                  </>
                ) : (
                  <>
                    1. Vaši objednávku nyní zpracováváme<br />
                    2. Jakmile bude objednávka odeslána, obdržíte e-mail s informacemi o sledování<br />
                    3. Zásilku můžete sledovat pomocí sledovacího čísla
                  </>
                )}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-status/${orderNumber}`}
              >
                Sledovat objednávku
              </Button>
            </Section>

            {/* Footer */}
            <Text style={footer}>
              Máte-li jakékoli dotazy, neváhejte nás kontaktovat na{' '}
              <Link href="mailto:info@czech-eshop.cz" style={link}>
                info@czech-eshop.cz
              </Link>
            </Text>
            
            <Text style={footer}>
              S pozdravem,<br />
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

const h2 = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  marginBottom: '24px',
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

const orderSummary = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
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
  color: '#1e293b',
  fontSize: '20px',
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
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
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

export default OrderConfirmationEmail;