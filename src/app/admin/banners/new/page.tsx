// src/app/admin/banners/new/page.tsx
import { BannerForm } from '@/components/admin/BannerForm';

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Přidat nový banner</h1>
      <BannerForm />
    </div>
  );
}