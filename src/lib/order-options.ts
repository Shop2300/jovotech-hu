// src/lib/order-options.ts
import { Truck, Building2, Banknote } from 'lucide-react';

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
  price: number; // Added price field
}

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    value: 'zasilkovna',
    label: 'Futárszolgálat',
    labelPl: 'Legkényelmesebb szállítás',
    description: 'A csomagot közvetlenül az Ön otthonába szállítjuk futárszolgálattal. DPD, InPost, DHL vagy Magyar Posta közül választunk.',
    descriptionPl: 'A csomagot közvetlenül az Ön otthonába szállítjuk futárszolgálattal. DPD, InPost, DHL vagy Magyar Posta közül választunk.',
    icon: Truck,
    price: 0
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    value: 'bank',
    label: 'Banki átutalás',
    labelPl: 'Banki átutalás',
    description: 'Fizetés banki átutalással',
    descriptionPl: 'Fizetés banki átutalással',
    icon: Building2,
    price: 0 // Free
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