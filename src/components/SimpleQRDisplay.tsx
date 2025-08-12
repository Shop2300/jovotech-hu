// src/components/SimpleQRDisplay.tsx
'use client';
import { useEffect, useState } from 'react';
import { generateEPCQRCode, BankTransferData } from '@/lib/qr-bank-transfer';

interface SimpleQRDisplayProps {
  orderNumber: string;
  amount: number;
  recipientAccount?: string;
  iban?: string;
}

export default function SimpleQRDisplay({
  orderNumber,
  amount,
  recipientAccount = '12600016-10426947-95638648',
  iban = 'HU86 1260 0016 1042 6947 9563 8648'
}: SimpleQRDisplayProps) {
  const [qrCode, setQrCode] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const transferData: BankTransferData = {
          recipientName: 'Jovotech.hu',
          recipientAccount,
          amount,
          title: orderNumber.replace(/-/g, ''),
          recipientAddress: 'Turnov, Liberecký kraj, CZ', // Updated to your actual address
          iban: iban.replace(/\s/g, '')
        };

        const epcQR = await generateEPCQRCode(transferData);
        setQrCode(epcQR);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [orderNumber, amount, recipientAccount, iban]);

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">QR kód az átutaláshoz:</p>
      
      {/* Info text */}
      <p className="text-xs text-gray-500 mb-2">
        🇭🇺 Magyar és 🇪🇺 EU banki alkalmazásokkal kompatibilis
      </p>

      {/* QR Code */}
      <div className="bg-white p-3 rounded border border-gray-200">
        {loading ? (
          <div className="w-full h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : qrCode ? (
          <img
            src={qrCode}
            alt="QR kód banki átutaláshoz"
            className="w-full h-auto max-w-[200px] mx-auto"
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-gray-400 text-xs">
            QR kód nem elérhető
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <p className="text-xs text-gray-600 mt-2">
        Nyissa meg banki alkalmazását és olvassa be a QR kódot az azonnali átutaláshoz.
      </p>
    </div>
  );
}