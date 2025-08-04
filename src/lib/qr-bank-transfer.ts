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
 * Generates a Czech SPAYD QR code (works with Czech banks)
 * This format is used by Czech banks like ČSOB, Fio, KB, etc.
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
    'CC:PLN', // Currency
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
 * Generates a Polish bank transfer QR code (format zgodny z polskimi standardami)
 */
export async function generatePolishBankQR(data: BankTransferData): Promise<string> {
  // Polish QR code standard for bank transfers
  // Format: recipient|account|amount|title|address
  
  const accountNumber = data.recipientAccount.replace(/\s/g, '');
  const formattedAmount = data.amount.toFixed(2);
  
  const qrData = [
    data.recipientName,
    accountNumber,
    `PLN${formattedAmount}`,
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
 * Generates an EPC QR code (European standard - works with many EU banks)
 * This is the most universal format for European banks
 */
export async function generateEPCQRCode(data: BankTransferData): Promise<string> {
  // EPC QR Code format (European Payments Council)
  // This should work with most European banks including Polish and some Czech banks
  
  const iban = data.iban || `PL${data.recipientAccount.replace(/\s/g, '')}`;
  
  const epcData = [
    'BCD', // Service tag
    '002', // Version
    '1', // Character set (1 = UTF-8)
    'SCT', // Identification (SEPA Credit Transfer)
    '', // BIC (optional)
    data.recipientName.substring(0, 70), // Beneficiary name (max 70 chars)
    iban, // IBAN
    `PLN${data.amount.toFixed(2)}`, // Amount in PLN
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
 * Main function - generates the most appropriate QR code
 * For now, we'll use Polish format as default
 */
export async function generateBankTransferQR(data: BankTransferData): Promise<string> {
  // You can change this to use different formats based on your needs:
  // - generatePolishBankQR for Polish banks only
  // - generateCzechSPAYDQR for Czech banks
  // - generateEPCQRCode for universal European format
  
  return generatePolishBankQR(data);
}

/**
 * Generates multiple QR codes for different bank standards
 * Returns an object with different QR code formats
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