// src/app/api/admin/invoices/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch the invoice with order info
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

    // Create history entry before deletion
    await prisma.orderHistory.create({
      data: {
        orderId: invoice.orderId,
        action: 'invoice_deleted',
        description: `Faktura ${invoice.invoiceNumber} byla smazána`,
        oldValue: invoice.invoiceNumber,
        metadata: {
          invoiceId: invoice.id,
          deletedAt: new Date().toISOString()
        }
      }
    });

    // Delete the PDF file if it exists
    if (invoice.pdfUrl) {
      try {
        const filePath = join(process.cwd(), 'public', invoice.pdfUrl);
        await unlink(filePath);
      } catch (error) {
        console.error('Failed to delete PDF file:', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the invoice from database
    await prisma.invoice.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}