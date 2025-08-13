// src/lib/invoice-pdf-generator.ts
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';

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

// Helper function to handle Hungarian and Czech characters
function hungarianToAscii(text: string): string {
  if (!text) return '';
  
  const charMap: { [key: string]: string } = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o', 'ú': 'u', 'ü': 'u', 'ű': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ö': 'O', 'Ő': 'O', 'Ú': 'U', 'Ü': 'U', 'Ű': 'U',
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
    'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u', 'ý': 'y', 'ž': 'z',
    'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
  };
  
  return text.replace(/[áéíóöőúüűÁÉÍÓÖŐÚÜŰąćęłńśźżĄĆĘŁŃŚŹŻčďěňřšťůýžČĎĚŇŘŠŤŮÝŽ]/g, char => charMap[char] || char);
}

// Format currency for HUF
function formatCurrency(amount: number): string {
  return `${Math.round(amount)} Ft`;
}

export function generateInvoicePDF(invoiceData: InvoiceData): jsPDF {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Get delivery and payment methods from configuration
    const deliveryMethod = getDeliveryMethod(invoiceData.deliveryMethod);
    const paymentMethod = getPaymentMethod(invoiceData.paymentMethod);
    
    // Use prices from configuration
    const deliveryPrice = deliveryMethod?.price ?? 0;
    const paymentFee = paymentMethod?.price ?? 0;
    
    // Prepare dates
    const issueDate = new Date();
    const saleDate = new Date(invoiceData.createdAt);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const orderNumberWithoutDash = invoiceData.orderNumber.replace('-', '');
    
    // Fallback delivery names if not in configuration
    const fallbackDeliveryNames: { [key: string]: string } = {
      'paczkomat': 'Paczkomat InPost',
      'kurier': 'Futarszolgalat DPD',
      'courier': 'Futarszolgalat DPD',
      'dpd': 'Futarszolgalat DPD',
      'zasilkovna': 'Legkenyelmesebb szallitas',
      'odbior-osobisty': 'Szemelyes atvetel',
      'personal': 'Szemelyes atvetel'
    };
    
    const deliveryName = deliveryMethod?.labelPl || fallbackDeliveryNames[invoiceData.deliveryMethod] || invoiceData.deliveryMethod || 'Szallitas';
    const paymentName = paymentMethod?.labelPl || invoiceData.paymentMethod || 'Banki atutalas';

    // Page setup
    const pageWidth = 210;
    const pageHeight = 297;
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;
    const contentWidth = rightMargin - leftMargin;
    let yPosition = 15;

    // Header - Invoice Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SZAMLA', leftMargin, yPosition);
    
    // Invoice number and details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(hungarianToAscii(invoiceData.invoiceNumber), rightMargin, yPosition - 3, { align: 'right' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(hungarianToAscii(`Rendelesi szam: ${invoiceData.orderNumber}`), rightMargin, yPosition + 1.5, { align: 'right' });
    
    // Add sale date
    doc.setFontSize(8);
    doc.text(hungarianToAscii(`Teljesites datuma:`), rightMargin - 20, yPosition + 5, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(format(saleDate, 'yyyy.MM.dd'), rightMargin, yPosition + 5, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    yPosition += 16;

    // Horizontal line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPosition, rightMargin, yPosition);
    yPosition += 8;

    // Two columns for seller and buyer
    const columnWidth = (contentWidth - 10) / 2;
    
    // Seller section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ELADO:', leftMargin, yPosition);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    let sellerY = yPosition + 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Jovotech.hu', leftMargin, sellerY);
    doc.setFont('helvetica', 'normal');
    sellerY += 4;
    doc.text(hungarianToAscii('1. maje 535/50'), leftMargin, sellerY);
    sellerY += 3.5;
    doc.text('46007 Liberec III-Jerab, Cseh Koztarsasag', leftMargin, sellerY);
    sellerY += 3.5;
    doc.text('Adoszam: 04688465', leftMargin, sellerY);
    sellerY += 3.5;
    doc.text('Email: support@jovotech.hu', leftMargin, sellerY);
    sellerY += 3.5;
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(hungarianToAscii('Az elado nem AFA-fizeto'), leftMargin, sellerY);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    
    // Bank info
    sellerY += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Bankszamla:', leftMargin, sellerY);
    sellerY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Szamlaszam: ', leftMargin, sellerY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('12600016-10426947-95638648', leftMargin + 22, sellerY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    sellerY += 4;
    doc.text('IBAN: ', leftMargin, sellerY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('HU86 1260 0016 1042 6947 9563 8648', leftMargin + 10, sellerY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    sellerY += 4;
    doc.text('SWIFT: ', leftMargin, sellerY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TRWIBEBBXXX', leftMargin + 12, sellerY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    sellerY += 3.5;
    doc.text('WISE EUROPE S.A., Rue du Trone 100, 1050 Brussels', leftMargin, sellerY);

    // Buyer section
    const buyerX = leftMargin + columnWidth + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('VEVO:', buyerX, yPosition);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    let buyerY = yPosition + 5;
    
    // Company name if exists
    if (invoiceData.billingCompany) {
      doc.setFont('helvetica', 'bold');
      doc.text(hungarianToAscii(invoiceData.billingCompany), buyerX, buyerY);
      doc.setFont('helvetica', 'normal');
      buyerY += 3.5;
      if (invoiceData.billingNip) {
        doc.text(`Adoszam: ${invoiceData.billingNip}`, buyerX, buyerY);
        buyerY += 3.5;
      }
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(hungarianToAscii(`${invoiceData.billingFirstName} ${invoiceData.billingLastName}`), buyerX, buyerY);
    doc.setFont('helvetica', 'normal');
    buyerY += 3.5;
    doc.text(hungarianToAscii(invoiceData.billingAddress), buyerX, buyerY);
    buyerY += 3.5;
    doc.text(hungarianToAscii(`${invoiceData.billingPostalCode} ${invoiceData.billingCity}`), buyerX, buyerY);
    buyerY += 3.5;
    doc.text(hungarianToAscii(invoiceData.billingCountry || 'Magyarorszag'), buyerX, buyerY);
    buyerY += 3.5;
    doc.text(`Email: ${invoiceData.customerEmail}`, buyerX, buyerY);
    buyerY += 3.5;
    doc.text(`Tel: ${invoiceData.customerPhone}`, buyerX, buyerY);

    yPosition = Math.max(sellerY + 3, buyerY) + 8;

    // Dates section
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(leftMargin, yPosition - 4, contentWidth, 15);
    
    const dateY = yPosition;
    
    doc.setFontSize(8);
    // First row - dates
    doc.text('Kiallitas datuma: ', leftMargin + 3, dateY);
    doc.setFont('helvetica', 'bold');
    doc.text(format(issueDate, 'yyyy.MM.dd'), leftMargin + 30, dateY);
    
    doc.setFont('helvetica', 'normal');
    doc.text(hungarianToAscii('Teljesites datuma: '), leftMargin + 65, dateY);
    doc.setFont('helvetica', 'bold');
    doc.text(format(saleDate, 'yyyy.MM.dd'), leftMargin + 93, dateY);
    
    doc.setFont('helvetica', 'normal');
    doc.text(hungarianToAscii('Fizetesi hatarido: '), leftMargin + 125, dateY);
    doc.setFont('helvetica', 'bold');
    doc.text(format(dueDate, 'yyyy.MM.dd'), leftMargin + 152, dateY);
    
    // Second row - payment info
    doc.setFont('helvetica', 'normal');
    doc.text(hungarianToAscii('Fizetesi mod: '), leftMargin + 3, dateY + 5);
    doc.setFont('helvetica', 'bold');
    doc.text(hungarianToAscii(paymentName), leftMargin + 25, dateY + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.text(hungarianToAscii('Atutalas kozlemeny: '), leftMargin + 90, dateY + 5);
    doc.setFont('helvetica', 'bold');
    doc.text(hungarianToAscii(orderNumberWithoutDash), leftMargin + 120, dateY + 5);
    
    doc.setFont('helvetica', 'normal');
    yPosition += 18;

    // Items table header
    doc.setFillColor(0, 0, 0);
    doc.rect(leftMargin, yPosition - 4, contentWidth, 6, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Ssz.', leftMargin + 2, yPosition);
    doc.text(hungarianToAscii('Termek/szolgaltatas megnevezese'), leftMargin + 10, yPosition);
    doc.text(hungarianToAscii('Menny.'), leftMargin + 130, yPosition, { align: 'center' });
    doc.text('Egysegar', leftMargin + 150, yPosition, { align: 'right' });
    doc.text(hungarianToAscii('Ertek'), rightMargin - 2, yPosition, { align: 'right' });
    
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
      
      const maxNameLength = 75;
      const itemName = hungarianToAscii(item.name || 'Termek');
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
    doc.text(itemNumber.toString() + '.', leftMargin + 2, yPosition);
    doc.text(hungarianToAscii(`Szallitas - ${deliveryName}`), leftMargin + 10, yPosition);
    doc.text('1', leftMargin + 130, yPosition, { align: 'center' });
    doc.text(formatCurrency(deliveryPrice), leftMargin + 150, yPosition, { align: 'right' });
    doc.text(formatCurrency(deliveryPrice), rightMargin - 2, yPosition, { align: 'right' });
    
    subtotal += deliveryPrice;
    yPosition += 5;
    itemNumber++;
    
    // Payment method
    doc.text(itemNumber.toString() + '.', leftMargin + 2, yPosition);
    doc.text(hungarianToAscii(`Fizetes - ${paymentName}`), leftMargin + 10, yPosition);
    doc.text('1', leftMargin + 130, yPosition, { align: 'center' });
    doc.text(formatCurrency(paymentFee), leftMargin + 150, yPosition, { align: 'right' });
    doc.text(formatCurrency(paymentFee), rightMargin - 2, yPosition, { align: 'right' });
    
    subtotal += paymentFee;
    yPosition += 5;

    // Summary line
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPosition, rightMargin, yPosition);
    yPosition += 6;

    // Total
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(hungarianToAscii('FIZETENDO OSSZESEN:'), leftMargin + 90, yPosition);
    doc.setFontSize(14);
    doc.text(formatCurrency(invoiceData.total), rightMargin - 2, yPosition, { align: 'right' });
    
    yPosition += 6;
    
    // Amount in words
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const amountInWords = hungarianToAscii(numberToHungarianWords(invoiceData.total));
    doc.text(hungarianToAscii(`Azaz: ${amountInWords}`), leftMargin, yPosition);

    // Payment details section
    yPosition += 10;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(leftMargin, yPosition - 4, contentWidth, 25);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(hungarianToAscii('FIZETESI ADATOK:'), leftMargin + 3, yPosition);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    yPosition += 5;
    
    // Payment info
    doc.text(hungarianToAscii('Fizetesi mod: '), leftMargin + 3, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(hungarianToAscii(paymentName), leftMargin + 25, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.text(hungarianToAscii('Atutalas kozlemeny: '), leftMargin + 100, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(hungarianToAscii(orderNumberWithoutDash), leftMargin + 130, yPosition);
    
    doc.setFont('helvetica', 'normal');
    yPosition += 5;
    doc.text('Szamlaszam: ', leftMargin + 3, yPosition);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('12600016-10426947-95638648', leftMargin + 25, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    yPosition += 5;
    doc.text('IBAN: ', leftMargin + 3, yPosition);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('HU86 1260 0016 1042 6947 9563 8648', leftMargin + 13, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('SWIFT/BIC: ', leftMargin + 100, yPosition);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TRWIBEBBXXX', leftMargin + 120, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    yPosition += 5;
    doc.text('Bank: WISE EUROPE S.A., Rue du Trone 100, 1050 Brussels', leftMargin + 3, yPosition);

    yPosition += 12;

    // Shipping address and notes - optional sections
    const showShippingAddress = invoiceData.shippingAddress && 
      (invoiceData.shippingAddress !== invoiceData.billingAddress ||
       invoiceData.shippingCity !== invoiceData.billingCity);
    
    const hasNotes = invoiceData.notes && invoiceData.notes.trim();
    
    if (showShippingAddress || hasNotes) {
      const boxHeight = 20;
      const boxY = yPosition - 4;
      
      // Shipping address box
      if (showShippingAddress) {
        const shippingBoxWidth = hasNotes ? (contentWidth / 2 - 2.5) : contentWidth;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.rect(leftMargin, boxY, shippingBoxWidth, boxHeight);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('SZALLITASI CIM:', leftMargin + 3, boxY + 4);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        let shippingY = boxY + 8;
        doc.text(hungarianToAscii(`${invoiceData.shippingFirstName || invoiceData.billingFirstName} ${invoiceData.shippingLastName || invoiceData.billingLastName}`), leftMargin + 3, shippingY);
        shippingY += 3.5;
        if (invoiceData.shippingAddress) {
          doc.text(hungarianToAscii(invoiceData.shippingAddress), leftMargin + 3, shippingY);
          shippingY += 3.5;
        }
        if (invoiceData.shippingPostalCode || invoiceData.shippingCity) {
          doc.text(hungarianToAscii(`${invoiceData.shippingPostalCode || ''} ${invoiceData.shippingCity || ''}`), leftMargin + 3, shippingY);
        }
      }
      
      // Notes box
      if (hasNotes) {
        const notesX = showShippingAddress ? (leftMargin + contentWidth / 2 + 2.5) : leftMargin;
        const notesWidth = showShippingAddress ? (contentWidth / 2 - 2.5) : contentWidth;
        
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.rect(notesX, boxY, notesWidth, boxHeight);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('MEGJEGYZESEK:', notesX + 3, boxY + 4);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        
        const noteLines = doc.splitTextToSize(hungarianToAscii(invoiceData.notes || ''), notesWidth - 6);
        let noteY = boxY + 8;
        noteLines.slice(0, 3).forEach((line: string) => {
          doc.text(line, notesX + 3, noteY);
          noteY += 3.5;
        });
      }
      
      yPosition += boxHeight + 5;
    }

    // Signature areas
    const footerY = Math.min(yPosition + 10, pageHeight - 42);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    
    // Draw signature lines
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, footerY, leftMargin + 60, footerY);
    doc.line(rightMargin - 60, footerY, rightMargin, footerY);
    
    doc.text(hungarianToAscii('A szamla kiallitasara'), leftMargin + 30, footerY + 4, { align: 'center' });
    doc.text(hungarianToAscii('jogosult szemely alairasa'), leftMargin + 30, footerY + 7, { align: 'center' });
    
    doc.text(hungarianToAscii('A szamla atvetelere'), rightMargin - 30, footerY + 4, { align: 'center' });
    doc.text(hungarianToAscii('jogosult szemely alairasa'), rightMargin - 30, footerY + 7, { align: 'center' });

    // Bottom line
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, pageHeight - 24, rightMargin, pageHeight - 24);
    
    // Company footer
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    
    doc.text(
      hungarianToAscii('Jovotech.hu • 1. maje 535/50, 46007 Liberec III-Jerab • Adoszam: 04688465 • Email: support@jovotech.hu • www.jovotech.hu'),
      pageWidth / 2,
      pageHeight - 21,
      { align: 'center', maxWidth: 180 }
    );
    
    doc.setFontSize(6);
    const footerText1 = hungarianToAscii('Kulfoldi vallalkozo magyarorszagi ertekesitessel. Penztargep hasznalatat kotelezettsege alol mentesitett tevekenyseg.');
    const footerText2 = hungarianToAscii('A szamla a 2007. evi CXXVII. torveny az altalanos forgalmi adorol szolo jogszabaly alapjan kerult kiallitasra.');
    
    doc.text(
      footerText1,
      pageWidth / 2,
      pageHeight - 17,
      { align: 'center', maxWidth: 170 }
    );
    doc.text(
      footerText2,
      pageWidth / 2,
      pageHeight - 14,
      { align: 'center', maxWidth: 150 }
    );
    
    // Page number
    doc.setFontSize(6);
    doc.text('Oldal 1 / 1', pageWidth / 2, pageHeight - 10, { align: 'center' });

    return doc;
  } catch (error) {
    console.error('Error in generateInvoicePDF:', error);
    throw error;
  }
}

// Helper function to convert numbers to Hungarian words
function numberToHungarianWords(amount: number): string {
  const forint = Math.floor(amount);
  
  // Basic conversion for common amounts
  const ones = ['', 'egy', 'ketto', 'harom', 'negy', 'ot', 'hat', 'het', 'nyolc', 'kilenc'];
  const teens = ['tiz', 'tizenegy', 'tizenketto', 'tizenharom', 'tizennegy', 'tizenot', 'tizenhat', 'tizenhet', 'tizennyolc', 'tizenkilenc'];
  const tens = ['', '', 'husz', 'harminc', 'negyven', 'otven', 'hatvan', 'hetven', 'nyolcvan', 'kilencven'];
  const hundreds = ['', 'szaz', 'ketszaz', 'haromszaz', 'negyszaz', 'otszaz', 'hatszaz', 'hetszaz', 'nyolcszaz', 'kilencszaz'];
  
  function convertHundreds(n: number): string {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o > 0 ? ones[o] : '');
    }
    const h = Math.floor(n / 100);
    const r = n % 100;
    return hundreds[h] + (r > 0 ? convertHundreds(r) : '');
  }
  
  // For simplicity, handle amounts up to 999999
  if (forint >= 1000000) {
    return `${forint} forint`;
  }
  
  let words = '';
  if (forint === 0) {
    words = 'nulla forint';
  } else if (forint < 1000) {
    words = convertHundreds(forint) + ' forint';
  } else {
    const thousands = Math.floor(forint / 1000);
    const remainder = forint % 1000;
    if (thousands === 1) {
      words = 'ezer';
    } else if (thousands < 10) {
      words = ones[thousands] + 'ezer';
    } else {
      words = convertHundreds(thousands) + 'ezer';
    }
    if (remainder > 0) {
      words += convertHundreds(remainder) + ' forint';
    } else {
      words += ' forint';
    }
  }
  
  return words;
}