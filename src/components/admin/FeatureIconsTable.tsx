// src/components/admin/FeatureIconsTable.tsx
'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface FeatureIcon {
  id: string;
  key: string;
  title: string;
  titleCs: string;
  description: string | null;
  descriptionCs: string | null;
  imageUrl: string | null;
  emoji: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

export function FeatureIconsTable({ icons: initialIcons }: { icons: FeatureIcon[] }) {
  const [icons, setIcons] = useState(initialIcons);
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Opravdu chcete smazat ikonu "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/feature-icons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setIcons(icons.filter(i => i.id !== id));
      toast.success('Ikona byla smazána');
    } catch (error) {
      toast.error('Chyba při mazání ikony');
    }
  };

  const toggleActive = async (icon: FeatureIcon) => {
    try {
      const response = await fetch(`/api/admin/feature-icons/${icon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...icon,
          isActive: !icon.isActive,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      setIcons(icons.map(i => 
        i.id === icon.id ? { ...i, isActive: !i.isActive } : i
      ));
      toast.success('Stav ikony byl změněn');
    } catch (error) {
      toast.error('Chyba při změně stavu');
    }
  };

  const moveIcon = async (icon: FeatureIcon, direction: 'up' | 'down') => {
    const currentIndex = icons.findIndex(i => i.id === icon.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= icons.length) return;

    const otherIcon = icons[newIndex];
    
    try {
      // Swap orders
      await Promise.all([
        fetch(`/api/admin/feature-icons/${icon.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...icon, order: otherIcon.order }),
        }),
        fetch(`/api/admin/feature-icons/${otherIcon.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...otherIcon, order: icon.order }),
        }),
      ]);

      // Update local state
      const newIcons = [...icons];
      newIcons[currentIndex] = { ...icon, order: otherIcon.order };
      newIcons[newIndex] = { ...otherIcon, order: icon.order };
      setIcons(newIcons.sort((a, b) => a.order - b.order));
      
      toast.success('Pořadí bylo změněno');
    } catch (error) {
      toast.error('Chyba při změně pořadí');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Ikona</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Klíč</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Název</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Stav</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Pořadí</th>
              <th className="text-left py-3 px-6 text-gray-700 font-semibold">Akce</th>
            </tr>
          </thead>
          <tbody>
            {icons.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  <div className="space-y-2">
                    <p>Žádné ikony nenalezeny</p>
                    <p className="text-sm">Přidejte první ikonu nebo spusťte seed script pro přidání výchozích ikon:</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">node seed-feature-icons.js</code>
                  </div>
                </td>
              </tr>
            ) : (
              icons.map((icon, index) => (
                <tr key={icon.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {icon.imageUrl ? (
                        <img 
                          src={icon.imageUrl} 
                          alt={icon.titleCs || icon.title}
                          className="w-12 h-12 object-contain rounded"
                        />
                      ) : icon.emoji ? (
                        <span className="text-3xl">{icon.emoji}</span>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No icon</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm">{icon.key}</code>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{icon.titleCs || icon.title}</div>
                      {(icon.descriptionCs || icon.description) && (
                        <div className="text-sm text-gray-600">{icon.descriptionCs || icon.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleActive(icon)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        icon.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {icon.isActive ? 'Aktivní' : 'Neaktivní'}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveIcon(icon, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded transition disabled:opacity-30"
                      >
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={() => moveIcon(icon, 'down')}
                        disabled={index === icons.length - 1}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded transition disabled:opacity-30"
                      >
                        <MoveDown size={16} />
                      </button>
                      <span className="text-sm text-gray-600 w-8 text-center">{icon.order}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/feature-icons/${icon.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(icon.id, icon.titleCs || icon.title)}
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