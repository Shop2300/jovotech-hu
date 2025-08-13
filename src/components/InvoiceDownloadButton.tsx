'use client';

import { FileText, Download } from 'lucide-react';

interface InvoiceDownloadButtonProps {
  orderNumber: string;
  invoiceNumber: string;
  pdfUrl: string | null;
}

export function InvoiceDownloadButton({ 
  orderNumber, 
  invoiceNumber, 
  pdfUrl 
}: InvoiceDownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/invoices/${orderNumber}/download`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Faktura-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Nem sikerült letölteni a számlát');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
    >
      <FileText size={16} />
      <span>Számla letöltése</span>
      <Download size={14} />
    </button>
  );
}
