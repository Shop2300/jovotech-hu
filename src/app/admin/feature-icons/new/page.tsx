// src/app/admin/feature-icons/new/page.tsx
import { FeatureIconForm } from '@/components/admin/FeatureIconForm';

export default function NewFeatureIconPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Přidat novou ikonu funkce</h1>
      <FeatureIconForm />
    </div>
  );
}