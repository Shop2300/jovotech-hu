'use client';

import { useState, useRef, MouseEvent, TouchEvent, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from 'lucide-react';

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
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  
  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Nincs kép</p>
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

  // Touch handlers for swipe
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && sortedImages.length > 1) {
      goToNext();
    }
    if (isRightSwipe && sortedImages.length > 1) {
      goToPrevious();
    }
  };

  // Scroll to selected thumbnail
  useEffect(() => {
    if (thumbnailsRef.current && sortedImages.length > 1) {
      const thumbnailElement = thumbnailsRef.current.children[selectedIndex] as HTMLElement;
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedIndex, sortedImages.length]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || isMobile) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCursorPosition({ x, y });
    
    const backgroundX = -(x * zoomLevel - magnifierSize / 2);
    const backgroundY = -(y * zoomLevel - magnifierSize / 2);
    
    setMagnifierPosition({ x: backgroundX, y: backgroundY });
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowMagnifier(true);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const magnifierSize = 350;
  const zoomLevel = 1.5;

  // Fullscreen modal for mobile zoom
  const FullscreenModal = () => (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button
        onClick={() => setShowFullscreen(false)}
        className="absolute top-4 right-4 z-10 bg-white shadow-lg rounded-full hover:bg-gray-100 transition touch-manipulation flex items-center justify-center opacity-90 border border-gray-300"
        style={{ width: '44px', height: '44px' }}
      >
        <X size={20} className="text-gray-700" />
      </button>
      
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img
          src={currentImage.url}
          alt={currentImage.alt || `${productName} - kép ${selectedIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
        
        {/* Navigation in fullscreen */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full hover:bg-gray-100 transition touch-manipulation flex items-center justify-center opacity-90 border border-gray-300"
              style={{ width: '44px', height: '44px' }}
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full hover:bg-gray-100 transition touch-manipulation flex items-center justify-center opacity-90 border border-gray-300"
              style={{ width: '44px', height: '44px' }}
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}
        
        {/* Counter in fullscreen */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur text-white px-4 py-2 rounded-full">
            {selectedIndex + 1} / {sortedImages.length}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <div 
            ref={imageRef}
            className={`relative overflow-hidden rounded-lg bg-white ${!isMobile ? 'cursor-zoom-in' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="aspect-square w-full relative">
              <img
                src={currentImage.url}
                alt={currentImage.alt || `${productName} - kép ${selectedIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Mobile: Fullscreen button */}
              {isMobile && (
                <button
                  onClick={() => setShowFullscreen(true)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-md touch-manipulation"
                  aria-label="Kép nagyítása"
                >
                  <Maximize2 size={20} className="text-gray-700" />
                </button>
              )}
              
              {/* Desktop: Zoom hint icon */}
              {!isMobile && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <ZoomIn size={20} className="text-gray-600" />
                </div>
              )}

              {/* Desktop Magnifier */}
              {!isMobile && showMagnifier && (
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
          
          {/* Navigation arrows - Always visible on mobile */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full hover:bg-gray-100 transition touch-manipulation flex items-center justify-center ${
                  isMobile ? 'opacity-90 border border-gray-300' : 'opacity-0 group-hover:opacity-100 p-2'
                }`}
                style={isMobile ? { width: '44px', height: '44px' } : {}}
                aria-label="Előző kép"
              >
                <ChevronLeft size={isMobile ? 20 : 24} className="text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full hover:bg-gray-100 transition touch-manipulation flex items-center justify-center ${
                  isMobile ? 'opacity-90 border border-gray-300' : 'opacity-0 group-hover:opacity-100 p-2'
                }`}
                style={isMobile ? { width: '44px', height: '44px' } : {}}
                aria-label="Következő kép"
              >
                <ChevronRight size={isMobile ? 20 : 24} className="text-gray-700" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          {sortedImages.length > 1 && (
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md px-3 py-1.5 rounded-full text-sm text-gray-700 font-medium ${
              isMobile ? 'opacity-100' : 'opacity-90'
            }`}>
              {selectedIndex + 1} / {sortedImages.length}
            </div>
          )}
          
          {/* Mobile: Swipe indicator dots */}
          {isMobile && sortedImages.length > 1 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
              {sortedImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedIndex 
                      ? 'bg-[#8bc34a] w-6' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Thumbnail Grid - Horizontal scroll on mobile */}
        {sortedImages.length > 1 && (
          <div 
            ref={thumbnailsRef}
            className={`${
              isMobile 
                ? 'flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4' 
                : 'grid grid-cols-6 gap-2'
            }`}
            style={isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
          >
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`${
                  isMobile ? 'flex-shrink-0 w-20 h-20' : 'aspect-square'
                } rounded-lg overflow-hidden border-2 transition touch-manipulation ${
                  index === selectedIndex
                    ? 'border-[#8bc34a]'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `${productName} - előnézeti kép ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && <FullscreenModal />}
    </>
  );
}
