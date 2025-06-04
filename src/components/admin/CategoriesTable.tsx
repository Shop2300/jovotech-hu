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
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const router = useRouter();

  // Function to get admin token from localStorage or cookie
  const getAdminToken = () => {
    const token = localStorage.getItem('adminToken');
    if (token) return token;
    
    // Fallback to cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'adminToken') return value;
    }
    return null;
  };

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
      const token = getAdminToken();
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }

      setCategories(categories.filter(c => c.id !== id));
      toast.success('Kategorie byla smazána');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Chyba při mazání kategorie');
    }
  };

  const toggleActive = async (category: Category) => {
    try {
      const token = getAdminToken();
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  const moveCategory = async (category: Category, direction: 'up' | 'down') => {
    setIsUpdatingOrder(true);
    
    try {
      // Get sibling categories (same parent)
      const siblings = categories
        .filter(c => c.parentId === category.parentId)
        .sort((a, b) => a.order - b.order);
      
      const currentIndex = siblings.findIndex(c => c.id === category.id);
      
      if ((direction === 'up' && currentIndex === 0) || 
          (direction === 'down' && currentIndex === siblings.length - 1)) {
        setIsUpdatingOrder(false);
        return; // Can't move further
      }
      
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const swapCategory = siblings[swapIndex];
      
      // If both categories have the same order, assign new order values
      let categoryNewOrder = swapCategory.order;
      let swapCategoryNewOrder = category.order;
      
      if (category.order === swapCategory.order) {
        // Categories have same order, need to create distinct values
        if (direction === 'up') {
          categoryNewOrder = category.order - 10;
          swapCategoryNewOrder = category.order;
        } else {
          categoryNewOrder = category.order + 10;
          swapCategoryNewOrder = category.order;
        }
      }
      
      // Prepare updates for both categories
      const updates = [
        { id: category.id, order: categoryNewOrder },
        { id: swapCategory.id, order: swapCategoryNewOrder }
      ];
      
      // Send update request
      const token = getAdminToken();
      const response = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ updates })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update order');
      }
      
      // Update local state
      setCategories(categories.map(c => {
        if (c.id === category.id) return { ...c, order: categoryNewOrder };
        if (c.id === swapCategory.id) return { ...c, order: swapCategoryNewOrder };
        return c;
      }));
      
      toast.success('Pořadí bylo změněno');
      
      // Optionally refresh the page to ensure consistency
      setTimeout(() => {
        router.refresh();
      }, 500);
      
    } catch (error) {
      toast.error('Chyba při změně pořadí: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUpdatingOrder(false);
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

    // Get sibling categories for up/down button visibility
    const siblings = categories.filter(c => c.parentId === category.parentId);
    siblings.sort((a, b) => a.order - b.order);
    const isFirst = siblings[0]?.id === category.id;
    const isLast = siblings[siblings.length - 1]?.id === category.id;

    return (
      <React.Fragment key={category.id}>
        <tr className="border-b hover:bg-gray-50">
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
              <div className="font-medium text-gray-900">{category.name}</div>
            </div>
          </td>
          <td className="py-4 px-6">
            <code className="px-2 py-1 bg-gray-100 rounded text-sm">{category.slug}</code>
          </td>
          <td className="py-4 px-6 text-gray-700">
            {category._count.products} produktů
            {category._count.children > 0 && (
              <span className="text-gray-500 ml-2">
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
          <td className="py-4 px-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">{category.order}</span>
              <div className="flex flex-col">
                <button
                  onClick={() => moveCategory(category, 'up')}
                  disabled={isFirst || isUpdatingOrder}
                  className={`p-1 rounded transition ${
                    isFirst || isUpdatingOrder
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Posunout nahoru"
                >
                  <MoveUp size={14} />
                </button>
                <button
                  onClick={() => moveCategory(category, 'down')}
                  disabled={isLast || isUpdatingOrder}
                  className={`p-1 rounded transition ${
                    isLast || isUpdatingOrder
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Posunout dolů"
                >
                  <MoveDown size={14} />
                </button>
              </div>
            </div>
          </td>
          <td className="py-4 px-6">
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                title="Upravit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(category.id, category.name, category._count.products, category._count.children)}
                className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                title="Smazat"
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
            <tr className="border-b bg-gray-50">
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
                <td colSpan={6} className="text-center py-8 text-gray-500">
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