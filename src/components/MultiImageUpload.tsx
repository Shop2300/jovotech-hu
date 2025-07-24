// src/components/MultiImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, GripVertical, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductImage {
  id?: string;
  url: string;
  order: number;
  alt?: string;
}

interface MultiImageUploadProps {
  productId?: string;
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export function MultiImageUpload({ 
  productId,
  value = [], 
  onChange,
  maxImages = 999
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sort images by order
  const sortedImages = [...value].sort((a, b) => a.order - b.order);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (value.length + files.length > maxImages) {
      toast.error(`Maximální počet obrázků překročen`);
      return;
    }

    setIsUploading(true);
    const newImages: ProductImage[] = [];

    try {
      for (const file of files) {
        try {
          console.log(`Uploading ${file.name}...`);
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'products');

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          // Get response as text first to debug
          const responseText = await response.text();
          console.log('Response status:', response.status);
          console.log('Response text:', responseText);
          
          // Try to parse as JSON
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            // If parsing fails, check if it's HTML (error page)
            if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
              throw new Error('Server returned HTML instead of JSON - possible error page');
            }
            throw new Error('Invalid server response');
          }

          if (!response.ok) {
            throw new Error(data.error || `Upload failed with status ${response.status}`);
          }

          if (!data.url) {
            console.error('Response missing URL:', data);
            throw new Error('Upload succeeded but no URL returned');
          }

          newImages.push({
            url: data.url,
            order: value.length + newImages.length,
            alt: file.name.split('.')[0]
          });
          
          console.log(`Successfully uploaded ${file.name}`);
        } catch (error: any) {
          console.error(`Failed to upload ${file.name}:`, error);
          
          // Check for specific error patterns
          if (error.message?.includes('pattern')) {
            toast.error(`${file.name}: Soubor má nekompatibilní formát. Zkuste ho převést na standardní JPG.`);
          } else {
            toast.error(`${file.name}: ${error.message || 'Nahrávání selhalo'}`);
          }
        }
      }

      if (newImages.length > 0) {
        onChange([...value, ...newImages]);
        toast.success(`${newImages.length} obrázků nahráno`);
      }
    } catch (error) {
      console.error('General upload error:', error);
      toast.error('Chyba při nahrávání');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = sortedImages.filter((_, i) => i !== index);
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const draggedImage = sortedImages[draggedIndex];
    const newImages = [...sortedImages];
    
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
    setDraggedIndex(null);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = [...sortedImages];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
    toast.success('Hlavní obrázek nastaven');
  };

  const handleRemoveAll = () => {
    if (confirm('Opravdu chcete odstranit všechny obrázky?')) {
      onChange([]);
      toast.success('Všechny obrázky byly odstraněny');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-black">Obrázky produktu</label>
        <div className="flex items-center gap-3">
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleRemoveAll}
              className="text-sm text-red-600 hover:text-red-700 transition"
            >
              Odstranit vše
            </button>
          )}
          <span className="text-sm text-gray-500">
            {value.length} obrázků
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {sortedImages.map((image, index) => (
          <div
            key={image.id || image.url}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative group border-2 rounded-lg overflow-hidden transition-all cursor-move aspect-square ${
              draggedIndex === index ? 'opacity-50' : ''
            } ${index === 0 ? 'border-blue-500' : 'border-gray-200'}`}
          >
            <img
              src={image.url}
              alt={image.alt || `Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  title="Nastavit jako hlavní"
                >
                  <Star size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                title="Odstranit"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="absolute top-1 left-1 p-0.5 bg-white rounded shadow opacity-0 group-hover:opacity-100 transition">
              <GripVertical size={12} className="text-gray-600" />
            </div>
            
            {index === 0 && (
              <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                Hlavní
              </div>
            )}
          </div>
        ))}

        {value.length < maxImages && (
          <div className="aspect-square">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition flex flex-col items-center justify-center gap-1 bg-gray-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin text-gray-400" size={20} />
                  <span className="text-xs text-gray-500">Nahrávám...</span>
                </>
              ) : (
                <>
                  <Upload className="text-gray-400" size={20} />
                  <span className="text-xs text-gray-600">Přidat</span>
                  <span className="text-xs text-gray-500">obrázky</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}