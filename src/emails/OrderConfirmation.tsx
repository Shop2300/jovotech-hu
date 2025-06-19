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
import { getDeliveryMethodLabel, getPaymentMethodLabel, getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  companyName?: string | null;
  companyNip?: string | null;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string | null;
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const BANK_DETAILS = {
  accountNumber: '21291000062469800208837403',
  iban: 'PL21 2910 0006 2469 8002 0883 7403',
  swift: 'BMPBPLPP',
  bankName: 'Aion S.A. Spolka Akcyjna Oddzial w Polsce',
  bankAddress: 'Dobra 40, 00-344, Warszawa, Poland'
};

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  companyName,
  companyNip,
  items,
  total,
  deliveryMethod,
  paymentMethod,
  deliveryAddress,
}: OrderConfirmationEmailProps) => {
  const previewText = `Potwierdzenie zamówienia #${orderNumber} - Galaxysklep.pl`;

  // Get delivery and payment method details
  const deliveryMethodInfo = getDeliveryMethod(deliveryMethod);
  const paymentMethodInfo = getPaymentMethod(paymentMethod);
  
  // Calculate subtotal and fees
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethodInfo?.price || 0;
  const paymentFee = paymentMethodInfo?.price || 0;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo - Smaller and with order number */}
          <Section style={header}>
            <Row>
              <Column style={logoColumn}>
                <Img 
                  src="https://galaxysklep.pl/images/galaxyskleplogo.png" 
                  alt="Galaxysklep.pl" 
                  height="40" 
                  style={logo}
                />
              </Column>
              <Column style={orderNumberColumn}>
                <Text style={headerOrderNumber}>
                  Zamówienie: #{orderNumber}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Success Icon */}
            <Section style={iconSection}>
              <div style={successIcon}>✓</div>
            </Section>

            <Heading as="h2" style={h2}>
              Dziękujemy za Twoje zamówienie!
            </Heading>
            
            <Text style={paragraph}>
              Dzień dobry {customerName},
            </Text>

            {/* Company Information - NEW SECTION */}
            {(companyName || companyNip) && (
              <Section style={companyDetailsSection}>
                <Text style={companyDetailsHeader}>Dane firmy:</Text>
                {companyName && (
                  <Text style={companyDetailsText}>
                    <strong>Nazwa firmy:</strong> {companyName}
                  </Text>
                )}
                {companyNip && (
                  <Text style={companyDetailsText}>
                    <strong>NIP:</strong> {companyNip}
                  </Text>
                )}
              </Section>
            )}
            
            <Text style={paragraph}>
              Twoje zamówienie <strong style={primaryText}>#{orderNumber}</strong> zostało pomyślnie przyjęte i jest obecnie przetwarzane.
            </Text>

            {/* Order Summary */}
            <Section style={orderSummary}>
              <Heading as="h3" style={h3}>
                📦 Podsumowanie zamówienia
              </Heading>
              
              {/* Product Items with Images */}
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  {/* Product Image */}
                  <Column style={itemImageColumn}>
                    {item.image ? (
                      <Img 
                        src={item.image} 
                        alt={item.name}
                        width="60"
                        height="60"
                        style={itemImage}
                      />
                    ) : (
                      <div style={itemImagePlaceholder}>
                        📦
                      </div>
                    )}
                  </Column>
                  
                  {/* Product Name and Quantity */}
                  <Column style={itemDetailsColumn}>
                    <Text style={itemNameText}>
                      {item.name}
                    </Text>
                    <Text style={itemQuantityText}>
                      Ilość: {item.quantity}
                    </Text>
                  </Column>
                  
                  {/* Price */}
                  <Column style={itemPriceColumn}>
                    <Text style={itemPriceText}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              ))}
              
              <Hr style={divider} />
              
              {/* Delivery Method as Item */}
              {deliveryMethodInfo && (
                <Row style={itemRow}>
                  <Column style={itemName}>
                    <Text style={itemText}>
                      🚚 {deliveryMethodInfo.labelPl}
                    </Text>
                  </Column>
                  <Column style={itemPrice}>
                    <Text style={itemText}>
                      {deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratis'}
                    </Text>
                  </Column>
                </Row>
              )}
              
              {/* Payment Method as Item */}
              {paymentMethodInfo && (
                <Row style={itemRow}>
                  <Column style={itemName}>
                    <Text style={itemText}>
                      💳 {paymentMethodInfo.labelPl}
                    </Text>
                  </Column>
                  <Column style={itemPrice}>
                    <Text style={itemText}>
                      {paymentFee > 0 ? formatPrice(paymentFee) : 'Gratis'}
                    </Text>
                  </Column>
                </Row>
              )}
              
              <Hr style={divider} />
              
              {/* Total */}
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>Razem:</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={totalAmount}>{formatPrice(total)}</Text>
                </Column>
              </Row>
            </Section>

            {/* Delivery & Payment Info */}
            <Section style={infoSection}>
              <Heading as="h3" style={h3}>
                🏠 Adres dostawy
              </Heading>
              
              <Section style={addressBox}>
                <Text style={addressText}>
                  {deliveryAddress.street}<br />
                  {deliveryAddress.city}, {deliveryAddress.postalCode}
                </Text>
              </Section>
              
              {deliveryMethodInfo?.descriptionPl && (
                <Text style={methodDescription}>
                  <strong>ℹ️ {deliveryMethodInfo.labelPl}:</strong> {deliveryMethodInfo.descriptionPl}
                </Text>
              )}
            </Section>

            {/* Bank Transfer Instructions */}
            {paymentMethod === 'bank' && (
              <Section style={bankSection}>
                <Heading as="h3" style={h3}>
                  💰 Informacje do przelewu bankowego
                </Heading>
                
                <Text style={bankText}>
                  Aby sfinalizować zamówienie, prosimy o wpłatę kwoty <strong style={primaryText}>{formatPrice(total)}</strong> na poniższe konto bankowe:
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
                    <strong>Bank:</strong> {BANK_DETAILS.bankName}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>Adres banku:</strong> {BANK_DETAILS.bankAddress}
                  </Text>
                  <Hr style={miniDivider} />
                  <Text style={bankDetailRow}>
                    <strong>Tytuł przelewu:</strong> <span style={highlightText}>{orderNumber.replace('-', '')}</span>
                  </Text>
                </Section>
                
                <Text style={bankNote}>
                  ⏱️ Twoje zamówienie zostanie wysłane natychmiast po zaksięgowaniu wpłaty na naszym koncie.
                </Text>
              </Section>
            )}

            {/* Next Steps */}
            <Section style={nextSteps}>
              <Heading as="h3" style={h3}>
                📋 Co dalej?
              </Heading>
              
              <div style={stepsList}>
                {paymentMethod === 'bank' ? (
                  <>
                    <Text style={stepItem}>✅ Proszę opłacić zamówienie przelewem bankowym</Text>
                    <Text style={stepItem}>✅ Po zaksięgowaniu wpłaty wyślemy potwierdzenie</Text>
                    <Text style={stepItem}>✅ Twoje zamówienie zostanie spakowane i wysłane</Text>
                    <Text style={stepItem}>✅ Otrzymasz e-mail z informacjami o śledzeniu przesyłki</Text>
                  </>
                ) : (
                  <>
                    <Text style={stepItem}>✅ Twoje zamówienie jest obecnie przetwarzane</Text>
                    <Text style={stepItem}>✅ Gdy zamówienie zostanie wysłane, otrzymasz e-mail z informacjami o śledzeniu</Text>
                    <Text style={stepItem}>✅ Będziesz mógł śledzić przesyłkę za pomocą numeru śledzenia</Text>
                    <Text style={stepItem}>✅ Ciesz się nowymi produktami!</Text>
                  </>
                )}
              </div>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`https://www.galaxysklep.pl/order-status/${orderNumber}`}
              >
                Śledź zamówienie
              </Button>
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
            <Hr style={footerDivider} />
            
            <Text style={footer}>
              Dziękujemy za zaufanie i zakupy w Galaxysklep.pl!<br />
              Z pozdrowieniami,<br />
              <strong>Zespół Galaxysklep.pl</strong>
            </Text>

            {/* Company Info */}
            <Section style={companyInfo}>
              <Text style={companyText}>
                <strong>Galaxysklep.pl</strong><br />
                <Link href="https://galaxysklep.pl" style={companyLink}>
                  www.galaxysklep.pl
                </Link>
              </Text>
            </Section>

            {/* Legal Information */}
            <Section style={legalSection}>
              <Text style={legalText}>
                Niniejsza wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać. Jeśli masz pytania, skontaktuj się z nami pod adresem support@galaxysklep.pl.
              </Text>
              <Text style={legalText}>
                Zgodnie z Ustawą o prawach konsumenta z dnia 30 maja 2014 r., masz prawo odstąpić od umowy w terminie 14 dni bez podania jakiejkolwiek przyczyny. Szczegółowe informacje znajdziesz w naszym regulaminie.
              </Text>
              <Text style={legalText}>
                Administratorem Twoich danych osobowych jest Galaxysklep.pl, 1. máje 535/50, 46007 Liberec, Czechy, NIP: 04688465. Twoje dane są przetwarzane w celu realizacji zamówienia zgodnie z naszą polityką prywatności dostępną na stronie www.galaxysklep.pl/polityka-prywatnosci.
              </Text>
              <Text style={legalText}>
                © {new Date().getFullYear()} Galaxysklep.pl. Wszelkie prawa zastrzeżone.
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
  maxWidth: '650px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
};

