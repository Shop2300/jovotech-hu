// src/app/admin/banners/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { BannerForm } from '@/components/admin/BannerForm';
import { notFound } from 'next/navigation';

async function getBanner(id: string) {
  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  return banner;
}

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await getBanner(id);

  if (!banner) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Upravit banner</h1>
      <BannerForm initialData={banner} />
    </div>
  );
}