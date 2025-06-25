// src/components/admin/OrdersTable.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Eye, FileText, Trash2, CheckCircle, XCircle, Package, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getPaymentMethodLabel, getDeliveryMethodLabel } from '@/lib/order-options';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  createdAt: string;
  items?: any; // JSON string of order items
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
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders by search query
  const searchFilteredOrders = orders.filter(order => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Search by order number (without #)
    const orderNumberMatch = order.orderNumber.toLowerCase().includes(query) || 
                           order.orderNumber.toLowerCase().includes(query.replace('#', ''));
    
    // Search by customer name
    const customerNameMatch = order.customerName.toLowerCase().includes(query);
    
    // Search by customer email
    const customerEmailMatch = order.customerEmail.toLowerCase().includes(query);
    
    return orderNumberMatch || customerNameMatch || customerEmailMatch;
  });

  // Filter orders by payment status
  const paymentFilteredOrders = paymentFilter === 'all' 
    ? searchFilteredOrders 
    : searchFilteredOrders.filter(order => {
        if (paymentFilter === 'paid') {
          return order.paymentStatus === 'paid';
        } else if (paymentFilter === 'unpaid') {
          return order.paymentStatus !== 'paid';
        }
        return true;
      });

  // Filter orders by status (after search and payment filters)
  const filteredOrders = statusFilter === 'all' 
    ? paymentFilteredOrders 
    : paymentFilteredOrders.filter(order => order.status === statusFilter);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedOrders([]); // Clear selections
  };

  const handleStatusFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
    setSelectedOrders([]); // Clear selections
  };

  const handlePaymentFilterChange = (newFilter: string) => {
    setPaymentFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
    setSelectedOrders([]); // Clear selections
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedOrders([]); // Clear selections when changing pages
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    setSelectedOrders([]); // Clear selections
  };

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    setUpdatingStatus(orderNumber);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Stav objednávky byl aktualizován');
      router.refresh();
    } catch (error) {
      toast.error('Chyba při aktualizaci stavu objednávky');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (!confirm(`Opravdu chcete změnit stav u ${selectedOrders.length} objednávek?`)) {
      return;
    }

    setBulkUpdating(true);
    try {
      const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
      
      for (const order of selectedOrdersData) {
        const response = await fetch(`/api/admin/orders/${order.orderNumber}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update order ${order.orderNumber}`);
        }
      }

      toast.success(`Stav byl změněn u ${selectedOrders.length} objednávek`);
      setSelectedOrders([]);
      router.refresh();
    } catch (error) {
      toast.error('Chyba při hromadné změně stavu');
    } finally {
      setBulkUpdating(false);
    }
  };

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
    const currentOrderIds = currentOrders.map(order => order.id);
    if (selectedOrders.filter(id => currentOrderIds.includes(id)).length === currentOrders.length) {
      // All current page orders are selected, deselect them
      setSelectedOrders(prev => prev.filter(id => !currentOrderIds.includes(id)));
    } else {
      // Select all orders on current page
      setSelectedOrders(prev => [...new Set([...prev, ...currentOrderIds])]);
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
      const selectedOrdersData = filteredOrders.filter(order => selectedOrders.includes(order.id));
      
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
      
      // Reset to first page if current page becomes empty
      const remainingOrders = filteredOrders.length - selectedOrders.length;
      const newTotalPages = Math.ceil(remainingOrders / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
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

  // Get status counts (from search and payment filtered orders)
  const statusCounts = {
    all: paymentFilteredOrders.length,
    pending: paymentFilteredOrders.filter(o => o.status === 'pending').length,
    processing: paymentFilteredOrders.filter(o => o.status === 'processing').length,
    shipped: paymentFilteredOrders.filter(o => o.status === 'shipped').length,
    delivered: paymentFilteredOrders.filter(o => o.status === 'delivered').length,
    cancelled: paymentFilteredOrders.filter(o => o.status === 'cancelled').length,
  };

  // Get payment status counts (from search filtered orders)
  const paymentCounts = {
    all: searchFilteredOrders.length,
    paid: searchFilteredOrders.filter(o => o.paymentStatus === 'paid').length,
    unpaid: searchFilteredOrders.filter(o => o.paymentStatus !== 'paid').length,
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 bg-white rounded-lg shadow p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Hledat podle čísla objednávky, jména nebo emailu..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Nalezeno {searchFilteredOrders.length} objednávek
            {searchFilteredOrders.length !== orders.length && (
              <span> z celkových {orders.length}</span>
            )}
          </div>
        )}
      </div>

      {/* Payment Status Filter */}
      <div className="mb-4 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePaymentFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              paymentFilter === 'all' 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Všechny platby ({paymentCounts.all})
          </button>
          <button
            onClick={() => handlePaymentFilterChange('paid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              paymentFilter === 'paid' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <CheckCircle size={14} />
              Zaplaceno ({paymentCounts.paid})
            </span>
          </button>
          <button
            onClick={() => handlePaymentFilterChange('unpaid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              paymentFilter === 'unpaid' 
                ? 'bg-red-600 text-white' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <XCircle size={14} />
              Nezaplaceno ({paymentCounts.unpaid})
            </span>
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-4 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Všechny ({statusCounts.all})
          </button>
          <button
            onClick={() => handleStatusFilterChange('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            Čeká na vyřízení ({statusCounts.pending})
          </button>
          <button
            onClick={() => handleStatusFilterChange('processing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === 'processing' 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            Zpracovává se ({statusCounts.processing})
          </button>
          <button
            onClick={() => handleStatusFilterChange('shipped')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === 'shipped' 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
          >
            Odesláno ({statusCounts.shipped})
          </button>
          <button
            onClick={() => handleStatusFilterChange('delivered')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === 'delivered' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            Doručeno ({statusCounts.delivered})
          </button>
          <button
            onClick={() => handleStatusFilterChange('cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === 'cancelled' 
                ? 'bg-red-600 text-white' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            Zrušeno ({statusCounts.cancelled})
          </button>
        </div>
      </div>
      
      {selectedOrders.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
          <p className="text-sm text-blue-800">
            Vybráno {selectedOrders.length} objednávek
          </p>
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStatusChange(e.target.value);
                  e.target.value = ''; // Reset select
                }
              }}
              disabled={bulkUpdating}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Změnit stav...</option>
              <option value="pending">Čeká na vyřízení</option>
              <option value="processing">Zpracovává se</option>
              <option value="shipped">Odesláno</option>
              <option value="delivered">Doručeno</option>
              <option value="cancelled">Zrušeno</option>
            </select>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
            >
              Smazat vybrané
            </button>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">
            {searchQuery 
              ? 'Žádné objednávky neodpovídají vašemu vyhledávání' 
              : paymentFilter !== 'all'
                ? 'Žádné objednávky s tímto stavem platby'
                : statusFilter === 'all' 
                  ? 'Zatím žádné objednávky' 
                  : 'Žádné objednávky s tímto stavem'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={currentOrders.length > 0 && currentOrders.every(order => selectedOrders.includes(order.id))}
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
                    Stav objednávky
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platba
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Způsob dopravy
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-gray-50 ${
                      order.status === 'cancelled' ? 'opacity-50 bg-gray-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <div
                        onMouseEnter={() => setHoveredOrderId(order.id)}
                        onMouseLeave={() => setHoveredOrderId(null)}
                      >
                        <Link 
                          href={`/admin/orders/${order.orderNumber}`}
                          className={`text-sm font-medium hover:underline ${
                            order.status === 'cancelled' 
                              ? 'text-gray-500 hover:text-gray-700' 
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          #{order.orderNumber}
                        </Link>
                        <div className="text-xs text-gray-500">
                          {format(new Date(order.createdAt), 'd. MMM yyyy', { locale: cs })}
                          {' • '}
                          {format(new Date(order.createdAt), 'HH:mm', { locale: cs })}
                        </div>
                      </div>
                      
                      {/* Order Preview */}
                      {hoveredOrderId === order.id && (
                        <div className="absolute z-[100] left-full ml-2 top-0 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-96 max-h-[80vh] overflow-y-auto">
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-900">Objednávka #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                          </div>
                          
                          <div className="border-t pt-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Položky:</h5>
                            {/* Parse items from order */}
                            {(() => {
                              try {
                                // Items might already be parsed or might be a JSON string
                                const items = typeof (order as any).items === 'string' 
                                  ? JSON.parse((order as any).items || '[]')
                                  : (order as any).items || [];
                                
                                if (!Array.isArray(items) || items.length === 0) {
                                  return <p className="text-sm text-gray-500">Žádné položky</p>;
                                }
                                
                                return items.map((item: any, index: number) => (
                                  <div key={index} className="flex gap-3 mb-3 pb-3 border-b last:border-0">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                      {item.image ? (
                                        <img 
                                          src={item.image} 
                                          alt={item.name || 'Produkt'}
                                          className="w-12 h-12 object-cover rounded"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                          <Package size={20} className="text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate pr-2" title={item.name || 'Produkt'}>
                                        {item.name || 'Produkt'}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {item.quantity}x {formatPrice(item.price)}
                                        {item.size && <span className="text-gray-500"> • {item.size}</span>}
                                        {item.color && <span className="text-gray-500"> • {item.color}</span>}
                                      </p>
                                    </div>
                                    
                                    {/* Item Total */}
                                    <div className="flex-shrink-0">
                                      <p className="text-sm font-medium text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                      </p>
                                    </div>
                                  </div>
                                ));
                              } catch (e) {
                                console.error('Error parsing items:', e);
                                return <p className="text-sm text-gray-500">Nelze načíst položky</p>;
                              }
                            })()}
                          </div>
                          
                          <div className="border-t mt-3 pt-3">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">Celkem:</span>
                              <span className="font-bold text-lg">{formatPrice(order.total)}</span>
                            </div>
                            {order.deliveryMethod && (
                              <div className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Doprava:</span> {getDeliveryMethodLabel(order.deliveryMethod, 'pl')}
                              </div>
                            )}
                            {order.paymentMethod && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Platba:</span> {getPaymentMethodLabel(order.paymentMethod, 'pl')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${order.status === 'cancelled' ? 'text-gray-600' : 'text-gray-900'}`}>
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${order.status === 'cancelled' ? 'text-gray-600' : 'text-gray-900'}`}>
                        {formatPrice(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                        disabled={updatingStatus === order.orderNumber}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="pending">Čeká na vyřízení</option>
                        <option value="processing">Zpracovává se</option>
                        <option value="shipped">Odesláno</option>
                        <option value="delivered">Doručeno</option>
                        <option value="cancelled">Zrušeno</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {getPaymentStatusBadge(order.paymentStatus)}
                        {order.paymentMethod && (
                          <div className="text-xs text-gray-600 mt-1">
                            {getPaymentMethodLabel(order.paymentMethod, 'pl')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.deliveryMethod ? (
                        <div className={`text-sm ${order.status === 'cancelled' ? 'text-gray-600' : 'text-gray-900'}`}>
                          {getDeliveryMethodLabel(order.deliveryMethod, 'pl')}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.orderNumber}`}
                          className={`hover:opacity-80 ${
                            order.status === 'cancelled' ? 'text-gray-500' : 'text-blue-600'
                          }`}
                          title="Zobrazit detail"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(order.id, order.orderNumber)}
                          disabled={deletingId === order.id}
                          className={`hover:opacity-80 disabled:opacity-50 ${
                            order.status === 'cancelled' ? 'text-gray-500' : 'text-red-600'
                          }`}
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
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Předchozí
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Další
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Zobrazeno <span className="font-medium">{startIndex + 1}</span> až{' '}
                <span className="font-medium">{Math.min(endIndex, filteredOrders.length)}</span> z{' '}
                <span className="font-medium">{filteredOrders.length}</span> výsledků
                {(statusFilter !== 'all' || searchQuery || paymentFilter !== 'all') && (
                  <span className="text-gray-500"> (filtrováno z {orders.length} celkem)</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="items-per-page" className="text-sm text-gray-700">
                  Zobrazit:
                </label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="rounded-md border-gray-300 py-1 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                </select>
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Předchozí</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Další</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}