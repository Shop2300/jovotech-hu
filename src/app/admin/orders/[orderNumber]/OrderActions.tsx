// src/app/admin/orders/[orderNumber]/OrderActions.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Package, FileText, Download, Loader2, CheckCircle, Trash2, CreditCard, Mail, RefreshCw } from 'lucide-react';

interface OrderActionsProps {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  currentTrackingNumber: string;
  currentPaymentStatus?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  pdfUrl: string | null;
  status: string;
  createdAt: string;
}

export function OrderActions({ orderId, orderNumber, currentStatus, currentTrackingNumber, currentPaymentStatus = 'unpaid' }: OrderActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber);
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isCheckingInvoice, setIsCheckingInvoice] = useState(true);
  const [isDeletingInvoice, setIsDeletingInvoice] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const paymentStatusOptions = [
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
  ];

  // Check if invoice exists
  useEffect(() => {
    async function checkInvoice() {
      try {
        const response = await fetch(`/api/admin/orders/${orderNumber}`);
        if (response.ok) {
          const orderData = await response.json();
          if (orderData.invoice) {
            setInvoice(orderData.invoice);
          }
        }
      } catch (error) {
        console.error('Error checking invoice:', error);
      } finally {
        setIsCheckingInvoice(false);
      }
    }
    checkInvoice();
  }, [orderNumber]);

  const handleGenerateInvoice = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}/invoice/generate`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to generate invoice');
      
      const data = await response.json();
      setInvoice(data.invoice);
      return true;
    } catch (error) {
      console.error('Error generating invoice:', error);
      return false;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    // Check if changing to shipped without tracking number
    if (newStatus === 'shipped' && !trackingNumber && !currentTrackingNumber) {
      toast.error('Please enter tracking number before marking as shipped');
      return;
    }

    setIsUpdating(true);
    
    // Auto-generate invoice when changing to processing
    if (newStatus === 'processing' && !invoice) {
      toast.loading('Generating invoice...', { id: 'invoice-gen' });
      const invoiceGenerated = await handleGenerateInvoice();
      if (invoiceGenerated) {
        toast.success('Invoice was automatically generated', { id: 'invoice-gen' });
      } else {
        toast.error('Failed to generate invoice', { id: 'invoice-gen' });
      }
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          trackingNumber: trackingNumber || currentTrackingNumber 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update status');
      }
      
      setStatus(newStatus);
      
      // Show appropriate success message
      if (newStatus === 'shipped') {
        toast.success(
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>Order marked as shipped and email was sent to customer</span>
          </div>,
          { duration: 5000 }
        );
      } else if (newStatus === 'processing') {
        toast.success('Status changed to "Processing"');
      } else {
        toast.success('Order status has been updated');
      }
      
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newPaymentStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update payment status');
      
      setPaymentStatus(newPaymentStatus);
      toast.success('Payment status has been updated');
      router.refresh();
    } catch (error) {
      toast.error('Error updating payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTrackingNumberUpdate = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter tracking number');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (!response.ok) throw new Error('Failed to update tracking number');
      
      toast.success('Tracking number has been updated');
      setIsEditingTracking(false);
      router.refresh();
    } catch (error) {
      toast.error('Error updating tracking number');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!invoice) return;

    // Direct download from Blob URL (if it exists)
    if (invoice.pdfUrl && invoice.pdfUrl.startsWith('http')) {
      window.open(invoice.pdfUrl, '_blank');
      toast.success('Invoice has been downloaded');
      return;
    }

    // Fallback to API route (shouldn't happen with new invoices)
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}/download`);
      
      if (!response.ok) throw new Error('Failed to download invoice');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Invoice has been downloaded');
    } catch (error) {
      toast.error('Error downloading invoice');
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoice) return;

    setIsDeletingInvoice(true);
    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete invoice');
      
      setInvoice(null);
      toast.success('Invoice has been deleted');
      router.refresh();
    } catch (error) {
      toast.error('Error deleting invoice');
    } finally {
      setIsDeletingInvoice(false);
    }
  };

  const handleResendConfirmationEmail = async () => {
    setIsResendingEmail(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}/resend-confirmation`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to resend confirmation email');
      
      const data = await response.json();
      toast.success(
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span>Order confirmation has been resent to customer</span>
        </div>,
        { duration: 4000 }
      );
      
      router.refresh();
    } catch (error) {
      toast.error('Error sending email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Actions</h2>
      
      {/* Status Update */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Status
        </label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {status === 'shipped' && (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <CheckCircle size={14} />
            Shipping notification email was sent
          </p>
        )}
        {status === 'processing' && invoice && (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <FileText size={14} />
            Invoice was automatically generated
          </p>
        )}
      </div>

      {/* Payment Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Status
        </label>
        <div className="relative">
          <select
            value={paymentStatus}
            onChange={(e) => handlePaymentStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              paymentStatus === 'paid' 
                ? 'border-green-300 bg-green-50' 
                : 'border-red-300 bg-red-50'
            }`}
          >
            {paymentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {paymentStatus === 'paid' ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <CreditCard className="text-red-600" size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Tracking Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tracking Number
          {status !== 'shipped' && !trackingNumber && (
            <span className="text-xs text-gray-500 ml-2">
              (required for shipping)
            </span>
          )}
        </label>
        {!isEditingTracking ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <Package size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">
                {trackingNumber || 'Not entered'}
              </span>
            </div>
            <button
              onClick={() => setIsEditingTracking(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {trackingNumber ? 'Edit' : 'Add'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleTrackingNumberUpdate}
                disabled={isUpdating || !trackingNumber.trim()}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTrackingNumber(currentTrackingNumber);
                  setIsEditingTracking(false);
                }}
                disabled={isUpdating}
                className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Actions */}
      <div className="space-y-2 pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Invoice</h3>
        
        {isCheckingInvoice ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        ) : invoice ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle size={16} />
                  <span>Invoice {invoice.invoiceNumber} was generated</span>
                </div>
                <button
                  onClick={handleDeleteInvoice}
                  disabled={isDeletingInvoice}
                  className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                  title="Delete invoice"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <button 
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
              onClick={handleDownloadInvoice}
            >
              <Download size={18} />
              Download PDF
            </button>
          </>
        ) : (
          <button 
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            onClick={handleGenerateInvoice}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating invoice...
              </>
            ) : (
              <>
                <FileText size={18} />
                Generate Invoice
              </>
            )}
          </button>
        )}
      </div>

      {/* Email Actions - NEW SECTION */}
      <div className="space-y-2 pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Email Communication</h3>
        
        <button 
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleResendConfirmationEmail}
          disabled={isResendingEmail}
        >
          {isResendingEmail ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Sending email...
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              Resend Order Confirmation
            </>
          )}
        </button>
      </div>

      {/* Shipping Email Info */}
      {status === 'shipped' && trackingNumber && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start gap-2 text-blue-700 text-sm">
            <Mail size={16} className="mt-0.5" />
            <div>
              <p className="font-medium">Shipping notification email</p>
              <p className="text-xs mt-1">
                Customer received email with tracking number: {trackingNumber}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}