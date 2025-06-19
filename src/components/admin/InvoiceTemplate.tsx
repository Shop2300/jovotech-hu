'use client';

// src/components/admin/InvoiceTemplate.tsx
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { getDeliveryMethod, getPaymentMethod } from '@/lib/order-options';

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

export function InvoiceTemplate({ order }: InvoiceTemplateProps) {
  const invoiceNumber = `FAK${new Date().getFullYear()}${order.orderNumber}`;
  const issueDate = new Date();
  const saleDate = new Date(order.createdAt);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 14 days payment term
  const orderNumberWithoutDash = order.orderNumber.replace('-', '');

  // Get delivery and payment methods from configuration
  const deliveryMethod = getDeliveryMethod(order.deliveryMethod);
  const paymentMethod = getPaymentMethod(order.paymentMethod);
  
  // Use prices from configuration
  const deliveryPrice = deliveryMethod?.price ?? 0;
  const paymentFee = paymentMethod?.price ?? 0;
  
  // Fallback delivery names if not in configuration
  const fallbackDeliveryNames: { [key: string]: string } = {
    'paczkomat': 'Paczkomat InPost',
    'kurier': 'Kurier DPD',
    'courier': 'Kurier DPD',
    'dpd': 'Kurier DPD',
    'zasilkovna': 'Najwygodniejsza dostawa',
    'odbior-osobisty': 'Odbiór osobisty',
    'personal': 'Odbiór osobisty'
  };
  
  const deliveryName = deliveryMethod?.labelPl || fallbackDeliveryNames[order.deliveryMethod] || order.deliveryMethod || 'Dostawa';
  const paymentName = paymentMethod?.labelPl || order.paymentMethod || 'Przelew bankowy';

  // Calculate totals - NO VAT
  let subtotal = 0;
  order.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // Always add delivery price and payment fee to subtotal
  subtotal += deliveryPrice;
  if (paymentFee > 0) {
    subtotal += paymentFee;
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
            <p className="text-gray-500 text-xs">Sprzedawca nie jest płatnikiem VAT</p>
            
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

      {/* Dates with payment info - expanded */}
      <div className="border border-gray-300 p-2 mb-3 text-xs">
        <div className="flex justify-between mb-1">
          <span>Data wystawienia: <strong>{format(issueDate, 'dd.MM.yyyy')}</strong></span>
          <span>Data sprzedaży: <strong>{format(saleDate, 'dd.MM.yyyy')}</strong></span>
          <span>Termin płatności: <strong>{format(dueDate, 'dd.MM.yyyy')}</strong></span>
        </div>
        <div className="flex justify-between">
          <span>Sposób płatności: <strong>{paymentName}</strong></span>
          <span>Tytuł przelewu: <strong>Zamówienie {orderNumberWithoutDash}</strong></span>
        </div>
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
          {/* Delivery - Always show delivery line */}
          <tr className="border-b border-gray-300">
            <td className="py-1 px-1">{order.items.length + 1}.</td>
            <td className="py-1">Dostawa - {deliveryName}</td>
            <td className="text-center py-1">1</td>
            <td className="text-right py-1">{formatCurrency(deliveryPrice)}</td>
            <td className="text-right py-1 px-1">{formatCurrency(deliveryPrice)}</td>
          </tr>
          {/* Payment fee if applicable */}
          {paymentFee > 0 && (
            <tr className="border-b border-gray-300">
              <td className="py-1 px-1">{order.items.length + 2}.</td>
              <td className="py-1">Opłata za płatność - {paymentName}</td>
              <td className="text-center py-1">1</td>
              <td className="text-right py-1">{formatCurrency(paymentFee)}</td>
              <td className="text-right py-1 px-1">{formatCurrency(paymentFee)}</td>
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
            <p><span className="font-semibold">Sposób płatności:</span> {paymentName}</p>
            <p><span className="font-semibold">Numer konta:</span> 21291000062469800208837403</p>
            <p><span className="font-semibold">IBAN:</span> PL21 2910 0006 2469 8002 0883 7403</p>
          </div>
          <div>
            <p><span className="font-semibold">Tytuł przelewu:</span> Zamówienie {orderNumberWithoutDash}</p>
            <p><span className="font-semibold">SWIFT/BIC:</span> BMPBPLPP</p>
            <p className="text-xs">Bank: Aion S.A. Spolka Akcyjna Oddzial w Polsce, Dobra 40, 00-344 Warszawa, Poland</p>
          </div>
        </div>
      </div>

      {/* Shipping Address and Notes - same height */}
      <div className="grid grid-cols-2 gap-4 mb-4" style={{ minHeight: '80px' }}>
        {/* Shipping Address if different */}
        {((order.shippingAddress && order.shippingAddress !== order.billingAddress) || 
          (order.shippingCity && order.shippingCity !== order.billingCity)) && (
          <div className="border border-gray-300 p-2 h-full">
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
          <div className="border border-gray-300 p-2 h-full">
            <h3 className="font-bold text-xs mb-1">UWAGI:</h3>
            <p className="text-xs text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Signature Areas - light grey */}
      <div className="flex justify-between mt-8 mb-4">
        <div className="text-center">
          <div className="border-t border-gray-400 w-36 mb-1"></div>
          <p className="text-xs text-gray-400">Podpis osoby upoważnionej</p>
          <p className="text-xs text-gray-400">do wystawienia faktury</p>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 w-36 mb-1"></div>
          <p className="text-xs text-gray-400">Podpis osoby upoważnionej</p>
          <p className="text-xs text-gray-400">do odbioru faktury</p>
        </div>
      </div>

      {/* Footer with more jurisdictional text */}
      <div className="text-center pt-2 border-t-2 border-gray-900">
        <p className="text-xs text-gray-600">
          Galaxy Sklep • 1. máje 535/50, 46007 Liberec, Republika Czeska • NIP: 04688465
        </p>
        <p className="text-xs text-gray-600">
          Email: support@galaxysklep.pl • www.galaxysklep.pl
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Przedsiębiorca zagraniczny prowadzący sprzedaż na terytorium RP. Podmiot zwolniony z obowiązku ewidencjonowania przy zastosowaniu kas rejestrujących.
        </p>
        <p className="text-xs text-gray-500">
          Faktura wystawiona zgodnie z art. 106e ustawy z dnia 11 marca 2004 r. o podatku od towarów i usług.
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