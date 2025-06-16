// src/app/api/admin/invoices/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth-middleware';
import { del } from '@vercel/blob';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await checkAuth(request);
  if (authResponse) return authResponse;

  const { id } = await params;

  try {
    // Fetch the invoice to get the PDF URL before deletion
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { order: true }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Delete the blob from Vercel Blob Storage if it exists
    if (invoice.pdfUrl) {
      try {
        await del(invoice.pdfUrl);
        console.log(`Deleted blob: ${invoice.pdfUrl}`);
      } catch (blobError) {
        // Log the error but don't fail the operation
        // The blob might already be deleted or the URL might be invalid
        console.error('Failed to delete blob:', blobError);
      }
    }

    // Delete the invoice record
    await prisma.invoice.delete({
      where: { id }
    });

    // Add to order history
    if (invoice.order) {
      await prisma.orderHistory.create({
        data: {
          orderId: invoice.order.id,
          action: 'invoice_deleted',
          description: `Faktura ${invoice.invoiceNumber} byla smazána`,
          oldValue: invoice.invoiceNumber,
          metadata: {
            deletedBy: 'Admin',
            invoiceId: invoice.id
          }
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Invoice deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}