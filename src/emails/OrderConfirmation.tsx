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

// TODO: Aktualizujte tyto údaje vašimi skutečnými bankovními údaji
const BANK_DETAILS = {
  accountNumber: '2302034483 / 2010',  // Váš účet / kód banky
  iban: 'CZ79 2010 0000 0023 0203 4483',  // Váš IBAN
  swift: 'FIOBCZPPXXX'  // SWIFT kód vaší banky
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
  const previewText = `Potvrzení objednávky #${orderNumber} - Galaxy Sklep`;

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
                <strong>Způsob platby:</strong> {
                  paymentMethod === 'bank' ? 'Bankovní převod' : 
                  paymentMethod === 'card' ? 'Platba kartou online' :
                  'Platba na dobírku'
                }
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
                    3. Zásilku můžete sledovat pomocí sledovacího čísla<br />
                    4. Těšte se na své nové produkty!
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
                Sledovat objednávku
              </Button>
            </Section>

            {/* Footer */}
            <Hr style={divider} />
            
            <Text style={footer}>
              Máte-li jakékoli dotazy, neváhejte nás kontaktovat na{' '}
              <Link href="mailto:support@galaxysklep.pl" style={link}>
                support@galaxysklep.pl
              </Link>
            </Text>
            
            <Text style={footer}>
              Děkujeme za váš nákup!<br />
              Tým Galaxy Sklep
            </Text>

            {/* Company Info */}
            <Section style={companyInfo}>
              <Text style={companyText}>
                <strong>Galaxy Sklep</strong><br />
                Váš oblíbený internetový obchod<br />
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