// src/components/ProductVideos.tsx
'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  youtubeId: string;
}

const productVideos: VideoData[] = [
  {
    id: '1',
    title: 'Router CNC - Prezentacja działania',
    youtubeId: '6aLMNgElA6Q'
  },
  {
    id: '2',
    title: 'Laser grawerujący - Test materiałów',
    youtubeId: 'QH4L_qYfavw'
  },
  {
    id: '3',
    title: 'Prasa termotransferowa - Instrukcja',
    youtubeId: 'HqAqr5g76Zg'
  },
  {
    id: '4',
    title: 'Ultradźwięki - Czyszczenie części',
    youtubeId: 'uxWO4eM4nAM'
  },
  {
    id: '5',
    title: 'CNC 3040 - Pierwsze uruchomienie',
    youtubeId: 'DYdiWyO6Ct8'
  },
  {
    id: '6',
    title: 'Laser CO2 - Grawerowanie drewna',
    youtubeId: 'gaeh1sTsI70'
  }
];

interface VideoThumbnailProps {
  video: VideoData;
}

function VideoThumbnail({ video }: VideoThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (isLoaded) {
    return (
      <div className="relative w-full h-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full cursor-pointer group overflow-hidden bg-gray-900"
      onClick={() => setIsLoaded(true)}
    >
      {/* Use regular img tag instead of Next.js Image to avoid server-side optimization */}
      {!imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        // Fallback when image fails to load
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Video unavailable</p>
          </div>
        </div>
      )}
      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity" />
      
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-red-600 bg-opacity-90 rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 text-white fill-white ml-0.5" />
        </div>
      </div>
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
      </div>
    </div>
  );
}

export function ProductVideos() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
      
      // Update button states after scrolling
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Check scroll buttons on mount and when videos change
  useState(() => {
    setTimeout(checkScrollButtons, 100);
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-3 text-center text-black">
          Odkryj nasze filmy produktowe
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Odkryj zalety naszych produktów, dowiedz się jak działają i zainspiruj się do ich używania.
        </p>
        
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hidden md:block ${
              canScrollLeft 
                ? 'hover:shadow-xl cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="Przewiń w lewo"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hidden md:block ${
              canScrollRight 
                ? 'hover:shadow-xl cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="Przewiń w prawo"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Videos Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={checkScrollButtons}
          >
            {productVideos.map((video) => (
              <div 
                key={video.id} 
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                  <div className="relative aspect-video bg-black">
                    <VideoThumbnail video={video} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center mt-4 gap-1 md:hidden">
          {productVideos.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}