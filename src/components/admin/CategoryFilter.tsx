// src/components/admin/CategoryFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface CategoryFilterProps {
  selectedCategory?: string;
}

export function CategoryFilter({ selectedCategory }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all') {
      params.set('category', value);
      params.set('page', '1'); // Reset to first page when changing category
    } else {
      params.delete('category');
      params.delete('page');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Build category options hierarchy
  function buildCategoryOptions(cats: Category[], parentId: string | null = null, level: number = 0): React.ReactElement[] {
    const options: React.ReactElement[] = [];
    const children = cats.filter(cat => cat.parentId === parentId);
    
    children.forEach(category => {
      const prefix = '— '.repeat(level);
      options.push(
        <option key={category.id} value={category.id}>
          {prefix}{category.name}
        </option>
      );
      const subOptions = buildCategoryOptions(cats, category.id, level + 1);
      options.push(...subOptions);
    });
    
    return options;
  }

  if (isLoading) {
    return (
      <div className="w-64">
        <select className="w-full px-3 py-2 border rounded-lg bg-gray-100" disabled>
          <option>Načítání kategorií...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="w-64">
      <select
        value={selectedCategory || 'all'}
        onChange={handleCategoryChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Všechny kategorie</option>
        {buildCategoryOptions(categories)}
      </select>
    </div>
  );
}