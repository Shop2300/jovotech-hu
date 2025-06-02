// src/components/ImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  type?: 'products' | 'banners';
  label?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove,
  type = 'products',
  label = 'Nahrát obrázek'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      toast.success('Obrázek byl nahrán');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Chyba při nahrávání');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-black">{label}</label>
      
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition flex flex-col items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Nahrávám...</span>
              </>
            ) : (
              <>
                <Upload size={24} />
                <span>Klikněte pro nahrání</span>
                <span className="text-sm text-gray-500">JPG, PNG, WebP</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}