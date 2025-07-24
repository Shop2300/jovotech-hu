// src/components/MultiImageUpload.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, GripVertical, Star, Image as ImageIcon, AlertCircle } from 'lucide-react';
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
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sort images by order
  const sortedImages = [...value].sort((a, b) => a.order - b.order);

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileType = file.type.toLowerCase();
    if (!ALLOWED_TYPES.includes(fileType)) {
      return `${file.name}: Invalid file type (only JPG, PNG, GIF, WebP allowed)`;
    }

    // Check for problematic filename patterns
    if (file.name.includes('..') || file.name.includes('//')) {
      return `${file.name}: Invalid filename`;
    }

    return null;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (value.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Pre-validate all files
    const errors: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
      // Still proceed with valid files
      if (validFiles.length === 0) {
        return;
      }
    }

    setIsUploading(true);
    const newImages: ProductImage[] = [];
    const uploadPromises: Promise<void>[] = [];

    // Upload files in parallel with error handling
    for (const file of validFiles) {
      const uploadPromise = (async () => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'products');

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
          }

          const data = await response.json();
          newImages.push({
            url: data.url,
            order: value.length + newImages.length,
            alt: file.name.split('.')[0].replace(/[^a-zA-Z0-9-_\s]/g, '')
          });
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Upload failed';
          errors.push(`${file.name}: ${errorMsg}`);
          console.error(`Failed to upload ${file.name}:`, error);
        }
      })();

      uploadPromises.push(uploadPromise);
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    if (newImages.length > 0) {
      onChange([...value, ...newImages]);
      toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded successfully`);
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    toast.success('Primary image set');
  };

  const handleRemoveAll = () => {
    if (confirm('Are you sure you want to remove all images?')) {
      onChange([]);
      toast.success('All images removed');
    }
  };

  // Clear errors after 10 seconds
  useEffect(() => {
    if (uploadErrors.length > 0) {
      const timer = setTimeout(() => {
        setUploadErrors([]);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [uploadErrors]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-black">Product Images</label>
        <div className="flex items-center gap-3">
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleRemoveAll}
              className="text-sm text-red-600 hover:text-red-700 transition"
            >
              Remove all
            </button>
          )}
          <span className="text-sm text-gray-500">
            {value.length} image{value.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Error messages */}
      {uploadErrors.length > 0 && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
            <div className="text-sm text-red-700">
              <p className="font-medium mb-1">Upload errors:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {uploadErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.png'; // Add a placeholder image
                target.onerror = null; // Prevent infinite loop
              }}
            />
            
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  title="Set as primary"
                >
                  <Star size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                title="Remove"
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
                Primary
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
              accept={ALLOWED_TYPES.join(',')}
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
                  <span className="text-xs text-gray-500">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="text-gray-400" size={20} />
                  <span className="text-xs text-gray-600">Add</span>
                  <span className="text-xs text-gray-500">images</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Supported formats: JPG, PNG, GIF, WebP. 
        Drag images to reorder. First image is the primary image.
      </p>
    </div>
  );
}