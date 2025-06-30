// src/components/admin/FeatureIconForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ImageUpload } from '@/components/ImageUpload';

interface FeatureIconFormData {
  key: string;
  title: string;  // Will be used for Czech only
  description: string | null;  // Will be used for Czech only
  imageUrl: string | null;
  emoji: string | null;
  order: number;
  isActive: boolean;
}

interface FeatureIconFormProps {
  initialData?: FeatureIconFormData & { id: string };
}

export function FeatureIconForm({ initialData }: FeatureIconFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FeatureIconFormData>({
    defaultValues: initialData || {
      key: '',
      title: '',
      description: '',
      imageUrl: '',
      emoji: '',
      order: 0,
      isActive: true,
    }
  });

  const onSubmit = async (data: FeatureIconFormData) => {
    setIsSubmitting(true);
    
    try {
      const url = initialData 
        ? `/api/admin/feature-icons/${initialData.id}`
        : '/api/admin/feature-icons';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Map to both fields for backward compatibility
          title: data.title,  // English field
          titleCs: data.title,  // Czech field - same value
          description: data.description,
          descriptionCs: data.description,
          imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to save feature icon');

      toast.success(initialData ? 'Icon has been updated' : 'Icon has been added');
      router.push('/admin/feature-icons');
      router.refresh();
    } catch (error) {
      toast.error('Error saving icon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Key (unique identifier) *</label>
          <input
            {...register('key', { 
              required: 'Key is required',
              pattern: {
                value: /^[a-z0-9_]+$/,
                message: 'Only lowercase letters, numbers and underscores'
              }
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="zasilkovna"
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Emoji (fallback icon)</label>
          <input
            {...register('emoji')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="📦"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Free shipping"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Description</label>
          <input
            {...register('description')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. On orders over $50"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          onRemove={() => setImageUrl('')}
          type="products"
          label="Icon (recommended 64x64px or SVG)"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">Order</label>
          <input
            type="number"
            {...register('order', { valueAsNumber: true })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Icon is active</span>
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
          {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Add Icon')}
        </button>
        
        <button
          type="button"
          onClick={() => router.push('/admin/feature-icons')}
          className="px-6 py-2 border rounded-lg hover:bg-white transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}