// src/app/admin/categories/new/page.tsx
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Přidat novou kategorii</h1>
      <CategoryForm />
    </div>
  );
}