// src/app/admin/banners/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { BannersTable } from '@/components/admin/BannersTable';

async function getBanners() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' },
  });
  
  return banners;
}

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bannery</h1>
        <Link
          href="/admin/banners/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Přidat banner
        </Link>
      </div>

      <BannersTable banners={banners} />
    </div>
  );
}