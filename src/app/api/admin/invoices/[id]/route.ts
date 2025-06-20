// src/app/api/admin/invoices/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth-middleware';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await checkAuth(request);
  if (authResponse) return authResponse;

  const { id } = await params;

  try {
    // Delete the invoice
    const invoice = await prisma.invoice.delete({
      where: { id }
    });

    // Add history entry
    if (invoice.orderId) {
      await prisma.orderHistory.create({
        data: {
          orderId: invoice.orderId,
          action: 'invoice_deleted',
          description: `Faktura ${invoice.invoiceNumber} została usunięta`,
          oldValue: invoice.invoiceNumber,
          metadata: { 
            deletedBy: 'Admin',
            invoiceId: invoice.id
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}