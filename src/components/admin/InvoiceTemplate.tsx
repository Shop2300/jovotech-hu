'use client';

// src/components/admin/InvoiceTemplate.tsx
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { formatPrice } from '@/lib/utils';

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
  // Items
  items: InvoiceItem[];
  total: number;
  // Payment info
  paymentMethod: string;
  deliveryMethod: string;
}

interface InvoiceTemplateProps {
  order: InvoiceData;
}

export function InvoiceTemplate({ order }: InvoiceTemplateProps) {
  const invoiceNumber = `FAK${new Date().getFullYear()}${order.orderNumber}`;
  const issueDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 14 days payment term

  // Calculate VAT (23% in Poland)
  const vatRate = 0.23;
  const totalWithoutVat = order.total / (1 + vatRate);
  const vatAmount = order.total - totalWithoutVat;

  return (
    <div className="invoice-container bg-white p-6 max-w-[210mm] mx-auto text-sm">
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
            width: 100%;
            margin: 0;
            padding: 15mm;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">FAKTURA</h1>
          <p className="text-gray-600 text-xs">Dokument podatkowy</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{invoiceNumber}</p>
          <p className="text-gray-600 text-xs">Numer zamówienia: {order.orderNumber}</p>
        </div>
      </div>

      {/* Company and Customer Info */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* Supplier */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1 text-sm">Sprzedawca:</h2>
          <div className="text-gray-700 text-xs">
            <p className="font-bold">Galaxy Sklep Sp. z o.o.</p>
            <p>ul. Handlowa 123, 00-001 Warszawa</p>
            <p>NIP: 1234567890, REGON: 123456789</p>
            <p>Email: info@galaxysklep.pl, Tel: +48 123 456 789</p>
          </div>
        </div>

        {/* Customer */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1 text-sm">Nabywca:</h2>
          <div className="text-gray-700 text-xs">
            <p className="font-bold">{order.billingFirstName} {order.billingLastName}</p>
            <p>{order.billingAddress}</p>
            <p>{order.billingCity}, {order.billingPostalCode}</p>
            <p>Email: {order.customerEmail}, Tel: {order.customerPhone}</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-gray-50 rounded text-xs">
        <div>
          <span className="text-gray-600">Data wystawienia: </span>
          <span className="font-bold">{format(issueDate, 'd.MM.yyyy', { locale: pl })}</span>
        </div>
        <div>
          <span className="text-gray-600">Data sprzedaży: </span>
          <span className="font-bold">{format(new Date(order.createdAt), 'd.MM.yyyy', { locale: pl })}</span>
        </div>
        <div>
          <span className="text-gray-600">Termin płatności: </span>
          <span className="font-bold">{format(dueDate, 'd.MM.yyyy', { locale: pl })}</span>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="border-b-2 border-gray-300 text-xs">
            <th className="text-left py-1">Nazwa towaru/usługi</th>
            <th className="text-center py-1 w-12">Ilość</th>
            <th className="text-right py-1 w-20">Cena jedn.</th>
            <th className="text-right py-1 w-24">Wartość netto</th>
            <th className="text-right py-1 w-12">VAT</th>
            <th className="text-right py-1 w-24">Wartość brutto</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => {
            const itemTotalWithVat = item.price * item.quantity;
            const itemTotalWithoutVat = itemTotalWithVat / (1 + vatRate);
            return (
              <tr key={index} className="border-b">
                <td className="py-1">{item.name || 'Produkt'}</td>
                <td className="text-center py-1">{item.quantity}</td>
                <td className="text-right py-1">{formatPrice(item.price)}</td>
                <td className="text-right py-1">{formatPrice(itemTotalWithoutVat)}</td>
                <td className="text-right py-1">23%</td>
                <td className="text-right py-1">{formatPrice(itemTotalWithVat)}</td>
              </tr>
            );
          })}
          {/* Delivery */}
          {order.deliveryMethod && order.deliveryMethod !== 'personal' && (
            <tr className="border-b">
              <td className="py-1">Dostawa - {order.deliveryMethod === 'zasilkovna' ? 'Paczkomat' : 'Kurier'}</td>
              <td className="text-center py-1">1</td>
              <td className="text-right py-1">{formatPrice(89)}</td>
              <td className="text-right py-1">{formatPrice(89 / (1 + vatRate))}</td>
              <td className="text-right py-1">23%</td>
              <td className="text-right py-1">{formatPrice(89)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-4">
        <div className="w-48 text-xs">
          <div className="flex justify-between py-0.5">
            <span>Wartość netto:</span>
            <span>{formatPrice(totalWithoutVat)}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>VAT 23%:</span>
            <span>{formatPrice(vatAmount)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold text-base border-t-2 border-gray-300">
            <span>Do zapłaty:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-bold">Sposób płatności:</span> {order.paymentMethod === 'card' ? 'Płatność kartą' : order.paymentMethod === 'bank' ? 'Przelew bankowy' : 'Płatność za pobraniem'}<br/>
            <span className="font-bold">Numer konta:</span> 2302034483 / 2010<br/>
            <span className="font-bold">Tytuł przelewu:</span> {order.orderNumber}
          </div>
          <div>
            <span className="font-bold">IBAN:</span> CZ79 2010 0000 0023 0203 4483<br/>
            <span className="font-bold">SWIFT:</span> FIOBCZPPXXX
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 pt-2 border-t">
        <p>Firma wpisana do rejestru przedsiębiorców prowadzonego przez Sąd Rejonowy dla m.st. Warszawy, XIV Wydział Gospodarczy KRS pod nr 0000123456.</p>
        <p className="font-bold mt-1">Dziękujemy za Twoje zamówienie!</p>
      </div>
    </div>
  );
}