const header = {
  backgroundColor: '#6da306',
  padding: '20px 24px',
};

const logoColumn = {
  width: '50%',
  textAlign: 'left' as const,
};

const orderNumberColumn = {
  width: '50%',
  textAlign: 'right' as const,
};

const logo = {
  margin: '0',
  borderRadius: '4px',
};

const headerOrderNumber = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '40px',
};

const content = {
  padding: '32px 24px 48px',
};

const iconSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const successIcon = {
  display: 'inline-block',
  width: '64px',
  height: '64px',
  lineHeight: '64px',
  borderRadius: '50%',
  backgroundColor: '#6da306',
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold' as const,
};

const h2 = {
  color: '#020b1d',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '36px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#073635',
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

// NEW STYLES FOR COMPANY DETAILS
const companyDetailsSection = {
  backgroundColor: '#f0f9ff',
  borderRadius: '6px',
  padding: '12px 16px',
  marginBottom: '16px',
  border: '1px solid #bae6fd',
};

const companyDetailsHeader = {
  color: '#0c4a6e',
  fontSize: '14px',
  fontWeight: '600' as const,
  marginBottom: '8px',
};

const companyDetailsText = {
  color: '#075985',
  fontSize: '13px',
  lineHeight: '18px',
  marginBottom: '4px',
};

const orderSummary = {
  backgroundColor: '#f8fdf4',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid #e7f5d9',
};

const itemRow = {
  marginBottom: '16px',
};

const itemImageColumn = {
  width: '60px',
  paddingRight: '12px',
};

const itemImage = {
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
};

const itemImagePlaceholder = {
  width: '60px',
  height: '60px',
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
};

const itemDetailsColumn = {
  paddingRight: '12px',
};

const itemNameText = {
  color: '#020b1d',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const itemQuantityText = {
  color: '#64748b',
  fontSize: '13px',
  margin: '0',
};

const itemPriceColumn = {
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
};

const itemPriceText = {
  color: '#020b1d',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
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

const miniDivider = {
  borderColor: '#e2e8f0',
  marginTop: '12px',
  marginBottom: '12px',
};

const totalRow = {
  marginTop: '8px',
};

const totalLabel = {
  color: '#020b1d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const totalAmount = {
  color: '#6da306',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'right' as const,
};

const infoSection = {
  marginBottom: '24px',
};

const addressBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  padding: '16px',
  marginBottom: '12px',
  borderLeft: '4px solid #6da306',
};

const addressText = {
  color: '#020b1d',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  fontWeight: '500' as const,
};

const methodDescription = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '20px',
  marginBottom: '8px',
  fontStyle: 'italic' as const,
};

const bankSection = {
  backgroundColor: '#fef9e7',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid #fde68a',
};

const bankText = {
  color: '#020b1d',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '16px',
};

const bankDetails = {
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  padding: '16px',
  marginBottom: '16px',
  border: '1px solid #e5e7eb',
};

const bankDetailRow = {
  color: '#020b1d',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '8px',
  fontFamily: 'monospace',
};

const highlightText = {
  backgroundColor: '#fef3c7',
  padding: '2px 6px',
  borderRadius: '4px',
  fontWeight: 'bold' as const,
};

const bankNote = {
  color: '#92400e',
  fontSize: '13px',
  lineHeight: '18px',
};

const nextSteps = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid #bbf7d0',
};

const stepsList = {
  marginTop: '12px',
};

const stepItem = {
  color: '#073635',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '10px',
  paddingLeft: '8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  marginTop: '32px',
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

const footerDivider = {
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

const legalSection = {
  marginTop: '24px',
  paddingTop: '24px',
  borderTop: '1px solid #f1f5f9',
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingBottom: '24px',
};

const legalText = {
  color: '#cbd5e1',
  fontSize: '11px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginBottom: '8px',
};

export default OrderConfirmationEmail;