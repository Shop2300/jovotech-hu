// src/components/SimpleQRDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { generatePolishBankQR, generateEPCQRCode, BankTransferData } from '@/lib/qr-bank-transfer';

interface SimpleQRDisplayProps {
  orderNumber: string;
  amount: number;
  recipientAccount?: string;
  iban?: string;
}

type QRFormat = 'polish' | 'epc';

export default function SimpleQRDisplay({
  orderNumber,
  amount,
  recipientAccount = '21291000062469800208837403',
  iban = 'PL21 2910 0006 2469 8002 0883 7403'
}: SimpleQRDisplayProps) {
  const [qrCodes, setQrCodes] = useState<{ polish?: string; epc?: string }>({});
  const [selectedFormat, setSelectedFormat] = useState<QRFormat>('polish');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQRs = async () => {
      try {
        const transferData: BankTransferData = {
          recipientName: 'Galaxysklep.pl',
          recipientAccount,
          amount,
          title: orderNumber.replace(/-/g, ''),
          recipientAddress: 'Dobra 40, 00-344 Warszawa',
          iban: iban.replace(/\s/g, '')
        };

        const [polishQR, epcQR] = await Promise.allSettled([
          generatePolishBankQR(transferData),
          generateEPCQRCode(transferData)
        ]);

        setQrCodes({
          polish: polishQR.status === 'fulfilled' ? polishQR.value : undefined,
          epc: epcQR.status === 'fulfilled' ? epcQR.value : undefined
        });
      } catch (error) {
        console.error('Failed to generate QR codes:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQRs();
  }, [orderNumber, amount, recipientAccount, iban]);

  const currentQR = qrCodes[selectedFormat];

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Kod QR do przelewu:</p>
      
      {/* Format selector - compact */}
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => setSelectedFormat('polish')}
          className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
            selectedFormat === 'polish'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🇵🇱 PL
        </button>
        <button
          onClick={() => setSelectedFormat('epc')}
          className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
            selectedFormat === 'epc'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🇪🇺 EU
        </button>
      </div>
      
      {/* QR Code */}
      <div className="bg-white p-2 rounded border border-gray-200">
        {loading ? (
          <div className="w-full h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : currentQR ? (
          <img 
            src={currentQR} 
            alt="QR kod" 
            className="w-full h-auto"
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-gray-400 text-xs">
            Brak QR
          </div>
        )}
      </div>
    </div>
  );
}