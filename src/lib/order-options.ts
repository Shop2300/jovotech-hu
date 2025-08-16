// src/lib/order-options.ts
import { Truck, Building2, Banknote } from 'lucide-react';

export interface DeliveryMethod {
  value: string;
  label: string;
  description?: string;
  icon: any;
  price: number;
}

export interface PaymentMethod {
  value: string;
  label: string;
  description?: string;
  icon: any;
  price: number;
}

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    value: 'zasilkovna',
    label: 'Legkényelmesebb szállítás',
    description: 'A csomagot közvetlenül az Ön otthonába szállítjuk futárszolgálattal. DPD, InPost, DHL vagy Magyar Posta közül választunk.',
    icon: Truck,
    price: 0
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    value: 'bank',
    label: 'Banki átutalás',
    description: 'Fizetés banki átutalással',
    icon: Building2,
    price: 0
  }
];

// Helper functions to get labels
export function getDeliveryMethodLabel(value: string): string {
  const method = DELIVERY_METHODS.find(m => m.value === value);
  if (!method) return value;
  return method.label;
}

export function getPaymentMethodLabel(value: string): string {
  const method = PAYMENT_METHODS.find(m => m.value === value);
  if (!method) return value;
  return method.label;
}

export function getDeliveryMethod(value: string): DeliveryMethod | undefined {
  return DELIVERY_METHODS.find(m => m.value === value);
}

export function getPaymentMethod(value: string): PaymentMethod | undefined {
  return PAYMENT_METHODS.find(m => m.value === value);
}