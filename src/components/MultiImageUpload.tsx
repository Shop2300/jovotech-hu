// src/components/MultiImageUpload.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, GripVertical, Star, Image as ImageIcon } from 'lucide-react';
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

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

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

  // Convert image to standard format using canvas
  const convertImageToStandardFormat = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        try {
          // Set canvas size to image size (max 4096px for compatibility)
          const maxSize = 4096;
          let width = img.width;
          let height = img.height;
          
          if (width > maxSize || height > maxSize) {
            const scale = Math.min(maxSize / width, maxSize / height);
            width *= scale;
            height *= scale;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas
          ctx!.drawImage(img, 0, 0, width, height);
          
          // Convert to blob (JPEG for better compatibility)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert image'));
              }
            },
            'image/jpeg',
            0.95 // High quality
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Create object URL for the image
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      
      // Clean up
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        img.onload = null;
      };
    });
  };

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
          let fileToUpload: File | Blob = file;
          let filename = file.name;
          
          // If upload fails with original file, try converting it
          let uploadAttempts = 0;
          let uploadSuccess = false;
          
          while (uploadAttempts < 2 && !uploadSuccess) {
            uploadAttempts++;
            
            // On second attempt, convert the image
            if (uploadAttempts === 2) {
              console.log(`Converting ${filename} to standard format...`);
              try {
                const convertedBlob = await convertImageToStandardFormat(file);
                // Create a new File from the blob
                const convertedFilename = filename.replace(/\.[^.]+$/, '.jpg');
                fileToUpload = new File([convertedBlob], convertedFilename, { type: 'image/jpeg' });
                filename = convertedFilename;
                toast(`Converting ${file.name} to standard format...`, {
                  icon: '🔄',
                  duration: 3000,
                });
              } catch (conversionError) {
                console.error('Image conversion failed:', conversionError);
                throw new Error('Unable to process this image file');
              }
            }
            
            const formData = new FormData();
            formData.append('file', fileToUpload);
            formData.append('type', 'products');

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              newImages.push({
                url: data.url,
                order: value.length + newImages.length,
                alt: file.name.split('.')[0]
              });
              uploadSuccess = true;
            } else {
              const error = await response.json();
              console.error(`Upload attempt ${uploadAttempts} failed:`, error);
              
              if (uploadAttempts === 1 && error.error?.includes('pattern')) {
                // Will retry with conversion
                continue;
              } else {
                throw new Error(error.error || 'Upload failed');
              }
            }
          }
          
          if (!uploadSuccess) {
            throw new Error('Failed after conversion attempt');
          }
          
        } catch (fileError: any) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          toast.error(`${file.name}: ${fileError.message || 'Nahrávání selhalo'}`);
        }
      }

      if (newImages.length > 0) {
        onChange([...value, ...newImages]);
        toast.success(`${newImages.length} obrázků nahráno`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Chyba při nahrávání');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = sortedImages.filter((_, i) => i !== index);
    // Reorder remaining images
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
    
    // Remove dragged item
    newImages.splice(draggedIndex, 1);
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Update order values
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
    setDraggedIndex(null);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = [...sortedImages];
    // Move selected image to first position
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    
    // Update order values
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
        {/* Existing images */}
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
            
            {/* Overlay controls */}
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
            
            {/* Drag handle */}
            <div className="absolute top-1 left-1 p-0.5 bg-white rounded shadow opacity-0 group-hover:opacity-100 transition">
              <GripVertical size={12} className="text-gray-600" />
            </div>
            
            {/* Primary badge */}
            {index === 0 && (
              <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                Hlavní
              </div>
            )}
          </div>
        ))}

        {/* Upload button */}
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