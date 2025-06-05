// src/app/api/admin/invoices/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    if (!invoice.pdfUrl) {
      return NextResponse.json(
        { error: 'Invoice PDF not found' },
        { status: 404 }
      );
    }

    // Check if it's a Blob URL (starts with http)
    if (invoice.pdfUrl.startsWith('http')) {
      // Fetch the PDF from Blob storage
      const response = await fetch(invoice.pdfUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice from Blob storage');
      }
      
      const pdfBuffer = await response.arrayBuffer();
      
      // Return the PDF with download headers
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
        },
      });
    }
    
    // For backward compatibility with old local files (if any)
    // This shouldn't happen with new invoices
    return NextResponse.json(
      { error: 'Invalid invoice URL format' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Failed to download invoice:', error);
    return NextResponse.json(
      { error: 'Failed to download invoice' },
      { status: 500 }
    );
  }
}