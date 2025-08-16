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
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date: Date | string | undefined | null) => {
  const fmt = new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Budapest',
  });
  if (!date) return fmt.format(new Date());
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return fmt.format(new Date());
  return fmt.format(dateObj);
};

const BANK_DETAILS = {
  accountNumber: '12600016-10426947-95638648', // Számlaszám
  iban: 'HU86126000161042694795638648',
  swift: 'TRWIBEBBXXX',
  bankName: 'WISE EUROPE S.A.',
  bankAddress: 'Rue du Trône 100, 1050 Brussels, Belgium',
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
  const previewText = `Rendelés visszaigazolása #${orderNumber} - Jovotech.hu`;

  const deliveryMethodInfo = deliveryMethod ? getDeliveryMethod(deliveryMethod) : null;
  const paymentMethodInfo = paymentMethod ? getPaymentMethod(paymentMethod) : null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethodInfo?.price || 0;
  const paymentFee = paymentMethodInfo?.price || 0;

  const isDifferentAddress =
    billingAddress &&
    (billingAddress.street !== deliveryAddress.street ||
      billingAddress.city !== deliveryAddress.city ||
      billingAddress.postalCode !== deliveryAddress.postalCode);

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
                  src="https://jovotech.hu/images/jovotechlogovevor.png"
                  alt="Jovotech.hu"
                  height="32"
                  style={logo}
                />
              </Column>
              <Column style={headerRight}>
                <Text style={headerText}>RENDELÉS #{orderNumber}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={content}>
            {/* Title with checkmark */}
            <Section style={titleSection}>
              <Text style={confirmationTitle}>
                <span style={checkmarkStyle}>✓</span>
                RENDELÉS VISSZAIGAZOLÁSA
              </Text>
            </Section>

            {/* Customer Information */}
            <Section style={infoBlock}>
              <Row>
                <Column style={infoColumn}>
                  <Text style={infoLabel}>VÁSÁRLÓ ADATAI</Text>
                  <Text style={infoText}>
                    {customerName}
                    {customerEmail && (
                      <>
                        <br />
                        {customerEmail}
                      </>
                    )}
                    {customerPhone && (
                      <>
                        <br />
                        Tel.: {customerPhone}
                      </>
                    )}
                  </Text>
                  {(companyName || companyNip) && (
                    <Text style={infoText}>
                      {companyName && (
                        <>
                          <br />
                          <strong>{companyName}</strong>
                        </>
                      )}
                      {companyNip && (
                        <>
                          <br />
                          Adószám: {companyNip}
                        </>
                      )}
                    </Text>
                  )}
                </Column>
                <Column style={infoColumn}>
                  <Text style={infoLabel}>RENDELÉS DÁTUMA</Text>
                  <Text style={infoText}>{formatDate(orderDate)}</Text>
                  <Text style={{ ...infoLabel, marginTop: '12px' }}>ÁLLAPOT</Text>
                  <Text style={infoText}>
                    {paymentMethod === 'bank' ? 'Fizetésre vár' : 'Feldolgozás alatt'}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Track Order Button after Customer Info */}
            <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
              <Button style={trackButton} href={`https://jovotech.hu/order-status/${orderNumber}`}>
                RENDELÉS KÖVETÉSE
              </Button>
            </Section>

            {/* Addresses */}
            <Section style={addressSection}>
              <Row>
                <Column style={addressColumn}>
                  <Text style={addressLabel}>SZÁMLÁZÁSI CÍM</Text>
                  <Text style={addressText}>
                    {billingAddress ? (
                      <>
                        {billingAddress.street}
                        <br />
                        {billingAddress.postalCode} {billingAddress.city}
                      </>
                    ) : (
                      <>
                        {deliveryAddress.street}
                        <br />
                        {deliveryAddress.postalCode} {deliveryAddress.city}
                      </>
                    )}
                  </Text>
                </Column>
                <Column style={addressColumn}>
                  <Text style={addressLabel}>SZÁLLÍTÁSI CÍM</Text>
                  <Text style={addressText}>
                    {deliveryAddress.street}
                    <br />
                    {deliveryAddress.postalCode} {deliveryAddress.city}
                  </Text>
                  {isDifferentAddress && <Text style={addressNote}>(eltér a számlázási címtől)</Text>}
                </Column>
              </Row>
            </Section>

            {/* Order Items */}
            <Section style={itemsSection}>
              <table style={itemsTable}>
                <thead>
                  <tr>
                    <th style={tableHeaderLeft}>TERMÉK</th>
                    <th style={tableHeaderCenter}>MENNYISÉG</th>
                    <th style={tableHeaderRight}>ÁR</th>
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
                                  href={`https://jovotech.hu/${item.categorySlug}/${item.productSlug}`}
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
                                href={`https://jovotech.hu/${item.categorySlug}/${item.productSlug}`}
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
                      🚚 Szállítás: {deliveryMethodInfo ? deliveryMethodInfo.label : deliveryMethod}
                    </td>
                    <td style={deliveryFee > 0 ? tableCellRight : tableCellRightFree}>
                      {deliveryFee > 0 ? formatPrice(deliveryFee) : 'Ingyenes'}
                    </td>
                  </tr>

                  {/* Payment */}
                  <tr>
                    <td style={methodCell} colSpan={2}>
                      💳 Fizetés: {paymentMethodInfo ? paymentMethodInfo.label : paymentMethod}
                    </td>
                    <td style={paymentFee > 0 ? tableCellRight : tableCellRightFree}>
                      {paymentFee > 0 ? formatPrice(paymentFee) : 'Ingyenes'}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={3} style={separatorCell}>
                      <Hr style={tableSeparator} />
                    </td>
                  </tr>

                  <tr>
                    <td style={totalCell} colSpan={2}>
                      <strong>ÖSSZESEN</strong>
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
                <Text style={bankTitle}>FIZETÉSI ÚTMUTATÓ ÉS BANKI ADATOK</Text>
                <Text style={bankText}>
                  A rendelés véglegesítéséhez kérjük, utalja át a(z) <strong>{formatPrice(total)}</strong>{' '}
                  összeget a bankszámlánkra.
                </Text>
                <Section style={bankHighlight}>
                  <Text style={bankDetailRow}>
                    <strong>Fizetendő összeg:</strong> {formatPrice(total)}
                  </Text>
                  <Text style={bankDetailRow}>
                    <strong>Közlemény:</strong>{' '}
                    <span style={highlightText}>{orderNumber.replace('-', '')}</span>
                  </Text>
                </Section>

                {/* Bank Details Table */}
                <table style={bankDetailsTable}>
                  <tbody>
                    <tr>
                      <td style={bankLabel}>Kedvezményezett neve:</td>
                      <td style={bankValue}>Jovotech.hu</td>
                    </tr>
                    <tr>
                      <td style={bankLabel}>Számlaszám:</td>
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

                <Text style={bankNote}>⏱️ A rendelést a befizetés beérkezése után azonnal feladjuk.</Text>
              </Section>
            )}

            {/* Track Order Button */}
            <Section style={buttonSection}>
              <Button style={trackButton} href={`https://jovotech.hu/order-status/${orderNumber}`}>
                RENDELÉS KÖVETÉSE
              </Button>
            </Section>

            {/* Bank Details - Only for non-bank payment methods */}
            {paymentMethod !== 'bank' && (
              <Section style={bankDetailsAlways}>
                <Text style={bankDetailsTitle}>BANKI ADATOK</Text>
                <table style={bankTable}>
                  <tbody>
                    <tr>
                      <td style={bankLabel}>Kedvezményezett neve:</td>
                      <td style={bankValue}>Jovotech.hu</td>
                    </tr>
                    <tr>
                      <td style={bankLabel}>Számlaszám:</td>
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
              Kérdése van? Lépjen kapcsolatba velünk:
              <br />
              <Link href="mailto:support@jovotech.hu" style={contactLink}>
                support@jovotech.hu
              </Link>
            </Text>

            {/* Footer */}
            <Hr style={footerDivider} />

            {/* Combined Company Info and Footer */}
            <Section style={companyInfo}>
              <Text style={companyText}>
                Köszönjük a bizalmát és a vásárlást a Jovotech.hu-n!
                <br />
                Üdvözlettel,
                <br />
                <strong>A Jovotech.hu csapata</strong>
                <br />
                <br />
                <strong>Jovotech.hu</strong>
                <br />
                <Link href="https://jovotech.hu" style={companyLink}>
                  www.jovotech.hu
                </Link>
              </Text>
            </Section>

            {/* Legal */}
            <Section style={legalSection}>
              <Text style={legalText}>
                Amennyiben a csomag szállítás közben megsérült, kérjük, azonnal jelezze a fuvarozónak,
                és győződjön meg róla, hogy az eset rögzítésre kerül a jegyzőkönyvben. Kérjük, őrizze meg
                az összes csomagolóanyagot, és vegye fel velünk a kapcsolatot a support@jovotech.hu címen.
                A rendeléshez tartozó számlákat kizárólag elektronikusan küldjük ki a megrendelésnél megadott
                e-mail címre. Kérjük, ellenőrizze az e-mail cím helyességét, és őrizze meg a számlák
                másolatát. Személyes adatait az irányadó adatvédelmi jogszabályoknak és az Adatkezelési
                tájékoztatónknak megfelelően kezeljük. Az adatokat harmadik félnek nem adjuk át az Ön
                kifejezett hozzájárulása nélkül, kivéve a szállításhoz szükséges adatfeldolgozókat.
                Részletek a weboldalunkon az Adatkezelési tájékoztatóban találhatók. Kérdés vagy észrevétel
                esetén keressen minket a support@jovotech.hu címen. A vásárlás feltételeire vonatkozó
                részletek az Általános Szerződési Feltételek (ÁSZF) menüpontban érhetők el.
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
  border: '1px solid #e0e0e0', // fixed
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
  borderBottom: '1px solid #f0f0f0', // fixed
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
  border: '1px solid #e5e7eb', // fixed
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
  paddingBottom: '24px',
};

const legalText = {
  color: '#aaaaaa',
  fontSize: '10px',
  lineHeight: '14px',
  textAlign: 'center' as const,
};

export default OrderConfirmationEmail;
