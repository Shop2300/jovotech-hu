// src/app/admin/orders/[id]/invoice/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { InvoiceTemplate } from '@/components/admin/InvoiceTemplate';
import { useParams } from 'next/navigation';

export default async function InvoicePage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoiceData() {
      try {
        const response = await fetch(`/api/admin/orders/${params.id}/invoice`);
        if (!response.ok) throw new Error('Failed to fetch invoice data');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoiceData();
  }, [params.id]);

  // Auto-print when the page loads
  useEffect(() => {
    if (!loading && order) {
      // Small delay to ensure everything is rendered
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [loading, order]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Načítám fakturu...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Faktura nebyla nalezena</p>
      </div>
    );
  }

  return <InvoiceTemplate order={order} />;
}