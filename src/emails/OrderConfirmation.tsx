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
  customerEmail?: string;
  customerPhone?: string;
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
  billingAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
  orderDate?: Date;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
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
  customerEmail,
  customerPhone,
  companyName,
  companyNip,
  items,
  total,
  deliveryMethod,
  paymentMethod,
  deliveryAddress,
  billingAddress,
  orderDate,
}: OrderConfirmationEmailProps) => {
  const previewText = `Potwierdzenie zamówienia #${orderNumber} - Galaxysklep.pl`;

  // Get delivery and payment method details
  const deliveryMethodInfo = getDeliveryMethod(deliveryMethod);
  const paymentMethodInfo = getPaymentMethod(paymentMethod);
  
  // Calculate subtotal and fees
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethodInfo?.price || 0;
  const paymentFee = paymentMethodInfo?.price || 0;

  // Check if addresses are different
  const isDifferentAddress = billingAddress && (
    billingAddress.street !== deliveryAddress.street ||
    billingAddress.city !== deliveryAddress.city ||
    billingAddress.postalCode !== deliveryAddress.postalCode
  );

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
                  ZAMÓWIENIE #{orderNumber}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Order Confirmation */}
            <Text style={confirmationTitle}>
              POTWIERDZENIE ZAMÓWIENIA
            </Text>

            {/* Customer Information Block */}
            <Section style={infoBlock}>
              <Row>
                <Column style={infoColumn}>
                  <Text style={infoLabel}>DANE KLIENTA</Text>
                  <Text style={infoText}>
                    {customerName}
                    {customerEmail && <><br />{customerEmail}</>}
                    {customerPhone && <><br />Tel: {customerPhone}</>}
                  </Text>
                  {(companyName || companyNip) && (
                    <Text style={infoText}>
                      {companyName && <><br /><strong>{companyName}</strong></>}
                      {companyNip && <><br />NIP: {companyNip}</>}
                    </Text>
                  )}
                </Column>
                <Column style={infoColumn}>
                  <Text style={infoLabel}>DATA ZAMÓWIENIA</Text>
                  <Text style={infoText}>
                    {formatDate(orderDate || new Date())}
                  </Text>
                  <Text style={{ ...infoLabel, marginTop: '12px' }}>STATUS</Text>
                  <Text style={infoText}>
                    {paymentMethod === 'bank' ? 'Oczekuje na płatność' : 'W realizacji'}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Addresses */}
            <Section style={addressSection}>
              <Row>
                <Column style={addressColumn}>
                  <Text style={addressLabel}>ADRES ROZLICZENIOWY</Text>
                  <Text style={addressText}>
                    {billingAddress ? (
                      <>
                        {billingAddress.street}<br />
                        {billingAddress.postalCode} {billingAddress.city}
                      </>
                    ) : (
                      <>
                        {deliveryAddress.street}<br />
                        {deliveryAddress.postalCode} {deliveryAddress.city}
                      </>
                    )}
                  </Text>
                </Column>
                <Column style={addressColumn}>
                  <Text style={addressLabel}>ADRES DOSTAWY</Text>
                  <Text style={addressText}>
                    {deliveryAddress.street}<br />
                    {deliveryAddress.postalCode} {deliveryAddress.city}
                  </Text>
                  {isDifferentAddress && (
                    <Text style={addressNote}>
                      (inny niż rozliczeniowy)
                    </Text>
                  )}
                </Column>
              </Row>
            </Section>

            {/* Order Items Table */}
            <Section style={itemsSection}>
              <table style={itemsTable}>
                <thead>
                  <tr>
                    <th style={tableHeaderLeft}>PRODUKT</th>
                    <th style={tableHeaderCenter}>ILOŚĆ</th>
                    <th style={tableHeaderRight}>CENA</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td style={tableCell}>
                        <Row>
                          {item.image && (
                            <Column style={{ width: '40px', paddingRight: '10px' }}>
                              <Img 
                                src={item.image} 
                                alt={item.name}
                                width="40"
                                height="40"
                                style={productImage}
                              />
                            </Column>
                          )}
                          <Column>
                            <Text style={productName}>{item.name}</Text>
                          </Column>
                        </Row>
                      </td>
                      <td style={tableCellCenter}>{item.quantity}</td>
                      <td style={tableCellRight}>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                  
                  {/* Subtotal */}
                  <tr>
                    <td colSpan={3} style={separatorCell}>
                      <Hr style={tableSeparator} />
                    </td>
                  </tr>
                  
                  {/* Delivery */}
                  {deliveryMethodInfo && (
                    <tr>
                      <td style={tableCell} colSpan={2}>
                        Dostawa: {deliveryMethodInfo.labelPl}
                      </td>
                      <td style={tableCellRight}>
                        {deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratis'}
                      </td>
                    </tr>
                  )}
                  
                  {/* Payment */}
                  {paymentMethodInfo && paymentFee > 0 && (
                    <tr>
                      <td style={tableCell} colSpan={2}>
                        Płatność: {paymentMethodInfo.labelPl}
                      </td>
                      <td style={tableCellRight}>
                        {formatPrice(paymentFee)}
                      </td>
                    </tr>
                  )}
                  
                  {/* Total */}
                  <tr>
                    <td colSpan={3} style={separatorCell}>
                      <Hr style={tableSeparator} />
                    </td>
                  </tr>
                  <tr>
                    <td style={totalCell} colSpan={2}>
                      <strong>RAZEM</strong>
                    </td>
                    <td style={totalAmountCell}>
                      <strong>{formatPrice(total)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Bank Transfer Instructions - Compact */}
            {paymentMethod === 'bank' && (
              <Section style={bankSection}>
                <Text style={bankTitle}>DANE DO PRZELEWU</Text>
                <table style={bankTable}>
                  <tbody>
                    <tr>
                      <td style={bankLabel}>Kwota:</td>
                      <td style={bankValue}><strong>{formatPrice(total)}</strong></td>
                    </tr>
                    <tr>
                      <td style={bankLabel}>Numer konta:</td>
                      <td style={bankValue}>{BANK_DETAILS.accountNumber}</td>
                    </tr>
                    <tr>
                      <td style={bankLabel}>IBAN:</td>
                      <td style={bankValue}>{BANK_DETAILS.iban}</td>
                    </tr>
                    <tr>
                      <td style={bankLabel}>SWIFT:</td>
                      <td style={bankValue}>{BANK_DETAILS.swift}</td>
                    </tr>
                    <tr>
                      <td style={bankLabel}>Tytuł przelewu:</td>
                      <td style={bankValue}><strong>{orderNumber.replace('-', '')}</strong></td>
                    </tr>
                  </tbody>
                </table>
                <Text style={bankNote}>
                  Zamówienie zostanie wysłane po zaksięgowaniu wpłaty.
                </Text>
              </Section>
            )}

            {/* Track Order Button */}
            <Section style={buttonSection}>
              <Button
                style={trackButton}
                href={`https://www.galaxysklep.pl/order-status/${orderNumber}`}
              >
                ŚLEDŹ ZAMÓWIENIE
              </Button>
            </Section>

            {/* Contact Info */}
            <Text style={contactText}>
              Pytania? Skontaktuj się z nami:<br />
              <Link href="mailto:support@galaxysklep.pl" style={contactLink}>support@galaxysklep.pl</Link>
            </Text>

            {/* Footer */}
            <Hr style={footerDivider} />
            <Text style={footerText}>
              Galaxysklep.pl • 1. máje 535/50, 46007 Liberec, Czechy • NIP: 04688465
            </Text>
            <Text style={legalText}>
              Masz prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny. 
              Szczegóły w regulaminie na www.galaxysklep.pl/regulamin
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

const confirmationTitle = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  margin: '0 0 24px 0',
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

const addressSection = {
  marginBottom: '20px',
};

const addressColumn = {
  width: '50%',
  paddingRight: '12px',
};

const addressLabel = {
  color: '#666666',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  marginBottom: '4px',
};

const addressText = {
  color: '#000000',
  fontSize: '13px',
  lineHeight: '18px',
  margin: '0',
};

const addressNote = {
  color: '#666666',
  fontSize: '11px',
  fontStyle: 'italic' as const,
  marginTop: '4px',
};

const itemsSection = {
  marginBottom: '24px',
};

const itemsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const tableHeaderLeft = {
  borderBottom: '2px solid #000000',
  color: '#000000',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  padding: '8px 0',
  textAlign: 'left' as const,
  textTransform: 'uppercase' as const,
};

const tableHeaderCenter = {
  borderBottom: '2px solid #000000',
  color: '#000000',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  padding: '8px 0',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

const tableHeaderRight = {
  borderBottom: '2px solid #000000',
  color: '#000000',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  padding: '8px 0',
  textAlign: 'right' as const,
  textTransform: 'uppercase' as const,
};

const tableCell = {
  borderBottom: '1px solid #f0f0f0',
  color: '#333333',
  fontSize: '13px',
  padding: '12px 0',
};

const tableCellCenter = {
  borderBottom: '1px solid #f0f0f0',
  color: '#333333',
  fontSize: '13px',
  padding: '12px 0',
  textAlign: 'center' as const,
};

const tableCellRight = {
  borderBottom: '1px solid #f0f0f0',
  color: '#333333',
  fontSize: '13px',
  padding: '12px 0',
  textAlign: 'right' as const,
};

const productImage = {
  borderRadius: '2px',
  border: '1px solid #e0e0e0',
};

const productName = {
  margin: '0',
  fontSize: '13px',
  color: '#000000',
};

const separatorCell = {
  padding: '0',
};

const tableSeparator = {
  borderColor: '#e0e0e0',
  margin: '8px 0',
};

const totalCell = {
  color: '#000000',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 0',
};

const totalAmountCell = {
  color: '#000000',
  fontSize: '16px',
  fontWeight: '700',
  padding: '12px 0',
  textAlign: 'right' as const,
};

const bankSection = {
  backgroundColor: '#fff9e6',
  border: '1px solid #ffd666',
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '24px',
};

const bankTitle = {
  color: '#000000',
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  marginBottom: '12px',
};

const bankTable = {
  width: '100%',
};

const bankLabel = {
  color: '#666666',
  fontSize: '12px',
  padding: '4px 0',
  width: '140px',
};

const bankValue = {
  color: '#000000',
  fontSize: '12px',
  fontFamily: 'monospace',
  padding: '4px 0',
};

const bankNote = {
  color: '#666666',
  fontSize: '11px',
  marginTop: '12px',
  fontStyle: 'italic' as const,
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const trackButton = {
  backgroundColor: '#333333',
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
};

export default OrderConfirmationEmail;