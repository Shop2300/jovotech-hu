// src/components/QRPreview.tsx
'use client';

import { useEffect, useState } from 'react';
import { generatePolishBankQR, BankTransferData } from '@/lib/qr-bank-transfer';

interface QRPreviewProps {
  amount?: number;
}

export default function QRPreview({ amount = 100 }: QRPreviewProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const transferData: BankTransferData = {
          recipientName: 'Jovotech.hu',
          recipientAccount: '12600016-10426947-95638648',
          amount,
          title: 'RENDELES',
          recipientAddress: '1. máje 535/50, 46007 Liberec'
        };

        const qr = await generatePolishBankQR(transferData);
        setQrCode(qr);
      } catch (error) {
        console.error('Failed to generate preview QR:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [amount]);

  if (loading) {
    return (
      <div className="w-20 h-20 bg-gray-100 rounded animate-pulse" />
    );
  }

  if (!qrCode) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <img 
        src={qrCode} 
        alt="QR kód példa" 
        className="w-20 h-20 opacity-80"
      />
      <p className="text-xs text-gray-600 mt-1">Fizessen QR kóddal</p>
    </div>
  );
}