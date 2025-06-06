// src/components/ProductImageGallery.tsx
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  
  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Brak zdjęcia</p>
      </div>
    );
  }

  const currentImage = sortedImages[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div 
          className={`relative overflow-hidden rounded-lg bg-white ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <div className="aspect-square w-full">
            <img
              src={currentImage.url}
              alt={currentImage.alt || `${productName} - zdjęcie ${selectedIndex + 1}`}
              className={`w-full h-full object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-150' : ''
              }`}
            />
          </div>
        </div>
        
        {/* Navigation arrows */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md px-3 py-1 rounded-full text-sm text-gray-700 font-medium">
            {selectedIndex + 1} / {sortedImages.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Grid */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                index === selectedIndex
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${productName} - miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}