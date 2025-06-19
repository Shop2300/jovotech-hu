'use client';

// src/components/admin/InvoiceTemplate.tsx
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface InvoiceItem {
  name?: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  orderNumber: string;
  createdAt: string;
  // Customer info
  customerEmail: string;
  customerPhone: string;
  // Billing address
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry?: string;
  billingCompany?: string;
  billingNip?: string;
  // Shipping address
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  // Items
  items: InvoiceItem[];
  total: number;
  // Payment info
  paymentMethod: string;
  deliveryMethod: string;
  notes?: string;
}

interface InvoiceTemplateProps {
  order: InvoiceData;
}

// Helper functions
function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} PLN`;
}

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

export function InvoiceTemplate({ order }: InvoiceTemplateProps) {
  const invoiceNumber = `FAK${new Date().getFullYear()}${order.orderNumber}`;
  const issueDate = new Date();
  const saleDate = new Date(order.createdAt);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 14 days payment term

  // Calculate totals - NO VAT
  let subtotal = 0;
  order.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const deliveryPrice = getDeliveryPrice(order.deliveryMethod);
  if (deliveryPrice > 0) {
    subtotal += deliveryPrice;
  }

  return (
    <div className="invoice-container bg-white p-4 max-w-[210mm] mx-auto text-xs">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            margin: 0;
            padding: 10mm;
          }
          @page {
            size: A4;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold text-gray-900">FAKTURA</h1>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{invoiceNumber}</p>
          <p className="text-gray-600 text-xs">Numer zamówienia: {order.orderNumber}</p>
        </div>
      </div>

      {/* Horizontal line */}
      <hr className="border-gray-900 mb-4" />

      {/* Company and Customer Info */}
      <div className="grid grid-cols-2 gap-8 mb-4">
        {/* Supplier with bank info */}
        <div>
          <h2 className="font-bold text-gray-900 mb-2 text-sm">SPRZEDAWCA:</h2>
          <div className="text-gray-700 text-xs space-y-0.5">
            <p className="font-bold">Galaxy Sklep</p>
            <p>1. máje 535/50</p>
            <p>46007 Liberec, Republika Czeska</p>
            <p>NIP: 04688465</p>
            <p>Email: support@galaxysklep.pl</p>
            
            <div className="mt-3">
              <p className="font-bold">Konto bankowe:</p>
              <p>21291000062469800208837403</p>
              <p>IBAN: PL21 2910 0006 2469 8002 0883 7403</p>
              <p>SWIFT: BMPBPLPP</p>
              <p>Aion S.A. Spolka Akcyjna Oddzial w Polsce</p>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div>
          <h2 className="font-bold text-gray-900 mb-2 text-sm">NABYWCA:</h2>
          <div className="text-gray-700 text-xs space-y-0.5">
            {order.billingCompany && (
              <>
                <p className="font-bold">{order.billingCompany}</p>
                {order.billingNip && <p>NIP: {order.billingNip}</p>}
              </>
            )}
            <p className={`${!order.billingCompany ? 'font-bold' : ''}`}>
              {order.billingFirstName} {order.billingLastName}
            </p>
            <p>{order.billingAddress}</p>
            <p>{order.billingPostalCode} {order.billingCity}</p>
            <p>{order.billingCountry || 'Polska'}</p>
            <p>Email: {order.customerEmail}</p>
            <p>Tel: {order.customerPhone}</p>
          </div>
        </div>
      </div>

      {/* Dates - horizontal */}
      <div className="border border-gray-300 p-2 mb-3 flex justify-between text-xs">
        <span>Data wystawienia: <strong>{format(issueDate, 'dd.MM.yyyy')}</strong></span>
        <span>Data sprzedaży: <strong>{format(saleDate, 'dd.MM.yyyy')}</strong></span>
        <span>Termin płatności: <strong>{format(dueDate, 'dd.MM.yyyy')}</strong></span>
      </div>

      {/* No VAT Notice */}
      <div className="mb-3 p-1.5 bg-gray-200 text-center">
        <p className="font-bold text-xs">FAKTURA WYSTAWIONA BEZ PODATKU VAT - Sprzedawca nie jest płatnikiem VAT</p>
      </div>

      {/* Items Table - simplified */}
      <table className="w-full mb-3 text-xs">
        <thead>
          <tr className="bg-black text-white">
            <th className="text-left py-1 px-1">Lp.</th>
            <th className="text-left py-1">Nazwa towaru/usługi</th>
            <th className="text-center py-1 w-16">Ilość</th>
            <th className="text-right py-1 w-20">Cena jedn.</th>
            <th className="text-right py-1 w-20 px-1">Wartość</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            return (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-1 px-1">{index + 1}.</td>
                <td className="py-1">{item.name || 'Produkt'}</td>
                <td className="text-center py-1">{item.quantity}</td>
                <td className="text-right py-1">{formatCurrency(item.price)}</td>
                <td className="text-right py-1 px-1">{formatCurrency(itemTotal)}</td>
              </tr>
            );
          })}
          {/* Delivery */}
          {deliveryPrice > 0 && (
            <tr className="border-b border-gray-300">
              <td className="py-1 px-1">{order.items.length + 1}.</td>
              <td className="py-1">Dostawa - {getDeliveryMethodName(order.deliveryMethod)}</td>
              <td className="text-center py-1">1</td>
              <td className="text-right py-1">{formatCurrency(deliveryPrice)}</td>
              <td className="text-right py-1 px-1">{formatCurrency(deliveryPrice)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-3">
        <div className="text-right">
          <div className="font-bold text-sm">
            RAZEM DO ZAPŁATY: <span className="text-base ml-4">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <p className="text-xs mb-4">Słownie: {numberToPolishWords(order.total)}</p>

      {/* Payment Info - compact */}
      <div className="border border-gray-300 p-2 mb-3 text-xs">
        <h3 className="font-bold mb-1">DANE DO PŁATNOŚCI:</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><span className="font-semibold">Sposób płatności:</span> {getPaymentMethodName(order.paymentMethod)}</p>
            <p><span className="font-semibold">Numer konta:</span> 21291000062469800208837403</p>
            <p><span className="font-semibold">IBAN:</span> PL21 2910 0006 2469 8002 0883 7403</p>
          </div>
          <div>
            <p><span className="font-semibold">Tytuł przelewu:</span> Zamówienie {order.orderNumber}</p>
            <p><span className="font-semibold">SWIFT/BIC:</span> BMPBPLPP</p>
            <p className="text-xs">Bank: Aion S.A. Spolka Akcyjna Oddzial w Polsce, Dobra 40, 00-344 Warszawa, Poland</p>
          </div>
        </div>
      </div>

      {/* Shipping Address and Notes - side by side if both exist */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Shipping Address if different */}
        {((order.shippingAddress && order.shippingAddress !== order.billingAddress) || 
          (order.shippingCity && order.shippingCity !== order.billingCity)) && (
          <div className="border border-gray-300 p-2">
            <h3 className="font-bold text-xs mb-1">ADRES DOSTAWY:</h3>
            <div className="text-xs text-gray-700">
              <p>{order.shippingFirstName || order.billingFirstName} {order.shippingLastName || order.billingLastName}</p>
              {order.shippingAddress && <p>{order.shippingAddress}</p>}
              {(order.shippingPostalCode || order.shippingCity) && (
                <p>{order.shippingPostalCode || ''} {order.shippingCity || ''}</p>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="border border-gray-300 p-2">
            <h3 className="font-bold text-xs mb-1">UWAGI:</h3>
            <p className="text-xs text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Signature Areas */}
      <div className="flex justify-between mt-8 mb-4">
        <div className="text-center">
          <div className="border-t border-gray-600 w-36 mb-1"></div>
          <p className="text-xs text-gray-600">Podpis osoby upoważnionej</p>
          <p className="text-xs text-gray-600">do wystawienia faktury</p>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-600 w-36 mb-1"></div>
          <p className="text-xs text-gray-600">Podpis osoby upoważnionej</p>
          <p className="text-xs text-gray-600">do odbioru faktury</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2 border-t-2 border-gray-900">
        <p className="text-xs text-gray-600">
          Galaxy Sklep • 1. máje 535/50, 46007 Liberec, Republika Czeska • NIP: 04688465 • Email: support@galaxysklep.pl • www.galaxysklep.pl
        </p>
        <p className="text-xs text-gray-400 mt-1">Strona 1 z 1</p>
      </div>
    </div>
  );
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