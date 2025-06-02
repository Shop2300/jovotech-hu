// src/components/admin/CategoryForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { createSlug } from '@/lib/slug';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  parentId: string | null;
}

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  parent?: {
    name: string;
  };
}

interface CategoryFormProps {
  initialData?: CategoryFormData & { id: string };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.image || '');
  const [categories, setCategories] = useState<Category[]>([]);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CategoryFormData>({
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      image: '',
      order: 0,
      isActive: true,
      parentId: null,
    }
  });

  const name = watch('name');
  const currentSlug = watch('slug');

  // Fetch categories for parent selection
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          // Filter out the current category and its descendants if editing
          if (initialData) {
            const filtered = data.filter((cat: Category) => {
              return cat.id !== initialData.id && !isDescendant(data, initialData.id, cat.id);
            });
            setCategories(filtered);
          } else {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, [initialData]);

  // Helper function to check if a category is a descendant
  function isDescendant(categories: Category[], ancestorId: string, categoryId: string): boolean {
    const category = categories.find(c => c.id === categoryId);
    if (!category || !category.parentId) return false;
    if (category.parentId === ancestorId) return true;
    return isDescendant(categories, ancestorId, category.parentId);
  }

  // Build category hierarchy for display
  function buildCategoryOptions(categories: Category[], parentId: string | null = null, level: number = 0): React.ReactElement[] {
    const options: React.ReactElement[] = [];
    const children = categories.filter(cat => cat.parentId === parentId);
    
    children.forEach(category => {
      const prefix = '— '.repeat(level);
      options.push(
        <option key={category.id} value={category.id}>
          {prefix}{category.name}
        </option>
      );
      options.push(...buildCategoryOptions(categories, category.id, level + 1));
    });
    
    return options;
  }

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!currentSlug || (initialData && createSlug(initialData.name) === currentSlug)) {
      setValue('slug', createSlug(value));
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    
    try {
      const url = initialData 
        ? `/api/admin/categories/${initialData.id}`
        : '/api/admin/categories';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          image: imageUrl,
          parentId: data.parentId || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      toast.success(initialData ? 'Kategorie byla aktualizována' : 'Kategorie byla přidána');
      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Chyba při ukládání kategorie');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Název *</label>
          <input
            {...register('name', { required: 'Název je povinný' })}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-black">URL slug *</label>
          <input
            {...register('slug', { 
              required: 'Slug je povinný',
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Pouze malá písmena, čísla a pomlčky'
              }
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="elektronika"
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">
            URL adresa kategorie bude: /category/{currentSlug || 'slug'}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-black">Nadřazená kategorie</label>
        <select
          {...register('parentId')}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Žádná (hlavní kategorie)</option>
          {buildCategoryOptions(categories)}
        </select>
        <p className="text-sm text-gray-600 mt-1">
          Vyberte nadřazenou kategorii pro vytvoření podkategorie
        </p>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-black">Popis</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mt-6">
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          onRemove={() => setImageUrl('')}
          type="products"
          label="Obrázek kategorie"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Pořadí</label>
          <input
            type="number"
            {...register('order', { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 mt-1">
            Nižší číslo = vyšší pozice
          </p>
        </div>
        
        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-black">Kategorie je aktivní</span>
          </label>
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            isSubmitting 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Ukládám...' : (initialData ? 'Aktualizovat' : 'Přidat kategorii')}
        </button>
        
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="px-6 py-2 border rounded-lg hover:bg-white transition"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}