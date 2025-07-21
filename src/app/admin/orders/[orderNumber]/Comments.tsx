// src/app/admin/orders/[orderNumber]/Comments.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MessageSquare, Save, Edit2, X } from 'lucide-react';

interface CommentsProps {
  orderNumber: string;
  initialComments?: string;
}

export function Comments({ orderNumber, initialComments = '' }: CommentsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comments }),
      });

      if (!response.ok) throw new Error('Failed to update comments');
      
      toast.success('Comments have been saved');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error('Error saving comments');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setComments(initialComments);
    setIsEditing(false);
  };

  return (
    <div className="bg-blue-50 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Comments
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
          >
            <Edit2 size={16} />
            {comments ? 'Edit' : 'Add'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add comments for this order..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={16} />
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition disabled:opacity-50 flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700">
          {comments ? (
            <p className="whitespace-pre-wrap">{comments}</p>
          ) : (
            <p className="text-gray-500 italic">No comments</p>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Comments are visible only to administrators and are not shown to customers.</p>
      </div>
    </div>
  );
}