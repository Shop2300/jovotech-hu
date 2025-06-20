'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { StickyNote, Save, Edit2, X } from 'lucide-react';

interface AdminNotesProps {
  orderNumber: string;
  initialNotes?: string;
}

export function AdminNotes({ orderNumber, initialNotes = '' }: AdminNotesProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminNotes: notes }),
      });

      if (!response.ok) throw new Error('Failed to update admin notes');
      
      toast.success('Poznámky byly uloženy');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error('Chyba při ukládání poznámek');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNotes(initialNotes);
    setIsEditing(false);
  };

  return (
    <div className="bg-yellow-50 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-yellow-600" />
          Interní poznámky
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
          >
            <Edit2 size={16} />
            {notes ? 'Upravit' : 'Přidat'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Přidejte interní poznámky k objednávce..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[120px]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <span>Ukládám...</span>
              ) : (
                <>
                  <Save size={16} />
                  Uložit
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition disabled:opacity-50 flex items-center gap-2"
            >
              <X size={16} />
              Zrušit
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700">
          {notes ? (
            <p className="whitespace-pre-wrap">{notes}</p>
          ) : (
            <p className="text-gray-500 italic">Žádné poznámky</p>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Tyto poznámky jsou viditelné pouze pro administrátory a nejsou zobrazeny zákazníkům.</p>
      </div>
    </div>
  );
}
