// src/lib/invoice-pdf-generator.ts
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

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
  items: Array<{
    name?: string;
    name?: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
}

// Helper function to replace Czech characters with ASCII equivalents
function czechToAscii(text: string): string {
  const charMap: { [key: string]: string } = {
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n',
    'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
    'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E', 'Í': 'I', 'Ň': 'N',
    'Ó': 'O', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U', 'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
  };
  
  return text.replace(/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g, char => charMap[char] || char);
}

// Format currency with proper spacing
function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} Kc`;
}

export function generateInvoicePDF(invoiceData: InvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add custom font that supports Czech characters (using built-in fonts for now)
  doc.setFont('helvetica');
  
  // Calculate dates
  const issueDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  // Calculate VAT
  const vatRate = 0.21;
  const totalWithoutVat = invoiceData.total / (1 + vatRate);
  const vatAmount = invoiceData.total - totalWithoutVat;

  // Page setup
  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 15;
  const rightMargin = pageWidth - 15;
  const contentWidth = rightMargin - leftMargin;
  let yPosition = 20;

  // Header
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('FAKTURA', leftMargin, yPosition);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(czechToAscii('Daňový doklad'), leftMargin, yPosition + 8);

  // Invoice number
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(invoiceData.invoiceNumber, rightMargin, yPosition, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(czechToAscii(`Variabilní symbol: ${invoiceData.orderNumber}`), rightMargin, yPosition + 8, { align: 'right' });

  yPosition += 25;

  // Draw a line
  doc.setDrawColor(200, 200, 200);
  doc.line(leftMargin, yPosition, rightMargin, yPosition);
  yPosition += 10;

  // Company and Customer info in two columns
  const columnWidth = contentWidth / 2 - 5;
  
  // Supplier column
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Dodavatel:', leftMargin, yPosition);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let supplierY = yPosition + 7;
  doc.setFont('helvetica', 'bold');
  doc.text(czechToAscii('Můj E-shop s.r.o.'), leftMargin, supplierY);
  doc.setFont('helvetica', 'normal');
  supplierY += 5;
  doc.text(czechToAscii('Václavské náměstí 123'), leftMargin, supplierY);
  supplierY += 5;
  doc.text('110 00 Praha 1', leftMargin, supplierY);
  supplierY += 5;
  doc.text(czechToAscii('IČO: 12345678'), leftMargin, supplierY);
  supplierY += 5;
  doc.text(czechToAscii('DIČ: CZ12345678'), leftMargin, supplierY);
  supplierY += 5;
  doc.text('Email: info@muj-eshop.cz', leftMargin, supplierY);
  supplierY += 5;
  doc.text('Tel: +420 123 456 789', leftMargin, supplierY);

  // Customer column
  const customerX = leftMargin + columnWidth + 10;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(czechToAscii('Odběratel:'), customerX, yPosition);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let customerY = yPosition + 7;
  doc.setFont('helvetica', 'bold');
  doc.text(czechToAscii(`${invoiceData.billingFirstName} ${invoiceData.billingLastName}`), customerX, customerY);
  doc.setFont('helvetica', 'normal');
  customerY += 5;
  doc.text(czechToAscii(invoiceData.billingAddress), customerX, customerY);
  customerY += 5;
  doc.text(czechToAscii(`${invoiceData.billingCity}, ${invoiceData.billingPostalCode}`), customerX, customerY);
  customerY += 5;
  doc.text(czechToAscii('Česká republika'), customerX, customerY);
  customerY += 5;
  doc.text(`Email: ${invoiceData.customerEmail}`, customerX, customerY);
  customerY += 5;
  doc.text(`Tel: ${invoiceData.customerPhone}`, customerX, customerY);

  yPosition = Math.max(supplierY, customerY) + 10;

  // Draw a line
  doc.setDrawColor(200, 200, 200);
  doc.line(leftMargin, yPosition, rightMargin, yPosition);
  yPosition += 8;

  // Dates
  doc.setFontSize(10);
  const dateY = yPosition;
  const dateSpacing = contentWidth / 3;
  
  doc.text(czechToAscii(`Datum vystavení:`), leftMargin, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(issueDate, 'd.M.yyyy'), leftMargin, dateY + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.text(czechToAscii(`Datum zdan. plnění:`), leftMargin + dateSpacing, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(new Date(invoiceData.createdAt), 'd.M.yyyy'), leftMargin + dateSpacing, dateY + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Splatnost:', leftMargin + dateSpacing * 2, dateY);
  doc.setFont('helvetica', 'bold');
  doc.text(format(dueDate, 'd.M.yyyy'), leftMargin + dateSpacing * 2, dateY + 5);

  yPosition = dateY + 15;

  // Items table
  doc.setFont('helvetica', 'normal');
  doc.setFillColor(245, 245, 245);
  doc.rect(leftMargin, yPosition - 5, contentWidth, 8, 'F');
  
  // Table header
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(czechToAscii('Položka'), leftMargin + 2, yPosition);
  doc.text('Ks', leftMargin + 100, yPosition, { align: 'center' });
  doc.text('Cena/ks', leftMargin + 120, yPosition, { align: 'right' });
  doc.text('Bez DPH', leftMargin + 150, yPosition, { align: 'right' });
  doc.text('S DPH', rightMargin - 2, yPosition, { align: 'right' });
  
  yPosition += 8;
  
  // Table items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  invoiceData.items.forEach((item) => {
    const itemTotalWithVat = item.price * item.quantity;
    const itemTotalWithoutVat = itemTotalWithVat / (1 + vatRate);
    
    doc.text(czechToAscii(item.name || 'Položka'), leftMargin + 2, yPosition);
    doc.text(item.quantity.toString(), leftMargin + 100, yPosition, { align: 'center' });
    doc.text(formatCurrency(item.price), leftMargin + 120, yPosition, { align: 'right' });
    doc.text(formatCurrency(itemTotalWithoutVat), leftMargin + 150, yPosition, { align: 'right' });
    doc.text(formatCurrency(itemTotalWithVat), rightMargin - 2, yPosition, { align: 'right' });
    
    yPosition += 6;
  });

  // Delivery
  if (invoiceData.deliveryMethod && invoiceData.deliveryMethod !== 'personal') {
    const deliveryPrice = 89;
    const deliveryWithoutVat = deliveryPrice / (1 + vatRate);
    
    doc.text(czechToAscii('Doprava - Zásilkovna'), leftMargin + 2, yPosition);
    doc.text('1', leftMargin + 100, yPosition, { align: 'center' });
    doc.text(formatCurrency(deliveryPrice), leftMargin + 120, yPosition, { align: 'right' });
    doc.text(formatCurrency(deliveryWithoutVat), leftMargin + 150, yPosition, { align: 'right' });
    doc.text(formatCurrency(deliveryPrice), rightMargin - 2, yPosition, { align: 'right' });
    
    yPosition += 6;
  }

  // Summary line
  yPosition += 3;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, yPosition, rightMargin, yPosition);
  yPosition += 8;

  // Summary
  doc.setFontSize(11);
  const summaryX = rightMargin - 70;
  
  doc.text(czechToAscii('Základ daně:'), summaryX - 30, yPosition);
  doc.text(formatCurrency(totalWithoutVat), rightMargin - 2, yPosition, { align: 'right' });
  yPosition += 6;
  
  doc.text('DPH 21%:', summaryX - 30, yPosition);
  doc.text(formatCurrency(vatAmount), rightMargin - 2, yPosition, { align: 'right' });
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(czechToAscii('Celkem k úhradě:'), summaryX - 30, yPosition);
  doc.text(formatCurrency(invoiceData.total), rightMargin - 2, yPosition, { align: 'right' });

  // Payment info box
  yPosition += 15;
  doc.setFillColor(245, 245, 245);
  doc.rect(leftMargin, yPosition - 5, contentWidth, 25, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(czechToAscii('Platební údaje:'), leftMargin + 3, yPosition);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition += 7;
  doc.text(czechToAscii(`Číslo účtu: 123456789/0100`), leftMargin + 3, yPosition);
  doc.text(czechToAscii(`Variabilní symbol: ${invoiceData.orderNumber}`), leftMargin + 100, yPosition);
  yPosition += 6;
  doc.text('IBAN: CZ12 0100 0000 0012 3456 789', leftMargin + 3, yPosition);
  doc.text('SWIFT: KOMBCZPP', leftMargin + 100, yPosition);

  // Footer
  const footerY = pageHeight - 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(
    czechToAscii('Společnost je zapsána v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 12345.'),
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(czechToAscii('Děkujeme za vaši objednávku!'), pageWidth / 2, footerY + 5, { align: 'center' });

  return doc;
}