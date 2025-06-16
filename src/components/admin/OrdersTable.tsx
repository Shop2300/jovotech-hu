// src/components/admin/OrdersTable.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Eye, FileText, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
  invoice: {
    id: string;
    invoiceNumber: string;
  } | null;
}

interface OrdersTableProps {
  orders: Order[];
  onDelete?: (orderId: string) => void;
}

export function OrdersTable({ orders, onDelete }: OrdersTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Čeká na vyřízení', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Zpracovává se', className: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Odesláno', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Doručeno', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Zrušeno', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    if (!paymentStatus) return null;

    const isPaid = paymentStatus === 'paid';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isPaid ? (
          <>
            <CheckCircle size={12} />
            Zaplaceno
          </>
        ) : (
          <>
            <XCircle size={12} />
            Nezaplaceno
          </>
        )}
      </span>
    );
  };

  const handleDelete = async (orderId: string, orderNumber: string) => {
    if (!confirm('Opravdu chcete smazat tuto objednávku?')) {
      return;
    }

    setDeletingId(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      toast.success('Objednávka byla smazána');
      if (onDelete) {
        onDelete(orderId);
      }
    } catch (error) {
      toast.error('Chyba při mazání objednávky');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Opravdu chcete smazat ${selectedOrders.length} objednávek?`)) {
      return;
    }

    try {
      // Get order numbers for selected orders
      const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
      
      // Delete orders one by one
      for (const order of selectedOrdersData) {
        const response = await fetch(`/api/admin/orders/${order.orderNumber}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete order ${order.orderNumber}`);
        }
      }

      toast.success(`${selectedOrders.length} objednávek bylo smazáno`);
      setSelectedOrders([]);
      router.refresh();
    } catch (error) {
      toast.error('Chyba při mazání objednávek');
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500">Zatím žádné objednávky</p>
      </div>
    );
  }

  return (
    <div>
      {selectedOrders.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
          <p className="text-sm text-blue-800">
            Vybráno {selectedOrders.length} objednávek
          </p>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
          >
            Smazat vybrané
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Číslo objednávky
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zákazník
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Celkem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stav
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platba
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faktura
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'd. MMM yyyy', { locale: cs })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.invoice ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <FileText size={16} />
                        <span className="text-xs">{order.invoice.invoiceNumber}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Žádná</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/orders/${order.orderNumber}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Zobrazit detail"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(order.id, order.orderNumber)}
                        disabled={deletingId === order.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Smazat objednávku"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}