// src/app/admin/categories/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/admin/CategoryForm';

async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id }
  });
  
  if (!category) {
    notFound();
  }
  
  return category;
}

export default async function EditCategoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const category = await getCategory(id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Upravit kategorii</h1>
      <CategoryForm initialData={category} />
    </div>
  );
}