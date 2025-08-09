export function formatPrice(price: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export function calculateDiscount(price: number, regularPrice: number): number {
  return Math.round(((regularPrice - price) / regularPrice) * 100);
}