// src/lib/qr-bank-transfer.ts
import QRCode from 'qrcode';

export interface BankTransferData {
  recipientName: string;
  recipientAccount: string;
  amount: number;
  title: string;
  recipientAddress?: string;
  iban?: string; // Optional IBAN for international transfers
}

/**
 * Czech SPAYD QR kód generálása (cseh bankokkal működik)
 * Ezt a formátumot használják a cseh bankok mint ČSOB, Fio, KB, stb.
 */
export async function generateCzechSPAYDQR(data: BankTransferData): Promise<string> {
  // Czech SPAYD format
  // SPD*1.0*ACC:CZ1234567890123456789012*AM:1234.56*CC:CZK*MSG:Payment for order
  
  const accountNumber = data.iban || data.recipientAccount.replace(/\s/g, '');
  const amount = data.amount.toFixed(2);
  
  // Build SPAYD string
  const spaydData = [
    'SPD*1.0',
    `ACC:${accountNumber}`,
    `AM:${amount}`,
    'CC:HUF', // Currency changed to Hungarian Forint
    `MSG:${data.title}`,
    `RN:${data.recipientName}`
  ].join('*');
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(spaydData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256,
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating Czech SPAYD QR code:', error);
    throw new Error('Failed to generate Czech SPAYD QR code');
  }
}

/**
 * Magyar banki átutalási QR kód generálása (kompatibilis a lengyel formátummal)
 */
export async function generatePolishBankQR(data: BankTransferData): Promise<string> {
  // Hungarian/Polish QR code standard for bank transfers
  // Format: recipient|account|amount|title|address
  
  const accountNumber = data.recipientAccount.replace(/\s/g, '');
  const formattedAmount = data.amount.toFixed(2);
  
  const qrData = [
    data.recipientName,
    accountNumber,
    `HUF${formattedAmount}`, // Changed to HUF
    data.title,
    data.recipientAddress || ''
  ].join('|');
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256,
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating Polish QR code:', error);
    throw new Error('Failed to generate Polish QR code');
  }
}

/**
 * EPC QR kód generálása (európai szabvány - működik sok EU bankkal)
 * Ez a legáltalánosabb formátum európai bankok számára
 */
export async function generateEPCQRCode(data: BankTransferData): Promise<string> {
  // EPC QR Code format (European Payments Council)
  // Működik a legtöbb európai bankkal, beleértve a magyar és néhány cseh bankot is
  
  const iban = data.iban || `HU${data.recipientAccount.replace(/\s/g, '')}`;
  
  const epcData = [
    'BCD', // Service tag
    '002', // Version
    '1', // Character set (1 = UTF-8)
    'SCT', // Identification (SEPA Credit Transfer)
    '', // BIC (optional)
    data.recipientName.substring(0, 70), // Beneficiary name (max 70 chars)
    iban, // IBAN
    `HUF${data.amount.toFixed(2)}`, // Amount in HUF
    '', // Purpose (optional)
    '', // Structured reference (optional)
    data.title.substring(0, 140), // Unstructured remittance information (max 140 chars)
    '', // Beneficiary to originator information
  ].join('\n');
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(epcData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256,
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating EPC QR code:', error);
    throw new Error('Failed to generate EPC QR code');
  }
}

/**
 * Fő funkció - a legmegfelelőbb QR kód generálása
 * Alapértelmezetten az EPC formátumot használjuk (európai szabvány)
 */
export async function generateBankTransferQR(data: BankTransferData): Promise<string> {
  // Választható formátumok az igényeknek megfelelően:
  // - generatePolishBankQR magyar/lengyel bankokhoz
  // - generateCzechSPAYDQR cseh bankokhoz
  // - generateEPCQRCode univerzális európai formátum
  
  return generateEPCQRCode(data); // Changed default to EPC for Hungarian market
}

/**
 * Több QR kód generálása különböző banki szabványokhoz
 * Egy objektumot ad vissza különböző QR kód formátumokkal
 */
export async function generateMultipleQRCodes(data: BankTransferData): Promise<{
  polish?: string;
  czech?: string;
  epc?: string;
}> {
  const results: { polish?: string; czech?: string; epc?: string } = {};
  
  try {
    results.polish = await generatePolishBankQR(data);
  } catch (error) {
    console.error('Failed to generate Polish QR:', error);
  }
  
  try {
    results.czech = await generateCzechSPAYDQR(data);
  } catch (error) {
    console.error('Failed to generate Czech QR:', error);
  }
  
  try {
    results.epc = await generateEPCQRCode(data);
  } catch (error) {
    console.error('Failed to generate EPC QR:', error);
  }
  
  return results;
}