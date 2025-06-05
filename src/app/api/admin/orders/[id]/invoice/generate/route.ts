// src/app/api/admin/orders/[id]/invoice/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice-pdf-generator';
import { put } from '@vercel/blob';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: { invoice: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if invoice already exists
    if (order.invoice) {
      return NextResponse.json({
        invoice: order.invoice,
        message: 'Invoice already exists'
      });
    }

    // Generate invoice number (same as order number for consistency)
    const invoiceNumber = `FAK${new Date().getFullYear()}${order.orderNumber}`;
    
    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Calculate VAT
    const vatRate = 0.21;
    const totalAmount = Number(order.total);
    const vatAmount = totalAmount - (totalAmount / (1 + vatRate));

    // Create invoice record in database
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        dueDate,
        totalAmount,
        vatAmount,
        status: 'issued'
      }
    });

    // Create history entry for invoice generation
    await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        action: 'invoice_generated',
        description: `Faktura ${invoiceNumber} byla vygenerována`,
        newValue: invoiceNumber,
        metadata: {
          invoiceId: invoice.id,
          totalAmount: totalAmount,
          vatAmount: vatAmount
        }
      }
    });

    // Prepare invoice data
    const items = order.items as any[];
    const invoiceData = {
      invoiceNumber,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      billingFirstName: order.billingFirstName || order.firstName,
      billingLastName: order.billingLastName || order.lastName,
      billingAddress: order.billingAddress || order.address,
      billingCity: order.billingCity || order.city,
      billingPostalCode: order.billingPostalCode || order.postalCode,
      items: items,
      total: totalAmount,
      paymentMethod: order.paymentMethod,
      deliveryMethod: order.deliveryMethod,
    };

    // Generate PDF
    const pdf = generateInvoicePDF(invoiceData);
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Upload PDF to Vercel Blob Storage
    const fileName = `${invoiceNumber.replace(/\//g, '-')}.pdf`;
    const blob = await put(`invoices/${fileName}`, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: true,  // Allow overwriting existing files
    });

    // Update invoice with Blob URL
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { pdfUrl: blob.url }
    });

    return NextResponse.json({
      invoice: updatedInvoice,
      message: 'Invoice generated successfully',
      url: blob.url
    });

  } catch (error) {
    console.error('Failed to generate invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}