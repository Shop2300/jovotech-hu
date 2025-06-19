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
  return `${amount.toFixed(2)} PLN`;
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
      return 'Paczkomat InPost';
    case 'courier':
    case 'kurier':
      return 'Kurier DPD';
    case 'dpd':
      return 'Kurier DPD';
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
      return 'Karta płatnicza';
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
      return 'Za pobraniem';
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
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;
  const contentWidth = rightMargin - leftMargin;
  let yPosition = 20;

  // Add logo placeholder (you can replace with actual logo)
  doc.setFillColor(41, 128, 185); // Professional blue
  doc.rect(leftMargin, yPosition - 5, 40, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GALAXY', leftMargin + 20, yPosition + 2, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Invoice title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FAKTURA', rightMargin, yPosition, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Nr: ' + invoiceData.invoiceNumber, rightMargin, yPosition + 8, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  yPosition += 20;

  // Company info section
  doc.setFillColor(245, 245, 245);
  doc.rect(leftMargin - 5, yPosition - 5, contentWidth + 10, 35, 'F');
  
  // Two columns for company and customer
  const columnWidth = contentWidth / 2 - 5;
  
  // Seller info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SPRZEDAWCA:', leftMargin, yPosition);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  let sellerY = yPosition + 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Galaxy Sklep', leftMargin, sellerY);
  doc.setFont('helvetica', 'normal');
  sellerY += 4;
  doc.text(polishToAscii('1. máje 535/50'), leftMargin, sellerY);
  sellerY += 4;
  doc.text('46007 Liberec, Czechy', leftMargin, sellerY);
  sellerY += 4;
  doc.text('NIP: 04688465', leftMargin, sellerY);
  sellerY += 4;
  doc.text('Email: support@galaxysklep.pl', leftMargin, sellerY);
  sellerY += 4;
  doc.text('Tel: +420 123 456 789', leftMargin, sellerY);

  // Buyer info
  const buyerX = leftMargin + columnWidth + 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('NABYWCA:', buyerX, yPosition);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  let buyerY = yPosition + 6;
  
  // Company name if exists
  if (invoiceData.billingCompany) {
    doc.setFont('helvetica', 'bold');
    doc.text(polishToAscii(invoiceData.billingCompany), buyerX, buyerY);
    doc.setFont('helvetica', 'normal');
    buyerY += 4;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii(`${invoiceData.billingFirstName} ${invoiceData.billingLastName}`), buyerX, buyerY);
  doc.setFont('helvetica', 'normal');
  buyerY += 4;
  doc.text(polishToAscii(invoiceData.billingAddress), buyerX, buyerY);
  buyerY += 4;
  doc.text(polishToAscii(`${invoiceData.billingPostalCode} ${invoiceData.billingCity}`), buyerX, buyerY);
  buyerY += 4;
  doc.text(polishToAscii(invoiceData.billingCountry || 'Polska'), buyerX, buyerY);
  
  if (invoiceData.billingNip) {
    buyerY += 4;
    doc.text(`NIP: ${invoiceData.billingNip}`, buyerX, buyerY);
  }
  
  buyerY += 4;
  doc.text(`Email: ${invoiceData.customerEmail}`, buyerX, buyerY);
  buyerY += 4;
  doc.text(`Tel: ${invoiceData.customerPhone}`, buyerX, buyerY);

  yPosition = Math.max(sellerY, buyerY) + 10;

  // Dates section
  doc.setFillColor(41, 128, 185);
  doc.rect(leftMargin - 5, yPosition - 5, contentWidth + 10, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  const dateY = yPosition + 2;
  const dateSpacing = contentWidth / 3;
  
  const issueDate = new Date();
  const saleDate = new Date(invoiceData.createdAt);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  
  doc.text(`Data wystawienia: ${format(issueDate, 'dd.MM.yyyy')}`, leftMargin, dateY);
  doc.text(polishToAscii(`Data sprzedaży: ${format(saleDate, 'dd.MM.yyyy')}`), leftMargin + dateSpacing, dateY);
  doc.text(polishToAscii(`Termin płatności: ${format(dueDate, 'dd.MM.yyyy')}`), leftMargin + dateSpacing * 2, dateY);
  
  doc.setTextColor(0, 0, 0);
  yPosition += 15;

  // Note about no VAT
  doc.setFillColor(255, 243, 224); // Light yellow background
  doc.rect(leftMargin - 5, yPosition - 4, contentWidth + 10, 10, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii('UWAGA: Sprzedawca nie jest płatnikiem VAT'), pageWidth / 2, yPosition, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(polishToAscii('Faktura wystawiona bez podatku VAT'), pageWidth / 2, yPosition + 4, { align: 'center' });
  
  yPosition += 12;

  // Items table header
  doc.setFillColor(100, 100, 100);
  doc.rect(leftMargin - 5, yPosition - 5, contentWidth + 10, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Lp.', leftMargin, yPosition);
  doc.text(polishToAscii('Nazwa towaru/usługi'), leftMargin + 10, yPosition);
  doc.text(polishToAscii('Ilość'), leftMargin + 110, yPosition, { align: 'center' });
  doc.text('Cena jedn.', leftMargin + 130, yPosition, { align: 'right' });
  doc.text(polishToAscii('Wartość'), rightMargin, yPosition, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
  yPosition += 10;
  
  // Table items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let itemNumber = 1;
  let subtotal = 0;
  
  // Products
  invoiceData.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    // Alternate row coloring
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(leftMargin - 5, yPosition - 4, contentWidth + 10, 6, 'F');
    }
    
    doc.text(itemNumber.toString() + '.', leftMargin, yPosition);
    
    // Truncate long product names
    const maxNameLength = 70;
    const itemName = polishToAscii(item.name || 'Produkt');
    const displayName = itemName.length > maxNameLength ? 
      itemName.substring(0, maxNameLength) + '...' : itemName;
    
    doc.text(displayName, leftMargin + 10, yPosition);
    doc.text(item.quantity.toString(), leftMargin + 110, yPosition, { align: 'center' });
    doc.text(formatCurrency(item.price), leftMargin + 130, yPosition, { align: 'right' });
    doc.text(formatCurrency(itemTotal), rightMargin, yPosition, { align: 'right' });
    
    yPosition += 6;
    itemNumber++;
  });

  // Delivery
  const deliveryPrice = getDeliveryPrice(invoiceData.deliveryMethod);
  if (deliveryPrice > 0) {
    if (itemNumber % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(leftMargin - 5, yPosition - 4, contentWidth + 10, 6, 'F');
    }
    
    doc.text(itemNumber.toString() + '.', leftMargin, yPosition);
    doc.text(polishToAscii(getDeliveryMethodName(invoiceData.deliveryMethod)), leftMargin + 10, yPosition);
    doc.text('1', leftMargin + 110, yPosition, { align: 'center' });
    doc.text(formatCurrency(deliveryPrice), leftMargin + 130, yPosition, { align: 'right' });
    doc.text(formatCurrency(deliveryPrice), rightMargin, yPosition, { align: 'right' });
    
    subtotal += deliveryPrice;
    yPosition += 6;
  }

  // Summary line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, yPosition, rightMargin, yPosition);
  yPosition += 8;

  // Total
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RAZEM DO ZAPLATY:', rightMargin - 50, yPosition);
  doc.setFontSize(14);
  doc.text(formatCurrency(invoiceData.total), rightMargin, yPosition, { align: 'right' });
  
  yPosition += 8;
  
  // Amount in words
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const amountInWords = polishToAscii(numberToPolishWords(invoiceData.total));
  doc.text(polishToAscii(`Słownie: ${amountInWords}`), leftMargin, yPosition);

  // Payment details box
  yPosition += 10;
  doc.setFillColor(41, 128, 185);
  doc.rect(leftMargin - 5, yPosition - 5, contentWidth + 10, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(polishToAscii('DANE DO PŁATNOŚCI:'), leftMargin, yPosition);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  yPosition += 6;
  doc.text(polishToAscii(`Sposób płatności: ${getPaymentMethodName(invoiceData.paymentMethod)}`), leftMargin, yPosition);
  yPosition += 5;
  doc.text('Numer konta: 21291000062469800208837403', leftMargin, yPosition);
  doc.text(polishToAscii(`Tytuł przelewu: Zamówienie ${invoiceData.orderNumber}`), buyerX, yPosition);
  yPosition += 5;
  doc.text('IBAN: PL21 2910 0006 2469 8002 0883 7403', leftMargin, yPosition);
  doc.text('SWIFT/BIC: BMPBPLPP', buyerX, yPosition);
  yPosition += 5;
  doc.text('Bank: Aion S.A. Spolka Akcyjna Oddzial w Polsce', leftMargin, yPosition);
  yPosition += 5;
  doc.text('Adres banku: Dobra 40, 00-344 Warszawa, Poland', leftMargin, yPosition);

  doc.setTextColor(0, 0, 0);
  yPosition += 10;

  // Shipping address if different
  const showShippingAddress = invoiceData.shippingAddress && 
    (invoiceData.shippingAddress !== invoiceData.billingAddress ||
     invoiceData.shippingCity !== invoiceData.billingCity);
     
  if (showShippingAddress) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ADRES DOSTAWY:', leftMargin, yPosition);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    yPosition += 5;
    doc.text(polishToAscii(`${invoiceData.shippingFirstName || invoiceData.billingFirstName} ${invoiceData.shippingLastName || invoiceData.billingLastName}`), leftMargin, yPosition);
    yPosition += 4;
    if (invoiceData.shippingAddress) {
      doc.text(polishToAscii(invoiceData.shippingAddress), leftMargin, yPosition);
      yPosition += 4;
    }
    if (invoiceData.shippingPostalCode || invoiceData.shippingCity) {
      doc.text(polishToAscii(`${invoiceData.shippingPostalCode || ''} ${invoiceData.shippingCity || ''}`), leftMargin, yPosition);
    }
    yPosition += 8;
  }

  // Notes section if any
  if (invoiceData.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('UWAGI:', leftMargin, yPosition);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    yPosition += 5;
    
    const lines = doc.splitTextToSize(polishToAscii(invoiceData.notes), contentWidth);
    lines.forEach((line: string) => {
      doc.text(line, leftMargin, yPosition);
      yPosition += 4;
    });
  }

  // Footer - ensure we have enough space
  const footerY = Math.max(yPosition + 20, pageHeight - 30);
  
  // If content is too long, add a new page
  if (footerY > pageHeight - 35) {
    doc.addPage();
    yPosition = 20;
    // Page number for page 2
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Strona 2 z 2', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Continue with signatures on new page
    const newFooterY = yPosition + 10;
    
    // Signature areas
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    // Draw signature lines
    doc.setDrawColor(100, 100, 100);
    doc.line(leftMargin, newFooterY, leftMargin + 60, newFooterY);
    doc.line(rightMargin - 60, newFooterY, rightMargin, newFooterY);
    
    doc.text(polishToAscii('Podpis sprzedającego'), leftMargin + 30, newFooterY + 4, { align: 'center' });
    doc.text(polishToAscii('Podpis kupującego'), rightMargin - 30, newFooterY + 4, { align: 'center' });
  } else {
    // Signature areas on same page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    // Draw signature lines
    doc.setDrawColor(100, 100, 100);
    doc.line(leftMargin, footerY, leftMargin + 60, footerY);
    doc.line(rightMargin - 60, footerY, rightMargin, footerY);
    
    doc.text(polishToAscii('Podpis sprzedającego'), leftMargin + 30, footerY + 4, { align: 'center' });
    doc.text(polishToAscii('Podpis kupującego'), rightMargin - 30, footerY + 4, { align: 'center' });
    
    // Company footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text(
      polishToAscii('Galaxy Sklep • 1. máje 535/50, 46007 Liberec, Czechy • NIP: 04688465'),
      pageWidth / 2,
      footerY + 12,
      { align: 'center' }
    );
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(9);
    doc.text(polishToAscii('Dziękujemy za zakupy!'), pageWidth / 2, footerY + 17, { align: 'center' });
    
    // Page number
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Strona 1 z 1', pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

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
    return `${zloty} złotych ${groszy}/100 groszy`;
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
  
  return words + ` ${groszy}/100 groszy`;
}