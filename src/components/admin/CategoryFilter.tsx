// src/components/admin/CategoryFilter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;  // Changed from nameCs to name
  parentId: string | null;
  _count: {
    products: number;
  };
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
}

export function CategoryFilter({ categories, selectedCategoryId }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  // Build category hierarchy
  function buildCategoryOptions(cats: Category[], parentId: string | null = null, level: number = 0): React.ReactElement[] {
    const options: React.ReactElement[] = [];
    const children = cats.filter(cat => cat.parentId === parentId);
    
    children.forEach(category => {
      const prefix = '— '.repeat(level);
      options.push(
        <option key={category.id} value={category.id}>
          {prefix}{category.name} ({category._count.products})
        </option>
      );
      const subOptions = buildCategoryOptions(cats, category.id, level + 1);
      options.push(...subOptions);
    });
    
    return options;
  }
  
  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    router.push(`/admin/products${params.toString() ? '?' + params.toString() : ''}`);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    router.push(`/admin/products${params.toString() ? '?' + params.toString() : ''}`);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    router.push('/admin/products');
  };
  
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Filtrovat podle kategorie
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Všechny kategorie</option>
            {buildCategoryOptions(categories)}
          </select>
        </div>
        
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Vyhledat produkt
          </label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Název produktu, kód..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>
      
      {(selectedCategoryId !== 'all' || searchParams.get('search')) && (
        <div className="mt-4">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Vymazat všechny filtry
          </button>
        </div>
      )}
    </div>
  );
}