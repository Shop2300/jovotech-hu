// src/components/admin/OrdersTable.tsx
'use client';

import { formatPrice } from '@/lib/utils';
import { format, differenceInMinutes } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Package, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  total: number;
  status: string;
  paymentStatus?: string;
  trackingNumber?: string | null;
  createdAt: Date;
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute to refresh the countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string, createdAt: Date) => {
    const statusConfig = {
      pending: { label: 'Čeká na vyřízení', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Zpracovává se', className: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Odesláno', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Doručeno', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Zrušeno', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    // Calculate minutes until automatic status change
    const minutesSinceCreation = differenceInMinutes(currentTime, new Date(createdAt));
    const minutesUntilProcessing = 30 - minutesSinceCreation;

    return (
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
          {config.label}
        </span>
        {status === 'pending' && minutesUntilProcessing > 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            {minutesUntilProcessing} min
          </span>
        )}
      </div>
    );
  };

  const getPaymentBadge = (paymentStatus: string = 'unpaid') => {
    const config = paymentStatus === 'paid' 
      ? { 
          label: 'Zaplaceno', 
          className: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={12} />
        } 
      : { 
          label: 'Nezaplaceno', 
          className: 'bg-red-100 text-red-800',
          icon: <CreditCard size={12} />
        };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.className}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="pb-3 font-medium text-gray-700">Číslo objednávky</th>
            <th className="pb-3 font-medium text-gray-700">Zákazník</th>
            <th className="pb-3 font-medium text-gray-700">Celkem</th>
            <th className="pb-3 font-medium text-gray-700">Stav</th>
            <th className="pb-3 font-medium text-gray-700">Platba</th>
            <th className="pb-3 font-medium text-gray-700">Sledování</th>
            <th className="pb-3 font-medium text-gray-700">Datum</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-3">
                <a href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800">
                  {order.orderNumber}
                </a>
              </td>
              <td className="py-3 text-black">{order.fullName}</td>
              <td className="py-3 text-black">{formatPrice(order.total)}</td>
              <td className="py-3">{getStatusBadge(order.status, order.createdAt)}</td>
              <td className="py-3">{getPaymentBadge(order.paymentStatus)}</td>
              <td className="py-3">
                {order.trackingNumber ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Package size={14} className="text-gray-500" />
                    <span className="text-blue-600">{order.trackingNumber}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </td>
              <td className="py-3 text-black">
                {format(new Date(order.createdAt), 'd. M. yyyy HH:mm', { locale: cs })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}