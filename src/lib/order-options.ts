// src/lib/order-options.ts
import { Truck, Building2, Banknote, CreditCard } from 'lucide-react';

export interface DeliveryMethod {
  value: string;
  label: string;
  labelPl: string;
  description?: string;
  descriptionPl?: string;
  icon: any;
  price: number;
}

export interface PaymentMethod {
  value: string;
  label: string;
  labelPl: string;
  description?: string;
  descriptionPl?: string;
  icon: any;
}

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    value: 'zasilkovna',
    label: 'Doručení kurýrem',
    labelPl: 'Najwygodniejsza dostawa',
    description: 'Doručíme balík až k vám domů prostřednictvím přepravní společnosti. Vybíráme mezi DPD, InPost, DHL nebo Českou poštou.',
    descriptionPl: 'Dostarczymy paczkę do Twojego domu za pośrednictwem firmy spedycyjnej. Wybieramy pomiędzy DPD, InPost, DHL lub Pocztą Polską.',
    icon: Truck,
    price: 0
  },
  {
    value: 'pickup',
    label: 'Osobní odběr',
    labelPl: 'Odbiór osobisty',
    description: 'Vyzvedněte si objednávku osobně v našem skladu',
    descriptionPl: 'Odbierz zamówienie osobiście w naszym magazynie',
    icon: Building2,
    price: 0
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    value: 'bank',
    label: 'Bankovní převod',
    labelPl: 'Przelew bankowy',
    description: 'Platba převodem na účet',
    descriptionPl: 'Płatność przelewem na konto',
    icon: Building2
  },
  {
    value: 'cash',
    label: 'Platba na dobírku',
    labelPl: 'Płatność za pobraniem',
    description: 'Platba při převzetí',
    descriptionPl: 'Płatność przy odbiorze',
    icon: Banknote
  },
  {
    value: 'card',
    label: 'Platba kartou online',
    labelPl: 'Płatność kartą online',
    description: 'Okamžitá platba kartou',
    descriptionPl: 'Natychmiastowa płatność kartą',
    icon: CreditCard
  }
];

// Helper functions to get labels
export function getDeliveryMethodLabel(value: string, locale: 'cs' | 'pl' = 'pl'): string {
  const method = DELIVERY_METHODS.find(m => m.value === value);
  if (!method) return value;
  return locale === 'pl' ? method.labelPl : method.label;
}

export function getPaymentMethodLabel(value: string, locale: 'cs' | 'pl' = 'pl'): string {
  const method = PAYMENT_METHODS.find(m => m.value === value);
  if (!method) return value;
  return locale === 'pl' ? method.labelPl : method.label;
}

export function getDeliveryMethod(value: string): DeliveryMethod | undefined {
  return DELIVERY_METHODS.find(m => m.value === value);
}

export function getPaymentMethod(value: string): PaymentMethod | undefined {
  return PAYMENT_METHODS.find(m => m.value === value);
}