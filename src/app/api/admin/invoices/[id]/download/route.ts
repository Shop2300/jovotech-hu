// src/app/api/admin/invoices/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile } from 'fs/promises';
import { join } from 'path';

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

    // Read the PDF file
    const filePath = join(process.cwd(), 'public', invoice.pdfUrl);
    const pdfBuffer = await readFile(filePath);

    // Return the PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Failed to download invoice:', error);
    return NextResponse.json(
      { error: 'Failed to download invoice' },
      { status: 500 }
    );
  }
}