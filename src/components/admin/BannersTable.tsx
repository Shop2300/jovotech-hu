// src/components/admin/BannersTable.tsx
'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  order: number;
  isActive: boolean;
  type: string;
  createdAt: Date;
}

export function BannersTable({ banners: initialBanners }: { banners: Banner[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete banner "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setBanners(banners.filter(b => b.id !== id));
      toast.success('Banner has been deleted');
    } catch (error) {
      toast.error('Error deleting banner');
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...banner,
          isActive: !banner.isActive,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      setBanners(banners.map(b => 
        b.id === banner.id ? { ...b, isActive: !b.isActive } : b
      ));
      toast.success('Banner status has been changed');
    } catch (error) {
      toast.error('Error changing status');
    }
  };

  const typeLabels = {
    hero: 'Hero',
    category: 'Category',
    promo: 'Promo',
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-white">
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Banner</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Type</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Status</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Order</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-700">
                  No banners found
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner.id} className="border-b hover:bg-white">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={banner.imageUrl} 
                        alt={banner.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{banner.title}</div>
                        {banner.subtitle && (
                          <div className="text-sm text-gray-600">{banner.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {typeLabels[banner.type as keyof typeof typeLabels] || banner.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleActive(banner)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4 px-6">{banner.order}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/banners/${banner.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}