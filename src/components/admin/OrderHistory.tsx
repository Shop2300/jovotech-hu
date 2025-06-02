// src/components/admin/OrderHistory.tsx
'use client';

import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { 
  Clock, 
  Package, 
  FileText, 
  Truck, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  History,
  Mail
} from 'lucide-react';

interface OrderHistoryEntry {
  id: string;
  action: string;
  description: string;
  oldValue?: string | null;
  newValue?: string | null;
  performedBy: string;
  metadata?: any;
  createdAt: string;
}

interface OrderHistoryProps {
  history: OrderHistoryEntry[];
}

export function OrderHistory({ history }: OrderHistoryProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'order_created':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'status_change':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'tracking_added':
      case 'tracking_updated':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'tracking_removed':
        return <Truck className="w-5 h-5 text-red-600" />;
      case 'invoice_generated':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'invoice_deleted':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'payment_received':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'email_sent':
        return <Mail className="w-5 h-5 text-blue-600" />;
      default:
        return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'order_created':
        return 'border-blue-200 bg-blue-50';
      case 'status_change':
        return 'border-yellow-200 bg-yellow-50';
      case 'tracking_added':
      case 'tracking_updated':
        return 'border-purple-200 bg-purple-50';
      case 'tracking_removed':
        return 'border-red-200 bg-red-50';
      case 'invoice_generated':
        return 'border-green-200 bg-green-50';
      case 'invoice_deleted':
        return 'border-red-200 bg-red-50';
      case 'email_sent':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-black">Historie objednávky</h2>
        </div>
        <p className="text-gray-500 text-center py-8">
          Zatím nejsou žádné záznamy v historii
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-black">Historie objednávky</h2>
      </div>
      
      <div className="space-y-3">
        {history.map((entry) => (
          <div 
            key={entry.id} 
            className={`border rounded-lg p-4 ${getActionColor(entry.action)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getActionIcon(entry.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {entry.description}
                </p>
                {(entry.oldValue || entry.newValue) && (
                  <div className="mt-1 text-xs text-gray-600">
                    {entry.oldValue && (
                      <span>
                        <span className="font-medium">Z:</span> {entry.oldValue}
                      </span>
                    )}
                    {entry.oldValue && entry.newValue && ' → '}
                    {entry.newValue && (
                      <span>
                        <span className="font-medium">Na:</span> {entry.newValue}
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {format(new Date(entry.createdAt), 'd. MMMM yyyy HH:mm', { locale: cs })}
                  </span>
                  <span>•</span>
                  <span>{entry.performedBy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}