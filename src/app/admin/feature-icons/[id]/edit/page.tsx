// src/app/admin/feature-icons/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { FeatureIconForm } from '@/components/admin/FeatureIconForm';
import { notFound } from 'next/navigation';

async function getFeatureIcon(id: string) {
  const icon = await prisma.featureIcon.findUnique({
    where: { id },
  });

  return icon;
}

export default async function EditFeatureIconPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const icon = await getFeatureIcon(id);

  if (!icon) {
    notFound();
  }

  // Map the data to use Czech fields as the main fields
  const mappedIcon = {
    ...icon,
    title: icon.titleCs || icon.title,  // Prefer Czech, fallback to English
    description: icon.descriptionCs || icon.description,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Upravit ikonu funkce</h1>
      <FeatureIconForm initialData={mappedIcon} />
    </div>
  );
}