// src/app/admin/products/new/page.tsx
import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Přidat nový produkt</h1>
      <ProductForm />
    </div>
  );
}