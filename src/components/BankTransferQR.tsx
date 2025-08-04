// src/components/BankTransferQR.tsx
'use client';

import { useEffect, useState } from 'react';
import { generatePolishBankQR, generateEPCQRCode, BankTransferData } from '@/lib/qr-bank-transfer';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface BankTransferQRProps {
  orderNumber: string;
  amount: number;
  recipientAccount?: string;
  iban?: string;
}

type QRFormat = 'polish' | 'epc';

export default function BankTransferQR({
  orderNumber,
  amount,
  recipientAccount = '21291000062469800208837403',
  iban = 'PL21 2910 0006 2469 8002 0883 7403'
}: BankTransferQRProps) {
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

        // Generate both QR formats
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} skopiowano do schowka`);
  };

  const currentQR = qrCodes[selectedFormat];

  const qrFormats = [
    { 
      id: 'polish' as QRFormat, 
      name: 'Polski standard', 
      description: 'mBank, PKO BP, ING, Santander, Pekao',
      flag: '🇵🇱'
    },
    { 
      id: 'epc' as QRFormat, 
      name: 'Standard EU', 
      description: 'Banki europejskie, Revolut',
      flag: '🇪🇺'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        Kod QR do szybkiej płatności
      </h3>

      {/* QR Format Selector */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Wybierz format kodu QR dla swojego banku:</p>
        <div className="grid grid-cols-2 gap-2">
          {qrFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 font-medium justify-center">
                <span className="text-xl">{format.flag}</span>
                <span className="text-sm">{format.name}</span>
              </div>
              <div className="text-xs mt-1 text-gray-600 text-center">
                {format.description}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            {loading ? (
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : currentQR ? (
              <>
                <img 
                  src={currentQR} 
                  alt="QR kod do przelewu" 
                  className="w-64 h-64"
                />
                <p className="text-xs text-gray-600 text-center mt-2">
                  Zeskanuj kod QR w aplikacji bankowej
                </p>
              </>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p>Nie udało się wygenerować kodu QR</p>
                  <p className="text-xs mt-2">Spróbuj inny format</p>
                </div>
              </div>
            )}
          </div>
          
          {currentQR && (
            <a
              href={currentQR}
              download={`przelew-${selectedFormat}-zamowienie-${orderNumber}.png`}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Pobierz kod QR
            </a>
          )}
        </div>
        
        {/* Transfer Details */}
        <div className="space-y-4">
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-800 font-medium">
              💡 Wskazówka: Wybierz format odpowiedni dla Twojego banku
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Polski standard dla banków PL, Standard EU dla banków zagranicznych i Revolut
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Odbiorca</p>
              <p className="font-medium text-gray-900">Galaxysklep.pl</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Numer konta</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm text-gray-900">
                  {recipientAccount}
                </p>
                <button
                  onClick={() => copyToClipboard(recipientAccount, 'Numer konta')}
                  className="text-blue-600 hover:text-blue-700 p-1 touch-manipulation"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {iban && (
              <div>
                <p className="text-sm text-gray-600 mb-1">IBAN</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-gray-900 break-all">
                    {iban}
                  </p>
                  <button
                    onClick={() => copyToClipboard(iban.replace(/\s/g, ''), 'IBAN')}
                    className="text-blue-600 hover:text-blue-700 p-1 touch-manipulation"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Kwota</p>
              <p className="font-semibold text-lg text-gray-900">
                {amount.toFixed(2)} PLN
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Tytuł przelewu</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">
                  {orderNumber.replace(/-/g, '')}
                </p>
                <button
                  onClick={() => copyToClipboard(orderNumber.replace(/-/g, ''), 'Tytuł przelewu')}
                  className="text-blue-600 hover:text-blue-700 p-1 touch-manipulation"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Jak skanować kod QR?</strong>
        </p>
        <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
          <li>Otwórz aplikację swojego banku</li>
          <li>Wybierz opcję "Skanuj kod QR" lub "Płatność QR"</li>
          <li>Zeskanuj powyższy kod aparatem telefonu</li>
          <li>Potwierdź przelew w aplikacji</li>
        </ol>
      </div>
    </div>
  );
}