// src/components/LayoutWrapper.tsx
import { Header } from '@/components/Header';
import { CategoryBar } from '@/components/CategoryBar';
import { PromotionalBarClient } from '@/components/PromotionalBarClient';
import { prisma } from '@/lib/prisma';

async function getCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      parentId: true,
    },
    orderBy: {
      order: 'asc'
    }
  });

  // Build hierarchy
  const categoryMap: { [key: string]: any } = {};
  const rootCategories: any[] = [];

  categories.forEach(cat => {
    categoryMap[cat.id] = {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      children: []
    };
  });

  categories.forEach(cat => {
    if (cat.parentId && categoryMap[cat.parentId]) {
      categoryMap[cat.parentId].children.push(categoryMap[cat.id]);
    } else if (!cat.parentId) {
      rootCategories.push(categoryMap[cat.id]);
    }
  });

  return rootCategories;
}

export async function LayoutWrapper() {
  const categories = await getCategories();

  return (
    <>
      <PromotionalBarClient />
      <Header />
      <CategoryBar initialCategories={categories} />
    </>
  );
}