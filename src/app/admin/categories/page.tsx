// src/app/admin/categories/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CategoriesTable } from '@/components/admin/CategoriesTable';

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
        }
      },
      children: {
        select: {
          id: true,
          name: true,
        }
      },
      _count: {
        select: { 
          products: true,
          children: true 
        }
      }
    }
  });
  
  return categories;
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kategorie</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Přidat kategorii
        </Link>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
}