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

export function InvoiceTemplate({ order }: InvoiceTemplateProps) {
  const invoiceNumber = `FAK${new Date().getFullYear()}${order.orderNumber}`;
  const issueDate = new Date();
  const saleDate = new Date(order.createdAt);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 14 days payment term

  // Calculate totals
  let subtotal = 0;
  order.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const deliveryPrice = getDeliveryPrice(order.deliveryMethod);
  if (deliveryPrice > 0) {
    subtotal += deliveryPrice;
  }

  return (
    <div className="invoice-container bg-white p-8 max-w-[210mm] mx-auto">
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
            padding: 15mm;
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

      {/* Header with Logo */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-lg">
            GALAXY
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">FAKTURA</h1>
            <p className="text-gray-500 text-sm">Nr: {invoiceNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 space-y-1">
            <p>Data wystawienia: <span className="font-semibold">{format(issueDate, 'dd.MM.yyyy')}</span></p>
            <p>Data sprzedaży: <span className="font-semibold">{format(saleDate, 'dd.MM.yyyy')}</span></p>
            <p>Termin płatności: <span className="font-semibold">{format(dueDate, 'dd.MM.yyyy')}</span></p>
          </div>
        </div>
      </div>

      {/* Company and Customer Info */}
      <div className="grid grid-cols-2 gap-8 mb-6 bg-gray-50 p-6 rounded-lg">
        {/* Seller */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Sprzedawca:</h2>
          <div className="text-gray-700 space-y-1 text-sm">
            <p className="font-bold text-base">Galaxy Sklep</p>
            <p>1. máje 535/50</p>
            <p>46007 Liberec, Czechy</p>
            <p className="font-semibold">NIP: 04688465</p>
            <div className="pt-2 space-y-1">
              <p>Email: support@galaxysklep.pl</p>
              <p>Tel: +420 123 456 789</p>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Nabywca:</h2>
          <div className="text-gray-700 space-y-1 text-sm">
            {order.billingCompany && (
              <p className="font-bold text-base">{order.billingCompany}</p>
            )}
            <p className={`${!order.billingCompany ? 'font-bold text-base' : ''}`}>
              {order.billingFirstName} {order.billingLastName}
            </p>
            <p>{order.billingAddress}</p>
            <p>{order.billingPostalCode} {order.billingCity}</p>
            <p>{order.billingCountry || 'Polska'}</p>
            {order.billingNip && (
              <p className="font-semibold">NIP: {order.billingNip}</p>
            )}
            <div className="pt-2 space-y-1">
              <p>Email: {order.customerEmail}</p>
              <p>Tel: {order.customerPhone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* No VAT Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
        <p className="font-bold text-gray-900">UWAGA: Sprzedawca nie jest płatnikiem VAT</p>
        <p className="text-sm text-gray-600">Faktura wystawiona bez podatku VAT</p>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white text-sm">
              <th className="text-left py-3 px-2 rounded-tl-lg">Lp.</th>
              <th className="text-left py-3 px-2">Nazwa towaru/usługi</th>
              <th className="text-center py-3 px-2">Ilość</th>
              <th className="text-right py-3 px-2">Cena jedn.</th>
              <th className="text-right py-3 px-2 rounded-tr-lg">Wartość</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {order.items.map((item, index) => {
              const itemTotal = item.price * item.quantity;
              return (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-2">{index + 1}.</td>
                  <td className="py-3 px-2">{item.name || 'Produkt'}</td>
                  <td className="text-center py-3 px-2">{item.quantity}</td>
                  <td className="text-right py-3 px-2">{formatCurrency(item.price)}</td>
                  <td className="text-right py-3 px-2 font-semibold">{formatCurrency(itemTotal)}</td>
                </tr>
              );
            })}
            {/* Delivery */}
            {deliveryPrice > 0 && (
              <tr className={order.items.length % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 px-2">{order.items.length + 1}.</td>
                <td className="py-3 px-2">{getDeliveryMethodName(order.deliveryMethod)}</td>
                <td className="text-center py-3 px-2">1</td>
                <td className="text-right py-3 px-2">{formatCurrency(deliveryPrice)}</td>
                <td className="text-right py-3 px-2 font-semibold">{formatCurrency(deliveryPrice)}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-800">
              <td colSpan={4} className="text-right py-4 px-2 font-bold text-lg">RAZEM DO ZAPŁATY:</td>
              <td className="text-right py-4 px-2 font-bold text-lg text-blue-600">{formatCurrency(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment Information */}
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
        <h3 className="font-bold text-lg mb-4">DANE DO PŁATNOŚCI:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p><span className="font-semibold">Sposób płatności:</span> {getPaymentMethodName(order.paymentMethod)}</p>
            <p><span className="font-semibold">Numer konta:</span> 21291000062469800208837403</p>
            <p><span className="font-semibold">IBAN:</span> PL21 2910 0006 2469 8002 0883 7403</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-semibold">Tytuł przelewu:</span> Zamówienie {order.orderNumber}</p>
            <p><span className="font-semibold">SWIFT/BIC:</span> BMPBPLPP</p>
            <p><span className="font-semibold">Bank:</span> Aion S.A. Spolka Akcyjna Oddzial w Polsce</p>
          </div>
        </div>
        <p className="text-xs mt-2 opacity-90">Adres banku: Dobra 40, 00-344 Warszawa, Poland</p>
      </div>

      {/* Shipping Address if different */}
      {((order.shippingAddress && order.shippingAddress !== order.billingAddress) || 
        (order.shippingCity && order.shippingCity !== order.billingCity)) && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-sm text-gray-900 mb-2">ADRES DOSTAWY:</h3>
          <div className="text-sm text-gray-700">
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
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-sm text-gray-900 mb-2">UWAGI:</h3>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Signature Areas */}
      <div className="flex justify-between mt-12 mb-8">
        <div className="text-center">
          <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-xs text-gray-600">Podpis sprzedającego</p>
        </div>
        <div className="text-center">
          <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-xs text-gray-600">Podpis kupującego</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t">
        <p className="text-xs text-gray-500 mb-2">
          Galaxy Sklep • 1. máje 535/50, 46007 Liberec, Czechy • NIP: 04688465
        </p>
        <p className="font-bold text-blue-600">Dziękujemy za zakupy!</p>
        <p className="text-xs text-gray-400 mt-2">Strona 1 z 1</p>
      </div>
    </div>
  );
}