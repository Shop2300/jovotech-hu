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

  // Page setup - reduced margins for more space
  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 15;
  const rightMargin = pageWidth - 15;
  const contentWidth = rightMargin - leftMargin;
  let yPosition = 15;

  // Header - Invoice Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FAKTURA', leftMargin, yPosition);
  
  // Invoice number and details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(invoiceData.invoiceNumber, rightMargin, yPosition - 3, { align: 'right' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(polishToAscii(`Numer zamówienia: ${invoiceData.orderNumber}`), rightMargin, yPosition + 2, { align: 'right' });

  yPosition += 12;

  // Horizontal line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, yPosition, rightMargin, yPosition);
  yPosition += 8;

  // Two columns for seller and buyer
  const columnWidth = (contentWidth - 10) / 2;
  
  // Seller section with bank info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SPRZEDAWCA:', leftMargin, yPosition);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  let sellerY = yPosition + 5;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Galaxy Sklep', leftMargin, sellerY);
  doc.setFont('helvetica', 'normal');
  sellerY += 3.5;
  doc.text(polishToAscii('1. máje 535/50'), leftMargin, sellerY);
  sellerY += 3.5;
  doc.text('46007 Liberec, Republika Czeska', leftMargin, sellerY);
  sellerY += 3.5;
  doc.text('NIP: 04688465', leftMargin, sellerY);
  sellerY += 3.5;
  doc.text('Email: support@galaxysklep.pl', leftMargin, sellerY);
  
  // Bank info under company
  sellerY += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Konto bankowe:', leftMargin, sellerY);
  doc.setFont('helvetica', 'normal');
  sellerY += 3.5;
  doc.text('21291000062469800208837403', leftMargin, sellerY);
  sellerY += 3.5;
  doc.text('IBAN: PL21 2910 0006 2469 8002 0883 7403', leftMargin, sellerY);
  sellerY += 3.5;
  doc.text('SWIFT: BMPBPLPP', leftMargin, sellerY);
  sellerY += 3.5;
  doc.text('Aion S.A. Spolka Akcyjna Oddzial w Polsce', leftMargin, sellerY);

  // Buyer section
  const buyerX = leftMargin + columnWidth + 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('NABYWCA:', buyerX, yPosition);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  let buyerY = yPosition + 5;
  
  // Company name if exists
  if (invoiceData.billingCompany) {
    doc.setFont('helvetica', 'bold');
    doc.text(polishToAscii(invoiceData.billingCompany), buyerX, buyerY);
    doc.setFont('helvetica', 'normal');
    buyerY += 3.5;
    if (invoiceData.billingNip) {
      doc.text(`NIP: ${invoiceData.billingNip}`, buyerX, buyerY);
      buyerY += 3.5;
    }
  }
  
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii(`${invoiceData.billingFirstName} ${invoiceData.billingLastName}`), buyerX, buyerY);
  doc.setFont('helvetica', 'normal');
  buyerY += 3.5;
  doc.text(polishToAscii(invoiceData.billingAddress), buyerX, buyerY);
  buyerY += 3.5;
  doc.text(polishToAscii(`${invoiceData.billingPostalCode} ${invoiceData.billingCity}`), buyerX, buyerY);
  buyerY += 3.5;
  doc.text(polishToAscii(invoiceData.billingCountry || 'Polska'), buyerX, buyerY);
  buyerY += 3.5;
  doc.text(`Email: ${invoiceData.customerEmail}`, buyerX, buyerY);
  buyerY += 3.5;
  doc.text(`Tel: ${invoiceData.customerPhone}`, buyerX, buyerY);

  yPosition = Math.max(sellerY, buyerY) + 8;

  // Dates section - horizontal layout
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(leftMargin, yPosition - 4, contentWidth, 10);
  
  const dateY = yPosition;
  const dateSpacing = contentWidth / 3;
  
  const issueDate = new Date();
  const saleDate = new Date(invoiceData.createdAt);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  
  doc.setFontSize(8);
  doc.text('Data wystawienia: ', leftMargin + 3, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(issueDate, 'dd.MM.yyyy'), leftMargin + 30, dateY);
  
  doc.setFont('helvetica', 'normal');
  doc.text(polishToAscii('Data sprzedaży: '), leftMargin + dateSpacing, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(saleDate, 'dd.MM.yyyy'), leftMargin + dateSpacing + 25, dateY);
  
  doc.setFont('helvetica', 'normal');
  doc.text(polishToAscii('Termin płatności: '), leftMargin + dateSpacing * 2, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(dueDate, 'dd.MM.yyyy'), leftMargin + dateSpacing * 2 + 25, dateY);
  
  doc.setFont('helvetica', 'normal');
  yPosition += 12;

  // No VAT notice - compact
  doc.setDrawColor(0, 0, 0);
  doc.setFillColor(240, 240, 240);
  doc.rect(leftMargin, yPosition - 3, contentWidth, 8, 'FD');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii('FAKTURA WYSTAWIONA BEZ PODATKU VAT - Sprzedawca nie jest płatnikiem VAT'), pageWidth / 2, yPosition + 1, { align: 'center' });
  
  yPosition += 12;

  // Items table - simplified
  doc.setFillColor(0, 0, 0);
  doc.rect(leftMargin, yPosition - 4, contentWidth, 6, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Lp.', leftMargin + 2, yPosition);
  doc.text(polishToAscii('Nazwa towaru/usługi'), leftMargin + 10, yPosition);
  doc.text(polishToAscii('Ilość'), leftMargin + 130, yPosition, { align: 'center' });
  doc.text('Cena jedn.', leftMargin + 150, yPosition, { align: 'right' });
  doc.text(polishToAscii('Wartość'), rightMargin - 2, yPosition, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
  yPosition += 7;
  
  // Table items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  let itemNumber = 1;
  let subtotal = 0;
  
  // Products
  invoiceData.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    doc.text(itemNumber.toString() + '.', leftMargin + 2, yPosition);
    
    // Truncate long product names
    const maxNameLength = 75;
    const itemName = polishToAscii(item.name || 'Produkt');
    const displayName = itemName.length > maxNameLength ? 
      itemName.substring(0, maxNameLength) + '...' : itemName;
    
    doc.text(displayName, leftMargin + 10, yPosition);
    doc.text(item.quantity.toString(), leftMargin + 130, yPosition, { align: 'center' });
    doc.text(formatCurrency(item.price), leftMargin + 150, yPosition, { align: 'right' });
    doc.text(formatCurrency(itemTotal), rightMargin - 2, yPosition, { align: 'right' });
    
    yPosition += 5;
    itemNumber++;
  });

  // Delivery
  const deliveryPrice = getDeliveryPrice(invoiceData.deliveryMethod);
  if (deliveryPrice > 0) {
    doc.text(itemNumber.toString() + '.', leftMargin + 2, yPosition);
    doc.text(polishToAscii(getDeliveryMethodName(invoiceData.deliveryMethod)), leftMargin + 10, yPosition);
    doc.text('1', leftMargin + 130, yPosition, { align: 'center' });
    doc.text(formatCurrency(deliveryPrice), leftMargin + 150, yPosition, { align: 'right' });
    doc.text(formatCurrency(deliveryPrice), rightMargin - 2, yPosition, { align: 'right' });
    
    subtotal += deliveryPrice;
    yPosition += 5;
  }

  // Summary line
  doc.setLineWidth(0.5);
  doc.line(leftMargin, yPosition, rightMargin, yPosition);
  yPosition += 6;

  // Total
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii('RAZEM DO ZAPŁATY:'), leftMargin + 100, yPosition);
  doc.setFontSize(12);
  doc.text(formatCurrency(invoiceData.total), rightMargin - 2, yPosition, { align: 'right' });
  
  yPosition += 6;
  
  // Amount in words
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const amountInWords = polishToAscii(numberToPolishWords(invoiceData.total));
  doc.text(polishToAscii(`Słownie: ${amountInWords}`), leftMargin, yPosition);

  // Payment details section - compact
  yPosition += 10;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.rect(leftMargin, yPosition - 4, contentWidth, 25);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii('DANE DO PŁATNOŚCI:'), leftMargin + 3, yPosition);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  
  // Payment info in columns
  doc.text(polishToAscii('Sposób płatności: '), leftMargin + 3, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii(getPaymentMethodName(invoiceData.paymentMethod)), leftMargin + 28, yPosition);
  
  doc.setFont('helvetica', 'normal');
  doc.text(polishToAscii('Tytuł przelewu: '), leftMargin + 100, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii(`Zamówienie ${invoiceData.orderNumber}`), leftMargin + 125, yPosition);
  
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  doc.text('Numer konta: ', leftMargin + 3, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text('21291000062469800208837403', leftMargin + 25, yPosition);
  
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  doc.text('IBAN: ', leftMargin + 3, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text('PL21 2910 0006 2469 8002 0883 7403', leftMargin + 13, yPosition);
  
  doc.setFont('helvetica', 'normal');
  doc.text('SWIFT/BIC: ', leftMargin + 100, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text('BMPBPLPP', leftMargin + 120, yPosition);
  
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  doc.text('Bank: Aion S.A. Spolka Akcyjna Oddzial w Polsce, Dobra 40, 00-344 Warszawa, Poland', leftMargin + 3, yPosition);

  yPosition += 12;

  // Shipping address if different - compact
  const showShippingAddress = invoiceData.shippingAddress && 
    (invoiceData.shippingAddress !== invoiceData.billingAddress ||
     invoiceData.shippingCity !== invoiceData.billingCity);
     
  if (showShippingAddress) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(leftMargin, yPosition - 4, contentWidth / 2 - 5, 20);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ADRES DOSTAWY:', leftMargin + 3, yPosition);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    yPosition += 4;
    doc.text(polishToAscii(`${invoiceData.shippingFirstName || invoiceData.billingFirstName} ${invoiceData.shippingLastName || invoiceData.billingLastName}`), leftMargin + 3, yPosition);
    yPosition += 3.5;
    if (invoiceData.shippingAddress) {
      doc.text(polishToAscii(invoiceData.shippingAddress), leftMargin + 3, yPosition);
      yPosition += 3.5;
    }
    if (invoiceData.shippingPostalCode || invoiceData.shippingCity) {
      doc.text(polishToAscii(`${invoiceData.shippingPostalCode || ''} ${invoiceData.shippingCity || ''}`), leftMargin + 3, yPosition);
    }
  }

  // Notes section if any - compact, next to shipping address
  if (invoiceData.notes && invoiceData.notes.trim()) {
    const notesX = showShippingAddress ? (leftMargin + contentWidth / 2 + 5) : leftMargin;
    const notesY = showShippingAddress ? (yPosition - 11) : yPosition - 4;
    const notesWidth = showShippingAddress ? (contentWidth / 2 - 5) : contentWidth;
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(notesX, notesY, notesWidth, 20);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('UWAGI:', notesX + 3, notesY + 4);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    const noteLines = doc.splitTextToSize(polishToAscii(invoiceData.notes), notesWidth - 6);
    let noteY = notesY + 8;
    noteLines.slice(0, 3).forEach((line: string) => {
      doc.text(line, notesX + 3, noteY);
      noteY += 3.5;
    });
    
    if (!showShippingAddress) {
      yPosition += 22;
    }
  }

  if (showShippingAddress) {
    yPosition += 10;
  }

  // Signature areas - compact
  const footerY = Math.min(yPosition + 15, pageHeight - 30);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  // Draw signature lines
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(leftMargin, footerY, leftMargin + 60, footerY);
  doc.line(rightMargin - 60, footerY, rightMargin, footerY);
  
  doc.text(polishToAscii('Podpis osoby upoważnionej'), leftMargin + 30, footerY + 4, { align: 'center' });
  doc.text(polishToAscii('do wystawienia faktury'), leftMargin + 30, footerY + 7, { align: 'center' });
  
  doc.text(polishToAscii('Podpis osoby upoważnionej'), rightMargin - 30, footerY + 4, { align: 'center' });
  doc.text(polishToAscii('do odbioru faktury'), rightMargin - 30, footerY + 7, { align: 'center' });

  // Bottom line
  doc.setLineWidth(0.5);
  doc.line(leftMargin, pageHeight - 18, rightMargin, pageHeight - 18);
  
  // Company footer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    polishToAscii('Galaxy Sklep • 1. máje 535/50, 46007 Liberec, Republika Czeska • NIP: 04688465 • Email: support@galaxysklep.pl • www.galaxysklep.pl'),
    pageWidth / 2,
    pageHeight - 13,
    { align: 'center' }
  );
  
  // Page number
  doc.setFontSize(6);
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