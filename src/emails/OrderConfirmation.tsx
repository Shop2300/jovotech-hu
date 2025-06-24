// src/emails/OrderConfirmation.tsx
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
import { getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';

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
    productSlug?: string | null;
    categorySlug?: string | null;
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

const formatDate = (date: Date | string | undefined | null) => {
  if (!date) {
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Warsaw'
    }).format(new Date());
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Warsaw'
    }).format(new Date());
  }
  
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Warsaw'
  }).format(dateObj);
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

  const deliveryMethodInfo = deliveryMethod ? getDeliveryMethod(deliveryMethod) : null;
  const paymentMethodInfo = paymentMethod ? getPaymentMethod(paymentMethod) : null;
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethodInfo?.price || 0;
  const paymentFee = paymentMethodInfo?.price || 0;

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
          {/* Header */}
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
            {/* Title with checkmark */}
            <Section style={titleSection}>
              <Text style={confirmationTitle}>
                <span style={checkmarkStyle}>✓</span>
                POTWIERDZENIE ZAMÓWIENIA
              </Text>
            </Section>

            {/* Track Order Button under Status */}
            <Section style={buttonSection}>
              <Button
                style={trackButton}
                href={`https://www.galaxysklep.pl/order-status/${orderNumber}`}
              >
                ŚLEDŹ ZAMÓWIENIE
              </Button>
            </Section>

            {/* Customer Information */}
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
                    {formatDate(orderDate)}
                  </Text>
                  <Text style={{ ...infoLabel, marginTop: '12px' }}>STATUS</Text>
                  <Text style={infoText}>
                    {paymentMethod === 'bank' ? 'Oczekuje na płatność' : 'W realizacji'}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Track Order Button under Status */}
            <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
              <Button
                style={trackButton}
                href={`https://www.galaxysklep.pl/order-status/${orderNumber}`}
              >
                ŚLEDŹ ZAMÓWIENIE
              </Button>
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

            {/* Order Items */}
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
                              {item.productSlug && item.categorySlug ? (
                                <Link 
                                  href={`https://www.galaxysklep.pl/${item.categorySlug}/${item.productSlug}`}
                                  style={{ textDecoration: 'none' }}
                                >
                                  <Img 
                                    src={item.image} 
                                    alt={item.name}
                                    width="40"
                                    height="40"
                                    style={productImage}
                                  />
                                </Link>
                              ) : (
                                <Img 
                                  src={item.image} 
                                  alt={item.name}
                                  width="40"
                                  height="40"
                                  style={productImage}
                                />
                              )}
                            </Column>
                          )}
                          <Column>
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
                          </Column>
                        </Row>
                      </td>
                      <td style={tableCellCenter}>{item.quantity}</td>
                      <td style={tableCellRight}>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                  
                  <tr>
                    <td colSpan={3} style={separatorCell}>
                      <Hr style={tableSeparator} />
                    </td>
                  </tr>
                  
                  {/* Delivery */}
                  <tr>
                    <td style={methodCell} colSpan={2}>
                      🚚 Dostawa: {deliveryMethodInfo ? deliveryMethodInfo.labelPl : deliveryMethod}
                    </td>
                    <td style={deliveryFee > 0 ? tableCellRight : tableCellRightFree}>
                      {deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratis'}
                    </td>
                  </tr>
                  
                  {/* Payment */}
                  <tr>
                    <td style={methodCell} colSpan={2}>
                      💳 Płatność: {paymentMethodInfo ? paymentMethodInfo.labelPl : paymentMethod}
                    </td>
                    <td style={paymentFee > 0 ? tableCellRight : tableCellRightFree}>
                      {paymentFee > 0 ? formatPrice(paymentFee) : 'Gratis'}
                    </td>
                  </tr>
                  
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

            {/* Bank Payment Instructions and Details - Combined */}
            {paymentMethod === 'bank' && (
              <Section style={bankSection}>
                <Text style={bankTitle}>INSTRUKCJE PŁATNOŚCI I DANE DO PRZELEWU</Text>
                <Text style={bankText}>
                  Aby sfinalizować zamówienie, prosimy o wpłatę kwoty <strong>{formatPrice(total)}</strong> na nasze konto bankowe.
                </Text>
                <Section style={bankHighlight}>
                  <Text style={bankDetailRow}>
                    <strong>Kwota do zapłaty:</strong> {formatPrice(total)}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>Tytuł przelewu:</strong> <span style={highlightText}>{orderNumber.replace('-', '')}</span>
                  </Text>
                </Section>
                
                {/* Bank Details Table */}
                <table style={bankDetailsTable}>
                  <tbody>
                    <tr>
                      <td style={bankLabel}>Nazwa odbiorcy:</td>
                      <td style={bankValue}>Galaxysklep.pl</td>
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
                      <td style={bankLabel}>SWIFT/BIC:</td>
                      <td style={bankValue}>{BANK_DETAILS.swift}</td>
                    </tr>
                    <tr>
                      <td style={bankLabel}>Bank:</td>
                      <td style={bankValue}>{BANK_DETAILS.bankName}</td>
                    </tr>
                  </tbody>
                </table>
                
                <Text style={bankNote}>
                  ⏱️ Twoje zamówienie zostanie wysłane natychmiast po zaksięgowaniu wpłaty na naszym koncie.
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

            {/* Bank Details - Only for non-bank payment methods */}
            {paymentMethod !== 'bank' && (
              <Section style={bankDetailsAlways}>
                <Text style={bankDetailsTitle}>DANE DO PRZELEWU</Text>
                <table style={bankTable}>
                  <tbody>
                    <tr>
                      <td style={bankLabel}>Nazwa odbiorcy:</td>
                      <td style={bankValue}>Galaxysklep.pl</td>
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
                      <td style={bankLabel}>SWIFT/BIC:</td>
                      <td style={bankValue}>{BANK_DETAILS.swift}</td>
                    </tr>
                    <tr>
                      <td style={bankLabel}>Bank:</td>
                      <td style={bankValue}>{BANK_DETAILS.bankName}</td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            )}

            {/* Contact */}
            <Text style={contactText}>
              Pytania? Skontaktuj się z nami:<br />
              <Link href="mailto:support@galaxysklep.pl" style={contactLink}>support@galaxysklep.pl</Link>
            </Text>

            {/* Footer */}
            <Hr style={footerDivider} />
            
            {/* Combined Company Info and Footer */}
            <Section style={companyInfo}>
              <Text style={companyText}>
                Dziękujemy za zaufanie i zakupy w Galaxysklep.pl!<br />
                Z pozdrowieniami,<br />
                <strong>Zespół Galaxysklep.pl</strong>
                <br /><br />
                <strong>Galaxysklep.pl</strong><br />
                <Link href="https://galaxysklep.pl" style={companyLink}>
                  www.galaxysklep.pl
                </Link>
              </Text>
            </Section>

            {/* Legal */}
            <Section style={legalSection}>
              <Text style={legalText}>
                Zgodnie z przepisami Ustawy z dnia 30 maja 2014 r. o prawach konsumenta (Dz.U. 2014 poz. 827 z późn. zm.), 
                przysługuje Państwu prawo odstąpienia od niniejszej umowy sprzedaży w terminie 14 dni kalendarzowych od dnia 
                otrzymania towaru bez podania jakiejkolwiek przyczyny. Termin do odstąpienia od umowy wygasa po upływie 14 dni 
                od dnia, w którym weszli Państwo w posiadanie rzeczy lub w którym osoba trzecia inna niż przewoźnik i wskazana 
                przez Państwa weszła w posiadanie rzeczy. Aby skorzystać z prawa odstąpienia od umowy, muszą Państwo poinformować 
                nas o swojej decyzji o odstąpieniu od niniejszej umowy w drodze jednoznacznego oświadczenia (na przykład pismo 
                wysłane pocztą lub pocztą elektroniczną). Szczegółowe warunki odstąpienia od umowy, w tym wzór formularza odstąpienia, 
                znajdują się w regulaminie sklepu dostępnym pod adresem www.galaxysklep.pl/regulamin. Niniejsze postanowienia 
                nie wyłączają, nie ograniczają ani nie zawieszają uprawnień kupującego wynikających z przepisów o rękojmi za wady 
                rzeczy sprzedanej zgodnie z Kodeksem cywilnym.
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
  color: '#4caf50',
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

const tableCellRightFree = {
  borderBottom: '1px solid #f0f0f0',
  color: '#4caf50',
  fontSize: '13px',
  fontWeight: '600' as const,
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

const productNameLink = {
  margin: '0',
  fontSize: '13px',
  color: '#073635',
  textDecoration: 'none',
  fontWeight: '500' as const,
};

const separatorCell = {
  padding: '0',
};

const tableSeparator = {
  borderColor: '#e0e0e0',
  margin: '8px 0',
};

const methodCell = {
  borderBottom: '1px solid #f0f0f0',
  color: '#666666',
  fontSize: '13px',
  padding: '12px 0',
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

const bankText = {
  color: '#020b1d',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '16px',
};

const bankHighlight = {
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  padding: '12px',
  marginBottom: '12px',
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
  color: '#666666',
  fontSize: '11px',
  marginTop: '12px',
  fontStyle: 'italic' as const,
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0 24px 0',
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

const bankDetailsAlways = {
  backgroundColor: '#fafafa',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '24px',
};

const bankDetailsTitle = {
  color: '#000000',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  marginBottom: '12px',
};

const bankTable = {
  width: '100%',
};

const bankDetailsTable = {
  width: '100%',
  marginTop: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  padding: '12px',
  border: '1px solid #e5e7eb',
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

export default OrderConfirmationEmail;