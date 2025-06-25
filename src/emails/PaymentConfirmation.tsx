// src/emails/PaymentConfirmation.tsx
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
  
  interface PaymentConfirmationEmailProps {
    orderNumber: string;
    customerName: string;
    customerEmail?: string;
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
    paymentDate?: Date;
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
  
  export const PaymentConfirmationEmail = ({
    orderNumber,
    customerName,
    customerEmail,
    items,
    total,
    deliveryMethod,
    paymentMethod,
    deliveryAddress,
    paymentDate,
  }: PaymentConfirmationEmailProps) => {
    const previewText = `Płatność otrzymana - Zamówienie #${orderNumber} - Galaxysklep.pl`;
  
    const deliveryMethodInfo = deliveryMethod ? getDeliveryMethod(deliveryMethod) : null;
    const paymentMethodInfo = paymentMethod ? getPaymentMethod(paymentMethod) : null;
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = deliveryMethodInfo?.price || 0;
    const paymentFee = paymentMethodInfo?.price || 0;
  
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
                  <span style={checkmarkStyle}>💰</span>
                  PŁATNOŚĆ OTRZYMANA
                </Text>
              </Section>
  
              {/* Payment Confirmation Message */}
              <Text style={confirmationMessage}>
                Dziękujemy! Otrzymaliśmy Twoją płatność za zamówienie #{orderNumber}.
              </Text>
  
              {/* Payment Information */}
              <Section style={infoBlock}>
                <Row>
                  <Column style={infoColumn}>
                    <Text style={infoLabel}>KWOTA PŁATNOŚCI</Text>
                    <Text style={paymentAmount}>
                      {formatPrice(total)}
                    </Text>
                  </Column>
                  <Column style={infoColumn}>
                    <Text style={infoLabel}>DATA PŁATNOŚCI</Text>
                    <Text style={infoText}>
                      {formatDate(paymentDate)}
                    </Text>
                  </Column>
                </Row>
              </Section>
  
              {/* Order Status Update */}
              <Section style={statusSection}>
                <Text style={statusTitle}>TWOJE ZAMÓWIENIE JEST TERAZ W REALIZACJI</Text>
                <Text style={statusText}>
                  Nasi pracownicy już przygotowują Twoje zamówienie do wysyłki. 
                  Powiadomimy Cię e-mailem, gdy paczka zostanie przekazana kurierowi.
                </Text>
              </Section>
  
              {/* Track Order Button */}
              <Section style={buttonSection}>
                <Button
                  style={trackButton}
                  href={`https://www.galaxysklep.pl/order-status/${orderNumber}`}
                >
                  ŚLEDŹ ZAMÓWIENIE
                </Button>
              </Section>
  
              {/* Order Items */}
              <Section style={itemsSection}>
                <Text style={itemsSectionTitle}>PRODUKTY W ZAMÓWIENIU</Text>
                <table style={itemsTable}>
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
                              <Text style={quantityText}>Ilość: {item.quantity}</Text>
                            </Column>
                          </Row>
                        </td>
                        <td style={tableCellRight}>{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                    
                    <tr>
                      <td colSpan={2} style={separatorCell}>
                        <Hr style={tableSeparator} />
                      </td>
                    </tr>
                    
                    {/* Delivery */}
                    <tr>
                      <td style={methodCell}>
                        Dostawa: {deliveryMethodInfo ? deliveryMethodInfo.labelPl : deliveryMethod}
                      </td>
                      <td style={deliveryFee > 0 ? tableCellRight : tableCellRightFree}>
                        {deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratis'}
                      </td>
                    </tr>
                    
                    {/* Payment */}
                    <tr>
                      <td style={methodCell}>
                        Płatność: {paymentMethodInfo ? paymentMethodInfo.labelPl : paymentMethod}
                      </td>
                      <td style={paymentFee > 0 ? tableCellRight : tableCellRightFree}>
                        {paymentFee > 0 ? formatPrice(paymentFee) : 'Gratis'}
                      </td>
                    </tr>
                    
                    <tr>
                      <td colSpan={2} style={separatorCell}>
                        <Hr style={tableSeparator} />
                      </td>
                    </tr>
                    
                    <tr>
                      <td style={totalCell}>
                        <strong>RAZEM</strong>
                      </td>
                      <td style={totalAmountCell}>
                        <strong>{formatPrice(total)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                  Ten e-mail został wygenerowany automatycznie. Prosimy nie odpowiadać na tę wiadomość. 
                  W przypadku jakichkolwiek pytań lub problemów prosimy o kontakt pod adresem support@galaxysklep.pl. 
                  Przetwarzamy Państwa dane osobowe zgodnie z obowiązującymi przepisami o ochronie danych osobowych 
                  oraz naszą Polityką Prywatności. Szczegółowe informacje znajdują się na naszej stronie internetowej 
                  w sekcji Polityka Prywatności.
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
  
  const confirmationMessage = {
    color: '#333333',
    fontSize: '15px',
    lineHeight: '22px',
    textAlign: 'center' as const,
    marginBottom: '24px',
  };
  
  const infoBlock = {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
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
  
  const paymentAmount = {
    color: '#059669',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '24px',
    margin: '0',
  };
  
  const statusSection = {
    backgroundColor: '#fafafa',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'center' as const,
  };
  
  const statusTitle = {
    color: '#000000',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    marginBottom: '8px',
  };
  
  const statusText = {
    color: '#666666',
    fontSize: '13px',
    lineHeight: '20px',
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
  
  const quantityText = {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: '#666666',
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
  
  export default PaymentConfirmationEmail;