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
  orderDate?: Date | string;
}

export const ShippingNotificationEmail = ({
  orderNumber,
  customerName,
  trackingNumber,
  carrier,
  estimatedDelivery,
  items,
  deliveryAddress,
  orderDate,
}: ShippingNotificationEmailProps) => {
  const previewText = `A(z) #${orderNumber} rendelést feladtuk – Jovotech.hu`;

  const trackingUrl = `https://jovotech.hu/order-status/${orderNumber}`;

  // Format order date (HU locale & Budapest TZ)
  const formatOrderDate = (date: Date | string | undefined) => {
    if (!date) return new Date().toLocaleDateString('hu-HU', { timeZone: 'Europe/Budapest' });
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('hu-HU', { timeZone: 'Europe/Budapest' });
  };

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
            {/* Title with icon */}
            <Section style={titleSection}>
              <Text style={confirmationTitle}>
                <span style={checkmarkStyle}>📦</span>
                CSOMAGJA ÚTON VAN
              </Text>
            </Section>

            {/* Order Description */}
            <Text style={orderDescription}>
              A(z) {orderNumber} számú rendelése {formatOrderDate(orderDate)} dátummal sikeresen feladásra került.
              A(z) {trackingNumber} azonosítójú küldemény már úton van Önhöz. Előfordulhat, hogy a rendelést
              a gyorsabb kiszállítás érdekében több csomagban kézbesítjük.
            </Text>

            {/* Tracking Information Box */}
            <Section style={infoBlock}>
              <Row>
                <Column style={infoColumn}>
                  <Text style={infoLabel}>KÖVETÉSI SZÁM</Text>
                  <Text style={trackingNumberText}>{trackingNumber}</Text>
                  <Text style={carrierText}>{carrier}</Text>
                </Column>
                <Column style={infoColumn}>
                  <Text style={infoLabel}>VÁRHATÓ KÉZBESÍTÉS</Text>
                  <Text style={infoText}>{estimatedDelivery || '1–3 munkanap'}</Text>
                </Column>
              </Row>
            </Section>

            {/* Track Button */}
            <Section style={buttonSection}>
              <Button style={trackButton} href={trackingUrl}>
                CSOMAG KÖVETÉSE
              </Button>
            </Section>

            {/* Delivery Address */}
            <Section style={addressSection}>
              <Text style={addressLabel}>SZÁLLÍTÁSI CÍM</Text>
              <Text style={addressText}>
                {customerName}
                <br />
                {deliveryAddress.street}
                <br />
                {deliveryAddress.postalCode} {deliveryAddress.city}
              </Text>
            </Section>

            {/* Order Items */}
            <Section style={itemsSection}>
              <Text style={itemsSectionTitle}>RENDELÉS TÉTELEI</Text>
              <table style={itemsTable}>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td style={tableCell}>
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
                      </td>
                      <td style={tableCellCenter}>x{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* Contact */}
            <Text style={contactText}>
              Kérdése van? Lépjen kapcsolatba velünk:
              <br />
              <Link href="mailto:support@jovotech.hu" style={contactLink}>
                support@jovotech.hu
              </Link>
            </Text>

            {/* Footer - Same as OrderConfirmation */}
            <Hr style={footerDivider} />

            {/* Combined Company Info and Footer */}
            <Section style={companyInfo}>
              <Text style={companyText}>
                Köszönjük a vásárlást a Jovotech.hu-n!
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

            {/* Legal Text */}
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
  borderBottom: '1px solid #e0e0e0', // ✅ fixed
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

const orderDescription = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  marginBottom: '24px',
  padding: '0 20px',
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
  paddingBottom: '24px',
};

const legalText = {
  color: '#aaaaaa',
  fontSize: '10px',
  lineHeight: '14px',
  textAlign: 'center' as const,
};

export default ShippingNotificationEmail;
