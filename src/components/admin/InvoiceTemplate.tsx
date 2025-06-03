// src/components/admin/InvoiceTemplate.tsx
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
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

  // Calculate VAT (21% in Czech Republic)
  const vatRate = 0.21;
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
          <p className="text-gray-600 text-xs">Daňový doklad</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{invoiceNumber}</p>
          <p className="text-gray-600 text-xs">Variabilní symbol: {order.orderNumber}</p>
        </div>
      </div>

      {/* Company and Customer Info */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* Supplier */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1 text-sm">Dodavatel:</h2>
          <div className="text-gray-700 text-xs">
            <p className="font-bold">Můj E-shop s.r.o.</p>
            <p>Václavské náměstí 123, 110 00 Praha 1</p>
            <p>IČO: 12345678, DIČ: CZ12345678</p>
            <p>Email: info@muj-eshop.cz, Tel: +420 123 456 789</p>
          </div>
        </div>

        {/* Customer */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1 text-sm">Odběratel:</h2>
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
          <span className="text-gray-600">Datum vystavení: </span>
          <span className="font-bold">{format(issueDate, 'd.M.yyyy', { locale: cs })}</span>
        </div>
        <div>
          <span className="text-gray-600">Datum zdan. plnění: </span>
          <span className="font-bold">{format(new Date(order.createdAt), 'd.M.yyyy', { locale: cs })}</span>
        </div>
        <div>
          <span className="text-gray-600">Splatnost: </span>
          <span className="font-bold">{format(dueDate, 'd.M.yyyy', { locale: cs })}</span>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4 text-xs">
        <thead>
          <tr className="border-b-2 border-gray-300 text-xs">
            <th className="text-left py-1">Položka</th>
            <th className="text-center py-1 w-12">Ks</th>
            <th className="text-right py-1 w-20">Cena/ks</th>
            <th className="text-right py-1 w-24">Bez DPH</th>
            <th className="text-right py-1 w-12">DPH</th>
            <th className="text-right py-1 w-24">S DPH</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => {
            const itemTotalWithVat = item.price * item.quantity;
            const itemTotalWithoutVat = itemTotalWithVat / (1 + vatRate);
            return (
              <tr key={index} className="border-b">
                <td className="py-1">{item.name || item.name || 'Položka'}</td>
                <td className="text-center py-1">{item.quantity}</td>
                <td className="text-right py-1">{formatPrice(item.price)}</td>
                <td className="text-right py-1">{formatPrice(itemTotalWithoutVat)}</td>
                <td className="text-right py-1">21%</td>
                <td className="text-right py-1">{formatPrice(itemTotalWithVat)}</td>
              </tr>
            );
          })}
          {/* Delivery */}
          {order.deliveryMethod && order.deliveryMethod !== 'personal' && (
            <tr className="border-b">
              <td className="py-1">Doprava - {order.deliveryMethod === 'zasilkovna' ? 'Zásilkovna' : 'Ostatní'}</td>
              <td className="text-center py-1">1</td>
              <td className="text-right py-1">{formatPrice(89)}</td>
              <td className="text-right py-1">{formatPrice(89 / (1 + vatRate))}</td>
              <td className="text-right py-1">21%</td>
              <td className="text-right py-1">{formatPrice(89)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-4">
        <div className="w-48 text-xs">
          <div className="flex justify-between py-0.5">
            <span>Základ daně:</span>
            <span>{formatPrice(totalWithoutVat)}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>DPH 21%:</span>
            <span>{formatPrice(vatAmount)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold text-base border-t-2 border-gray-300">
            <span>Celkem k úhradě:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-bold">Způsob platby:</span> {order.paymentMethod === 'card' ? 'Platba kartou' : 'Platba na dobírku'}<br/>
            <span className="font-bold">Číslo účtu:</span> 123456789/0100<br/>
            <span className="font-bold">Variabilní symbol:</span> {order.orderNumber}
          </div>
          <div>
            <span className="font-bold">IBAN:</span> CZ12 0100 0000 0012 3456 789<br/>
            <span className="font-bold">SWIFT:</span> KOMBCZPP
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 pt-2 border-t">
        <p>Společnost je zapsána v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 12345.</p>
        <p className="font-bold mt-1">Děkujeme za vaši objednávku!</p>
      </div>
    </div>
  );
}