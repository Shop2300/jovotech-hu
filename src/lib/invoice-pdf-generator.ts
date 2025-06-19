// src/lib/invoice-pdf-generator.ts
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  createdAt: string;
  customerEmail: string;
  customerPhone: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry?: string;
  billingCompany?: string;
  billingNip?: string;
  items: Array<{
    name?: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  notes?: string;
}

// Helper function to handle Polish characters
function polishToAscii(text: string): string {
  const charMap: { [key: string]: string } = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n',
    'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
    'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E', 'Í': 'I', 'Ň': 'N',
    'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U', 'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
  };
  
  return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻáčďéěíňřšťúůýžÁČĎÉĚÍŇŘŠŤÚŮÝŽ]/g, char => charMap[char] || char);
}

// Format currency for PLN
function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} zl`;
}

// Calculate delivery price based on method
function getDeliveryPrice(method: string): number {
  switch(method) {
    case 'zasilkovna':
    case 'paczkomat':
      return 8.99;
    case 'courier':
    case 'kurier':
      return 14.99;
    case 'dpd':
      return 12.99;
    case 'personal':
    case 'odbior-osobisty':
      return 0;
    default:
      return 12.99;
  }
}

// Get delivery method name in Polish
function getDeliveryMethodName(method: string): string {
  switch(method) {
    case 'zasilkovna':
    case 'paczkomat':
      return 'Dostawa - Paczkomat InPost';
    case 'courier':
    case 'kurier':
      return 'Dostawa - Kurier DPD';
    case 'dpd':
      return 'Dostawa - Kurier DPD';
    case 'personal':
    case 'odbior-osobisty':
      return 'Odbiór osobisty';
    default:
      return 'Dostawa';
  }
}

// Get payment method name in Polish
function getPaymentMethodName(method: string): string {
  switch(method) {
    case 'card':
      return 'Karta płatnicza online';
    case 'bank':
    case 'transfer':
      return 'Przelew bankowy';
    case 'blik':
      return 'BLIK';
    case 'cash':
    case 'gotowka':
      return 'Gotówka przy odbiorze';
    case 'cod':
    case 'pobranie':
      return 'Płatność przy odbiorze';
    default:
      return 'Przelew bankowy';
  }
}

export function generateInvoicePDF(invoiceData: InvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Page setup
  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 25;
  const rightMargin = pageWidth - 25;
  const contentWidth = rightMargin - leftMargin;
  let yPosition = 25;

  // Header - Invoice Title
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('FAKTURA', leftMargin, yPosition);
  
  // Invoice number and details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(invoiceData.invoiceNumber, rightMargin, yPosition - 5, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(polishToAscii(`Numer zamówienia: ${invoiceData.orderNumber}`), rightMargin, yPosition + 2, { align: 'right' });

  yPosition += 15;

  // Horizontal line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, yPosition, rightMargin, yPosition);
  yPosition += 10;

  // Two columns for seller and buyer
  const columnWidth = (contentWidth - 20) / 2;
  
  // Seller section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SPRZEDAWCA:', leftMargin, yPosition);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let sellerY = yPosition + 7;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Galaxy Sklep', leftMargin, sellerY);
  doc.setFont('helvetica', 'normal');
  sellerY += 5;
  doc.text(polishToAscii('1. máje 535/50'), leftMargin, sellerY);
  sellerY += 5;
  doc.text('46007 Liberec', leftMargin, sellerY);
  sellerY += 5;
  doc.text('Republika Czeska', leftMargin, sellerY);
  sellerY += 7;
  doc.text('NIP: 04688465', leftMargin, sellerY);
  sellerY += 7;
  doc.text('Email: support@galaxysklep.pl', leftMargin, sellerY);
  sellerY += 5;
  doc.text('Tel: +420 123 456 789', leftMargin, sellerY);

  // Buyer section
  const buyerX = leftMargin + columnWidth + 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('NABYWCA:', buyerX, yPosition);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let buyerY = yPosition + 7;
  
  // Company name if exists
  if (invoiceData.billingCompany) {
    doc.setFont('helvetica', 'bold');
    doc.text(polishToAscii(invoiceData.billingCompany), buyerX, buyerY);
    doc.setFont('helvetica', 'normal');
    buyerY += 5;
    if (invoiceData.billingNip) {
      doc.text(`NIP: ${invoiceData.billingNip}`, buyerX, buyerY);
      buyerY += 5;
    }
  }
  
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii(`${invoiceData.billingFirstName} ${invoiceData.billingLastName}`), buyerX, buyerY);
  doc.setFont('helvetica', 'normal');
  buyerY += 5;
  doc.text(polishToAscii(invoiceData.billingAddress), buyerX, buyerY);
  buyerY += 5;
  doc.text(polishToAscii(`${invoiceData.billingPostalCode} ${invoiceData.billingCity}`), buyerX, buyerY);
  buyerY += 5;
  doc.text(polishToAscii(invoiceData.billingCountry || 'Polska'), buyerX, buyerY);
  buyerY += 7;
  doc.text(`Email: ${invoiceData.customerEmail}`, buyerX, buyerY);
  buyerY += 5;
  doc.text(`Tel: ${invoiceData.customerPhone}`, buyerX, buyerY);

  yPosition = Math.max(sellerY, buyerY) + 10;

  // Dates section with border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(leftMargin, yPosition - 5, contentWidth, 16);
  
  const dateY = yPosition + 2;
  const dateSpacing = contentWidth / 3;
  
  const issueDate = new Date();
  const saleDate = new Date(invoiceData.createdAt);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  
  doc.setFontSize(9);
  doc.text('Data wystawienia:', leftMargin + 5, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(issueDate, 'dd.MM.yyyy'), leftMargin + 5, dateY + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.text(polishToAscii('Data sprzedaży:'), leftMargin + dateSpacing, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(saleDate, 'dd.MM.yyyy'), leftMargin + dateSpacing, dateY + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.text(polishToAscii('Termin płatności:'), leftMargin + dateSpacing * 2, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(dueDate, 'dd.MM.yyyy'), leftMargin + dateSpacing * 2, dateY + 5);
  
  doc.setFont('helvetica', 'normal');
  yPosition += 20;

  // No VAT notice
  doc.setDrawColor(0, 0, 0);
  doc.setFillColor(240, 240, 240);
  doc.rect(leftMargin, yPosition - 4, contentWidth, 12, 'FD');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii('FAKTURA WYSTAWIONA BEZ PODATKU VAT'), pageWidth / 2, yPosition, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(polishToAscii('Sprzedawca nie jest płatnikiem VAT'), pageWidth / 2, yPosition + 5, { align: 'center' });
  
  yPosition += 18;

  // Items table
  // Table header
  doc.setFillColor(0, 0, 0);
  doc.rect(leftMargin, yPosition - 5, contentWidth, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Lp.', leftMargin + 2, yPosition);
  doc.text(polishToAscii('Nazwa towaru/usługi'), leftMargin + 12, yPosition);
  doc.text(polishToAscii('Ilość'), leftMargin + 125, yPosition, { align: 'center' });
  doc.text('Cena jedn.', leftMargin + 145, yPosition, { align: 'right' });
  doc.text(polishToAscii('Wartość'), rightMargin - 2, yPosition, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
  yPosition += 10;
  
  // Table items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let itemNumber = 1;
  let subtotal = 0;
  
  // Draw table borders
  const tableStartY = yPosition - 10;
  let currentY = yPosition - 5;
  
  // Products
  invoiceData.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    // Row background for even rows
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(leftMargin, currentY - 4, contentWidth, 7, 'F');
    }
    
    doc.text(itemNumber.toString() + '.', leftMargin + 2, yPosition);
    
    // Truncate long product names
    const maxNameLength = 65;
    const itemName = polishToAscii(item.name || 'Produkt');
    const displayName = itemName.length > maxNameLength ? 
      itemName.substring(0, maxNameLength) + '...' : itemName;
    
    doc.text(displayName, leftMargin + 12, yPosition);
    doc.text(item.quantity.toString(), leftMargin + 125, yPosition, { align: 'center' });
    doc.text(formatCurrency(item.price), leftMargin + 145, yPosition, { align: 'right' });
    doc.text(formatCurrency(itemTotal), rightMargin - 2, yPosition, { align: 'right' });
    
    currentY += 7;
    yPosition += 7;
    itemNumber++;
  });

  // Delivery
  const deliveryPrice = getDeliveryPrice(invoiceData.deliveryMethod);
  if (deliveryPrice > 0) {
    if (itemNumber % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(leftMargin, currentY - 4, contentWidth, 7, 'F');
    }
    
    doc.text(itemNumber.toString() + '.', leftMargin + 2, yPosition);
    doc.text(polishToAscii(getDeliveryMethodName(invoiceData.deliveryMethod)), leftMargin + 12, yPosition);
    doc.text('1', leftMargin + 125, yPosition, { align: 'center' });
    doc.text(formatCurrency(deliveryPrice), leftMargin + 145, yPosition, { align: 'right' });
    doc.text(formatCurrency(deliveryPrice), rightMargin - 2, yPosition, { align: 'right' });
    
    subtotal += deliveryPrice;
    currentY += 7;
    yPosition += 7;
  }

  // Draw table borders
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  // Vertical lines
  doc.line(leftMargin, tableStartY, leftMargin, currentY - 4);
  doc.line(leftMargin + 10, tableStartY, leftMargin + 10, currentY - 4);
  doc.line(leftMargin + 115, tableStartY, leftMargin + 115, currentY - 4);
  doc.line(leftMargin + 135, tableStartY, leftMargin + 135, currentY - 4);
  doc.line(rightMargin, tableStartY, rightMargin, currentY - 4);
  // Bottom line
  doc.line(leftMargin, currentY - 4, rightMargin, currentY - 4);

  // Summary
  yPosition += 5;
  doc.setLineWidth(0.5);
  doc.line(leftMargin + 100, yPosition, rightMargin, yPosition);
  yPosition += 8;

  // Total
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii('RAZEM DO ZAPŁATY:'), leftMargin + 100, yPosition);
  doc.setFontSize(14);
  doc.text(formatCurrency(invoiceData.total), rightMargin - 2, yPosition, { align: 'right' });
  
  yPosition += 8;
  
  // Amount in words
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const amountInWords = polishToAscii(numberToPolishWords(invoiceData.total));
  doc.text(polishToAscii(`Słownie: ${amountInWords}`), leftMargin, yPosition);

  // Payment details section
  yPosition += 15;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(leftMargin, yPosition - 5, contentWidth, 42);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii('DANE DO PŁATNOŚCI:'), leftMargin + 5, yPosition);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  yPosition += 7;
  
  // Two columns for payment info
  const paymentColWidth = (contentWidth - 10) / 2;
  
  // Left column
  doc.text(polishToAscii('Sposób płatności:'), leftMargin + 5, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii(getPaymentMethodName(invoiceData.paymentMethod)), leftMargin + 5, yPosition + 5);
  doc.setFont('helvetica', 'normal');
  
  yPosition += 12;
  doc.text('Numer konta:', leftMargin + 5, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text('21291000062469800208837403', leftMargin + 5, yPosition + 5);
  doc.setFont('helvetica', 'normal');
  
  yPosition += 12;
  doc.text('Bank:', leftMargin + 5, yPosition);
  doc.text('Aion S.A. Spolka Akcyjna Oddzial w Polsce', leftMargin + 5, yPosition + 5);
  doc.text('Dobra 40, 00-344 Warszawa, Poland', leftMargin + 5, yPosition + 10);
  
  // Right column
  yPosition = yPosition - 24; // Reset to top of payment box
  const rightColX = leftMargin + paymentColWidth + 10;
  
  doc.text(polishToAscii('Tytuł przelewu:'), rightColX, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii(`Zamówienie ${invoiceData.orderNumber}`), rightColX, yPosition + 5);
  doc.setFont('helvetica', 'normal');
  
  yPosition += 12;
  doc.text('IBAN:', rightColX, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text('PL21 2910 0006 2469 8002 0883 7403', rightColX, yPosition + 5);
  doc.setFont('helvetica', 'normal');
  
  yPosition += 12;
  doc.text('SWIFT/BIC:', rightColX, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text('BMPBPLPP', rightColX, yPosition + 5);
  
  doc.setFont('helvetica', 'normal');
  yPosition += 20;

  // Shipping address if different
  const showShippingAddress = invoiceData.shippingAddress && 
    (invoiceData.shippingAddress !== invoiceData.billingAddress ||
     invoiceData.shippingCity !== invoiceData.billingCity);
     
  if (showShippingAddress) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    const shippingBoxHeight = 30;
    doc.rect(leftMargin, yPosition - 5, contentWidth, shippingBoxHeight);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ADRES DOSTAWY:', leftMargin + 5, yPosition);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    yPosition += 7;
    doc.text(polishToAscii(`${invoiceData.shippingFirstName || invoiceData.billingFirstName} ${invoiceData.shippingLastName || invoiceData.billingLastName}`), leftMargin + 5, yPosition);
    yPosition += 5;
    if (invoiceData.shippingAddress) {
      doc.text(polishToAscii(invoiceData.shippingAddress), leftMargin + 5, yPosition);
      yPosition += 5;
    }
    if (invoiceData.shippingPostalCode || invoiceData.shippingCity) {
      doc.text(polishToAscii(`${invoiceData.shippingPostalCode || ''} ${invoiceData.shippingCity || ''}`), leftMargin + 5, yPosition);
    }
    yPosition += 15;
  }

  // Notes section if any
  if (invoiceData.notes && invoiceData.notes.trim()) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    
    // Calculate box height based on text
    const noteLines = doc.splitTextToSize(polishToAscii(invoiceData.notes), contentWidth - 10);
    const noteBoxHeight = Math.max(15, 8 + (noteLines.length * 5));
    
    doc.rect(leftMargin, yPosition - 5, contentWidth, noteBoxHeight);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('UWAGI:', leftMargin + 5, yPosition);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    yPosition += 7;
    
    noteLines.forEach((line: string) => {
      doc.text(line, leftMargin + 5, yPosition);
      yPosition += 5;
    });
    
    yPosition += 5;
  }

  // Footer - ensure we have enough space
  const footerY = Math.max(yPosition + 20, pageHeight - 45);
  
  // Signature areas
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Draw signature lines
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(leftMargin, footerY, leftMargin + 65, footerY);
  doc.line(rightMargin - 65, footerY, rightMargin, footerY);
  
  doc.text(polishToAscii('Podpis osoby upoważnionej'), leftMargin + 32.5, footerY + 5, { align: 'center' });
  doc.text(polishToAscii('do wystawienia faktury'), leftMargin + 32.5, footerY + 10, { align: 'center' });
  
  doc.text(polishToAscii('Podpis osoby upoważnionej'), rightMargin - 32.5, footerY + 5, { align: 'center' });
  doc.text(polishToAscii('do odbioru faktury'), rightMargin - 32.5, footerY + 10, { align: 'center' });

  // Bottom line
  doc.setLineWidth(0.5);
  doc.line(leftMargin, pageHeight - 25, rightMargin, pageHeight - 25);
  
  // Company footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    polishToAscii('Galaxy Sklep • 1. máje 535/50, 46007 Liberec, Republika Czeska • NIP: 04688465'),
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );
  
  doc.text(
    polishToAscii('Email: support@galaxysklep.pl • Tel: +420 123 456 789 • www.galaxysklep.pl'),
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );
  
  // Page number
  doc.setFontSize(7);
  doc.text('Strona 1 z 1', pageWidth / 2, pageHeight - 8, { align: 'center' });

  return doc;
}

// Helper function to convert numbers to Polish words
function numberToPolishWords(amount: number): string {
  const zloty = Math.floor(amount);
  const groszy = Math.round((amount - zloty) * 100);
  
  // Basic conversion for common amounts
  const ones = ['', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
  const teens = ['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
  const tens = ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'];
  const hundreds = ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];
  
  function convertHundreds(n: number): string {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o > 0 ? ' ' + ones[o] : '');
    }
    const h = Math.floor(n / 100);
    const r = n % 100;
    return hundreds[h] + (r > 0 ? ' ' + convertHundreds(r) : '');
  }
  
  // For simplicity, handle amounts up to 9999
  if (zloty >= 10000) {
    return `${zloty} złotych ${groszy}/100`;
  }
  
  let words = '';
  if (zloty === 0) {
    words = 'zero złotych';
  } else if (zloty === 1) {
    words = 'jeden złoty';
  } else if (zloty < 1000) {
    words = convertHundreds(zloty) + ' złotych';
  } else {
    const thousands = Math.floor(zloty / 1000);
    const remainder = zloty % 1000;
    if (thousands === 1) {
      words = 'tysiąc';
    } else if (thousands < 5) {
      words = ones[thousands] + ' tysiące';
    } else {
      words = ones[thousands] + ' tysięcy';
    }
    if (remainder > 0) {
      words += ' ' + convertHundreds(remainder) + ' złotych';
    } else {
      words += ' złotych';
    }
  }
  
  return words + ` ${groszy}/100`;
}