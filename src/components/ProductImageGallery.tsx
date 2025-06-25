// src/components/ProductImageGallery.tsx
'use client';

import { useState, useRef, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

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
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCursorPosition({ x, y });
    
    // Calculate the background position for proper alignment
    // This ensures the zoomed area matches exactly where the cursor is
    const backgroundX = -(x * zoomLevel - magnifierSize / 2);
    const backgroundY = -(y * zoomLevel - magnifierSize / 2);
    
    setMagnifierPosition({ x: backgroundX, y: backgroundY });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Increased magnifier size and zoom level
  const magnifierSize = 300; // Increased from 250px
  const zoomLevel = 1.9; // Reduced zoom for better balance

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div 
          ref={imageRef}
          className="relative overflow-hidden rounded-lg bg-white cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="aspect-square w-full relative">
            <img
              src={currentImage.url}
              alt={currentImage.alt || `${productName} - zdjęcie ${selectedIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* Zoom hint icon */}
            <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <ZoomIn size={20} className="text-gray-600" />
            </div>

            {/* Magnifier */}
            {showMagnifier && (
              <div
                className="absolute pointer-events-none border-2 border-gray-300 rounded-full shadow-2xl overflow-hidden bg-white"
                style={{
                  width: `${magnifierSize}px`,
                  height: `${magnifierSize}px`,
                  left: `${cursorPosition.x - magnifierSize / 2}px`,
                  top: `${cursorPosition.y - magnifierSize / 2}px`,
                  zIndex: 50,
                }}
              >
                <div
                  className="absolute"
                  style={{
                    width: `${imageRef.current?.offsetWidth ? imageRef.current.offsetWidth * zoomLevel : 0}px`,
                    height: `${imageRef.current?.offsetHeight ? imageRef.current.offsetHeight * zoomLevel : 0}px`,
                    backgroundImage: `url(${currentImage.url})`,
                    backgroundSize: `${imageRef.current?.offsetWidth ? imageRef.current.offsetWidth * zoomLevel : 0}px ${imageRef.current?.offsetHeight ? imageRef.current.offsetHeight * zoomLevel : 0}px`,
                    backgroundPosition: `${magnifierPosition.x}px ${magnifierPosition.y}px`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                {/* Crosshair in magnifier */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-px h-6 bg-gray-400 opacity-50" />
                  <div className="w-6 h-px bg-gray-400 opacity-50 absolute" />
                </div>
              </div>
            )}
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md px-3 py-1 rounded-full text-sm text-gray-700 font-medium opacity-90">
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