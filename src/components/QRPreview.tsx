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
          recipientName: 'Galaxysklep.pl',
          recipientAccount: '21291000062469800208837403',
          amount,
          title: 'ZAMOWIENIE',
          recipientAddress: 'Dobra 40, 00-344 Warszawa'
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
        alt="QR kod przykład" 
        className="w-20 h-20 opacity-80"
      />
      <p className="text-xs text-gray-600 mt-1">Płać kodem QR</p>
    </div>
  );
}