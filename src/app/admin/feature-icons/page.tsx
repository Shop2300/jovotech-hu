// src/app/admin/feature-icons/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { FeatureIconsTable } from '@/components/admin/FeatureIconsTable';

async function getFeatureIcons() {
  const icons = await prisma.featureIcon.findMany({
    orderBy: { order: 'asc' },
  });
  
  return icons;
}

export default async function AdminFeatureIconsPage() {
  const icons = await getFeatureIcons();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Ikony funkcí</h1>
        <Link
          href="/admin/feature-icons/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Přidat ikonu
        </Link>
      </div>

      <FeatureIconsTable icons={icons} />
    </div>
  );
}