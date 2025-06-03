// src/components/admin/CategoriesTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown, Package, ChevronRight, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  parentId: string | null;
  parent?: {
    id: string;
    name: string;
  };
  children?: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
  _count: {
    products: number;
    children: number;
  };
}

interface CategoryWithChildren extends Category {
  childCategories?: CategoryWithChildren[];
}

export function CategoriesTable({ categories: initialCategories }: { categories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('Categories data:', categories);
    console.log('Categories with children:', categories.filter(c => c._count.children > 0));
  }, [categories]);

  // Build hierarchical structure
  const buildHierarchy = (cats: Category[]): CategoryWithChildren[] => {
    const categoryMap: { [key: string]: CategoryWithChildren } = {};
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all categories with childCategories array
    cats.forEach(cat => {
      categoryMap[cat.id] = { ...cat, childCategories: [] };
    });

    // Second pass: build hierarchy
    cats.forEach(cat => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].childCategories!.push(categoryMap[cat.id]);
      } else if (!cat.parentId) {
        rootCategories.push(categoryMap[cat.id]);
      }
    });

    // Sort each level by order
    const sortCategories = (categories: CategoryWithChildren[]) => {
      categories.sort((a, b) => a.order - b.order);
      categories.forEach(cat => {
        if (cat.childCategories && cat.childCategories.length > 0) {
          sortCategories(cat.childCategories);
        }
      });
    };

    sortCategories(rootCategories);
    
    console.log('Hierarchical structure:', rootCategories);
    
    return rootCategories;
  };

  const hierarchicalCategories = buildHierarchy(categories);

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDelete = async (id: string, name: string, productCount: number, childCount: number) => {
    if (productCount > 0) {
      toast.error(`Nelze smazat kategorii s ${productCount} produkty`);
      return;
    }

    if (childCount > 0) {
      toast.error(`Nelze smazat kategorii s ${childCount} podkategoriemi`);
      return;
    }

    if (!confirm(`Opravdu chcete smazat kategorii "${name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }

      setCategories(categories.filter(c => c.id !== id));
      toast.success('Kategorie byla smazána');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Chyba při mazání kategorie');
    }
  };

  const toggleActive = async (category: Category) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...category,
          isActive: !category.isActive,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      setCategories(categories.map(c => 
        c.id === category.id ? { ...c, isActive: !c.isActive } : c
      ));
      toast.success('Stav kategorie byl změněn');
    } catch (error) {
      toast.error('Chyba při změně stavu');
    }
  };

  const renderCategory = (category: CategoryWithChildren, level: number = 0): React.ReactNode => {
    const hasChildren = category.childCategories && category.childCategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    // Filter by search term
    if (searchTerm) {
      const matches = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     category.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matches && hasChildren) {
        // Check if any children match
        const childrenMatch = category.childCategories?.some(child => 
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!childrenMatch) return null;
      } else if (!matches) {
        return null;
      }
    }

    return (
      <React.Fragment key={category.id}>
        <tr className="border-b hover:bg-white">
          <td className="py-4 px-6">
            <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 2}rem` }}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <div className="w-6" />
              )}
              
              {category.image ? (
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <Package size={20} className="text-gray-500" />
                </div>
              )}
              <div className="font-medium text-black">{category.name}</div>
            </div>
          </td>
          <td className="py-4 px-6">
            <code className="px-2 py-1 bg-gray-100 rounded text-sm">{category.slug}</code>
          </td>
          <td className="py-4 px-6 text-black">
            {category._count.products} produktů
            {category._count.children > 0 && (
              <span className="text-gray-600 ml-2">
                ({category._count.children} podkategorií)
              </span>
            )}
          </td>
          <td className="py-4 px-6">
            <button
              onClick={() => toggleActive(category)}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                category.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {category.isActive ? 'Aktivní' : 'Neaktivní'}
            </button>
          </td>
          <td className="py-4 px-6 text-center text-black">
            {category.order}
          </td>
          <td className="py-4 px-6">
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(category.id, category.name, category._count.products, category._count.children)}
                className="p-2 text-red-600 hover:bg-red-100 rounded transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && hasChildren && (category.childCategories?.map(child => renderCategory(child, level + 1)) || null)}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <input
          type="text"
          placeholder="Hledat kategorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-white">
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Kategorie</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Slug</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Produkty</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Stav</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Pořadí</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Akce</th>
            </tr>
          </thead>
          <tbody>
            {hierarchicalCategories.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-700">
                  Žádné kategorie nenalezeny
                </td>
              </tr>
            ) : (
              hierarchicalCategories.map(category => renderCategory(category))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}