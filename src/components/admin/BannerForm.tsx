// src/components/admin/BannerForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ImageUpload } from '@/components/ImageUpload';

interface BannerFormData {
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  order: number;
  isActive: boolean;
  type: string;
}

interface BannerFormProps {
  initialData?: BannerFormData & { id: string };
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<BannerFormData>({
    defaultValues: initialData || {
      title: '',
      subtitle: '',
      imageUrl: '',
      link: '',
      order: 0,
      isActive: true,
      type: 'hero',
    }
  });

  const onSubmit = async (data: BannerFormData) => {
    if (!imageUrl) {
      toast.error('Prosím nahrajte obrázek');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = initialData 
        ? `/api/admin/banners/${initialData.id}`
        : '/api/admin/banners';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to save banner');

      toast.success(initialData ? 'Banner byl aktualizován' : 'Banner byl přidán');
      router.push('/admin/banners');
      router.refresh();
    } catch (error) {
      toast.error('Chyba při ukládání banneru');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Název *</label>
          <input
            {...register('title', { required: 'Název je povinný' })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Podtitulek</label>
          <input
            {...register('subtitle')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          onRemove={() => setImageUrl('')}
          type="banners"
          label="Obrázek banneru (doporučeno 1920x600px pro hero)"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2">Odkaz (URL)</label>
          <input
            {...register('link')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="/category/electronics"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Typ banneru</label>
          <select
            {...register('type')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hero">Hero (hlavní)</option>
            <option value="category">Kategorie</option>
            <option value="promo">Promo</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Pořadí</label>
          <input
            type="number"
            {...register('order', { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('isActive')}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Banner je aktivní</span>
        </label>
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
          {isSubmitting ? 'Ukládám...' : (initialData ? 'Aktualizovat' : 'Přidat banner')}
        </button>
        
        <button
          type="button"
          onClick={() => router.push('/admin/banners')}
          className="px-6 py-2 border rounded-lg hover:bg-white transition"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}