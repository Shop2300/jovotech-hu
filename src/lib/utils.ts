export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export function calculateDiscount(price: number, regularPrice: number): number {
  return Math.round(((regularPrice - price) / regularPrice) * 100);
}