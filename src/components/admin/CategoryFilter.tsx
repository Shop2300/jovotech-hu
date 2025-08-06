// src/components/admin/CategoryFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.category-filter-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

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

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all') {
      params.set('category', value);
      params.set('page', '1'); // Reset to first page when changing category
    } else {
      params.delete('category');
      params.delete('page');
    }
    
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false); // Close dropdown on mobile after selection
  };

  // Build category options hierarchy
  function buildCategoryOptions(cats: Category[], parentId: string | null = null, level: number = 0): React.ReactElement[] {
    const options: React.ReactElement[] = [];
    const children = cats.filter(cat => cat.parentId === parentId);
    
    children.forEach(category => {
      const prefix = '— '.repeat(level);
      const isSelected = selectedCategory === category.id;
      
      options.push(
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={`
            w-full text-left px-3 py-2.5 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors
            ${isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
            text-sm sm:text-base
          `}
        >
          <span className={level > 0 ? 'pl-4' : ''}>{prefix}{category.name}</span>
        </button>
      );
      const subOptions = buildCategoryOptions(cats, category.id, level + 1);
      options.push(...subOptions);
    });
    
    return options;
  }

  // Get selected category name
  const getSelectedCategoryName = () => {
    if (!selectedCategory || selectedCategory === 'all') return 'Všechny kategorie';
    const cat = categories.find(c => c.id === selectedCategory);
    return cat ? cat.name : 'Všechny kategorie';
  };

  if (isLoading) {
    return (
      <div className="w-full sm:w-64 category-filter-container">
        <div className="w-full px-3 py-2.5 sm:py-2 border rounded-lg bg-gray-100 text-gray-500 text-sm sm:text-base">
          Načítání kategorií...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-64 relative category-filter-container">
      {/* Mobile and Desktop Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2.5 sm:py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          bg-white hover:bg-gray-50 transition-colors
          flex items-center justify-between
          text-sm sm:text-base min-h-[44px] sm:min-h-[40px]
        `}
      >
        <span className="truncate pr-2">{getSelectedCategoryName()}</span>
        <ChevronDown 
          size={18} 
          className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg
          max-h-[60vh] sm:max-h-96 overflow-y-auto
          ${categories.length > 10 ? 'pb-2' : ''}
        `}>
          <button
            onClick={() => handleCategoryChange('all')}
            className={`
              w-full text-left px-3 py-2.5 sm:py-2 hover:bg-gray-100 active:bg-gray-200
              border-b transition-colors text-sm sm:text-base
              ${!selectedCategory || selectedCategory === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
            `}
          >
            Všechny kategorie
          </button>
          <div className="py-1">
            {buildCategoryOptions(categories)}
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}